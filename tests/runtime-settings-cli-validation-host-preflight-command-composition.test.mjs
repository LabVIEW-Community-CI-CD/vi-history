import assert from "node:assert/strict";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_COMMAND_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliValidationCommandRequirementIds,
  createRuntimeSettingsValidationCommandResult,
  createRuntimeSettingsValidationHostRuntimePreflight
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-host-preflight-command-composition-v1";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function idsFromText(filePath) {
  return [...fs.readFileSync(filePath, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

function readySettings() {
  return {
    "viHistorySuite.runtimeProvider": "host-native",
    "viHistorySuite.labviewVersion": "2026",
    "viHistorySuite.labviewBitness": "64-bit"
  };
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

function mixedBitnessCandidate(overrides = {}) {
  return {
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

async function makeTempBase(t) {
  const baseDirectory = await fsp.mkdtemp(path.join(os.tmpdir(), "vi-history-host-command-"));
  t.after(async () => {
    await fsp.rm(baseDirectory, { recursive: true, force: true });
  });
  return baseDirectory;
}

function recordingFileSystem(calls) {
  return {
    async mkdir(...args) {
      calls.push(["mkdir", ...args]);
      return fsp.mkdir(...args);
    },
    async writeFile(...args) {
      calls.push(["writeFile", ...args]);
      return fsp.writeFile(...args);
    }
  };
}

test("T009 command result consumes ready host preflight facts without separate runtimeSelection", async () => {
  const preflight = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate()]
  });
  const result = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostPreflight: preflight
  });

  assert.equal(preflight.status, "ready");
  assert.equal(result.status, "ready");
  assert.equal(result.requestMode, "validate-only");
  assert.equal(result.runtimeOutcome.runtimeErrorCode, "VIHS_OK");
  assert.equal(result.runtimeOutcome.runtimeProvider, "host-native");
  assert.equal(result.runtimeOutcome.runtimeEngine, "labview-cli");
});

test("T010 command result composes supplied public-safe host selection and candidate facts", async () => {
  const result = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    selection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate()]
  });
  const persistedSettingsSelection = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostCandidates: [mixedBitnessCandidate()]
  });

  assert.equal(result.status, "ready");
  assert.equal(result.validationStatus, "ready");
  assert.equal(result.runtimeOutcome.runtimeValidationOutcome, "ready");
  assert.equal(result.runtimeOutcome.runtimeProvider, "host-native");
  assert.equal(result.runtimeOutcome.runtimeEngine, "labview-cli");
  assert.equal(persistedSettingsSelection.status, "ready");
  assert.equal(persistedSettingsSelection.runtimeOutcome.runtimeEngine, "labview-cli");
});

test("T011 blocked host preflight facts fail closed through command validation", async () => {
  const preflight = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: []
  });
  const result = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostRuntimePreflight: preflight
  });

  assert.equal(preflight.status, "blocked");
  assert.equal(result.status, "blocked");
  assert.equal(result.blockedReason, "missing-host-runtime-candidate");
  assert.equal(result.validationStatus, "blocked");
  assert.equal(result.runtimeOutcome.runtimeBlockedReason, "missing-host-runtime-candidate");
  assert.equal(result.runtimeOutcome.runtimeErrorCode, "VIHS_E_LABVIEW_NOT_FOUND");
});

test("T012 validate-only proof-out and plan-only preserve existing output shapes", async (t) => {
  const baseDirectory = await makeTempBase(t);
  const preflight = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate()]
  });
  const validateOnly = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostPreflight: preflight
  });
  const proofOut = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostPreflight: preflight,
    proofOut: "proof/host-command",
    baseDirectory
  });
  const planOnly = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    hostPreflight: preflight,
    proofOut: "proof/host-command"
  });

  assert.equal(validateOnly.type, "runtime-settings-cli-validation-command-contract");
  assert.equal(validateOnly.proofOut, null);
  assert.equal(proofOut.requestMode, "validate-with-proof-out-ready");
  assert.equal(proofOut.proofOut.type, "runtime-settings-cli-validation-proof-out-file-emission-contract");
  assert.equal(planOnly.requestMode, "validate-plan-only");
  assert.equal(planOnly.proofOut.type, "runtime-settings-cli-validation-proof-out-adapter-contract");
  assert.equal(planOnly.artifactWrites, false);
});

test("T013 proof-out writes stay delegated to command file-emission path", async (t) => {
  const baseDirectory = await makeTempBase(t);
  const calls = [];
  const result = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostSelection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate()],
    proofOut: "proof/writes",
    baseDirectory,
    fileSystem: recordingFileSystem(calls)
  });
  const writeCalls = calls.filter(([name]) => name === "writeFile");

  assert.equal(result.status, "ready");
  assert.equal(result.artifactWrites, true);
  assert.equal(calls[0][0], "mkdir");
  assert.equal(writeCalls.length, 2);
  assert.deepEqual(writeCalls.map(([, filePath]) => path.basename(filePath)).sort(), [
    "vihs-validation-issue.md",
    "vihs-validation-proof.json"
  ]);
});

test("T014 malformed or unsupported host composition inputs fail closed", async () => {
  const missingCandidate = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostSelection: hostSelection()
  });
  const unsupportedProvider = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostSelection: hostSelection({ runtimeProvider: "docker", platform: "linux" }),
    hostCandidates: [mixedBitnessCandidate()]
  });
  const ambiguous = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostSelection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate(), mixedBitnessCandidate()]
  });
  const malformed = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostSelection: hostSelection(),
    hostCandidates: {}
  });
  const contaminated = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostSelection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate({ contaminated: true })]
  });

  assert.equal(missingCandidate.blockedReason, "missing-host-runtime-candidate");
  assert.equal(unsupportedProvider.blockedReason, "unsupported-runtime-provider");
  assert.equal(ambiguous.blockedReason, "ambiguous-host-runtime-candidate");
  assert.equal(malformed.blockedReason, "malformed-host-runtime-preflight-input");
  assert.equal(contaminated.blockedReason, "windows-host-runtime-surface-contaminated");
  assert.equal(malformed.partialWrite, false);
});

test("T015 traces command IDs and keeps blocked side effects stable", async () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationCommandRequirementIds();
  const result = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    hostSelection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate()]
  });

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
  assert.deepEqual(result.blockedSideEffects, RUNTIME_SETTINGS_VALIDATION_COMMAND_BLOCKED_SIDE_EFFECTS);
  assert.equal(Object.values(result.blockedSideEffects).every((value) => value === false), true);
  assert.equal(result.blockedSideEffects.osInspection, false);
  assert.equal(result.blockedSideEffects.runtimeLocator, false);
  assert.equal(result.blockedSideEffects.privatePathDiscovery, false);
  assert.equal(result.blockedSideEffects.labviewCli, false);
  assert.equal(result.blockedSideEffects.dockerExecution, false);
  assert.equal(result.blockedSideEffects.sourceCopying, false);
});
