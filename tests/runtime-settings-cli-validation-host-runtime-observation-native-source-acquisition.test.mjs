import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_ACQUISITION_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliValidationHostRuntimeObservationNativeSourceAcquisitionRequirementIds,
  createRuntimeSettingsValidationCommandResult,
  createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition,
  createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition,
  createRuntimeSettingsValidationRuntimeOutcome,
  readRuntimeSettingsValidation
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1";

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

function windowsNativeAcquisition(overrides = {}) {
  return {
    kind: "windows-registry-view-native-acquisition",
    registryView: "64-bit",
    nativeAcquisitionId: "labview-2026-windows-x64-native-registry-acquisition",
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

function linuxNativeAcquisition(overrides = {}) {
  return {
    kind: "documented-root-native-acquisition",
    documentedRoot: "ni-labview-2026-linux-root",
    nativeAcquisitionId: "labview-2026-linux-x64-native-documented-root-acquisition",
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

test("T009 selected host facts drive bounded native source acquisition without filesystem walking", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection({ platform: "linux" }),
    nativeAcquisitionDependencies: {
      documentedRootNativeAcquisitions: [linuxNativeAcquisition()]
    }
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-contract");
  assert.equal(result.nativeSourceAcquisitionBoundary, "bounded-native-host-source-acquisition-dependency-adapter-only");
  assert.equal(result.selection.platform, "linux");
  assert.equal(result.nativeAcquisitionDependencyCount, 1);
  assert.equal(result.acquisitionDependencyFacts[0].kind, "host-runtime-observation-source-acquisition-dependency");
  assert.equal(result.nativeAcquisitionDependencyFacts[0].kind, "host-runtime-observation-native-source-acquisition-dependency");
  assert.equal(result.sourceAcquisition.status, "ready");
  assert.equal(result.runtimeSelection.runtimeProvider, "host-native");
  assert.equal(result.blockedSideEffects.arbitraryFilesystemWalking, false);
  assert.equal(result.blockedSideEffects.fileSystemReads, false);
});

test("T010 Windows registry-view native observations sanitize raw registry and private path surfaces", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: {
      windowsRegistryViewNativeAcquisitions: [windowsNativeAcquisition()]
    }
  });
  const rawRegistry = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: {
      windowsRegistryViewNativeAcquisitions: [
        windowsNativeAcquisition({
          rawRegistryOutput: "HKEY_LOCAL_MACHINE private raw registry output"
        })
      ]
    }
  });
  const privatePath = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: {
      windowsRegistryViewNativeAcquisitions: [
        windowsNativeAcquisition({
          installPath: "C:\\Users\\Example\\Private\\LabVIEW"
        })
      ]
    }
  });
  const serialized = JSON.stringify(result);

  assert.equal(result.status, "ready");
  assert.equal(result.acquisitionDependencyFacts[0].sourceClass, "windows-registry-view");
  assert.equal(result.acquisitionDependencyFacts[0].registryView, "64-bit");
  assert.equal(result.acquisitionDependencyFacts[0].labviewCli.bitness, "x86");
  assert.equal(serialized.includes("HKEY_LOCAL_MACHINE"), false);
  assert.equal(serialized.includes("C:\\"), false);
  assert.equal(rawRegistry.status, "blocked");
  assert.equal(rawRegistry.blockedReason, "malformed-native-registry-acquisition");
  assert.equal(privatePath.status, "blocked");
  assert.equal(privatePath.blockedReason, "private-path-disclosure-attempt");
});

