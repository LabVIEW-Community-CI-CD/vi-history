// ============================================================================
// Type Definitions
// ============================================================================

export type Provider = "host-native" | "docker";
export type Engine = "LabVIEWCLI" | "Docker";
export type Bitness = "x64" | "x86";
export type Readiness = "ready" | "blocked" | "unavailable";

export interface RuntimeSelection {
  readonly kind: "runtime-selection";
  readonly provider: Provider;
  readonly engine: Engine;
  readonly version: string;
  readonly bitness: Bitness;
  readonly selectedPaths: Record<string, string>;
  readonly readiness: Readiness;
  readonly blockedReason: string | null;
  readonly notes: readonly string[];
  readonly requirementIds: readonly string[];
}

export interface CommitRecord {
  readonly id: string;
  readonly [key: string]: unknown;
}

export interface CommitPairSelection {
  readonly kind: "commit-pair-selection";
  readonly selectedCommit: CommitRecord;
  readonly baseCommit: CommitRecord;
  readonly requirementIds: readonly string[];
}

export interface CompareActionState {
  readonly kind: "compare-action-state";
  readonly phase: string;
  readonly compareRequested: boolean;
  readonly commitPair: CommitPairSelection;
  readonly runtimeSelection: RuntimeSelection;
  readonly requirementIds: readonly string[];
}

export interface ComparePreExecutionFacts {
  readonly kind: "compare-pre-execution-facts";
  readonly selectedCommit: CommitRecord;
  readonly baseCommit: CommitRecord;
  readonly provider: Provider;
  readonly version: string;
  readonly bitness: Bitness;
  readonly requirementIds: readonly string[];
}

export interface SelectedLabView {
  readonly provider: Provider;
  readonly engine: Engine;
  readonly version: string;
  readonly bitness: Bitness;
  readonly labviewPath: string | null;
  readonly labviewCliPath: string;
}

export interface StagedViPaths {
  readonly base: string;
  readonly selected: string;
}

export interface ComparisonCommandPlan {
  readonly kind: "comparison-command-plan";
  readonly operation: string;
  readonly executable: string;
  readonly arguments: readonly string[];
  readonly stagedViPaths: StagedViPaths;
  readonly outputPath: string;
  readonly selectedLabView: SelectedLabView;
  readonly runtimeSelection: RuntimeSelection;
  readonly requirementIds: readonly string[];
}

export interface LabViewCliCommandPlan {
  readonly kind: "labviewcli-command-plan";
  readonly operation: string;
  readonly executable: string;
  readonly arguments: readonly string[];
  readonly stagedViPaths: StagedViPaths;
  readonly outputPath: string;
  readonly selectedLabView: SelectedLabView;
  readonly runtimeSelection: RuntimeSelection;
  readonly requirementIds: readonly string[];
  readonly executionStarted: boolean;
  readonly executionPolicy: string;
}

export interface RuntimeFacts {
  readonly provider: Provider;
  readonly engine: Engine;
  readonly version: string;
  readonly bitness: Bitness;
  readonly readiness: Readiness;
  readonly blockedReason: string | null;
  readonly selectedPaths: Record<string, string>;
  readonly notes: readonly string[];
}

export interface ExecutionFacts {
  readonly state: string;
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number | null;
  readonly durationMs: number | null;
}

export interface GeneratedReportFacts {
  readonly path: string;
  readonly exists: boolean;
  readonly [key: string]: unknown;
}

export interface HostFacts {
  readonly platform: string;
  readonly osFamily: string;
  readonly isWsl: boolean;
}

export interface DockerDesktopFacts {
  readonly ostype: string;
}

export interface FixtureFacts {
  readonly command: string;
  readonly canonical: boolean;
}

export interface RuntimeFactsReport {
  readonly kind: "runtime-facts-report";
  readonly runtime: RuntimeFacts;
  readonly commandPlan: {
    readonly operation: string;
    readonly executable: string;
    readonly stagedViPaths: StagedViPaths;
    readonly outputPath: string;
    readonly selectedLabView: SelectedLabView;
    readonly executionStarted: boolean;
  } | null;
  readonly requirementIds: readonly string[];
}

