/**
 * Host-Native LabVIEWCLI Execution Adapter
 *
 * This module provides the execution adapter for spawning LabVIEWCLI.exe
 * as a child process on Windows host systems.
 *
 * Slice: runtime-execution-host-native-labviewcli-v1
 */

import { spawn, type ChildProcess } from "node:child_process";
import { access, constants } from "node:fs/promises";
import { type HostNativeComparisonReportCommand } from "./runtime-execution-contracts.js";

// ============================================================================
// Type Definitions
// ============================================================================

export type HostNativeExecutionStatus = "success" | "failure" | "timeout";

export interface HostNativeExecutionDiagnostics {
  readonly stdout: string;
  readonly stderr: string;
  readonly durationMs: number;
}

export interface HostNativeExecutionOutcome {
  readonly kind: "host-native-execution-outcome";
  readonly status: HostNativeExecutionStatus;
  readonly executionContext: "host-native";
  readonly operationName: string;
  readonly exitCode: number;
  readonly success: boolean;
  readonly timedOut: boolean;
  readonly timeoutMs?: number;
  readonly failureReason?: string;
  readonly diagnostics: HostNativeExecutionDiagnostics;
  readonly outputPath: string;
  readonly blockedSideEffects: readonly string[];
  readonly requirementIds: readonly string[];
}

export interface HostNativeExecutionInput {
  commandFacts: HostNativeComparisonReportCommand;
  timeoutMs?: number;
}

export interface MockHostNativeExecutionInput {
  commandFacts: HostNativeComparisonReportCommand;
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

export const HOST_NATIVE_EXECUTION_REQUIREMENTS = {
  processSpawn: ["VHS-REQ-620"] as const,
  streamCapture: ["VHS-REQ-621"] as const,
  exitCode: ["VHS-REQ-622"] as const,
  timeout: ["VHS-REQ-623"] as const,
  termination: ["VHS-REQ-624"] as const,
  redaction: ["VHS-REQ-625"] as const
} as const;

export const HOST_NATIVE_EXECUTION_BLOCKED_SIDE_EFFECTS = [
  "docker-execution",
  "labview-license-validation",
  "interactive-sessions",
  "marketplace-publication"
] as const;

const DEFAULT_TIMEOUT_MS = 300000; // 5 minutes
const MAX_TIMEOUT_MS = 3600000;    // 1 hour
const GRACEFUL_TERM_MS = 5000;     // 5 seconds for graceful termination

/**
 * Returns all requirement IDs for host-native execution.
 */
export function allHostNativeExecutionRequirementIds(): string[] {
  const ids = new Set<string>();
  for (const reqArray of Object.values(HOST_NATIVE_EXECUTION_REQUIREMENTS)) {
    for (const id of reqArray) {
      ids.add(id);
    }
  }
  return [...ids].sort();
}

/**
 * Executes LabVIEWCLI CreateComparisonReport on the host Windows system.
 *
 * This function spawns LabVIEWCLI.exe as a child process and captures
 * stdout, stderr, and exit code.
 */
export async function executeHostNativeComparisonReport(input: HostNativeExecutionInput): Promise<HostNativeExecutionOutcome> {
  const commandFacts = requireCommandFacts(input.commandFacts);
  const timeoutMs = normalizeTimeout(input.timeoutMs);

  // Validate executable exists
  const executableCheck = await checkExecutableExists(commandFacts.executable);
  if (!executableCheck.exists) {
    return createFailedOutcome({
      commandFacts,
      exitCode: -1,
      stdout: "",
      stderr: `LabVIEWCLI executable not found at: ${redactPath(commandFacts.executable)}`,
      durationMs: 0,
      failureReason: "executable-not-found"
    });
  }

  const startTime = Date.now();

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const childProcess: ChildProcess = spawn(
      commandFacts.executable,
      commandFacts.arguments as string[],
      {
        cwd: commandFacts.workingDirectory ?? undefined,
        shell: false,
        windowsHide: true
      }
    );

    // Timeout handling
    const timeoutHandle = setTimeout(() => {
      timedOut = true;

      // Try graceful termination first
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
        exitCode: -1,
        stdout: redactPrivatePaths(stdout),
        stderr: redactPrivatePaths(`Process spawn error: ${error.message}\n${stderr}`),
        durationMs,
        failureReason: "spawn-error"
      }));
    });

    // Completion handling
    childProcess.on("close", (exitCode: number | null, signal: string | null) => {
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
 * Creates a mock execution for testing purposes.
 *
 * This returns outcome facts without actually spawning a process.
 * Useful for unit testing the outcome structure.
 */
export function createMockHostNativeExecution(input: MockHostNativeExecutionInput): HostNativeExecutionOutcome {
  const commandFacts = requireCommandFacts(input.commandFacts);
  const exitCode = input.exitCode ?? 0;
  const stdout = input.stdout ?? "";
  const stderr = input.stderr ?? "";
  const durationMs = input.durationMs ?? 100;
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
    kind: "host-native-execution-outcome" as const,
    status: success ? "success" as const : "failure" as const,
    executionContext: "host-native" as const,
    operationName: commandFacts.operationName,
    exitCode,
    success,
    timedOut: false,
    diagnostics: {
      stdout: redactPrivatePaths(stdout),
      stderr: redactPrivatePaths(stderr),
      durationMs
    },
    outputPath: commandFacts.inputs.outputPath,
    blockedSideEffects: HOST_NATIVE_EXECUTION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allHostNativeExecutionRequirementIds()
  });
}

