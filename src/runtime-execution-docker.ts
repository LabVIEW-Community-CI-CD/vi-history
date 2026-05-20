/**
 * Docker LabVIEWCLI Execution Adapter
 *
 * This module provides the execution adapter for spawning Docker containers
 * with LabVIEWCLI using the nationalinstruments/labview:latest-linux image.
 *
 * Slice: runtime-execution-docker-labviewcli-v1
 */

import { spawn, type ChildProcess } from "node:child_process";
import { type DockerComparisonReportCommand, type VolumeMount } from "./runtime-execution-contracts.js";

// ============================================================================
// Type Definitions
// ============================================================================

export type DockerExecutionStatus = "success" | "failure" | "timeout";

export interface DockerExecutionDiagnostics {
  readonly stdout: string;
  readonly stderr: string;
  readonly durationMs: number;
}

export interface DockerExecutionOutcome {
  readonly kind: "docker-execution-outcome";
  readonly status: DockerExecutionStatus;
  readonly executionContext: "docker";
  readonly operationName: string;
  readonly dockerImage: string;
  readonly headless: boolean;
  readonly volumeMounts: readonly VolumeMount[];
  readonly exitCode: number;
  readonly success: boolean;
  readonly timedOut: boolean;
  readonly timeoutMs?: number;
  readonly failureReason?: string;
  readonly diagnostics: DockerExecutionDiagnostics;
  readonly outputPath: string;
  readonly blockedSideEffects: readonly string[];
  readonly requirementIds: readonly string[];
}

export interface DockerExecutionInput {
  commandFacts: DockerComparisonReportCommand;
  timeoutMs?: number;
}

export interface MockDockerExecutionInput {
  commandFacts: DockerComparisonReportCommand;
  exitCode?: number;
  stdout?: string;
  stderr?: string;
  durationMs?: number;
  timedOut?: boolean;
  timeoutMs?: number;
}

// ============================================================================
// Requirement Constants
// ============================================================================

export const DOCKER_EXECUTION_REQUIREMENTS = {
  containerSpawn: ["VHS-REQ-630"] as const,
  volumeMount: ["VHS-REQ-631"] as const,
  headlessFlag: ["VHS-REQ-632"] as const,
  streamCapture: ["VHS-REQ-633"] as const,
  exitCode: ["VHS-REQ-634"] as const,
  timeout: ["VHS-REQ-635"] as const
} as const;

export const DOCKER_EXECUTION_BLOCKED_SIDE_EFFECTS = [
  "docker-image-building",
  "multi-family-image-selection",
  "docker-availability-checking",
  "container-orchestration",
  "marketplace-publication"
] as const;

const DOCKER_IMAGE = "nationalinstruments/labview:latest-linux";
const DEFAULT_TIMEOUT_MS = 600000; // 10 minutes
const MAX_TIMEOUT_MS = 3600000;    // 1 hour
const GRACEFUL_TERM_MS = 5000;     // 5 seconds for graceful termination

/**
 * Returns all requirement IDs for Docker execution.
 */
export function allDockerExecutionRequirementIds(): string[] {
  const ids = new Set<string>();
  for (const reqArray of Object.values(DOCKER_EXECUTION_REQUIREMENTS)) {
    for (const id of reqArray) {
      ids.add(id);
    }
  }
  return [...ids].sort();
}

/**
 * Executes LabVIEWCLI CreateComparisonReport inside a Docker container.
 *
 * This function spawns a Docker container with the hardcoded
 * nationalinstruments/labview:latest-linux image and captures stdout,
 * stderr, and exit code.
 */
