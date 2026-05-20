import assert from "node:assert/strict";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_DISCOVERY_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliValidationHostRuntimeDiscoveryRequirementIds,
  createRuntimeSettingsValidationCommandResult,
  createRuntimeSettingsValidationHostRuntimeDiscovery,
  createRuntimeSettingsValidationHostRuntimePreflight,
  createRuntimeSettingsValidationProofArtifact,
  createRuntimeSettingsValidationProofOutAdapter,
  createRuntimeSettingsValidationRuntimeOutcome,
  readRuntimeSettingsValidation,
  writeRuntimeSettingsValidationProofOutFiles
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-host-runtime-discovery-v1";

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

async function makeTempBase(t) {
  const baseDirectory = await fsp.mkdtemp(path.join(os.tmpdir(), "vi-history-host-discovery-"));
  t.after(async () => {
    await fsp.rm(baseDirectory, { recursive: true, force: true });
  });
  return baseDirectory;
}

test("T009 selected host facts drive bounded documented-root discovery without filesystem walking", () => {
  const result = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection({ platform: "linux" }),
    documentedRootObservations: [linuxRootObservation()]
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-validation-host-runtime-discovery-contract");
  assert.equal(result.discoveryBoundary, "bounded-public-safe-discovery-facts-only");
  assert.equal(result.hostCandidateCount, 1);
  assert.equal(result.hostCandidates[0].sourceClass, "documented-root");
  assert.equal(result.hostCandidates[0].documentedRoot, "ni-labview-2026-linux-root");
  assert.equal(result.preflight.status, "ready");
  assert.equal(result.runtimeSelection.runtimeProvider, "host-native");
  assert.equal(result.blockedSideEffects.arbitraryFilesystemWalking, false);
});

test("T010 Windows registry-view observations normalize without raw registry output or private paths", () => {
  const result = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection(),
    windowsRegistryViewObservations: [windowsRegistryObservation()]
  });
  const rawRegistry = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection(),
    windowsRegistryViewObservations: [
      windowsRegistryObservation({
        rawRegistryOutput: "HKEY_LOCAL_MACHINE private raw registry output"
      })
    ]
  });
  const privatePath = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection(),
    windowsRegistryViewObservations: [
      windowsRegistryObservation({
        installPath: "C:\\Users\\Example\\Private\\LabVIEW"
      })
    ]
  });

  assert.equal(result.status, "ready");
  assert.equal(result.hostCandidates[0].sourceClass, "windows-registry-view");
  assert.equal(result.hostCandidates[0].registryView, "64-bit");
  assert.equal(JSON.stringify(result).includes("HKEY_LOCAL_MACHINE"), false);
  assert.equal(JSON.stringify(result).includes("C:\\"), false);
  assert.equal(rawRegistry.status, "blocked");
  assert.equal(rawRegistry.blockedReason, "malformed-registry-observation");
  assert.equal(privatePath.status, "blocked");
  assert.equal(privatePath.blockedReason, "private-path-disclosure-attempt");
});

test("T011 Linux documented-root discovery and macOS unavailable facts are deterministic", () => {
  const linux = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection({ platform: "linux" }),
    documentedRootObservations: [linuxRootObservation()]
  });
  const macos = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection({ platform: "macos" }),
    documentedRootObservations: [linuxRootObservation({ platform: "macos" })]
  });
  const macosAgain = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection({ platform: "darwin" }),
    documentedRootObservations: [linuxRootObservation({ platform: "macos" })]
  });

  assert.equal(linux.status, "ready");
  assert.equal(linux.hostCandidates[0].platform, "linux");
  assert.equal(macos.status, "blocked");
  assert.equal(macos.blockedReason, "macos-host-runtime-discovery-unavailable");
  assert.deepEqual(macos.runtimeSelection, macosAgain.runtimeSelection);
});

test("T012 Windows host 2026 x64 discovers LabVIEW x64 plus canonical installed x86 LabVIEWCLI", () => {
  const result = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection(),
    windowsRegistryViewObservations: [windowsRegistryObservation()]
  });

  assert.equal(result.status, "ready");
  assert.equal(result.preflight.mixedBitnessAccepted, true);
  assert.equal(result.hostCandidates[0].labviewExecutable.bitness, "x64");
  assert.equal(result.hostCandidates[0].labviewCli.bitness, "x86");
  assert.equal(result.runtimeSelection.runtimeEngine, "labview-cli");
});

