import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_ACQUISITION_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliValidationHostRuntimeObservationSourceAcquisitionRequirementIds,
  createRuntimeSettingsValidationCommandResult,
  createRuntimeSettingsValidationHostRuntimeDiscovery,
  createRuntimeSettingsValidationHostRuntimeObservation,
  createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition,
  createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter,
  createRuntimeSettingsValidationHostRuntimePreflight,
  createRuntimeSettingsValidationProofArtifact,
  createRuntimeSettingsValidationProofOutAdapter,
  createRuntimeSettingsValidationRuntimeOutcome,
  readRuntimeSettingsValidation
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1";

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

function windowsRegistryAcquisition(overrides = {}) {
  return {
    kind: "windows-registry-view-acquisition",
    registryView: "64-bit",
    acquisitionId: "labview-2026-windows-x64-registry-acquisition",
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

function linuxDocumentedRootAcquisition(overrides = {}) {
  return {
    kind: "documented-root-acquisition",
    documentedRoot: "ni-labview-2026-linux-root",
    acquisitionId: "labview-2026-linux-x64-documented-root-acquisition",
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

test("T009 selected host facts drive bounded public-safe source acquisition without filesystem walking", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection({ platform: "linux" }),
    acquisitionDependencies: {
      documentedRootAcquisitions: [linuxDocumentedRootAcquisition()]
    }
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-validation-host-runtime-observation-source-acquisition-contract");
  assert.equal(result.sourceAcquisitionBoundary, "bounded-native-host-source-acquisition-dependencies-only");
  assert.equal(result.selection.platform, "linux");
  assert.equal(result.acquisitionDependencyCount, 1);
  assert.equal(result.sourceFacts[0].kind, "host-runtime-observation-source");
  assert.equal(result.sourceFacts[0].sourceClass, "documented-root");
  assert.equal(result.sourceAdapter.status, "ready");
  assert.equal(result.runtimeSelection.runtimeProvider, "host-native");
  assert.equal(result.blockedSideEffects.arbitraryFilesystemWalking, false);
  assert.equal(result.blockedSideEffects.fileSystemReads, false);
});

test("T010 Windows registry-view acquisition dependency facts sanitize raw registry and private path surfaces", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: {
      windowsRegistryViewAcquisitions: [windowsRegistryAcquisition()]
    }
  });
  const rawRegistry = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: {
      windowsRegistryViewAcquisitions: [
        windowsRegistryAcquisition({
          rawRegistryOutput: "HKEY_LOCAL_MACHINE private raw registry output"
        })
      ]
    }
  });
  const privatePath = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: {
      windowsRegistryViewAcquisitions: [
        windowsRegistryAcquisition({
          installPath: "C:\\Users\\Example\\Private\\LabVIEW"
        })
      ]
    }
  });
  const serialized = JSON.stringify(result);

  assert.equal(result.status, "ready");
  assert.equal(result.sourceFacts[0].sourceClass, "windows-registry-view");
  assert.equal(result.sourceFacts[0].registryView, "64-bit");
  assert.equal(result.sourceFacts[0].labviewCli.bitness, "x86");
  assert.equal(serialized.includes("HKEY_LOCAL_MACHINE"), false);
  assert.equal(serialized.includes("C:\\"), false);
  assert.equal(rawRegistry.status, "blocked");
  assert.equal(rawRegistry.blockedReason, "malformed-registry-acquisition");
  assert.equal(privatePath.status, "blocked");
  assert.equal(privatePath.blockedReason, "private-path-disclosure-attempt");
});

test("T011 documented-root acquisition dependency facts and macOS unavailable facts are deterministic", () => {
  const linux = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection({ platform: "linux" }),
    acquisitionDependencies: {
      documentedRootAcquisitions: [linuxDocumentedRootAcquisition()]
    }
  });
  const macos = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection({ platform: "macos" }),
    acquisitionDependencies: {
      documentedRootAcquisitions: [linuxDocumentedRootAcquisition({ platform: "macos" })]
    }
  });
  const macosAgain = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection({ platform: "darwin" }),
    acquisitionDependencies: {
      documentedRootAcquisitions: [linuxDocumentedRootAcquisition({ platform: "macos" })]
    }
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
  assert.equal(macos.blockedReason, "macos-host-runtime-observation-source-acquisition-unavailable");
  assert.deepEqual(macos.runtimeSelection, macosAgain.runtimeSelection);
});

test("T012 Windows host 2026 x64 acquisition facts preserve canonical installed x86 LabVIEWCLI", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: {
      windowsRegistryViewAcquisitions: [windowsRegistryAcquisition()]
    }
  });

  assert.equal(result.status, "ready");
  assert.equal(result.sourceAdapter.status, "ready");
  assert.equal(result.observation.status, "ready");
  assert.equal(result.discovery.status, "ready");
  assert.equal(result.preflight.mixedBitnessAccepted, true);
  assert.equal(result.sourceFacts[0].labviewExecutable.bitness, "x64");
  assert.equal(result.sourceFacts[0].labviewCli.role, "canonical-labview-cli");
  assert.equal(result.sourceFacts[0].labviewCli.bitness, "x86");
  assert.equal(result.runtimeSelection.runtimeEngine, "labview-cli");
});

