import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliValidationHostRuntimeObservationSourceRequirementIds,
  createRuntimeSettingsValidationCommandResult,
  createRuntimeSettingsValidationHostRuntimeDiscovery,
  createRuntimeSettingsValidationHostRuntimeObservation,
  createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter,
  createRuntimeSettingsValidationHostRuntimePreflight,
  createRuntimeSettingsValidationProofArtifact,
  createRuntimeSettingsValidationProofOutAdapter,
  createRuntimeSettingsValidationRuntimeOutcome,
  readRuntimeSettingsValidation
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function idsFromText(filePath) {
  return [...fs.readFileSync(filePath, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

function hostSelection(overrides = {}) {
  return {
    runtimeProvider: "host-native",
    platform: "windows",
    labviewVersion: "2026",
    labviewBitness: "x64",
    ...overrides
  };
}

function windowsRegistrySource(overrides = {}) {
  return {
    kind: "windows-registry-view-source",
    registryView: "64-bit",
    sourceId: "labview-2026-windows-x64-registry-source",
    platform: "windows",
    labviewVersion: "2026",
    labviewBitness: "x64",
    labviewExecutable: {
      available: true,
      version: "2026",
      bitness: "x64"
    },
    labviewCli: {
      available: true,
      canonical: true,
      bitness: "x86"
    },
    ...overrides
  };
}

function linuxDocumentedRootSource(overrides = {}) {
  return {
    kind: "documented-root-source",
    documentedRoot: "ni-labview-2026-linux-root",
    sourceId: "labview-2026-linux-x64-documented-root-source",
    platform: "linux",
    labviewVersion: "2026",
    labviewBitness: "x64",
    labviewExecutable: {
      available: true,
      version: "2026",
      bitness: "x64"
    },
    labviewCli: {
      available: true,
      canonical: true,
      bitness: "x64"
    },
    ...overrides
  };
}

function readySettings() {
  return {
    "viHistorySuite.runtimeProvider": "host-native",
    "viHistorySuite.labviewVersion": "2026",
    "viHistorySuite.labviewBitness": "64-bit"
  };
}

test("T009 selected host facts drive public-safe source adaptation without filesystem walking", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection({ platform: "linux" }),
    sourceFacts: [linuxDocumentedRootSource()]
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-validation-host-runtime-observation-source-adapter-contract");
  assert.equal(result.sourceAdapterBoundary, "bounded-public-safe-observation-source-facts-only");
  assert.equal(result.selection.platform, "linux");
  assert.equal(result.sourceCount, 1);
  assert.equal(result.sourceFacts[0].kind, "host-runtime-observation-source");
  assert.equal(result.sourceFacts[0].sourceClass, "documented-root");
  assert.equal(result.observationDependencyFacts[0].documentedRoot, "ni-labview-2026-linux-root");
  assert.equal(result.observation.status, "ready");
  assert.equal(result.runtimeSelection.runtimeProvider, "host-native");
  assert.equal(result.blockedSideEffects.arbitraryFilesystemWalking, false);
  assert.equal(result.blockedSideEffects.fileSystemReads, false);
});

test("T010 registry-view source facts sanitize raw registry and private path surfaces", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [windowsRegistrySource()]
  });
  const rawRegistry = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [
      windowsRegistrySource({
        rawRegistryOutput: "HKEY_LOCAL_MACHINE private raw registry output"
      })
    ]
  });
  const privatePath = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [
      windowsRegistrySource({
        installPath: "C:\\Users\\Example\\Private\\LabVIEW"
      })
    ]
  });
  const serialized = JSON.stringify(result);

  assert.equal(result.status, "ready");
  assert.equal(result.sourceFacts[0].sourceClass, "windows-registry-view");
  assert.equal(result.sourceFacts[0].registryView, "64-bit");
  assert.equal(result.observationDependencyFacts[0].labviewCli.bitness, "x86");
  assert.equal(serialized.includes("HKEY_LOCAL_MACHINE"), false);
  assert.equal(serialized.includes("C:\\"), false);
  assert.equal(rawRegistry.status, "blocked");
  assert.equal(rawRegistry.blockedReason, "malformed-registry-source");
  assert.equal(privatePath.status, "blocked");
  assert.equal(privatePath.blockedReason, "private-path-disclosure-attempt");
});

