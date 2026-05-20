import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliValidationHostRuntimeObservationRequirementIds,
  createRuntimeSettingsValidationCommandResult,
  createRuntimeSettingsValidationHostRuntimeDiscovery,
  createRuntimeSettingsValidationHostRuntimeObservation,
  createRuntimeSettingsValidationHostRuntimePreflight,
  createRuntimeSettingsValidationProofArtifact,
  createRuntimeSettingsValidationProofOutAdapter,
  createRuntimeSettingsValidationRuntimeOutcome,
  readRuntimeSettingsValidation
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-host-runtime-observation-adapter-v1";

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

function windowsRegistryObservation(overrides = {}) {
  return {
    kind: "windows-registry-view",
    registryView: "64-bit",
    sourceId: "labview-2026-windows-x64-registry-view",
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

function linuxRootObservation(overrides = {}) {
  return {
    kind: "documented-root",
    documentedRoot: "ni-labview-2026-linux-root",
    sourceId: "labview-2026-linux-x64-documented-root",
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

test("T009 selected host facts drive public-safe observation shaping without filesystem walking", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection({ platform: "linux" }),
    observationDependencies: {
      documentedRootObservations: [linuxRootObservation()]
    }
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-validation-host-runtime-observation-adapter-contract");
  assert.equal(result.observationBoundary, "bounded-public-safe-observation-facts-only");
  assert.equal(result.selection.platform, "linux");
  assert.equal(result.observationCount, 1);
  assert.equal(result.discoveryObservations[0].kind, "host-runtime-observation");
  assert.equal(result.discoveryObservations[0].sourceClass, "documented-root");
  assert.equal(result.discoveryObservations[0].documentedRoot, "ni-labview-2026-linux-root");
  assert.equal(result.discovery.status, "ready");
  assert.equal(result.runtimeSelection.runtimeProvider, "host-native");
  assert.equal(result.blockedSideEffects.arbitraryFilesystemWalking, false);
  assert.equal(result.blockedSideEffects.filesystemWalking, false);
});

test("T010 registry observations reduce to sanitized source-class and candidate facts", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      windowsRegistryViewObservations: [windowsRegistryObservation()]
    }
  });
  const rawRegistry = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      windowsRegistryViewObservations: [
        windowsRegistryObservation({
          rawRegistryOutput: "HKEY_LOCAL_MACHINE private raw registry output"
        })
      ]
    }
  });
  const privatePath = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      windowsRegistryViewObservations: [
        windowsRegistryObservation({
          installPath: "C:\\Users\\Example\\Private\\LabVIEW"
        })
      ]
    }
  });
  const serialized = JSON.stringify(result);

  assert.equal(result.status, "ready");
  assert.equal(result.discoveryObservations[0].sourceClass, "windows-registry-view");
  assert.equal(result.discoveryObservations[0].registryView, "64-bit");
  assert.equal(serialized.includes("HKEY_LOCAL_MACHINE"), false);
  assert.equal(serialized.includes("C:\\"), false);
  assert.equal(rawRegistry.status, "blocked");
  assert.equal(rawRegistry.blockedReason, "malformed-registry-observation");
  assert.equal(privatePath.status, "blocked");
  assert.equal(privatePath.blockedReason, "private-path-disclosure-attempt");
});

test("T011 documented-root observations reduce to public-safe availability role version and bitness facts", () => {
  const linux = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection({ platform: "linux" }),
    observationDependencies: {
      documentedRootObservations: [linuxRootObservation()]
    }
  });
  const macos = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection({ platform: "macos" }),
    observationDependencies: {
      documentedRootObservations: [linuxRootObservation({ platform: "macos" })]
    }
  });
  const macosAgain = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection({ platform: "darwin" }),
    observationDependencies: {
      documentedRootObservations: [linuxRootObservation({ platform: "macos" })]
    }
  });

  assert.equal(linux.status, "ready");
  assert.equal(linux.discoveryObservations[0].available, true);
  assert.deepEqual(linux.discoveryObservations[0].labviewExecutable, {
    role: "labview-executable",
    available: true,
    version: "2026",
    bitness: "x64"
  });
  assert.deepEqual(linux.discoveryObservations[0].labviewCli, {
    role: "canonical-labview-cli",
    available: true,
    canonical: true,
    bitness: "x64"
  });
  assert.equal(macos.status, "blocked");
  assert.equal(macos.blockedReason, "macos-host-runtime-observation-unavailable");
  assert.deepEqual(macos.runtimeSelection, macosAgain.runtimeSelection);
});

test("T012 Windows host 2026 x64 observes LabVIEW x64 plus canonical installed x86 LabVIEWCLI", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      windowsRegistryViewObservations: [windowsRegistryObservation()]
    }
  });

  assert.equal(result.status, "ready");
  assert.equal(result.discovery.status, "ready");
  assert.equal(result.preflight.mixedBitnessAccepted, true);
  assert.equal(result.discoveryObservations[0].labviewExecutable.bitness, "x64");
  assert.equal(result.discoveryObservations[0].labviewCli.role, "canonical-labview-cli");
  assert.equal(result.discoveryObservations[0].labviewCli.bitness, "x86");
  assert.equal(result.runtimeSelection.runtimeEngine, "labview-cli");
});