test("T013 missing unsupported malformed unavailable ambiguous incompatible contaminated dependency errors and private acquisition inputs fail closed", () => {
  const missingSelection = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    acquisitionDependencies: { documentedRootAcquisitions: [linuxDocumentedRootAcquisition()] }
  });
  const unsupportedProvider = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection({ runtimeProvider: "docker", platform: "docker" }),
    acquisitionDependencies: { documentedRootAcquisitions: [linuxDocumentedRootAcquisition()] }
  });
  const unsupportedPlatform = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection({ platform: "solaris" }),
    acquisitionDependencies: { documentedRootAcquisitions: [linuxDocumentedRootAcquisition({ platform: "solaris" })] }
  });
  const unsupportedVersion = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection({ labviewVersion: "2024" }),
    acquisitionDependencies: { windowsRegistryViewAcquisitions: [windowsRegistryAcquisition({ labviewVersion: "2024" })] }
  });
  const missingDependency = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection()
  });
  const malformedGroup = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: {}
  });
  const unsupportedSourceClass = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: { sourceAcquisitionFacts: [windowsRegistryAcquisition({ kind: "path-scan-acquisition" })] }
  });
  const unavailable = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: { windowsRegistryViewAcquisitions: [windowsRegistryAcquisition({ available: false })] }
  });
  const ambiguous = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: { windowsRegistryViewAcquisitions: [windowsRegistryAcquisition(), windowsRegistryAcquisition()] }
  });
  const incompatible = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: { documentedRootAcquisitions: [linuxDocumentedRootAcquisition()] }
  });
  const contaminated = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: { windowsRegistryViewAcquisitions: [windowsRegistryAcquisition({ contaminated: true })] }
  });
  const dependencyError = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: { windowsRegistryViewAcquisitions: [windowsRegistryAcquisition({ dependencyError: "registry-unavailable" })] }
  });
  const rawRegistry = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: { windowsRegistryViewAcquisitions: [windowsRegistryAcquisition({ rawRegistryOutput: "raw registry output" })] }
  });
  const privatePath = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: { windowsRegistryViewAcquisitions: [windowsRegistryAcquisition({ privatePath: "C:\\Users\\Example\\Private\\LabVIEW" })] }
  });

  assert.equal(missingSelection.blockedReason, "missing-selection-facts");
  assert.equal(unsupportedProvider.blockedReason, "unsupported-runtime-provider");
  assert.equal(unsupportedPlatform.blockedReason, "unsupported-host-platform");
  assert.equal(unsupportedVersion.blockedReason, "unsupported-host-year");
  assert.equal(missingDependency.blockedReason, "missing-source-acquisition-dependency");
  assert.equal(malformedGroup.blockedReason, "missing-source-acquisition-dependency");
  assert.equal(unsupportedSourceClass.blockedReason, "unsupported-source-acquisition-class");
  assert.equal(unavailable.blockedReason, "missing-host-runtime-candidate");
  assert.equal(ambiguous.blockedReason, "ambiguous-host-runtime-candidate");
  assert.equal(incompatible.blockedReason, "host-platform-mismatch");
  assert.equal(contaminated.blockedReason, "windows-host-runtime-surface-contaminated");
  assert.equal(dependencyError.blockedReason, "source-acquisition-dependency-error");
  assert.equal(rawRegistry.blockedReason, "malformed-registry-acquisition");
  assert.equal(privatePath.blockedReason, "private-path-disclosure-attempt");
  assert.equal(privatePath.partialWrite, false);
});

test("T014 source acquisition facts compose into source adapter observation discovery preflight and validation command contracts", async () => {
  const acquisition = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: {
      windowsRegistryViewAcquisitions: [windowsRegistryAcquisition()]
    }
  });
  const sourceAdapter = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: acquisition.selection,
    sourceFacts: acquisition.sourceFacts
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
    runtimeSelection: acquisition.runtimeSelection
  });
  const validation = readRuntimeSettingsValidation({
    settings: readySettings(),
    runtimeOutcome: runtimeOutcome.runtimeOutcome
  });
  const artifact = createRuntimeSettingsValidationProofArtifact({ validation });
  const adapter = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "proof/host-source-acquisition",
    validation
  });
  const command = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    hostRuntimeObservationSourceAcquisition: acquisition,
    proofOut: "proof/host-source-acquisition"
  });
  const commandRequest = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostRuntimeObservationSourceAcquisitionRequest: {
      selection: hostSelection(),
      acquisitionDependencies: {
        windowsRegistryViewAcquisitions: [windowsRegistryAcquisition()]
      }
    }
  });

  assert.equal(acquisition.status, "ready");
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

test("T015 traces host observation source acquisition IDs and keeps blocked side effects stable", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationHostRuntimeObservationSourceAcquisitionRequirementIds();
  const result = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: hostSelection(),
    acquisitionDependencies: {
      windowsRegistryViewAcquisitions: [windowsRegistryAcquisition()]
    }
  });

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
  assert.deepEqual(result.blockedSideEffects, RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_ACQUISITION_BLOCKED_SIDE_EFFECTS);
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
  assert.equal(result.blockedSideEffects.dockerSourceDiscovery, false);
});