export async function executeDockerComparisonReport(input: DockerExecutionInput): Promise<DockerExecutionOutcome> {
  const commandFacts = requireCommandFacts(input.commandFacts);
  const timeoutMs = normalizeTimeout(input.timeoutMs);

  const startTime = Date.now();

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const childProcess: ChildProcess = spawn(
      commandFacts.executable,  // "docker"
      commandFacts.arguments as string[],
      {
        shell: false
      }
    );

    // Timeout handling
    const timeoutHandle = setTimeout(() => {
      timedOut = true;

      // Try graceful termination first (docker stop)
      try {
        childProcess.kill("SIGTERM");
      } catch {
        // Process may already be dead
      }

      // Force kill after grace period
      setTimeout(() => {
        try {
          if (!childProcess.killed) {
            childProcess.kill("SIGKILL");
          }
        } catch {
          // Process may already be dead
        }
      }, GRACEFUL_TERM_MS);
    }, timeoutMs);

    // Stream capture
    childProcess.stdout?.on("data", (data: Buffer) => {
      stdout += data.toString();
    });

    childProcess.stderr?.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    // Error handling
    childProcess.on("error", (error: Error) => {
      clearTimeout(timeoutHandle);
      const durationMs = Date.now() - startTime;

      resolve(createFailedOutcome({
        commandFacts,
        status: "failure",
        exitCode: -1,
        stdout: redactPrivatePaths(stdout),
        stderr: redactPrivatePaths(`Docker spawn error: ${error.message}\n${stderr}`),
        durationMs,
        timedOut: false,
        failureReason: "docker-spawn-error"
      }));
    });

    // Completion handling
    childProcess.on("close", (exitCode, signal) => {
      clearTimeout(timeoutHandle);
      const durationMs = Date.now() - startTime;

      if (timedOut) {
        resolve(createTimeoutOutcome({
          commandFacts,
          stdout: redactPrivatePaths(stdout),
          stderr: redactPrivatePaths(stderr),
          durationMs,
          timeoutMs
        }));
        return;
      }

      const actualExitCode = exitCode ?? (signal ? -1 : 0);
      const success = actualExitCode === 0;

      resolve(createSuccessOutcome({
        commandFacts,
        status: success ? "success" : "failure",
        exitCode: actualExitCode,
        stdout: redactPrivatePaths(stdout),
        stderr: redactPrivatePaths(stderr),
        durationMs,
        success
      }));
    });
  });
}

/**
 * Creates a mock Docker execution for testing purposes.
 *
 * This returns outcome facts without actually spawning a Docker container.
 * Useful for unit testing the outcome structure.
 */
export function createMockDockerExecution(input: MockDockerExecutionInput): DockerExecutionOutcome {
  const commandFacts = requireCommandFacts(input.commandFacts);
  const exitCode = input.exitCode ?? 0;
  const stdout = input.stdout ?? "";
  const stderr = input.stderr ?? "";
  const durationMs = input.durationMs ?? 1000;
  const timedOut = input.timedOut ?? false;

  if (timedOut) {
    return createTimeoutOutcome({
      commandFacts,
      stdout: redactPrivatePaths(stdout),
      stderr: redactPrivatePaths(stderr),
      durationMs,
      timeoutMs: input.timeoutMs ?? DEFAULT_TIMEOUT_MS
    });
  }

  const success = exitCode === 0;

  return freezeRecord({
    kind: "docker-execution-outcome",
    status: success ? "success" : "failure",
    executionContext: "docker",
    operationName: commandFacts.operationName,
    dockerImage: DOCKER_IMAGE,
    headless: true,
    volumeMounts: commandFacts.volumeMounts,
    exitCode,
    success,
    timedOut: false,
    diagnostics: {
      stdout: redactPrivatePaths(stdout),
      stderr: redactPrivatePaths(stderr),
      durationMs
    },
    outputPath: commandFacts.inputs.outputPath,
    blockedSideEffects: DOCKER_EXECUTION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allDockerExecutionRequirementIds()
  });
}

// Helper functions

interface SuccessOutcomeInput {
  commandFacts: DockerComparisonReportCommand;
  status: "success" | "failure";
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  success: boolean;
}

interface FailedOutcomeInput {
  commandFacts: DockerComparisonReportCommand;
  status?: "failure";
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  timedOut?: boolean;
  failureReason: string;
}

