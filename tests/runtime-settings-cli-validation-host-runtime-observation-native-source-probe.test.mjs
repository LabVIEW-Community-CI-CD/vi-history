import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_PROBE_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliValidationHostRuntimeObservationNativeSourceProbeRequirementIds,
  createRuntimeSettingsValidationCommandResult,
  createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition,
  createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe,
  createRuntimeSettingsValidationRuntimeOutcome,
  readRuntimeSettingsValidation
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-host-runtime-observation-native-source-probe-v1";

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

function windowsRegistryViewProbe(overrides = {}) {
  return {
    probeSourceClass: "windows-registry-view",
    registryView: "64-bit",
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

function linuxDocumentedRootProbe(overrides = {}) {
  return {
    probeSourceClass: "documented-root",
    documentedRoot: "ni-labview-2026-linux-root",
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

test("T009 selected host facts drive bounded native source surface probing without arbitrary filesystem walking", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection({ platform: "linux" }),
    probeDependencies: {
      documentedRootProbes: [linuxDocumentedRootProbe()]
    }
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-validation-host-runtime-observation-native-source-probe-contract");
  assert.equal(result.nativeSourceProbeBoundary, "bounded-native-host-source-surface-probe-only");
  assert.equal(result.selection.platform, "linux");
  assert.equal(result.nativeSourceProbeCount, 1);
  assert.equal(result.nativeSourceProbeFacts[0].kind, "host-runtime-observation-native-source-probe");
  assert.equal(result.nativeAcquisitionObservationCount, 1);
  assert.equal(result.nativeAcquisitionObservations[0].kind, "documented-root-native-acquisition");
  assert.equal(result.nativeSourceAcquisition.status, "ready");
  assert.equal(result.runtimeSelection.runtimeProvider, "host-native");
  assert.equal(result.blockedSideEffects.arbitraryFilesystemWalking, false);
  assert.equal(result.blockedSideEffects.fileSystemReads, false);
});

test("T010 Windows registry-view source surface probing produces native acquisition observations without raw registry output or private paths", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: {
      windowsRegistryViewProbes: [windowsRegistryViewProbe()]
    }
  });
  const rawRegistry = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: {
      windowsRegistryViewProbes: [
        windowsRegistryViewProbe({
          rawRegistryOutput: "HKEY_LOCAL_MACHINE private raw registry output"
        })
      ]
    }
  });
  const privatePath = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: {
      windowsRegistryViewProbes: [
        windowsRegistryViewProbe({
          installPath: "C:\\Users\\Example\\Private\\LabVIEW"
        })
      ]
    }
  });
  const serialized = JSON.stringify(result);

  assert.equal(result.status, "ready");
  assert.equal(result.nativeSourceProbeFacts[0].probeSourceClass, "windows-registry-view");
  assert.equal(result.nativeAcquisitionObservations[0].registryView, "64-bit");
  assert.equal(result.nativeAcquisitionObservations[0].labviewCli.bitness, "x86");
  assert.equal(serialized.includes("HKEY_LOCAL_MACHINE"), false);
  assert.equal(serialized.includes("C:\\"), false);
  assert.equal(rawRegistry.status, "blocked");
  assert.equal(rawRegistry.blockedReason, "malformed-native-registry-probe");
  assert.equal(privatePath.status, "blocked");
  assert.equal(privatePath.blockedReason, "private-path-disclosure-attempt");
});

test("T011 Linux documented-root source surface probing produces public-safe availability role version and bitness observations", () => {
  const linux = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection({ platform: "linux" }),
    probeDependencies: {
      documentedRootProbes: [linuxDocumentedRootProbe()]
    }
  });
  const macos = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection({ platform: "macos" }),
    probeDependencies: {
      documentedRootProbes: [linuxDocumentedRootProbe({ platform: "macos" })]
    }
  });
  const macosAgain = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection({ platform: "darwin" }),
    probeDependencies: {
      documentedRootProbes: [linuxDocumentedRootProbe({ platform: "macos" })]
    }
  });

  assert.equal(linux.status, "ready");
  assert.deepEqual(linux.nativeSourceProbeFacts[0].labviewExecutable, {
    role: "labview-executable",
    available: true,
    version: "2026",
    bitness: "x64"
  });
  assert.deepEqual(linux.nativeSourceProbeFacts[0].labviewCli, {
    role: "canonical-labview-cli",
    available: true,
    canonical: true,
    bitness: "x64"
  });
  assert.equal(macos.status, "blocked");
  assert.equal(macos.blockedReason, "macos-host-runtime-observation-native-source-probe-unavailable");
  assert.deepEqual(macos.runtimeSelection, macosAgain.runtimeSelection);
});

test("T012 Windows host 2026 x64 native source probe observations produce LabVIEW 2026 x64 plus canonical installed x86 LabVIEWCLI native acquisition observations", () => {
  const result = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: {
      windowsRegistryViewProbes: [windowsRegistryViewProbe()]
    }
  });

  assert.equal(result.status, "ready");
  assert.equal(result.nativeSourceAcquisition.status, "ready");
  assert.equal(result.preflight.mixedBitnessAccepted, true);
  assert.equal(result.nativeSourceProbeFacts[0].labviewExecutable.bitness, "x64");
  assert.equal(result.nativeSourceProbeFacts[0].labviewCli.role, "canonical-labview-cli");
  assert.equal(result.nativeSourceProbeFacts[0].labviewCli.bitness, "x86");
  assert.equal(result.nativeAcquisitionObservations[0].labviewExecutable.bitness, "x64");
  assert.equal(result.nativeAcquisitionObservations[0].labviewCli.bitness, "x86");
  assert.equal(result.runtimeSelection.runtimeEngine, "labview-cli");
});