export interface ProofPacket {
  readonly kind: "proof-packet";
  readonly schema: string;
  readonly environmentClass: string;
  readonly runtimeFacts: RuntimeFacts;
  readonly commandPlan: ComparisonCommandPlan | null;
  readonly generatedReportFacts: GeneratedReportFacts;
  readonly hostFacts: HostFacts;
  readonly dockerDesktopFacts: DockerDesktopFacts;
  readonly fixture: FixtureFacts;
  readonly execution: ExecutionFacts;
  readonly issueBody: string;
  readonly requirementIds: readonly string[];
}

export interface ValidateFixtureProofArtifacts {
  readonly kind: "validate-fixture-proof-artifacts";
  readonly proofJson: ProofPacket;
  readonly issueBody: string;
  readonly requirementIds: readonly string[];
}

export interface ProofIntakeValidation {
  readonly kind: "proof-intake-validation";
  readonly classification: string;
  readonly accepted: boolean;
  readonly reason: string | null;
  readonly requirementIds: readonly string[];
}

export interface ProviderPolicy {
  readonly kind: "provider-policy";
  readonly platform: string;
  readonly defaultProvider: Provider;
  readonly requestedProvider: Provider | null;
  readonly selectedProvider: Provider;
  readonly expertMode: boolean;
  readonly readiness: Readiness;
  readonly blockedReason: string | null;
  readonly failureGuidance: readonly string[];
  readonly fallbackProvider: Provider | null;
  readonly silentFallbackAllowed: boolean;
  readonly requirementIds: readonly string[];
}

// ============================================================================
// Requirement Constants
// ============================================================================

export const RUNTIME_CONTRACT_REQUIREMENTS = {
  runtimeSelection: [
    "VHS-SYS-REQ-006",
    "VHS-SYS-REQ-007",
    "VHS-REQ-095",
    "VHS-REQ-141"
  ] as const,
  comparisonCommandPlan: [
    "VHS-SYS-REQ-004",
    "VHS-SYS-REQ-008",
    "VHS-REQ-094",
    "VHS-REQ-144",
    "VHS-REQ-194"
  ] as const,
  proofPacket: [
    "VHS-REQ-148",
    "VHS-REQ-588",
    "VHS-REQ-589",
    "VHS-REQ-590"
  ] as const,
  providerPolicy: [
    "VHS-SYS-REQ-005",
    "VHS-REQ-138",
    "VHS-REQ-146"
  ] as const,
  explicitCompareAction: [
    "VHS-SYS-REQ-006",
    "VHS-SYS-REQ-008"
  ] as const,
  runtimeProviderFacts: [
    "VHS-SYS-REQ-006",
    "VHS-SYS-REQ-007",
    "VHS-REQ-094",
    "VHS-REQ-095",
    "VHS-REQ-141",
    "VHS-REQ-144",
    "VHS-REQ-194"
  ] as const
} as const;

// ============================================================================
// Internal Constants and Utilities
// ============================================================================

const PROVIDERS = new Set<Provider>(["host-native", "docker"]);
const ENGINES = new Set<Engine>(["LabVIEWCLI", "Docker"]);
const BITNESS = new Set<Bitness>(["x64", "x86"]);
const READINESS = new Set<Readiness>(["ready", "blocked", "unavailable"]);
const PROOF_PACKET_SCHEMA = "vi-history/proof-packet@v1";

function requireValue<T>(value: T | undefined | null, label: string): T {
  if (value === undefined || value === null || value === "") {
    throw new Error(`${label} is required`);
  }
  return value;
}

function requireOneOf<T>(value: T, allowed: Set<T>, label: string): T {
  requireValue(value, label);
  if (!allowed.has(value)) {
    throw new Error(`${label} must be one of ${Array.from(allowed).join(", ")}`);
  }
  return value;
}

function normalizeNotes(notes: unknown): readonly string[] {
  if (notes === undefined || notes === null) {
    return Object.freeze([]);
  }
  const values = Array.isArray(notes) ? notes : [notes];
  return Object.freeze(values.map(String).filter((note: string) => note.length > 0));
}

function freezeRecord<T extends object>(record: T): Readonly<T> {
  for (const [, value] of Object.entries(record)) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      freezeRecord(value as object);
    }
  }
  return Object.freeze(record);
}

