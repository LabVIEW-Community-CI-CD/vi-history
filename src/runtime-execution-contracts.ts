/**
 * Runtime Execution Contracts
 *
 * This module provides pure facts contracts for LabVIEWCLI CreateComparisonReport
 * execution on both host-native Windows installations and Docker containers.
 *
 * Slice: runtime-execution-contracts-v1
 */

// ============================================================================
// Type Definitions
// ============================================================================

export type ExecutionContext = "host-native" | "docker";
export type CommandStatus = "ready" | "blocked";
export type OutcomeStatus = "success" | "failure";

export interface VolumeMount {
  readonly host: string;
  readonly container: string;
}

export interface CommandInputs {
  readonly viPath1: string;
  readonly viPath2: string;
  readonly outputPath: string;
  readonly reportType: string;
}

export interface HostInputs {
  readonly viPath1: string;
  readonly viPath2: string;
  readonly outputPath: string;
  readonly workspacePath: string | null;
}

export interface ComparisonReportCommandBase {
  readonly kind: "comparison-report-command";
  readonly status: CommandStatus;
  readonly executionContext: ExecutionContext;
  readonly executable: string;
  readonly arguments: readonly string[];
  readonly workingDirectory: string | null;
  readonly operationName: string;
  readonly inputs: CommandInputs;
  readonly commandLine: string;
  readonly blockedSideEffects: readonly string[];
  readonly requirementIds: readonly string[];
}

export interface HostNativeComparisonReportCommand extends ComparisonReportCommandBase {
  readonly executionContext: "host-native";
}

export interface DockerComparisonReportCommand extends ComparisonReportCommandBase {
  readonly executionContext: "docker";
  readonly dockerImage: string;
  readonly volumeMounts: readonly VolumeMount[];
  readonly headless: boolean;
  readonly hostInputs: HostInputs;
}

export type ComparisonReportCommand = HostNativeComparisonReportCommand | DockerComparisonReportCommand;

export interface ExecutionDiagnostics {
  readonly stdout: string;
  readonly stderr: string;
  readonly durationMs: number | null;
}

export interface ComparisonReportExecutionOutcome {
  readonly kind: "comparison-report-execution-outcome";
  readonly status: OutcomeStatus;
  readonly executionContext: ExecutionContext;
  readonly operationName: string;
  readonly exitCode: number;
  readonly success: boolean;
  readonly diagnostics: ExecutionDiagnostics;
  readonly outputPath: string;
  readonly requirementIds: readonly string[];
}

export interface RuntimeDiscoveryFacts {
  labviewCliPath?: string;
  discoveredRuntimes?: {
    labviewCli?: {
      path?: string;
    };
  };
  nativeAcquisition?: {
    labviewCliPath?: string;
  };
}

// ============================================================================
// Requirement Constants
// ============================================================================

export const RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS = {
  createComparisonReport: ["VHS-REQ-600"] as const,
  hostNativeExecution: ["VHS-REQ-601"] as const,
  dockerExecution: ["VHS-REQ-602"] as const,
  commandArguments: ["VHS-REQ-603", "VHS-REQ-604"] as const,
  headlessFlag: ["VHS-REQ-605"] as const,
  executionPlan: ["VHS-REQ-606"] as const,
  volumeMounts: ["VHS-REQ-607"] as const,
  dockerImage: ["VHS-REQ-608"] as const,
  labviewCliPath: ["VHS-REQ-609"] as const,
  outputCapture: ["VHS-REQ-610"] as const,
  exitCode: ["VHS-REQ-611"] as const
} as const;

export const RUNTIME_EXECUTION_BLOCKED_SIDE_EFFECTS = [
  "actual-labviewcli-execution",
  "actual-docker-execution",
  "file-system-writes",
  "process-spawn",
  "network-requests"
] as const;

const DOCKER_IMAGE_LATEST_LINUX = "nationalinstruments/labview:latest-linux";

// ============================================================================
// Exported Functions
// ============================================================================

/**
 * Returns all requirement IDs for runtime execution contracts.
 */
export function allRuntimeExecutionContractsRequirementIds(): string[] {
  const ids = new Set<string>();
  for (const reqArray of Object.values(RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS)) {
    for (const id of reqArray) {
      ids.add(id);
    }
  }
  return [...ids].sort();
}

export interface CreateComparisonReportInput {
  viPath1: string;
  viPath2: string;
  outputPath: string;
  executionContext: ExecutionContext;
  runtimeDiscoveryFacts?: RuntimeDiscoveryFacts;
  workspacePath?: string;
}

/**
 * Creates comparison report command facts for LabVIEWCLI CreateComparisonReport.
 */
