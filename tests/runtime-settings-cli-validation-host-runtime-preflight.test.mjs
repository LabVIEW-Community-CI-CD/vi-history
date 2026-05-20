import assert from "node:assert/strict";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_PREFLIGHT_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliValidationHostRuntimePreflightRequirementIds,
  createRuntimeSettingsValidationCommandResult,
  createRuntimeSettingsValidationHostRuntimePreflight,
  createRuntimeSettingsValidationProofArtifact,
  createRuntimeSettingsValidationProofOutAdapter,
  createRuntimeSettingsValidationRuntimeOutcome,
  readRuntimeSettingsValidation,
  writeRuntimeSettingsValidationProofOutFiles
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-host-runtime-preflight-v1";

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

function x86Candidate() {
  return mixedBitnessCandidate({
    labviewBitness: "x86",
    labviewExecutable: {
      available: true,
      version: "2026",
      bitness: "x86"
    },
    labviewCli: {
      available: true,
      canonical: true,
      bitness: "x86"
    }
  });
}

function readySettings() {
  return {
    "viHistorySuite.runtimeProvider": "host-native",
    "viHistorySuite.labviewVersion": "2026",
    "viHistorySuite.labviewBitness": "64-bit"
  };
}

async function makeTempBase(t) {
  const baseDirectory = await fsp.mkdtemp(path.join(os.tmpdir(), "vi-history-host-preflight-"));
  t.after(async () => {
    await fsp.rm(baseDirectory, { recursive: true, force: true });
  });
  return baseDirectory;
}

test("T009 supplied host selection and one compatible candidate return ready runtime selection facts", () => {
  const result = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection({ labviewBitness: "x86" }),
    hostCandidates: [x86Candidate()]
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-validation-host-runtime-preflight-contract");
  assert.equal(result.preflightBoundary, "supplied-public-safe-host-candidate-facts-only");
  assert.equal(result.hostCandidateCount, 1);
  assert.equal(result.compatibleHostCandidateCount, 1);
  assert.deepEqual(result.runtimeSelection, {
    provider: "host-native",
    runtimeProvider: "host-native",
    engine: "labview-cli",
    runtimeEngine: "labview-cli",
    platform: "windows",
    labviewVersion: "2026",
    labviewBitness: "x86",
    blockedReason: null,
    runtimeBlockedReason: null
  });
  assert.equal(result.selectedHostCandidate.publicSafe, true);
  assert.equal(result.selectedHostCandidate.labviewExecutable.role, "labview-executable");
  assert.equal(result.selectedHostCandidate.labviewCli.role, "canonical-labview-cli");
});

test("T010 Windows host 2026 x64 accepts LabVIEW x64 plus canonical installed x86 LabVIEWCLI", () => {
  const result = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate()]
  });

  assert.equal(result.status, "ready");
  assert.equal(result.mixedBitnessAccepted, true);
  assert.equal(result.selection.labviewBitness, "x64");
  assert.equal(result.selectedHostCandidate.labviewExecutable.bitness, "x64");
  assert.equal(result.selectedHostCandidate.labviewCli.bitness, "x86");
  assert.equal(result.runtimeSelection.provider, "host-native");
});

test("T011 missing selection non-host provider missing candidate and malformed inputs fail closed", () => {
  const missingSelection = createRuntimeSettingsValidationHostRuntimePreflight({
    hostCandidates: [mixedBitnessCandidate()]
  });
  const docker = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection({
      runtimeProvider: "docker",
      platform: "docker"
    }),
    hostCandidates: [mixedBitnessCandidate()]
  });
  const missingCandidate = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection()
  });
  const malformed = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: {}
  });

  assert.equal(missingSelection.status, "blocked");
  assert.equal(missingSelection.blockedReason, "missing-selection-facts");
  assert.equal(docker.status, "blocked");
  assert.equal(docker.blockedReason, "unsupported-runtime-provider");
  assert.equal(docker.runtimeSelection.provider, "unavailable");
  assert.equal(missingCandidate.blockedReason, "missing-host-runtime-candidate");
  assert.equal(malformed.blockedReason, "malformed-host-runtime-preflight-input");
});