function cloneRecord(value: unknown, label: string): Readonly<CommitRecord> {
  const required = requireValue(value, label);
  if (typeof required === "string") {
    return Object.freeze({ id: required });
  }
  if (typeof required !== "object" || required === null) {
    throw new Error(`${label} must be a string or object`);
  }
  return freezeRecord({ ...required } as CommitRecord);
}

function normalizeVersionNumber(version: unknown): number {
  const versionText = String(requireValue(version, "version"));
  const match = versionText.match(/\d{4}/);
  if (!match) {
    throw new Error("version must include a four-digit LabVIEW year");
  }
  return Number(match[0]);
}

interface RuntimePathsInput {
  selectedPaths?: Record<string, string>;
  labviewCliPath?: string;
  labviewPath?: string;
}

function selectedRuntimePaths(input: RuntimePathsInput = {}): Record<string, string> {
  return {
    ...(input.selectedPaths ?? {}),
    ...(input.labviewCliPath ? { labviewCli: String(input.labviewCliPath) } : {}),
    ...(input.labviewPath ? { labview: String(input.labviewPath) } : {})
  };
}

function toRuntimeFacts(runtimeSelection: RuntimeSelection): RuntimeFacts {
  return {
    provider: runtimeSelection.provider,
    engine: runtimeSelection.engine,
    version: runtimeSelection.version,
    bitness: runtimeSelection.bitness,
    readiness: runtimeSelection.readiness,
    blockedReason: runtimeSelection.blockedReason,
    selectedPaths: { ...(runtimeSelection.selectedPaths ?? {}) },
    notes: normalizeNotes(runtimeSelection.notes)
  };
}

interface ExecutionInput {
  state?: string;
  stdout?: string;
  stderr?: string;
  exitCode?: number | null;
  durationMs?: number | null;
}

function toExecutionFacts(input: ExecutionInput = {}): ExecutionFacts {
  if (input.state !== undefined && input.state !== null && input.state !== "") {
    return {
      state: String(input.state),
      stdout: String(input.stdout ?? ""),
      stderr: String(input.stderr ?? ""),
      exitCode: input.exitCode ?? null,
      durationMs: input.durationMs ?? null
    };
  }

  let derivedState = "planned";
  if (input.exitCode === 0) {
    derivedState = "completed";
  } else if (input.exitCode !== null && input.exitCode !== undefined) {
    derivedState = "failed";
  }
  return {
    state: String(derivedState),
    stdout: String(input.stdout ?? ""),
    stderr: String(input.stderr ?? ""),
    exitCode: input.exitCode ?? null,
    durationMs: input.durationMs ?? null
  };
}

interface GeneratedReportInput {
  path?: string;
  exists?: boolean;
  [key: string]: unknown;
}

function toGeneratedReportFacts(input: GeneratedReportInput = {}): GeneratedReportFacts {
  return {
    path: input.path ? String(input.path) : "",
    exists: input.exists === true,
    ...Object.fromEntries(
      Object.entries(input)
        .filter(([key]) => key !== "path" && key !== "exists")
    )
  };
}

interface HostFactsInput {
  platform?: string;
  osFamily?: string;
  isWsl?: boolean;
}

function toHostFacts(input: HostFactsInput = {}): HostFacts {
  return {
    platform: input.platform ? String(input.platform) : "unknown",
    osFamily: input.osFamily ? String(input.osFamily) : "unknown",
    isWsl: input.isWsl === true
  };
}

interface DockerDesktopFactsInput {
  ostype?: string;
}

function toDockerDesktopFacts(input: DockerDesktopFactsInput = {}): DockerDesktopFacts {
  return {
    ostype: input.ostype ? String(input.ostype) : "unknown"
  };
}

interface FixtureFactsInput {
  command?: string;
  canonical?: boolean;
}

function toFixtureFacts(input: FixtureFactsInput = {}): FixtureFacts {
  return {
    command: input.command ? String(input.command) : "",
    canonical: input.canonical === true
  };
}

// ============================================================================
// Exported Factory Functions
// ============================================================================