export function createComparisonReportCommand(input: CreateComparisonReportInput): ComparisonReportCommand {
  const viPath1 = requireString(input.viPath1, "viPath1");
  const viPath2 = requireString(input.viPath2, "viPath2");
  const outputPath = requireString(input.outputPath, "outputPath");
  const executionContext = requireExecutionContext(input.executionContext);

  if (executionContext === "host-native") {
    return createHostNativeComparisonReportCommand({
      viPath1,
      viPath2,
      outputPath,
      runtimeDiscoveryFacts: input.runtimeDiscoveryFacts
    });
  }

  return createDockerComparisonReportCommand({
    viPath1,
    viPath2,
    outputPath,
    workspacePath: input.workspacePath
  });
}

export interface HostNativeCommandInput {
  viPath1: string;
  viPath2: string;
  outputPath: string;
  runtimeDiscoveryFacts?: RuntimeDiscoveryFacts;
}

/**
 * Creates host-native LabVIEWCLI CreateComparisonReport command facts.
 */
export function createHostNativeComparisonReportCommand(input: HostNativeCommandInput): HostNativeComparisonReportCommand {
  const viPath1 = requireString(input.viPath1, "viPath1");
  const viPath2 = requireString(input.viPath2, "viPath2");
  const outputPath = requireString(input.outputPath, "outputPath");

  const labviewCliPath = deriveLabViewCliPath(input.runtimeDiscoveryFacts);

  const args = [
    "-OperationName", "CreateComparisonReport",
    "-VIPath1", viPath1,
    "-VIPath2", viPath2,
    "-OutputPath", outputPath,
    "-ReportType", "html"
  ];

  return freezeRecord({
    kind: "comparison-report-command" as const,
    status: "ready" as const,
    executionContext: "host-native" as const,
    executable: labviewCliPath,
    arguments: args,
    workingDirectory: null,
    operationName: "CreateComparisonReport",
    inputs: {
      viPath1,
      viPath2,
      outputPath,
      reportType: "html"
    },
    commandLine: buildCommandLine(labviewCliPath, args),
    blockedSideEffects: RUNTIME_EXECUTION_BLOCKED_SIDE_EFFECTS,
    requirementIds: [
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.createComparisonReport,
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.hostNativeExecution,
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.commandArguments,
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.executionPlan,
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.labviewCliPath
    ]
  });
}

export interface DockerCommandInput {
  viPath1: string;
  viPath2: string;
  outputPath: string;
  workspacePath?: string;
}

/**
 * Creates Docker LabVIEWCLI CreateComparisonReport command facts.
 */
export function createDockerComparisonReportCommand(input: DockerCommandInput): DockerComparisonReportCommand {
  const viPath1 = requireString(input.viPath1, "viPath1");
  const viPath2 = requireString(input.viPath2, "viPath2");
  const outputPath = requireString(input.outputPath, "outputPath");
  const workspacePath = input.workspacePath ?? null;

  // Container paths for mounted workspace
  const containerViPath1 = mapToContainerPath(viPath1, workspacePath);
  const containerViPath2 = mapToContainerPath(viPath2, workspacePath);
  const containerOutputPath = mapToContainerPath(outputPath, workspacePath);

  const volumeMounts: VolumeMount[] = workspacePath
    ? [{ host: workspacePath, container: "/workspace" }]
    : [];

  const labviewCliArgs = [
    "-OperationName", "CreateComparisonReport",
    "-VIPath1", containerViPath1,
    "-VIPath2", containerViPath2,
    "-OutputPath", containerOutputPath,
    "-ReportType", "html",
    "-Headless"
  ];

  const dockerArgs = [
    "run", "--rm",
    ...volumeMounts.flatMap(mount => ["-v", `${mount.host}:${mount.container}`]),
    DOCKER_IMAGE_LATEST_LINUX,
    "LabVIEWCLI",
    ...labviewCliArgs
  ];

  return freezeRecord({
    kind: "comparison-report-command" as const,
    status: "ready" as const,
    executionContext: "docker" as const,
    executable: "docker",
    arguments: dockerArgs,
    workingDirectory: null,
    dockerImage: DOCKER_IMAGE_LATEST_LINUX,
    volumeMounts,
    operationName: "CreateComparisonReport",
    headless: true,
    inputs: {
      viPath1: containerViPath1,
      viPath2: containerViPath2,
      outputPath: containerOutputPath,
      reportType: "html"
    },
    hostInputs: {
      viPath1,
      viPath2,
      outputPath,
      workspacePath
    },
    commandLine: buildCommandLine("docker", dockerArgs),
    blockedSideEffects: RUNTIME_EXECUTION_BLOCKED_SIDE_EFFECTS,
    requirementIds: [
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.createComparisonReport,
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.dockerExecution,
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.commandArguments,
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.headlessFlag,
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.executionPlan,
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.volumeMounts,
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.dockerImage
    ]
  });
}