test("T013 missing unsupported malformed ambiguous incompatible contaminated and private inputs fail closed", () => {
  const missingSelection = createRuntimeSettingsValidationHostRuntimeObservation({
    observationDependencies: {
      documentedRootObservations: [linuxRootObservation()]
    }
  });
  const unsupportedProvider = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection({ runtimeProvider: "docker", platform: "docker" }),
    observationDependencies: {
      documentedRootObservations: [linuxRootObservation()]
    }
  });
  const unsupportedPlatform = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection({ platform: "solaris" }),
    observationDependencies: {
      documentedRootObservations: [linuxRootObservation({ platform: "solaris" })]
    }
  });
  const unsupportedVersion = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection({ labviewVersion: "2024" }),
    observationDependencies: {
      windowsRegistryViewObservations: [windowsRegistryObservation({ labviewVersion: "2024" })]
    }
  });
  const missingDependency = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection()
  });
  const malformedGroup = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      windowsRegistryViewObservations: {}
    }
  });
  const malformedRegistry = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      windowsRegistryViewObservations: [
        windowsRegistryObservation({ registryView: null })
      ]
    }
  });
  const malformedRoot = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection({ platform: "linux" }),
    observationDependencies: {
      documentedRootObservations: [
        linuxRootObservation({ documentedRoot: null })
      ]
    }
  });
  const missingCandidate = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      windowsRegistryViewObservations: [windowsRegistryObservation({ available: false })]
    }
  });
  const ambiguous = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      windowsRegistryViewObservations: [windowsRegistryObservation(), windowsRegistryObservation()]
    }
  });
  const incompatible = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      documentedRootObservations: [linuxRootObservation()]
    }
  });
  const contaminated = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      windowsRegistryViewObservations: [windowsRegistryObservation({ contaminated: true })]
    }
  });
  const privatePath = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      windowsRegistryViewObservations: [
        windowsRegistryObservation({ privatePath: "C:\\Users\\Example\\Private\\LabVIEW" })
      ]
    }
  });

  assert.equal(missingSelection.blockedReason, "missing-selection-facts");
  assert.equal(unsupportedProvider.blockedReason, "unsupported-runtime-provider");
  assert.equal(unsupportedPlatform.blockedReason, "unsupported-host-platform");
  assert.equal(unsupportedVersion.blockedReason, "unsupported-host-year");
  assert.equal(missingDependency.blockedReason, "missing-observation-dependency");
  assert.equal(malformedGroup.blockedReason, "malformed-host-runtime-observation-input");
  assert.equal(malformedRegistry.blockedReason, "malformed-registry-observation");
  assert.equal(malformedRoot.blockedReason, "malformed-documented-root-observation");
  assert.equal(missingCandidate.blockedReason, "missing-host-runtime-candidate");
  assert.equal(ambiguous.blockedReason, "ambiguous-host-runtime-candidate");
  assert.equal(incompatible.blockedReason, "host-platform-mismatch");
  assert.equal(contaminated.blockedReason, "windows-host-runtime-surface-contaminated");
  assert.equal(privatePath.blockedReason, "private-path-disclosure-attempt");
  assert.equal(privatePath.partialWrite, false);
});

test("T014 observation facts compose into discovery preflight and the validation command chain", async () => {
  const observation = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      windowsRegistryViewObservations: [windowsRegistryObservation()]
    }
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
    runtimeSelection: observation.runtimeSelection
  });
  const validation = readRuntimeSettingsValidation({
    settings: readySettings(),
    runtimeOutcome: runtimeOutcome.runtimeOutcome
  });
  const artifact = createRuntimeSettingsValidationProofArtifact({ validation });
  const adapter = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "proof/host-observation",
    validation
  });
  const command = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    hostRuntimeObservation: observation,
    proofOut: "proof/host-observation"
  });
  const commandRequest = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostRuntimeObservationRequest: {
      selection: hostSelection(),
      observationDependencies: {
        windowsRegistryViewObservations: [windowsRegistryObservation()]
      }
    }
  });

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

test("T015 traces host observation IDs and keeps blocked side effects stable", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationHostRuntimeObservationRequirementIds();
  const result = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: hostSelection(),
    observationDependencies: {
      windowsRegistryViewObservations: [windowsRegistryObservation()]
    }
  });

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
  assert.deepEqual(result.blockedSideEffects, RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_BLOCKED_SIDE_EFFECTS);
  assert.equal(Object.values(result.blockedSideEffects).every((value) => value === false), true);
  assert.equal(result.blockedSideEffects.runtimeValidation, false);
  assert.equal(result.blockedSideEffects.compareExecution, false);
  assert.equal(result.blockedSideEffects.labviewCli, false);
  assert.equal(result.blockedSideEffects.dockerExecution, false);
  assert.equal(result.blockedSideEffects.rawTerminalProcessWiring, false);
  assert.equal(result.blockedSideEffects.proofOutExpansion, false);
  assert.equal(result.blockedSideEffects.fileSystemWrites, false);
  assert.equal(result.blockedSideEffects.packageBinPublication, false);
  assert.equal(result.blockedSideEffects.marketplace, false);
  assert.equal(result.blockedSideEffects.releaseAutomation, false);
  assert.equal(result.blockedSideEffects.launcherProfileMutation, false);
  assert.equal(result.blockedSideEffects.sourceCopying, false);
  assert.equal(result.blockedSideEffects.rawRegistryOutputRetention, false);
  assert.equal(result.blockedSideEffects.privatePathDisclosure, false);
});