export interface ProofIssueBodyInput {
  environmentClass?: string;
  runtimeFacts?: Partial<RuntimeFacts>;
  execution?: Partial<ExecutionFacts>;
  generatedReportFacts?: Partial<GeneratedReportFacts>;
  fixture?: Partial<FixtureFacts>;
  hostFacts?: Partial<HostFacts>;
  dockerDesktopFacts?: Partial<DockerDesktopFacts>;
}

export function createProofIssueBody(input: ProofIssueBodyInput = {}): string {
  const environmentClass = String(input.environmentClass ?? "unknown");
  const runtimeFacts = input.runtimeFacts ?? {};
  const execution = input.execution ?? {};
  const generatedReportFacts = input.generatedReportFacts ?? {};
  const fixture = input.fixture ?? {};
  const hostFacts = input.hostFacts ?? {};
  const dockerDesktopFacts = input.dockerDesktopFacts ?? {};

  return [
    "### Runtime contract proof",
    `- Environment class: ${environmentClass}`,
    `- Runtime provider: ${runtimeFacts.provider ?? "unknown"}`,
    `- Runtime engine: ${runtimeFacts.engine ?? "unknown"}`,
    `- Runtime version: ${runtimeFacts.version ?? "unknown"}`,
    `- Runtime bitness: ${runtimeFacts.bitness ?? "unknown"}`,
    `- Runtime readiness: ${runtimeFacts.readiness ?? "unknown"}`,
    `- Execution state: ${execution.state ?? "unknown"}`,
    `- Execution exit code: ${execution.exitCode ?? "null"}`,
    `- Generated report path: ${generatedReportFacts.path ?? ""}`,
    `- Generated report exists: ${generatedReportFacts.exists === true}`,
    `- Host platform: ${hostFacts.platform ?? "unknown"}`,
    `- Host osFamily: ${hostFacts.osFamily ?? "unknown"}`,
    `- Host isWsl: ${hostFacts.isWsl === true}`,
    `- Docker Desktop OSType: ${dockerDesktopFacts.ostype ?? "unknown"}`,
    `- Fixture command: ${fixture.command ?? ""}`,
    `- Fixture canonical: ${fixture.canonical === true}`
  ].join("\n");
}

export interface RuntimeSelectionInput {
  provider: Provider;
  engine?: Engine;
  version: string;
  bitness: Bitness;
  selectedPaths?: Record<string, string>;
  readiness?: Readiness;
  blockedReason?: string | null;
  notes?: string | readonly string[];
}

export function createRuntimeSelection(input: RuntimeSelectionInput): RuntimeSelection {
  const provider = requireOneOf(input?.provider, PROVIDERS, "provider");
  const engine = requireOneOf(input?.engine ?? "LabVIEWCLI", ENGINES, "engine");
  const bitness = requireOneOf(input?.bitness, BITNESS, "bitness");
  const readiness = requireOneOf(input?.readiness ?? "blocked", READINESS, "readiness");
  const blockedReason = input?.blockedReason ?? null;

  if (readiness !== "ready" && !blockedReason) {
    throw new Error("blockedReason is required unless readiness is ready");
  }

  return freezeRecord({
    kind: "runtime-selection",
    provider,
    engine,
    version: String(requireValue(input?.version, "version")),
    bitness,
    selectedPaths: { ...(input?.selectedPaths ?? {}) },
    readiness,
    blockedReason,
    notes: normalizeNotes(input?.notes),
    requirementIds: [...RUNTIME_CONTRACT_REQUIREMENTS.runtimeSelection]
  });
}

export interface CommitPairSelectionInput {
  selectedCommit: string | CommitRecord;
  baseCommit: string | CommitRecord;
}

export function createCommitPairSelection(input: CommitPairSelectionInput): CommitPairSelection {
  const selectedCommit = cloneRecord(input?.selectedCommit, "selectedCommit");
  const baseCommit = cloneRecord(input?.baseCommit, "baseCommit");

  return freezeRecord({
    kind: "commit-pair-selection" as const,
    selectedCommit,
    baseCommit,
    requirementIds: [...RUNTIME_CONTRACT_REQUIREMENTS.explicitCompareAction]
  });
}