test("T013 missing selection unsupported provider platform version missing source surface malformed ambiguous contaminated probe-error raw registry and private-path disclosure inputs fail closed", () => {
  const missingSelection = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    probeDependencies: { documentedRootProbes: [linuxDocumentedRootProbe()] }
  });
  const unsupportedProvider = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection({ runtimeProvider: "docker", platform: "docker" }),
    probeDependencies: { documentedRootProbes: [linuxDocumentedRootProbe()] }
  });
  const unsupportedPlatform = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection({ platform: "solaris" }),
    probeDependencies: { documentedRootProbes: [linuxDocumentedRootProbe({ platform: "solaris" })] }
  });
  const unsupportedVersion = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection({ labviewVersion: "2024" }),
    probeDependencies: { windowsRegistryViewProbes: [windowsRegistryViewProbe({ labviewVersion: "2024" })] }
  });
  const missingDependency = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection()
  });
  const malformedGroup = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: { windowsRegistryViewProbes: {} }
  });
  const unsupportedSourceClass = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: { nativeSourceProbeFacts: [windowsRegistryViewProbe({ probeSourceClass: "path-scan-probe" })] }
  });
  const probeUnavailable = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: { windowsRegistryViewProbes: [windowsRegistryViewProbe({ probeUnavailable: true })] }
  });
  const ambiguous = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: { windowsRegistryViewProbes: [windowsRegistryViewProbe({ ambiguous: true })] }
  });
  const incompatible = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: { documentedRootProbes: [linuxDocumentedRootProbe()] }
  });
  const contaminated = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: { windowsRegistryViewProbes: [windowsRegistryViewProbe({ contaminated: true })] }
  });
  const probeError = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: { windowsRegistryViewProbes: [windowsRegistryViewProbe({ probeError: "registry-unavailable" })] }
  });
  const rawRegistry = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: { windowsRegistryViewProbes: [windowsRegistryViewProbe({ rawRegistryOutput: "raw registry output" })] }
  });
  const privatePath = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: { windowsRegistryViewProbes: [windowsRegistryViewProbe({ privatePath: "C:\\Users\\Example\\Private\\LabVIEW" })] }
  });

  assert.equal(missingSelection.blockedReason, "missing-selection-facts");
  assert.equal(unsupportedProvider.blockedReason, "unsupported-runtime-provider");
  assert.equal(unsupportedPlatform.blockedReason, "unsupported-host-platform");
  assert.equal(unsupportedVersion.blockedReason, "unsupported-host-year");
  assert.equal(missingDependency.blockedReason, "missing-native-source-probe-dependency");
  assert.equal(malformedGroup.blockedReason, "malformed-native-source-probe-input");
  assert.equal(unsupportedSourceClass.blockedReason, "unsupported-native-source-probe-class");
  assert.equal(probeUnavailable.blockedReason, "native-source-probe-unavailable");
  assert.equal(ambiguous.blockedReason, "ambiguous-native-source-probe");
  assert.equal(incompatible.blockedReason, "host-platform-mismatch");
  assert.equal(contaminated.blockedReason, "windows-host-runtime-surface-contaminated");
  assert.equal(probeError.blockedReason, "native-source-probe-error");
  assert.equal(rawRegistry.blockedReason, "malformed-native-registry-probe");
  assert.equal(privatePath.blockedReason, "private-path-disclosure-attempt");
  assert.equal(privatePath.partialWrite, false);
});

test("T014 native source probe output composes into createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition and the existing validation command chain", async () => {
  const nativeSourceProbe = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: {
      windowsRegistryViewProbes: [windowsRegistryViewProbe()]
    }
  });
  const nativeSourceAcquisition = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: nativeSourceProbe.selection,
    nativeAcquisitionDependencies: {
      windowsRegistryViewNativeAcquisitions: nativeSourceProbe.nativeAcquisitionObservations
    }
  });
  const runtimeOutcome = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: nativeSourceProbe.runtimeSelection
  });
  const validation = readRuntimeSettingsValidation({
    settings: readySettings(),
    runtimeOutcome: runtimeOutcome.runtimeOutcome
  });
  const command = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    hostRuntimeObservationNativeSourceProbe: nativeSourceProbe,
    proofOut: "proof/native-source-probe"
  });
  const commandRequest = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostRuntimeObservationNativeSourceProbeRequest: {
      selection: hostSelection(),
      probeDependencies: {
        windowsRegistryViewProbes: [windowsRegistryViewProbe()]
      }
    }
  });

  assert.equal(nativeSourceProbe.status, "ready");
  assert.equal(nativeSourceAcquisition.status, "ready");
  assert.equal(validation.status, "ready");
  assert.equal(command.status, "ready");
  assert.equal(command.requestMode, "validate-plan-only");
  assert.equal(command.proofOut.type, "runtime-settings-cli-validation-proof-out-adapter-contract");
  assert.equal(commandRequest.status, "ready");
  assert.equal(commandRequest.runtimeOutcome.runtimeErrorCode, "VIHS_OK");
});

test("T015 traces host observation native source probe IDs and keeps blocked side effects stable", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationHostRuntimeObservationNativeSourceProbeRequirementIds();
  const result = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe({
    selection: hostSelection(),
    probeDependencies: {
      windowsRegistryViewProbes: [windowsRegistryViewProbe()]
    }
  });

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
  assert.deepEqual(result.blockedSideEffects, RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_PROBE_BLOCKED_SIDE_EFFECTS);
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