test("T012 ambiguous candidates mismatches missing executables missing CLI and contamination fail closed", () => {
  const ambiguous = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate(), mixedBitnessCandidate()]
  });
  const versionMismatch = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate({ labviewVersion: "2025" })]
  });
  const bitnessMismatch = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: [x86Candidate()]
  });
  const missingExecutable = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: [
      mixedBitnessCandidate({
        labviewExecutable: {
          available: false,
          version: "2026",
          bitness: "x64"
        }
      })
    ]
  });
  const missingCli = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: [
      mixedBitnessCandidate({
        labviewCli: {
          available: false,
          canonical: true,
          bitness: "x86"
        }
      })
    ]
  });
  const contaminated = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate({ contaminated: true })]
  });

  assert.equal(ambiguous.blockedReason, "ambiguous-host-runtime-candidate");
  assert.equal(versionMismatch.blockedReason, "labview-version-mismatch");
  assert.equal(bitnessMismatch.blockedReason, "labview-bitness-mismatch");
  assert.equal(missingExecutable.blockedReason, "labview-exe-not-found");
  assert.equal(missingCli.blockedReason, "canonical-labview-cli-not-found");
  assert.equal(contaminated.blockedReason, "windows-host-runtime-surface-contaminated");
});

test("T013 preflight runtime selection facts compose into runtime outcome facts", () => {
  const ready = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate()]
  });
  const blocked = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: []
  });
  const readyOutcome = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: ready.runtimeSelection
  });
  const blockedOutcome = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: blocked.runtimeSelection
  });

  assert.equal(readyOutcome.status, "ready");
  assert.equal(readyOutcome.runtimeOutcome.runtimeErrorCode, "VIHS_OK");
  assert.equal(blockedOutcome.status, "blocked");
  assert.equal(blockedOutcome.runtimeOutcome.runtimeErrorCode, "VIHS_E_LABVIEW_NOT_FOUND");
});

test("T014 preflight facts compose through readback proof proof-out file emission and plan-only outputs", async (t) => {
  const baseDirectory = await makeTempBase(t);
  const preflight = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate()]
  });
  const runtimeOutcome = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: preflight.runtimeSelection
  });
  const validation = readRuntimeSettingsValidation({
    settings: readySettings(),
    runtimeOutcome: runtimeOutcome.runtimeOutcome
  });
  const artifact = createRuntimeSettingsValidationProofArtifact({ validation });
  const adapter = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "proof/host-preflight",
    validation
  });
  const files = await writeRuntimeSettingsValidationProofOutFiles({
    proofOutAdapter: adapter,
    baseDirectory
  });
  const command = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    runtimeSelection: preflight.runtimeSelection,
    proofOut: "proof/host-preflight"
  });

  assert.equal(validation.status, "ready");
  assert.equal(artifact.status, "ready");
  assert.equal(adapter.status, "ready");
  assert.equal(files.status, "ready");
  assert.equal(command.status, "ready");
  assert.equal(command.requestMode, "validate-plan-only");
  assert.equal(command.runtimeOutcome.runtimeErrorCode, "VIHS_OK");
  assert.equal(command.proofOut.artifactFiles.proofJson.fileName, "vihs-validation-proof.json");
});

test("T015 traces host preflight IDs and keeps blocked side effects stable", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationHostRuntimePreflightRequirementIds();
  const result = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: hostSelection(),
    hostCandidates: [mixedBitnessCandidate()]
  });

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
  assert.deepEqual(result.blockedSideEffects, RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_PREFLIGHT_BLOCKED_SIDE_EFFECTS);
  assert.equal(Object.values(result.blockedSideEffects).every((value) => value === false), true);
  assert.equal(result.blockedSideEffects.osInspection, false);
  assert.equal(result.blockedSideEffects.runtimeLocator, false);
  assert.equal(result.blockedSideEffects.labviewCli, false);
  assert.equal(result.blockedSideEffects.dockerExecution, false);
  assert.equal(result.blockedSideEffects.fileSystemWrites, false);
  assert.equal(result.blockedSideEffects.sourceCopying, false);
});