export interface CompareActionStateInput {
  commitPair: CommitPairSelection;
  runtimeSelection: RuntimeSelection;
}

export function createCompareActionState(input: CompareActionStateInput): CompareActionState {
  const commitPair = requireValue(input?.commitPair, "commitPair");
  const runtimeSelection = requireValue(input?.runtimeSelection, "runtimeSelection");
  if (commitPair.kind !== "commit-pair-selection") {
    throw new Error("commitPair must come from createCommitPairSelection");
  }
  if (runtimeSelection.kind !== "runtime-selection") {
    throw new Error("runtimeSelection must come from createRuntimeSelection");
  }

  return freezeRecord({
    kind: "compare-action-state" as const,
    phase: "review",
    compareRequested: false,
    commitPair,
    runtimeSelection,
    requirementIds: [...RUNTIME_CONTRACT_REQUIREMENTS.explicitCompareAction]
  });
}

export function requestExplicitCompareAction(compareActionState: CompareActionState): CompareActionState {
  const state = requireValue(compareActionState, "compareActionState");
  if (state.kind !== "compare-action-state") {
    throw new Error("compareActionState must come from createCompareActionState");
  }

  return freezeRecord({
    ...state,
    phase: "execution-requested",
    compareRequested: true
  });
}

export function createComparePreExecutionFacts(compareActionState: CompareActionState): ComparePreExecutionFacts {
  const state = requireValue(compareActionState, "compareActionState");
  if (state.kind !== "compare-action-state") {
    throw new Error("compareActionState must come from createCompareActionState");
  }

  return freezeRecord({
    kind: "compare-pre-execution-facts" as const,
    selectedCommit: state.commitPair.selectedCommit,
    baseCommit: state.commitPair.baseCommit,
    provider: state.runtimeSelection.provider,
    version: state.runtimeSelection.version,
    bitness: state.runtimeSelection.bitness,
    requirementIds: [...RUNTIME_CONTRACT_REQUIREMENTS.explicitCompareAction]
  });
}

export interface ComparisonCommandPlanInput {
  runtimeSelection: RuntimeSelection;
  selectedViPath: string;
  baseViPath: string;
  outputPath: string;
  labviewCliPath?: string;
}

export function createComparisonCommandPlan(input: ComparisonCommandPlanInput): ComparisonCommandPlan {
  const runtimeSelection = requireValue(input?.runtimeSelection, "runtimeSelection");
  if (runtimeSelection.kind !== "runtime-selection") {
    throw new Error("runtimeSelection must come from createRuntimeSelection");
  }
  if (runtimeSelection.readiness !== "ready") {
    throw new Error(`runtimeSelection is not ready: ${runtimeSelection.blockedReason ?? "unknown"}`);
  }

  const selectedViPath = String(requireValue(input?.selectedViPath, "selectedViPath"));
  const baseViPath = String(requireValue(input?.baseViPath, "baseViPath"));
  const outputPath = String(requireValue(input?.outputPath, "outputPath"));
  const labviewCliPath = input?.labviewCliPath ?? runtimeSelection.selectedPaths.labviewCli ?? "LabVIEWCLI";

  return freezeRecord({
    kind: "comparison-command-plan",
    operation: "CreateComparisonReport",
    executable: String(labviewCliPath),
    arguments: [
      "CreateComparisonReport",
      "--base-vi",
      baseViPath,
      "--selected-vi",
      selectedViPath,
      "--output",
      outputPath
    ],
    stagedViPaths: {
      base: baseViPath,
      selected: selectedViPath
    },
    outputPath,
    selectedLabView: {
      provider: runtimeSelection.provider,
      engine: runtimeSelection.engine,
      version: runtimeSelection.version,
      bitness: runtimeSelection.bitness,
      labviewPath: runtimeSelection.selectedPaths.labview ?? null,
      labviewCliPath: String(labviewCliPath)
    },
    runtimeSelection,
    requirementIds: [...RUNTIME_CONTRACT_REQUIREMENTS.comparisonCommandPlan]
  });
}

export interface CompareActionPlanInput extends ComparisonCommandPlanInput {
  compareActionState: CompareActionState;
}