export interface ExecutionOutcomeInput {
  commandFacts: ComparisonReportCommand;
  exitCode: number;
  stdout?: string;
  stderr?: string;
  durationMs?: number | null;
}

/**
 * Creates execution outcome facts from command execution results.
 */
export function createComparisonReportExecutionOutcome(input: ExecutionOutcomeInput): ComparisonReportExecutionOutcome {
  const commandFacts = requireObject(input.commandFacts, "commandFacts");
  const exitCode = requireNumber(input.exitCode, "exitCode");
  const stdout = input.stdout ?? "";
  const stderr = input.stderr ?? "";
  const durationMs = input.durationMs ?? null;

  const success = exitCode === 0;

  return freezeRecord({
    kind: "comparison-report-execution-outcome" as const,
    status: success ? "success" as const : "failure" as const,
    executionContext: commandFacts.executionContext,
    operationName: commandFacts.operationName,
    exitCode,
    success,
    diagnostics: {
      stdout: redactPrivatePaths(stdout),
      stderr: redactPrivatePaths(stderr),
      durationMs
    },
    outputPath: commandFacts.inputs.outputPath,
    requirementIds: [
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.outputCapture,
      ...RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS.exitCode
    ]
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

function requireString(value: unknown, name: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${name} is required and must be a non-empty string`);
  }
  return value;
}

function requireNumber(value: unknown, name: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${name} is required and must be a number`);
  }
  return value;
}

function requireObject<T extends object>(value: T | null | undefined, name: string): T {
  if (value === null || typeof value !== "object") {
    throw new Error(`${name} is required and must be an object`);
  }
  return value;
}

function requireExecutionContext(value: unknown): ExecutionContext {
  if (value !== "host-native" && value !== "docker") {
    throw new Error(`executionContext must be 'host-native' or 'docker', got: ${value}`);
  }
  return value;
}

function deriveLabViewCliPath(runtimeDiscoveryFacts?: RuntimeDiscoveryFacts): string {
  if (!runtimeDiscoveryFacts) {
    // Default Windows path when no discovery facts available
    return "C:\\Program Files\\National Instruments\\LabVIEW 2026\\LabVIEWCLI.exe";
  }

  // Extract LabVIEWCLI path from runtime discovery facts
  if (runtimeDiscoveryFacts.labviewCliPath) {
    return runtimeDiscoveryFacts.labviewCliPath;
  }

  if (runtimeDiscoveryFacts.discoveredRuntimes?.labviewCli?.path) {
    return runtimeDiscoveryFacts.discoveredRuntimes.labviewCli.path;
  }

  if (runtimeDiscoveryFacts.nativeAcquisition?.labviewCliPath) {
    return runtimeDiscoveryFacts.nativeAcquisition.labviewCliPath;
  }

  // Fallback to default
  return "C:\\Program Files\\National Instruments\\LabVIEW 2026\\LabVIEWCLI.exe";
}

function mapToContainerPath(hostPath: string, workspacePath: string | null): string {
  if (!workspacePath) {
    return hostPath;
  }

  const normalizedWorkspace = workspacePath.replace(/\\/g, "/");
  const normalizedPath = hostPath.replace(/\\/g, "/");

  if (normalizedPath.startsWith(normalizedWorkspace)) {
    const relativePath = normalizedPath.slice(normalizedWorkspace.length);
    return `/workspace${relativePath.startsWith("/") ? "" : "/"}${relativePath}`;
  }

  // Path not under workspace, return as-is (may cause mount issues)
  return hostPath;
}

function buildCommandLine(executable: string, args: readonly string[]): string {
  const escapedArgs = args.map(arg => {
    if (arg.includes(" ") || arg.includes('"')) {
      return `"${arg.replace(/"/g, '\\"')}"`;
    }
    return arg;
  });
  return `${executable} ${escapedArgs.join(" ")}`;
}

function redactPrivatePaths(text: string): string {
  // Redact common private path patterns
  return text
    .replace(/C:\\Users\\[^\\]+/gi, "C:\\Users\\[REDACTED]")
    .replace(/\/home\/[^/]+/g, "/home/[REDACTED]")
    .replace(/\/Users\/[^/]+/g, "/Users/[REDACTED]");
}

function freezeRecord<T extends object>(obj: T): Readonly<T> {
  return Object.freeze(obj);
}