test("T011 documented-root source facts and macOS unavailable source facts are deterministic", () => {
  const linux = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection({ platform: "linux" }),
    sourceFacts: [linuxDocumentedRootSource()]
  });
  const macos = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection({ platform: "macos" }),
    sourceFacts: [linuxDocumentedRootSource({ platform: "macos" })]
  });
  const macosAgain = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection({ platform: "darwin" }),
    sourceFacts: [linuxDocumentedRootSource({ platform: "macos" })]
  });

  assert.equal(linux.status, "ready");
  assert.deepEqual(linux.sourceFacts[0].labviewExecutable, {
    role: "labview-executable",
    available: true,
    version: "2026",
    bitness: "x64"
  });
  assert.deepEqual(linux.sourceFacts[0].labviewCli, {
    role: "canonical-labview-cli",
    available: true,
    canonical: true,
    bitness: "x64"
  });
  assert.equal(macos.status, "blocked");
  assert.equal(macos.blockedReason, "macos-host-runtime-observation-source-unavailable");
  assert.deepEqual(macos.runtimeSelection, macosAgain.runtimeSelection);
});

test("T012 Windows host 2026 x64 source facts preserve canonical installed x86 LabVIEWCLI", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [windowsRegistrySource()]
  });

  assert.equal(result.status, "ready");
  assert.equal(result.observation.status, "ready");
  assert.equal(result.discovery.status, "ready");
  assert.equal(result.preflight.mixedBitnessAccepted, true);
  assert.equal(result.sourceFacts[0].labviewExecutable.bitness, "x64");
  assert.equal(result.sourceFacts[0].labviewCli.role, "canonical-labview-cli");
  assert.equal(result.sourceFacts[0].labviewCli.bitness, "x86");
  assert.equal(result.runtimeSelection.runtimeEngine, "labview-cli");
});

test("T013 missing unsupported malformed unavailable ambiguous incompatible contaminated and private source inputs fail closed", () => {
  const missingSelection = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    sourceFacts: [linuxDocumentedRootSource()]
  });
  const unsupportedProvider = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection({ runtimeProvider: "docker", platform: "docker" }),
    sourceFacts: [linuxDocumentedRootSource()]
  });
  const unsupportedPlatform = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection({ platform: "solaris" }),
    sourceFacts: [linuxDocumentedRootSource({ platform: "solaris" })]
  });
  const unsupportedVersion = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection({ labviewVersion: "2024" }),
    sourceFacts: [windowsRegistrySource({ labviewVersion: "2024" })]
  });
  const missingSource = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection()
  });
  const malformedGroup = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: {}
  });
  const unsupportedSourceClass = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [windowsRegistrySource({ kind: "path-scan-source" })]
  });
  const unavailable = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [windowsRegistrySource({ available: false })]
  });
  const ambiguous = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [windowsRegistrySource(), windowsRegistrySource()]
  });
  const incompatible = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [linuxDocumentedRootSource()]
  });
  const contaminated = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [windowsRegistrySource({ contaminated: true })]
  });
  const rawRegistry = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [windowsRegistrySource({ rawRegistryOutput: "raw registry output" })]
  });
  const privatePath = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [windowsRegistrySource({ privatePath: "C:\\Users\\Example\\Private\\LabVIEW" })]
  });

  assert.equal(missingSelection.blockedReason, "missing-selection-facts");
  assert.equal(unsupportedProvider.blockedReason, "unsupported-runtime-provider");
  assert.equal(unsupportedPlatform.blockedReason, "unsupported-host-platform");
  assert.equal(unsupportedVersion.blockedReason, "unsupported-host-year");
  assert.equal(missingSource.blockedReason, "missing-observation-source");
  assert.equal(malformedGroup.blockedReason, "malformed-host-runtime-observation-source-input");
  assert.equal(unsupportedSourceClass.blockedReason, "unsupported-observation-source-class");
  assert.equal(unavailable.blockedReason, "missing-host-runtime-candidate");
  assert.equal(ambiguous.blockedReason, "ambiguous-host-runtime-candidate");
  assert.equal(incompatible.blockedReason, "host-platform-mismatch");
  assert.equal(contaminated.blockedReason, "windows-host-runtime-surface-contaminated");
  assert.equal(rawRegistry.blockedReason, "malformed-registry-source");
  assert.equal(privatePath.blockedReason, "private-path-disclosure-attempt");
  assert.equal(privatePath.partialWrite, false);
});