export function createComparisonCommandPlanFromCompareAction(input: CompareActionPlanInput): ComparisonCommandPlan {
  const compareActionState = requireValue(input?.compareActionState, "compareActionState");
  if (compareActionState.kind !== "compare-action-state") {
    throw new Error("compareActionState must come from createCompareActionState");
  }
  if (compareActionState.compareRequested !== true || compareActionState.phase !== "execution-requested") {
    throw new Error("compare does not start before explicit user action");
  }

  return createComparisonCommandPlan({
    runtimeSelection: compareActionState.runtimeSelection,
    selectedViPath: input?.selectedViPath,
    baseViPath: input?.baseViPath,
    outputPath: input?.outputPath,
    labviewCliPath: input?.labviewCliPath
  });
}

export interface DiscoverHostNativeInput extends RuntimePathsInput {
  version: string;
  bitness: Bitness;
  proofOverrideRequired?: boolean;
  runtimeAvailable?: boolean;
  notes?: string | string[];
}

export function discoverHostNativeLabViewRuntime(input: DiscoverHostNativeInput): RuntimeSelection {
  const version = String(requireValue(input.version, "version"));
  const bitness = requireOneOf(input.bitness, BITNESS, "bitness");
  const paths = selectedRuntimePaths(input);
  const versionYear = normalizeVersionNumber(version);
  const proofOverrideRequired = input.proofOverrideRequired === true;

  if (proofOverrideRequired && (!paths.labviewCli || !paths.labview)) {
    return createRuntimeSelection({
      provider: "host-native",
      engine: "LabVIEWCLI",
      version,
      bitness,
      selectedPaths: paths,
      readiness: "blocked",
      blockedReason: "explicit-proof-override-paths-missing",
      notes: ["explicit LabVIEWCLI and LabVIEW paths are required for proof override mode"]
    });
  }

  if (versionYear <= 2024) {
    return createRuntimeSelection({
      provider: "host-native",
      engine: "LabVIEWCLI",
      version,
      bitness,
      selectedPaths: paths,
      readiness: "blocked",
      blockedReason: "labview-version-unsupported",
      notes: ["LabVIEW 2025 or newer is required"]
    });
  }

  if (input.runtimeAvailable === false) {
    return createRuntimeSelection({
      provider: "host-native",
      engine: "LabVIEWCLI",
      version,
      bitness,
      selectedPaths: paths,
      readiness: "unavailable",
      blockedReason: "runtime-bundle-unavailable",
      notes: normalizeNotes(input.notes)
    });
  }

  return createRuntimeSelection({
    provider: "host-native",
    engine: "LabVIEWCLI",
    version,
    bitness,
    selectedPaths: paths,
    readiness: "ready",
    notes: normalizeNotes(input.notes)
  });
}

export function createLabViewCliCommandPlan(input: ComparisonCommandPlanInput): LabViewCliCommandPlan {
  const plan = createComparisonCommandPlan(input);
  return freezeRecord({
    ...plan,
    kind: "labviewcli-command-plan" as const,
    executionStarted: false,
    executionPolicy: "plan-only"
  }) as LabViewCliCommandPlan;
}

export interface RuntimeFactsReportInput {
  runtimeSelection: RuntimeSelection;
  commandPlan?: ComparisonCommandPlan | LabViewCliCommandPlan | null;
}

export function createRuntimeFactsReport(input: RuntimeFactsReportInput): RuntimeFactsReport {
  const runtimeSelection = requireValue(input?.runtimeSelection, "runtimeSelection");
  if (runtimeSelection.kind !== "runtime-selection") {
    throw new Error("runtimeSelection must come from createRuntimeSelection");
  }

  const commandPlan = input?.commandPlan ?? null;
  return freezeRecord({
    kind: "runtime-facts-report" as const,
    runtime: {
      provider: runtimeSelection.provider,
      engine: runtimeSelection.engine,
      version: runtimeSelection.version,
      bitness: runtimeSelection.bitness,
      selectedPaths: runtimeSelection.selectedPaths,
      readiness: runtimeSelection.readiness,
      blockedReason: runtimeSelection.blockedReason,
      notes: runtimeSelection.notes
    },
    commandPlan: commandPlan
      ? {
          operation: commandPlan.operation,
          executable: commandPlan.executable,
          stagedViPaths: commandPlan.stagedViPaths,
          outputPath: commandPlan.outputPath,
          selectedLabView: commandPlan.selectedLabView,
          executionStarted: (commandPlan as LabViewCliCommandPlan).executionStarted === true
        }
      : null,
    requirementIds: [...RUNTIME_CONTRACT_REQUIREMENTS.runtimeProviderFacts]
  });
}