test("T011 documented-root native observations and macOS unavailable facts are deterministic", () => {
  const linux = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection({ platform: "linux" }),
    nativeAcquisitionDependencies: {
      documentedRootNativeAcquisitions: [linuxNativeAcquisition()]
    }
  });
  const macos = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection({ platform: "macos" }),
    nativeAcquisitionDependencies: {
      documentedRootNativeAcquisitions: [linuxNativeAcquisition({ platform: "macos" })]
    }
  });
  const macosAgain = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection({ platform: "darwin" }),
    nativeAcquisitionDependencies: {
      documentedRootNativeAcquisitions: [linuxNativeAcquisition({ platform: "macos" })]
    }
  });

  assert.equal(linux.status, "ready");
  assert.deepEqual(linux.acquisitionDependencyFacts[0].labviewExecutable, {
    role: "labview-executable",
    available: true,
    version: "2026",
    bitness: "x64"
  });
  assert.deepEqual(linux.acquisitionDependencyFacts[0].labviewCli, {
    role: "canonical-labview-cli",
    available: true,
    canonical: true,
    bitness: "x64"
  });
  assert.equal(macos.status, "blocked");
  assert.equal(macos.blockedReason, "macos-host-runtime-observation-native-source-acquisition-unavailable");
  assert.deepEqual(macos.runtimeSelection, macosAgain.runtimeSelection);
});

test("T012 Windows host 2026 x64 native facts preserve canonical installed x86 LabVIEWCLI", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: {
      windowsRegistryViewNativeAcquisitions: [windowsNativeAcquisition()]
    }
  });

  assert.equal(result.status, "ready");
  assert.equal(result.sourceAcquisition.status, "ready");
  assert.equal(result.preflight.mixedBitnessAccepted, true);
  assert.equal(result.acquisitionDependencyFacts[0].labviewExecutable.bitness, "x64");
  assert.equal(result.acquisitionDependencyFacts[0].labviewCli.role, "canonical-labview-cli");
  assert.equal(result.acquisitionDependencyFacts[0].labviewCli.bitness, "x86");
  assert.equal(result.runtimeSelection.runtimeEngine, "labview-cli");
});

test("T013 native source acquisition missing unsupported malformed unavailable ambiguous incompatible contaminated dependency errors and private inputs fail closed", () => {
  const missingSelection = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    nativeAcquisitionDependencies: { documentedRootNativeAcquisitions: [linuxNativeAcquisition()] }
  });
  const unsupportedProvider = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection({ runtimeProvider: "docker", platform: "docker" }),
    nativeAcquisitionDependencies: { documentedRootNativeAcquisitions: [linuxNativeAcquisition()] }
  });
  const unsupportedPlatform = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection({ platform: "solaris" }),
    nativeAcquisitionDependencies: { documentedRootNativeAcquisitions: [linuxNativeAcquisition({ platform: "solaris" })] }
  });
  const unsupportedVersion = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection({ labviewVersion: "2024" }),
    nativeAcquisitionDependencies: { windowsRegistryViewNativeAcquisitions: [windowsNativeAcquisition({ labviewVersion: "2024" })] }
  });
  const missingDependency = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection()
  });
  const malformedGroup = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: { windowsRegistryViewNativeAcquisitions: {} }
  });
  const unsupportedSourceClass = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: { nativeSourceAcquisitionFacts: [windowsNativeAcquisition({ kind: "path-scan-native-acquisition" })] }
  });
  const unavailable = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: { windowsRegistryViewNativeAcquisitions: [windowsNativeAcquisition({ available: false })] }
  });
  const ambiguous = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: { windowsRegistryViewNativeAcquisitions: [windowsNativeAcquisition(), windowsNativeAcquisition()] }
  });
  const incompatible = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: { documentedRootNativeAcquisitions: [linuxNativeAcquisition()] }
  });
  const contaminated = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: { windowsRegistryViewNativeAcquisitions: [windowsNativeAcquisition({ contaminated: true })] }
  });
  const dependencyError = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: { windowsRegistryViewNativeAcquisitions: [windowsNativeAcquisition({ dependencyError: "registry-unavailable" })] }
  });
  const rawRegistry = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: { windowsRegistryViewNativeAcquisitions: [windowsNativeAcquisition({ rawRegistryOutput: "raw registry output" })] }
  });
  const privatePath = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: { windowsRegistryViewNativeAcquisitions: [windowsNativeAcquisition({ privatePath: "C:\\Users\\Example\\Private\\LabVIEW" })] }
  });

  assert.equal(missingSelection.blockedReason, "missing-selection-facts");
  assert.equal(unsupportedProvider.blockedReason, "unsupported-runtime-provider");
  assert.equal(unsupportedPlatform.blockedReason, "unsupported-host-platform");
  assert.equal(unsupportedVersion.blockedReason, "unsupported-host-year");
  assert.equal(missingDependency.blockedReason, "missing-native-source-acquisition-dependency");
  assert.equal(malformedGroup.blockedReason, "malformed-native-source-acquisition-input");
  assert.equal(unsupportedSourceClass.blockedReason, "unsupported-native-source-acquisition-class");
  assert.equal(unavailable.blockedReason, "missing-host-runtime-candidate");
  assert.equal(ambiguous.blockedReason, "ambiguous-host-runtime-candidate");
  assert.equal(incompatible.blockedReason, "host-platform-mismatch");
  assert.equal(contaminated.blockedReason, "windows-host-runtime-surface-contaminated");
  assert.equal(dependencyError.blockedReason, "native-source-acquisition-dependency-error");
  assert.equal(rawRegistry.blockedReason, "malformed-native-registry-acquisition");
  assert.equal(privatePath.blockedReason, "private-path-disclosure-attempt");
  assert.equal(privatePath.partialWrite, false);
});