// ============================================================================
// Helper Functions and Interfaces
// ============================================================================

interface SuccessOutcomeInput {
  commandFacts: HostNativeComparisonReportCommand;
  status: "success" | "failure";
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  success: boolean;
}

interface FailedOutcomeInput {
  commandFacts: HostNativeComparisonReportCommand;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  failureReason: string;
}

interface TimeoutOutcomeInput {
  commandFacts: HostNativeComparisonReportCommand;
  stdout: string;
  stderr: string;
  durationMs: number;
  timeoutMs: number;
}

function requireCommandFacts(commandFacts: HostNativeComparisonReportCommand): HostNativeComparisonReportCommand {
  if (!commandFacts || typeof commandFacts !== "object") {
    throw new Error("commandFacts is required and must be an object");
  }
  if (commandFacts.kind !== "comparison-report-command") {
    throw new Error("commandFacts must come from createHostNativeComparisonReportCommand");
  }
  if (commandFacts.executionContext !== "host-native") {
    throw new Error("commandFacts must be for host-native execution context");
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

async function checkExecutableExists(executablePath: string): Promise<{ exists: boolean }> {
  try {
    await access(executablePath, constants.X_OK);
    return { exists: true };
  } catch {
    return { exists: false };
  }
}

function createSuccessOutcome(input: SuccessOutcomeInput): HostNativeExecutionOutcome {
  return freezeRecord({
    kind: "host-native-execution-outcome" as const,
    status: input.status,
    executionContext: "host-native" as const,
    operationName: input.commandFacts.operationName,
    exitCode: input.exitCode,
    success: input.success,
    timedOut: false,
    diagnostics: {
      stdout: input.stdout,
      stderr: input.stderr,
      durationMs: input.durationMs
    },
    outputPath: input.commandFacts.inputs.outputPath,
    blockedSideEffects: HOST_NATIVE_EXECUTION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allHostNativeExecutionRequirementIds()
  });
}

function createFailedOutcome(input: FailedOutcomeInput): HostNativeExecutionOutcome {
  return freezeRecord({
    kind: "host-native-execution-outcome" as const,
    status: "failure" as const,
    executionContext: "host-native" as const,
    operationName: input.commandFacts.operationName,
    exitCode: input.exitCode,
    success: false,
    timedOut: false,
    failureReason: input.failureReason,
    diagnostics: {
      stdout: input.stdout,
      stderr: input.stderr,
      durationMs: input.durationMs
    },
    outputPath: input.commandFacts.inputs.outputPath,
    blockedSideEffects: HOST_NATIVE_EXECUTION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allHostNativeExecutionRequirementIds()
  });
}

function createTimeoutOutcome(input: TimeoutOutcomeInput): HostNativeExecutionOutcome {
  return freezeRecord({
    kind: "host-native-execution-outcome" as const,
    status: "timeout" as const,
    executionContext: "host-native" as const,
    operationName: input.commandFacts.operationName,
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
    blockedSideEffects: HOST_NATIVE_EXECUTION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allHostNativeExecutionRequirementIds()
  });
}

function redactPath(path: string): string {
  return redactPrivatePaths(path);
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