export interface ProofPacketInput {
  runtimeSelection: RuntimeSelection;
  environmentClass: string;
  execution?: ExecutionInput;
  stdout?: string;
  stderr?: string;
  exitCode?: number | null;
  durationMs?: number | null;
  state?: string;
  generatedReportFacts?: GeneratedReportInput;
  hostFacts?: HostFactsInput;
  dockerDesktopFacts?: DockerDesktopFactsInput;
  fixture?: FixtureFactsInput;
  commandPlan?: ComparisonCommandPlan | null;
  issueBody?: string;
}

export function createProofPacket(input: ProofPacketInput): ProofPacket {
  const runtimeSelection = requireValue(input?.runtimeSelection, "runtimeSelection");
  if (runtimeSelection.kind !== "runtime-selection") {
    throw new Error("runtimeSelection must come from createRuntimeSelection");
  }

  const runtimeFacts = toRuntimeFacts(runtimeSelection);
  const execution = toExecutionFacts({
    ...(input?.execution ?? {}),
    stdout: input?.stdout ?? input?.execution?.stdout,
    stderr: input?.stderr ?? input?.execution?.stderr,
    exitCode: input?.exitCode ?? input?.execution?.exitCode,
    durationMs: input?.durationMs ?? input?.execution?.durationMs,
    state: input?.state ?? input?.execution?.state
  });
  const generatedReportFacts = toGeneratedReportFacts(input?.generatedReportFacts ?? {});
  const hostFacts = toHostFacts(input?.hostFacts ?? {});
  const dockerDesktopFacts = toDockerDesktopFacts(input?.dockerDesktopFacts ?? {});
  const fixture = toFixtureFacts(input?.fixture ?? {});
  const issueBody =
    input?.issueBody ??
    createProofIssueBody({
      environmentClass: input?.environmentClass,
      runtimeFacts,
      execution,
      generatedReportFacts,
      hostFacts,
      dockerDesktopFacts,
      fixture
    });

  return freezeRecord({
    kind: "proof-packet",
    schema: PROOF_PACKET_SCHEMA,
    environmentClass: String(requireValue(input?.environmentClass, "environmentClass")),
    runtimeFacts,
    commandPlan: input?.commandPlan ?? null,
    generatedReportFacts,
    hostFacts,
    dockerDesktopFacts,
    fixture,
    execution,
    issueBody: String(issueBody),
    requirementIds: [...RUNTIME_CONTRACT_REQUIREMENTS.proofPacket]
  });
}

export function createValidateFixtureProofArtifacts(input: ProofPacketInput): ValidateFixtureProofArtifacts {
  const proofJson = createProofPacket({
    ...input,
    fixture: {
      ...(input?.fixture ?? {}),
      command: "vihs validate-fixture",
      canonical: true
    }
  });
  return freezeRecord({
    kind: "validate-fixture-proof-artifacts" as const,
    proofJson,
    issueBody: proofJson.issueBody,
    requirementIds: [...RUNTIME_CONTRACT_REQUIREMENTS.proofPacket]
  });
}