test("T014 native source acquisition facts compose into source acquisition and validation command contracts", async () => {
  const nativeAcquisition = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: {
      windowsRegistryViewNativeAcquisitions: [windowsNativeAcquisition()]
    }
  });
  const sourceAcquisition = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: nativeAcquisition.selection,
    acquisitionDependencies: {
      sourceAcquisitionFacts: nativeAcquisition.acquisitionDependencyFacts
    }
  });
  const runtimeOutcome = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: nativeAcquisition.runtimeSelection
  });
  const validation = readRuntimeSettingsValidation({
    settings: readySettings(),
    runtimeOutcome: runtimeOutcome.runtimeOutcome
  });
  const command = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    hostRuntimeObservationNativeSourceAcquisition: nativeAcquisition,
    proofOut: "proof/native-source-acquisition"
  });
  const commandRequest = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostRuntimeObservationNativeSourceAcquisitionRequest: {
      selection: hostSelection(),
      nativeAcquisitionDependencies: {
        windowsRegistryViewNativeAcquisitions: [windowsNativeAcquisition()]
      }
    }
  });

  assert.equal(nativeAcquisition.status, "ready");
  assert.equal(sourceAcquisition.status, "ready");
  assert.equal(validation.status, "ready");
  assert.equal(command.status, "ready");
  assert.equal(command.requestMode, "validate-plan-only");
  assert.equal(command.proofOut.type, "runtime-settings-cli-validation-proof-out-adapter-contract");
  assert.equal(commandRequest.status, "ready");
  assert.equal(commandRequest.runtimeOutcome.runtimeErrorCode, "VIHS_OK");
});

test("T015 traces host observation native source acquisition IDs and keeps blocked side effects stable", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationHostRuntimeObservationNativeSourceAcquisitionRequirementIds();
  const result = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: hostSelection(),
    nativeAcquisitionDependencies: {
      windowsRegistryViewNativeAcquisitions: [windowsNativeAcquisition()]
    }
  });

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
  assert.deepEqual(result.blockedSideEffects, RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_ACQUISITION_BLOCKED_SIDE_EFFECTS);
  assert.equal(Object.values(result.blockedSideEffects).every((value) => value === false), true);
  assert.equal(result.blockedSideEffects.runtimeValidation, false);
  assert.equal(result.blockedSideEffects.compareExecution, false);
  assert.equal(result.blockedSideEffects.labviewCli, false);
  assert.equal(result.blockedSideEffects.dockerExecution, false);
  assert.equal(result.blockedSideEffects.dockerImageInspection, false);
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