interface TimeoutOutcomeInput {
  commandFacts: DockerComparisonReportCommand;
  stdout: string;
  stderr: string;
  durationMs: number;
  timeoutMs: number;
}

function requireCommandFacts(commandFacts: DockerComparisonReportCommand): DockerComparisonReportCommand {
  if (!commandFacts || typeof commandFacts !== "object") {
    throw new Error("commandFacts is required and must be an object");
  }
  if (commandFacts.kind !== "comparison-report-command") {
    throw new Error("commandFacts must come from createDockerComparisonReportCommand");
  }
  if (commandFacts.executionContext !== "docker") {
    throw new Error("commandFacts must be for docker execution context");
  }
  return commandFacts;
}

function normalizeTimeout(timeoutMs?: number): number {
  if (timeoutMs === undefined || timeoutMs === null) {
    return DEFAULT_TIMEOUT_MS;
  }
  const timeout = Number(timeoutMs);
  if (Number.isNaN(timeout) || timeout < 1000) {
    return DEFAULT_TIMEOUT_MS;
  }
  if (timeout > MAX_TIMEOUT_MS) {
    return MAX_TIMEOUT_MS;
  }
  return timeout;
}

function createSuccessOutcome(input: SuccessOutcomeInput): DockerExecutionOutcome {
  return freezeRecord({
    kind: "docker-execution-outcome" as const,
    status: input.status,
    executionContext: "docker" as const,
    operationName: input.commandFacts.operationName,
    dockerImage: DOCKER_IMAGE,
    headless: true,
    volumeMounts: input.commandFacts.volumeMounts,
    exitCode: input.exitCode,
    success: input.success,
    timedOut: false,
    diagnostics: {
      stdout: input.stdout,
      stderr: input.stderr,
      durationMs: input.durationMs
    },
    outputPath: input.commandFacts.inputs.outputPath,
    blockedSideEffects: DOCKER_EXECUTION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allDockerExecutionRequirementIds()
  });
}

function createFailedOutcome(input: FailedOutcomeInput): DockerExecutionOutcome {
  return freezeRecord({
    kind: "docker-execution-outcome" as const,
    status: "failure" as const,
    executionContext: "docker" as const,
    operationName: input.commandFacts.operationName,
    dockerImage: DOCKER_IMAGE,
    headless: true,
    volumeMounts: input.commandFacts.volumeMounts,
    exitCode: input.exitCode,
    success: false,
    timedOut: input.timedOut ?? false,
    failureReason: input.failureReason,
    diagnostics: {
      stdout: input.stdout,
      stderr: input.stderr,
      durationMs: input.durationMs
    },
    outputPath: input.commandFacts.inputs.outputPath,
    blockedSideEffects: DOCKER_EXECUTION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allDockerExecutionRequirementIds()
  });
}

function createTimeoutOutcome(input: TimeoutOutcomeInput): DockerExecutionOutcome {
  return freezeRecord({
    kind: "docker-execution-outcome" as const,
    status: "timeout" as const,
    executionContext: "docker" as const,
    operationName: input.commandFacts.operationName,
    dockerImage: DOCKER_IMAGE,
    headless: true,
    volumeMounts: input.commandFacts.volumeMounts,
    exitCode: -1,
    success: false,
    timedOut: true,
    timeoutMs: input.timeoutMs,
    diagnostics: {
      stdout: input.stdout,
      stderr: input.stderr,
      durationMs: input.durationMs
    },
    outputPath: input.commandFacts.inputs.outputPath,
    blockedSideEffects: DOCKER_EXECUTION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allDockerExecutionRequirementIds()
  });
}

function redactPrivatePaths(text: string): string {
  if (!text) return "";
  return text
    .replace(/C:\\Users\\[^\\]+/gi, "C:\\Users\\[REDACTED]")
    .replace(/\/home\/[^/]+/g, "/home/[REDACTED]")
    .replace(/\/Users\/[^/]+/g, "/Users/[REDACTED]");
}

function freezeRecord<T extends object>(obj: T): Readonly<T> {
  return Object.freeze(obj);
}