export function validateWindowsDockerDesktopProofIntake(input: unknown): ProofIntakeValidation {
  if (!input || typeof input !== "object" || (input as ProofPacket).kind !== "proof-packet") {
    return freezeRecord({
      kind: "proof-intake-validation" as const,
      classification: "not-windows-docker-desktop-proof",
      accepted: false,
      reason: "report-without-proof-packet",
      requirementIds: [...RUNTIME_CONTRACT_REQUIREMENTS.proofPacket]
    });
  }

  const proofPacket = input as ProofPacket;
  const hostFacts = proofPacket.hostFacts ?? {} as HostFacts;
  const dockerDesktopFacts = proofPacket.dockerDesktopFacts ?? {} as DockerDesktopFacts;
  const runtimeFacts = proofPacket.runtimeFacts ?? {} as RuntimeFacts;
  const execution = proofPacket.execution ?? {} as ExecutionFacts;
  const fixture = proofPacket.fixture ?? {} as FixtureFacts;
  const generatedReportFacts = proofPacket.generatedReportFacts ?? {} as GeneratedReportFacts;

  const windowsDockerDesktopAccepted =
    proofPacket.environmentClass === "windows-docker-desktop-windows-container" &&
    hostFacts.platform === "win32" &&
    hostFacts.osFamily === "windows" &&
    hostFacts.isWsl === false &&
    dockerDesktopFacts.ostype === "windows" &&
    runtimeFacts.provider === "docker" &&
    runtimeFacts.engine === "Docker" &&
    execution.state === "completed" &&
    execution.exitCode === 0 &&
    fixture.command === "vihs validate-fixture" &&
    fixture.canonical === true &&
    String(generatedReportFacts.path ?? "").length > 0 &&
    generatedReportFacts.exists === true;

  if (windowsDockerDesktopAccepted) {
    return freezeRecord({
      kind: "proof-intake-validation" as const,
      classification: "windows-docker-desktop-windows-container-proof",
      accepted: true,
      reason: null,
      requirementIds: [...RUNTIME_CONTRACT_REQUIREMENTS.proofPacket]
    });
  }

  let reason = "not-windows-docker-desktop-proof";
  if (hostFacts.isWsl === true) {
    reason = "wsl-evidence-substitute";
  } else if (runtimeFacts.provider === "host-native") {
    reason = "host-provider-evidence-substitute";
  } else if (dockerDesktopFacts.ostype === "linux" || hostFacts.osFamily === "linux") {
    reason = "linux-docker-evidence-substitute";
  }

  return freezeRecord({
    kind: "proof-intake-validation" as const,
    classification: "not-windows-docker-desktop-proof",
    accepted: false,
    reason,
    requirementIds: [...RUNTIME_CONTRACT_REQUIREMENTS.proofPacket]
  });
}

export interface ProviderPolicyInput {
  requestedProvider?: Provider | null;
  platform?: string;
  expertMode?: boolean;
  bundleSupported?: boolean;
  runtimeAvailable?: boolean;
}

export function selectProviderPolicy(input: ProviderPolicyInput = {}): ProviderPolicy {
  const requestedProvider = input.requestedProvider ?? null;
  const selectedProvider: Provider = requestedProvider ?? "host-native";
  requireOneOf(selectedProvider, PROVIDERS, "selectedProvider");

  let readiness: Readiness = "ready";
  let blockedReason: string | null = null;
  let failureGuidance: string[] = [];

  if (selectedProvider === "docker" && input.expertMode !== true) {
    readiness = "blocked";
    blockedReason = "docker-provider-requires-explicit-expert-selection";
    failureGuidance = [
      "Docker is bound to explicit expert selection.",
      "Keep host-native LabVIEWCLI as the installed-user default or set expert mode explicitly."
    ];
  } else if (input.bundleSupported === false) {
    readiness = "blocked";
    blockedReason = "runtime-bundle-unsupported";
    failureGuidance = [
      "The selected provider bundle is unsupported.",
      "Choose a supported runtime bundle before comparison."
    ];
  } else if (input.runtimeAvailable === false) {
    readiness = "unavailable";
    blockedReason = "runtime-bundle-unavailable";
    failureGuidance = [
      "The selected provider bundle is unavailable.",
      "Install or configure the runtime bundle, then retry."
    ];
  }

  return freezeRecord({
    kind: "provider-policy",
    platform: input.platform ?? "win32",
    defaultProvider: "host-native",
    requestedProvider,
    selectedProvider,
    expertMode: input.expertMode === true,
    readiness,
    blockedReason,
    failureGuidance,
    fallbackProvider: null,
    silentFallbackAllowed: false,
    requirementIds: [...RUNTIME_CONTRACT_REQUIREMENTS.providerPolicy]
  });
}

export function allRuntimeContractRequirementIds(): readonly string[] {
  return Object.freeze(
    Object.values(RUNTIME_CONTRACT_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}