test("T014 source adapter facts compose into observation discovery preflight and validation command contracts", async () => {
  const sourceAdapter = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [windowsRegistrySource()]
  });
  const observation = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: sourceAdapter.selection,
    observationDependencies: sourceAdapter.observationDependencies
  });
  const discovery = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: observation.selection,
    discoveryObservations: observation.discoveryObservations
  });
  const preflight = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: discovery.selection,
    hostCandidates: discovery.hostCandidates
  });
  const runtimeOutcome = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: sourceAdapter.runtimeSelection
  });
  const validation = readRuntimeSettingsValidation({
    settings: readySettings(),
    runtimeOutcome: runtimeOutcome.runtimeOutcome
  });
  const artifact = createRuntimeSettingsValidationProofArtifact({ validation });
  const adapter = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "proof/host-source-adapter",
    validation
  });
  const command = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    hostRuntimeObservationSourceAdapter: sourceAdapter,
    proofOut: "proof/host-source-adapter"
  });
  const commandRequest = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostRuntimeObservationSourceAdapterRequest: {
      selection: hostSelection(),
      sourceFacts: [windowsRegistrySource()]
    }
  });

  assert.equal(sourceAdapter.status, "ready");
  assert.equal(observation.status, "ready");
  assert.equal(discovery.status, "ready");
  assert.equal(preflight.status, "ready");
  assert.equal(validation.status, "ready");
  assert.equal(artifact.status, "ready");
  assert.equal(adapter.status, "ready");
  assert.equal(command.status, "ready");
  assert.equal(command.requestMode, "validate-plan-only");
  assert.equal(command.proofOut.type, "runtime-settings-cli-validation-proof-out-adapter-contract");
  assert.equal(commandRequest.status, "ready");
  assert.equal(commandRequest.runtimeOutcome.runtimeErrorCode, "VIHS_OK");
});

test("T015 traces host observation source IDs and keeps blocked side effects stable", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationHostRuntimeObservationSourceRequirementIds();
  const result = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: hostSelection(),
    sourceFacts: [windowsRegistrySource()]
  });

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
  assert.deepEqual(result.blockedSideEffects, RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_BLOCKED_SIDE_EFFECTS);
  assert.equal(Object.values(result.blockedSideEffects).every((value) => value === false), true);
  assert.equal(result.blockedSideEffects.runtimeValidation, false);
  assert.equal(result.blockedSideEffects.compareExecution, false);
  assert.equal(result.blockedSideEffects.labviewCli, false);
  assert.equal(result.blockedSideEffects.dockerExecution, false);
  assert.equal(result.blockedSideEffects.rawTerminalProcessWiring, false);
  assert.equal(result.blockedSideEffects.proofOutExpansion, false);
  assert.equal(result.blockedSideEffects.fileSystemReads, false);
  assert.equal(result.blockedSideEffects.fileSystemWrites, false);
  assert.equal(result.blockedSideEffects.packageBinPublication, false);
  assert.equal(result.blockedSideEffects.vsixPackagingChanges, false);
  assert.equal(result.blockedSideEffects.marketplace, false);
  assert.equal(result.blockedSideEffects.releaseAutomation, false);
  assert.equal(result.blockedSideEffects.launcherProfileMutation, false);
  assert.equal(result.blockedSideEffects.sourceCopying, false);
  assert.equal(result.blockedSideEffects.rawRegistryOutputRetention, false);
  assert.equal(result.blockedSideEffects.privatePathDisclosure, false);
});
