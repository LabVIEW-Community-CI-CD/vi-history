import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  allRuntimeContractRequirementIds,
  createCommitPairSelection,
  createCompareActionState,
  createComparePreExecutionFacts,
  createComparisonCommandPlan,
  createComparisonCommandPlanFromCompareAction,
  createLabViewCliCommandPlan,
  createProofIssueBody,
  createProofPacket,
  createRuntimeFactsReport,
  createValidateFixtureProofArtifacts,
  discoverHostNativeLabViewRuntime,
  requestExplicitCompareAction,
  createRuntimeSelection,
  selectProviderPolicy,
  validateWindowsDockerDesktopProofIntake
} from "../out/src/runtime-contracts.js";

const sliceId = "runtime-contract-host-provider-v1";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function idsFromText(path) {
  return [...fs.readFileSync(path, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

test("T007 defines runtime selection facts and fail-closed blocked reason", () => {
  const ready = createRuntimeSelection({
    provider: "host-native",
    engine: "LabVIEWCLI",
    version: "2026",
    bitness: "x64",
    selectedPaths: {
      labviewCli: "LabVIEWCLI",
      labview: "LabVIEW"
    },
    readiness: "ready",
    notes: ["host default"]
  });

  assert.equal(ready.provider, "host-native");
  assert.equal(ready.engine, "LabVIEWCLI");
  assert.equal(ready.version, "2026");
  assert.equal(ready.bitness, "x64");
  assert.equal(ready.readiness, "ready");
  assert.equal(ready.blockedReason, null);
  assert.deepEqual(ready.requirementIds, [
    "VHS-SYS-REQ-006",
    "VHS-SYS-REQ-007",
    "VHS-REQ-095",
    "VHS-REQ-141"
  ]);

  assert.throws(
    () => createRuntimeSelection({
      provider: "host-native",
      version: "2024",
      bitness: "x64",
      readiness: "blocked"
    }),
    /blockedReason is required/
  );
});

test("T008 defines a LabVIEWCLI CreateComparisonReport command plan", () => {
  const runtimeSelection = createRuntimeSelection({
    provider: "host-native",
    engine: "LabVIEWCLI",
    version: "2026",
    bitness: "x64",
    selectedPaths: { labviewCli: "LabVIEWCLI", labview: "LabVIEW" },
    readiness: "ready"
  });

  const plan = createComparisonCommandPlan({
    runtimeSelection,
    selectedViPath: "selected.vi",
    baseViPath: "base.vi",
    outputPath: "report.html"
  });

  assert.equal(plan.operation, "CreateComparisonReport");
  assert.equal(plan.executable, "LabVIEWCLI");
  assert.deepEqual(plan.stagedViPaths, { base: "base.vi", selected: "selected.vi" });
  assert.equal(plan.selectedLabView.provider, "host-native");
  assert.equal(plan.selectedLabView.version, "2026");
  assert.equal(plan.selectedLabView.bitness, "x64");
  assert.ok(plan.arguments.includes("CreateComparisonReport"));
});

test("T009 defines proof packets with runtime, report, execution, and issue facts", () => {
  const runtimeSelection = createRuntimeSelection({
    provider: "host-native",
    engine: "LabVIEWCLI",
    version: "2026",
    bitness: "x64",
    readiness: "ready"
  });
  const commandPlan = createComparisonCommandPlan({
    runtimeSelection,
    selectedViPath: "selected.vi",
    baseViPath: "base.vi",
    outputPath: "report.html"
  });

  const packet = createProofPacket({
    environmentClass: "linux-host-labview-2026",
    runtimeSelection,
    commandPlan,
    generatedReportFacts: { path: "report.html", exists: true },
    stdout: "ok",
    stderr: "",
    exitCode: 0,
    durationMs: 42,
    issueBody: "proof summary"
  });

  assert.equal(packet.environmentClass, "linux-host-labview-2026");
  assert.equal(packet.runtimeFacts.provider, "host-native");
  assert.equal(packet.generatedReportFacts.exists, true);
  assert.deepEqual(packet.execution, { state: "completed", stdout: "ok", stderr: "", exitCode: 0, durationMs: 42 });
  assert.equal(packet.issueBody, "proof summary");
});

test("T010 defines host-native default, bounded Docker, unsupported bundles, and no silent fallback", () => {
  assert.deepEqual(selectProviderPolicy({ platform: "win32" }), {
    kind: "provider-policy",
    platform: "win32",
    defaultProvider: "host-native",
    requestedProvider: null,
    selectedProvider: "host-native",
    expertMode: false,
    readiness: "ready",
    blockedReason: null,
    failureGuidance: [],
    fallbackProvider: null,
    silentFallbackAllowed: false,
    requirementIds: ["VHS-SYS-REQ-005", "VHS-REQ-138", "VHS-REQ-146"]
  });

  const dockerBlocked = selectProviderPolicy({ requestedProvider: "docker" });
  assert.equal(dockerBlocked.readiness, "blocked");
  assert.equal(dockerBlocked.blockedReason, "docker-provider-requires-explicit-expert-selection");
  assert.equal(dockerBlocked.fallbackProvider, null);
  assert.equal(dockerBlocked.silentFallbackAllowed, false);

  const dockerAdmitted = selectProviderPolicy({ requestedProvider: "docker", expertMode: true });
  assert.equal(dockerAdmitted.readiness, "ready");
  assert.equal(dockerAdmitted.selectedProvider, "docker");

  const unsupported = selectProviderPolicy({ requestedProvider: "host-native", bundleSupported: false });
  assert.equal(unsupported.readiness, "blocked");
  assert.equal(unsupported.blockedReason, "runtime-bundle-unsupported");
});

test("T011 traces implementation contract IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeContractRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});

test("T012 retains selected and base commit facts after commit-pair selection", () => {
  const commitPair = createCommitPairSelection({
    selectedCommit: { sha: "abc123", label: "selected" },
    baseCommit: { sha: "def456", label: "base" }
  });

  assert.equal(commitPair.kind, "commit-pair-selection");
  assert.deepEqual(commitPair.selectedCommit, { sha: "abc123", label: "selected" });
  assert.deepEqual(commitPair.baseCommit, { sha: "def456", label: "base" });
});

test("T013 proves compare does not start before explicit user action", () => {
  const commitPair = createCommitPairSelection({
    selectedCommit: { sha: "abc123" },
    baseCommit: { sha: "def456" }
  });
  const runtimeSelection = createRuntimeSelection({
    provider: "host-native",
    engine: "LabVIEWCLI",
    version: "2026",
    bitness: "x64",
    readiness: "ready"
  });
  const reviewState = createCompareActionState({ commitPair, runtimeSelection });

  assert.throws(
    () => createComparisonCommandPlanFromCompareAction({
      compareActionState: reviewState,
      selectedViPath: "selected.vi",
      baseViPath: "base.vi",
      outputPath: "report.html"
    }),
    /does not start before explicit user action/
  );
});

test("T014 implements compare-action state flow from selection to explicit execution trigger", () => {
  const commitPair = createCommitPairSelection({
    selectedCommit: { sha: "abc123" },
    baseCommit: { sha: "def456" }
  });
  const runtimeSelection = createRuntimeSelection({
    provider: "host-native",
    engine: "LabVIEWCLI",
    version: "2026",
    bitness: "x64",
    readiness: "ready"
  });
  const reviewState = createCompareActionState({ commitPair, runtimeSelection });
  assert.equal(reviewState.phase, "review");
  assert.equal(reviewState.compareRequested, false);

  const requestedState = requestExplicitCompareAction(reviewState);
  assert.equal(requestedState.phase, "execution-requested");
  assert.equal(requestedState.compareRequested, true);

  const plan = createComparisonCommandPlanFromCompareAction({
    compareActionState: requestedState,
    selectedViPath: "selected.vi",
    baseViPath: "base.vi",
    outputPath: "report.html"
  });
  assert.equal(plan.operation, "CreateComparisonReport");
});

test("T015 renders selected/base commit and runtime facts before execution", () => {
  const commitPair = createCommitPairSelection({
    selectedCommit: { sha: "abc123", label: "selected" },
    baseCommit: { sha: "def456", label: "base" }
  });
  const runtimeSelection = createRuntimeSelection({
    provider: "host-native",
    engine: "LabVIEWCLI",
    version: "2026",
    bitness: "x64",
    readiness: "ready"
  });
  const reviewState = createCompareActionState({ commitPair, runtimeSelection });
  const facts = createComparePreExecutionFacts(reviewState);

  assert.deepEqual(facts.selectedCommit, { sha: "abc123", label: "selected" });
  assert.deepEqual(facts.baseCommit, { sha: "def456", label: "base" });
  assert.equal(facts.provider, "host-native");
  assert.equal(facts.version, "2026");
  assert.equal(facts.bitness, "x64");
});

test("T016 selects a supported host-native LabVIEWCLI runtime", () => {
  const runtimeSelection = discoverHostNativeLabViewRuntime({
    version: "2026",
    bitness: "x64",
    labviewCliPath: "/opt/ni/labview-2026/LabVIEWCLI",
    labviewPath: "/opt/ni/labview-2026/LabVIEW",
    notes: ["detected from host"]
  });

  assert.equal(runtimeSelection.provider, "host-native");
  assert.equal(runtimeSelection.engine, "LabVIEWCLI");
  assert.equal(runtimeSelection.version, "2026");
  assert.equal(runtimeSelection.bitness, "x64");
  assert.equal(runtimeSelection.readiness, "ready");
  assert.equal(runtimeSelection.blockedReason, null);
  assert.equal(runtimeSelection.selectedPaths.labviewCli, "/opt/ni/labview-2026/LabVIEWCLI");
  assert.equal(runtimeSelection.selectedPaths.labview, "/opt/ni/labview-2026/LabVIEW");
});

test("T017 rejects unsupported LabVIEW 2024-or-older runtimes", () => {
  const runtimeSelection = discoverHostNativeLabViewRuntime({
    version: "2024",
    bitness: "x64",
    labviewCliPath: "/opt/ni/labview-2024/LabVIEWCLI",
    labviewPath: "/opt/ni/labview-2024/LabVIEW"
  });

  assert.equal(runtimeSelection.readiness, "blocked");
  assert.equal(runtimeSelection.blockedReason, "labview-version-unsupported");
  assert.deepEqual(runtimeSelection.notes, ["LabVIEW 2025 or newer is required"]);
});

test("T018 fails closed when explicit proof override paths are missing", () => {
  const runtimeSelection = discoverHostNativeLabViewRuntime({
    version: "2026",
    bitness: "x64",
    proofOverrideRequired: true,
    labviewCliPath: "/opt/ni/labview-2026/LabVIEWCLI"
  });

  assert.equal(runtimeSelection.readiness, "blocked");
  assert.equal(runtimeSelection.blockedReason, "explicit-proof-override-paths-missing");
  assert.equal(runtimeSelection.selectedPaths.labviewCli, "/opt/ni/labview-2026/LabVIEWCLI");
  assert.equal(runtimeSelection.selectedPaths.labview, undefined);
});

test("T019 classifies unavailable host-native runtimes with retained facts", () => {
  const runtimeSelection = discoverHostNativeLabViewRuntime({
    version: "2026",
    bitness: "x64",
    labviewCliPath: "/opt/ni/labview-2026/LabVIEWCLI",
    labviewPath: "/opt/ni/labview-2026/LabVIEW",
    runtimeAvailable: false,
    notes: ["binary missing during discovery"]
  });

  assert.equal(runtimeSelection.readiness, "unavailable");
  assert.equal(runtimeSelection.blockedReason, "runtime-bundle-unavailable");
  assert.equal(runtimeSelection.provider, "host-native");
  assert.equal(runtimeSelection.engine, "LabVIEWCLI");
  assert.deepEqual(runtimeSelection.notes, ["binary missing during discovery"]);
});

test("T020 creates a LabVIEWCLI command plan without command execution", () => {
  const runtimeSelection = discoverHostNativeLabViewRuntime({
    version: "2026",
    bitness: "x64",
    labviewCliPath: "/opt/ni/labview-2026/LabVIEWCLI",
    labviewPath: "/opt/ni/labview-2026/LabVIEW"
  });

  const plan = createLabViewCliCommandPlan({
    runtimeSelection,
    selectedViPath: "selected.vi",
    baseViPath: "base.vi",
    outputPath: "report.html"
  });

  assert.equal(plan.kind, "labviewcli-command-plan");
  assert.equal(plan.operation, "CreateComparisonReport");
  assert.equal(plan.executable, "/opt/ni/labview-2026/LabVIEWCLI");
  assert.equal(plan.executionStarted, false);
  assert.equal(plan.executionPolicy, "plan-only");
});

test("T021 renders retained runtime facts for report and proof surfaces", () => {
  const runtimeSelection = discoverHostNativeLabViewRuntime({
    version: "2026",
    bitness: "x64",
    labviewCliPath: "/opt/ni/labview-2026/LabVIEWCLI",
    labviewPath: "/opt/ni/labview-2026/LabVIEW",
    notes: ["ready for planning"]
  });
  const commandPlan = createLabViewCliCommandPlan({
    runtimeSelection,
    selectedViPath: "selected.vi",
    baseViPath: "base.vi",
    outputPath: "report.html"
  });

  const report = createRuntimeFactsReport({ runtimeSelection, commandPlan });

  assert.equal(report.kind, "runtime-facts-report");
  assert.equal(report.runtime.provider, "host-native");
  assert.equal(report.runtime.engine, "LabVIEWCLI");
  assert.equal(report.runtime.version, "2026");
  assert.equal(report.runtime.bitness, "x64");
  assert.equal(report.runtime.readiness, "ready");
  assert.deepEqual(report.runtime.notes, ["ready for planning"]);
  assert.equal(report.commandPlan.operation, "CreateComparisonReport");
  assert.equal(report.commandPlan.selectedLabView.provider, "host-native");
  assert.equal(report.commandPlan.executionStarted, false);
});


test("T022 selects host-native as the default provider", () => {
  const policy = selectProviderPolicy({ platform: "win32" });

  assert.equal(policy.defaultProvider, "host-native");
  assert.equal(policy.requestedProvider, null);
  assert.equal(policy.selectedProvider, "host-native");
  assert.equal(policy.readiness, "ready");
  assert.equal(policy.blockedReason, null);
  assert.deepEqual(policy.failureGuidance, []);
});

test("T023 selects Docker only when explicitly requested in expert mode", () => {
  const policy = selectProviderPolicy({ requestedProvider: "docker", expertMode: true });

  assert.equal(policy.selectedProvider, "docker");
  assert.equal(policy.expertMode, true);
  assert.equal(policy.readiness, "ready");
  assert.equal(policy.blockedReason, null);
  assert.deepEqual(policy.failureGuidance, []);
});

test("T024 never selects Docker implicitly", () => {
  const implicit = selectProviderPolicy({ expertMode: true });
  assert.equal(implicit.selectedProvider, "host-native");
  assert.equal(implicit.readiness, "ready");

  const expertModeRequired = selectProviderPolicy({ requestedProvider: "docker", expertMode: false });
  assert.equal(expertModeRequired.selectedProvider, "docker");
  assert.equal(expertModeRequired.readiness, "blocked");
  assert.equal(expertModeRequired.blockedReason, "docker-provider-requires-explicit-expert-selection");
  assert.equal(expertModeRequired.fallbackProvider, null);
  assert.equal(expertModeRequired.silentFallbackAllowed, false);
  assert.ok(expertModeRequired.failureGuidance.length > 0);
});

test("T025 provides stable failure guidance for blocked and unavailable provider selections", () => {
  const blocked = selectProviderPolicy({ requestedProvider: "host-native", bundleSupported: false });
  assert.equal(blocked.readiness, "blocked");
  assert.equal(blocked.blockedReason, "runtime-bundle-unsupported");
  assert.ok(blocked.failureGuidance.length > 0);
  assert.equal(blocked.fallbackProvider, null);
  assert.equal(blocked.silentFallbackAllowed, false);

  const unavailable = selectProviderPolicy({ requestedProvider: "host-native", runtimeAvailable: false });
  assert.equal(unavailable.readiness, "unavailable");
  assert.equal(unavailable.blockedReason, "runtime-bundle-unavailable");
  assert.ok(unavailable.failureGuidance.length > 0);
  assert.equal(unavailable.fallbackProvider, null);
  assert.equal(unavailable.silentFallbackAllowed, false);
});

test("T026 classifies Linux host LabVIEW proof as distinct non-Windows evidence", () => {
  const runtimeSelection = createRuntimeSelection({
    provider: "host-native",
    engine: "LabVIEWCLI",
    version: "2026",
    bitness: "x64",
    readiness: "ready"
  });
  const packet = createProofPacket({
    environmentClass: "linux-host-labview-2026",
    runtimeSelection,
    execution: { state: "completed", exitCode: 0 },
    generatedReportFacts: { path: "report.html", exists: true },
    hostFacts: { platform: "linux", osFamily: "linux", isWsl: false },
    dockerDesktopFacts: { ostype: "linux" },
    fixture: { command: "vihs validate-fixture", canonical: true }
  });

  const intake = validateWindowsDockerDesktopProofIntake(packet);
  assert.equal(packet.environmentClass, "linux-host-labview-2026");
  assert.equal(packet.runtimeFacts.provider, "host-native");
  assert.equal(intake.classification, "not-windows-docker-desktop-proof");
  assert.equal(intake.accepted, false);
});

test("T027 rejects Linux Docker, WSL, host-provider proof, and reports without proof packets as Windows Docker Desktop proof", () => {
  const dockerRuntime = createRuntimeSelection({
    provider: "docker",
    engine: "Docker",
    version: "2026",
    bitness: "x64",
    readiness: "ready"
  });
  const linuxDockerPacket = createProofPacket({
    environmentClass: "windows-docker-desktop-windows-container",
    runtimeSelection: dockerRuntime,
    execution: { state: "completed", exitCode: 0 },
    generatedReportFacts: { path: "report.html", exists: true },
    hostFacts: { platform: "linux", osFamily: "linux", isWsl: false },
    dockerDesktopFacts: { ostype: "linux" },
    fixture: { command: "vihs validate-fixture", canonical: true }
  });
  assert.equal(validateWindowsDockerDesktopProofIntake(linuxDockerPacket).reason, "linux-docker-evidence-substitute");

  const wslPacket = createProofPacket({
    environmentClass: "windows-docker-desktop-windows-container",
    runtimeSelection: dockerRuntime,
    execution: { state: "completed", exitCode: 0 },
    generatedReportFacts: { path: "report.html", exists: true },
    hostFacts: { platform: "win32", osFamily: "windows", isWsl: true },
    dockerDesktopFacts: { ostype: "windows" },
    fixture: { command: "vihs validate-fixture", canonical: true }
  });
  assert.equal(validateWindowsDockerDesktopProofIntake(wslPacket).reason, "wsl-evidence-substitute");

  const hostRuntime = createRuntimeSelection({
    provider: "host-native",
    engine: "LabVIEWCLI",
    version: "2026",
    bitness: "x64",
    readiness: "ready"
  });
  const hostProviderPacket = createProofPacket({
    environmentClass: "windows-docker-desktop-windows-container",
    runtimeSelection: hostRuntime,
    execution: { state: "completed", exitCode: 0 },
    generatedReportFacts: { path: "report.html", exists: true },
    hostFacts: { platform: "win32", osFamily: "windows", isWsl: false },
    dockerDesktopFacts: { ostype: "windows" },
    fixture: { command: "vihs validate-fixture", canonical: true }
  });
  assert.equal(validateWindowsDockerDesktopProofIntake(hostProviderPacket).reason, "host-provider-evidence-substitute");

  const reportWithoutProof = { reportPath: "report.html", exists: true };
  const withoutPacketIntake = validateWindowsDockerDesktopProofIntake(reportWithoutProof);
  assert.equal(withoutPacketIntake.classification, "not-windows-docker-desktop-proof");
  assert.equal(withoutPacketIntake.reason, "report-without-proof-packet");
});

test("T028 validates deterministic vihs validate-fixture proof JSON and issue-body generation", () => {
  const runtimeSelection = createRuntimeSelection({
    provider: "docker",
    engine: "Docker",
    version: "2026",
    bitness: "x64",
    readiness: "ready"
  });
  const artifacts = createValidateFixtureProofArtifacts({
    environmentClass: "windows-docker-desktop-windows-container",
    runtimeSelection,
    commandPlan: { operation: "CreateComparisonReport" },
    execution: { state: "completed", exitCode: 0, stdout: "ok", stderr: "", durationMs: 77 },
    generatedReportFacts: { path: "report.html", exists: true },
    hostFacts: { platform: "win32", osFamily: "windows", isWsl: false },
    dockerDesktopFacts: { ostype: "windows" },
    fixture: { command: "custom command", canonical: false }
  });

  assert.equal(artifacts.proofJson.schema, "vi-history/proof-packet@v1");
  assert.equal(artifacts.proofJson.fixture.command, "vihs validate-fixture");
  assert.equal(artifacts.proofJson.fixture.canonical, true);
  assert.equal(artifacts.proofJson.generatedReportFacts.path, "report.html");
  assert.equal(artifacts.proofJson.generatedReportFacts.exists, true);
  assert.equal(artifacts.issueBody, artifacts.proofJson.issueBody);
  assert.equal(artifacts.issueBody, createProofIssueBody(artifacts.proofJson));
  assert.ok(artifacts.issueBody.includes("Fixture command: vihs validate-fixture"));
  assert.ok(artifacts.issueBody.includes("Fixture canonical: true"));
});

test("T029 writes proof packet and generated issue body from retained proof facts", () => {
  const runtimeSelection = createRuntimeSelection({
    provider: "docker",
    engine: "Docker",
    version: "2026",
    bitness: "x64",
    readiness: "ready"
  });
  const packet = createProofPacket({
    environmentClass: "windows-docker-desktop-windows-container",
    runtimeSelection,
    commandPlan: { operation: "CreateComparisonReport" },
    execution: { state: "completed", exitCode: 0, stdout: "ok", stderr: "", durationMs: 41 },
    generatedReportFacts: { path: "report.html", exists: true },
    hostFacts: { platform: "win32", osFamily: "windows", isWsl: false },
    dockerDesktopFacts: { ostype: "windows" },
    fixture: { command: "vihs validate-fixture", canonical: true }
  });

  assert.equal(packet.schema, "vi-history/proof-packet@v1");
  assert.equal(packet.runtimeFacts.provider, "docker");
  assert.equal(packet.runtimeFacts.engine, "Docker");
  assert.equal(packet.execution.state, "completed");
  assert.equal(packet.execution.exitCode, 0);
  assert.equal(packet.generatedReportFacts.exists, true);
  assert.equal(packet.hostFacts.platform, "win32");
  assert.equal(packet.dockerDesktopFacts.ostype, "windows");
  assert.equal(packet.fixture.command, "vihs validate-fixture");
  assert.ok(packet.issueBody.includes("Runtime provider: docker"));
});

test("T030 accepts only real Windows Docker Desktop Windows-container proof intake", () => {
  const runtimeSelection = createRuntimeSelection({
    provider: "docker",
    engine: "Docker",
    version: "2026",
    bitness: "x64",
    readiness: "ready"
  });
  const acceptedPacket = createProofPacket({
    environmentClass: "windows-docker-desktop-windows-container",
    runtimeSelection,
    execution: { state: "completed", exitCode: 0 },
    generatedReportFacts: { path: "report.html", exists: true },
    hostFacts: { platform: "win32", osFamily: "windows", isWsl: false },
    dockerDesktopFacts: { ostype: "windows" },
    fixture: { command: "vihs validate-fixture", canonical: true }
  });

  const accepted = validateWindowsDockerDesktopProofIntake(acceptedPacket);
  assert.equal(accepted.classification, "windows-docker-desktop-windows-container-proof");
  assert.equal(accepted.accepted, true);
  assert.equal(accepted.reason, null);

  const missingGeneratedReport = createProofPacket({
    environmentClass: "windows-docker-desktop-windows-container",
    runtimeSelection,
    execution: { state: "completed", exitCode: 0 },
    generatedReportFacts: { path: "report.html", exists: false },
    hostFacts: { platform: "win32", osFamily: "windows", isWsl: false },
    dockerDesktopFacts: { ostype: "windows" },
    fixture: { command: "vihs validate-fixture", canonical: true }
  });
  const rejected = validateWindowsDockerDesktopProofIntake(missingGeneratedReport);
  assert.equal(rejected.classification, "not-windows-docker-desktop-proof");
  assert.equal(rejected.accepted, false);

  const missingGeneratedReportPath = createProofPacket({
    environmentClass: "windows-docker-desktop-windows-container",
    runtimeSelection,
    execution: { state: "completed", exitCode: 0 },
    generatedReportFacts: { exists: true },
    hostFacts: { platform: "win32", osFamily: "windows", isWsl: false },
    dockerDesktopFacts: { ostype: "windows" },
    fixture: { command: "vihs validate-fixture", canonical: true }
  });
  const rejectedWithoutPath = validateWindowsDockerDesktopProofIntake(missingGeneratedReportPath);
  assert.equal(rejectedWithoutPath.classification, "not-windows-docker-desktop-proof");
  assert.equal(rejectedWithoutPath.accepted, false);
});