test("T013 missing unsupported malformed ambiguous incompatible and contaminated inputs fail closed", () => {
  const missingSelection = createRuntimeSettingsValidationHostRuntimeDiscovery({
    documentedRootObservations: [linuxRootObservation()]
  });
  const unsupportedProvider = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection({ runtimeProvider: "docker", platform: "docker" }),
    documentedRootObservations: [linuxRootObservation()]
  });
  const unsupportedVersion = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection({ labviewVersion: "2024" }),
    windowsRegistryViewObservations: [windowsRegistryObservation({ labviewVersion: "2024" })]
  });
  const missingDependency = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection()
  });
  const malformed = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection(),
    observations: {}
  });
  const ambiguous = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection(),
    windowsRegistryViewObservations: [windowsRegistryObservation(), windowsRegistryObservation()]
  });
  const incompatible = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection(),
    documentedRootObservations: [linuxRootObservation()]
  });
  const contaminated = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection(),
    windowsRegistryViewObservations: [windowsRegistryObservation({ contaminated: true })]
  });

  assert.equal(missingSelection.blockedReason, "missing-selection-facts");
  assert.equal(unsupportedProvider.blockedReason, "unsupported-runtime-provider");
  assert.equal(unsupportedVersion.blockedReason, "unsupported-host-year");
  assert.equal(missingDependency.blockedReason, "missing-discovery-observation");
  assert.equal(malformed.blockedReason, "malformed-host-runtime-discovery-input");
  assert.equal(ambiguous.blockedReason, "ambiguous-host-runtime-candidate");
  assert.equal(incompatible.blockedReason, "host-platform-mismatch");
  assert.equal(contaminated.blockedReason, "windows-host-runtime-surface-contaminated");
  assert.equal(malformed.partialWrite, false);
});

test("T014 discovered host candidate facts compose into preflight and the validation command chain", async (t) => {
  const baseDirectory = await makeTempBase(t);
  const discovery = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection(),
    windowsRegistryViewObservations: [windowsRegistryObservation()]
  });
  const preflight = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: discovery.selection,
    hostCandidates: discovery.hostCandidates
  });
  const runtimeOutcome = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: discovery.runtimeSelection
  });
  const validation = readRuntimeSettingsValidation({
    settings: readySettings(),
    runtimeOutcome: runtimeOutcome.runtimeOutcome
  });
  const artifact = createRuntimeSettingsValidationProofArtifact({ validation });
  const adapter = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "proof/host-discovery",
    validation
  });
  const files = await writeRuntimeSettingsValidationProofOutFiles({
    proofOutAdapter: adapter,
    baseDirectory
  });
  const command = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    hostRuntimeDiscovery: discovery,
    proofOut: "proof/host-discovery"
  });
  const commandRequest = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostRuntimeDiscoveryRequest: {
      selection: hostSelection(),
      windowsRegistryViewObservations: [windowsRegistryObservation()]
    }
  });

  assert.equal(discovery.status, "ready");
  assert.equal(preflight.status, "ready");
  assert.equal(validation.status, "ready");
  assert.equal(artifact.status, "ready");
  assert.equal(adapter.status, "ready");
  assert.equal(files.status, "ready");
  assert.equal(command.status, "ready");
  assert.equal(command.requestMode, "validate-plan-only");
  assert.equal(command.proofOut.type, "runtime-settings-cli-validation-proof-out-adapter-contract");
  assert.equal(commandRequest.status, "ready");
  assert.equal(commandRequest.runtimeOutcome.runtimeErrorCode, "VIHS_OK");
});

test("T015 traces host discovery IDs and keeps blocked side effects stable", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationHostRuntimeDiscoveryRequirementIds();
  const result = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: hostSelection(),
    windowsRegistryViewObservations: [windowsRegistryObservation()]
  });

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
  assert.deepEqual(result.blockedSideEffects, RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_DISCOVERY_BLOCKED_SIDE_EFFECTS);
  assert.equal(Object.values(result.blockedSideEffects).every((value) => value === false), true);
  assert.equal(result.blockedSideEffects.runtimeValidation, false);
  assert.equal(result.blockedSideEffects.compareExecution, false);
  assert.equal(result.blockedSideEffects.labviewCli, false);
  assert.equal(result.blockedSideEffects.dockerExecution, false);
  assert.equal(result.blockedSideEffects.rawTerminalProcessWiring, false);
  assert.equal(result.blockedSideEffects.fileSystemWrites, false);
  assert.equal(result.blockedSideEffects.marketplace, false);
  assert.equal(result.blockedSideEffects.sourceCopying, false);
});
