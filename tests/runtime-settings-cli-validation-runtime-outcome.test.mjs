import assert from "node:assert/strict";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_RUNTIME_OUTCOME_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliValidationRuntimeOutcomeRequirementIds,
  createRuntimeSettingsValidationProofArtifact,
  createRuntimeSettingsValidationProofOutAdapter,
  createRuntimeSettingsValidationRuntimeOutcome,
  readRuntimeSettingsValidation,
  writeRuntimeSettingsValidationProofOutFiles
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-runtime-outcome-v1";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function idsFromText(filePath) {
  return [...fs.readFileSync(filePath, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

function persistedSettings() {
  return {
    "viHistorySuite.runtimeProvider": "host-native",
    "viHistorySuite.labviewVersion": "2026",
    "viHistorySuite.labviewBitness": "64-bit"
  };
}

function readyRuntimeOutcome() {
  return createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: {
      provider: "host-native",
      engine: "labview-cli"
    }
  });
}

function readyValidationReadback() {
  return readRuntimeSettingsValidation({
    settings: persistedSettings(),
    effectiveSettingsTarget: {
      scope: "user",
      identifier: "User/settings.json"
    },
    runtimeOutcome: readyRuntimeOutcome().runtimeOutcome
  });
}

async function makeTempBase(t) {
  const baseDirectory = await fsp.mkdtemp(path.join(os.tmpdir(), "vi-history-runtime-outcome-"));
  t.after(async () => {
    await fsp.rm(baseDirectory, { recursive: true, force: true });
  });
  return baseDirectory;
}

test("T009 maps ready supplied runtime selection facts to a ready runtimeOutcome", () => {
  const result = readyRuntimeOutcome();

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-validation-runtime-outcome-contract");
  assert.deepEqual(result.runtimeOutcome, {
    runtimeValidationOutcome: "ready",
    runtimeProvider: "host-native",
    runtimeEngine: "labview-cli",
    runtimeBlockedReason: null,
    runtimeErrorCode: "VIHS_OK",
    runtimeProofStatus: "ready",
    runtimeImplementationStatus: "implemented"
  });
  assert.equal(result.blockedSideEffects.runtimeExecution, false);
  assert.equal(result.blockedSideEffects.runtimeLocator, false);
});

test("T010 invalid or missing provider facts fail closed", () => {
  const missing = createRuntimeSettingsValidationRuntimeOutcome();
  const invalid = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: {
      provider: "mystery",
      engine: "labview-cli"
    }
  });

  assert.equal(missing.status, "blocked");
  assert.equal(missing.blockedReason, "missing-runtime-selection-facts");
  assert.equal(missing.runtimeOutcome.runtimeErrorCode, "VIHS_E_RUNTIME_SELECTION_REQUIRED");
  assert.equal(missing.runtimeOutcome.runtimeImplementationStatus, "blocked-or-missing-prerequisite");

  assert.equal(invalid.status, "blocked");
  assert.equal(invalid.blockedReason, "installed-provider-invalid");
  assert.equal(invalid.runtimeOutcome.runtimeProvider, "unavailable");
  assert.equal(invalid.runtimeOutcome.runtimeErrorCode, "VIHS_E_PROVIDER_INVALID");
});

test("T011 maps Docker and platform unsupported facts to not-implemented", () => {
  const docker = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: {
      provider: "unavailable",
      blockedReason: "docker-provider-labview-version-not-implemented"
    }
  });
  const platform = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: {
      provider: "unavailable",
      blockedReason: "linux-container-provider-not-supported-on-platform"
    }
  });

  assert.equal(docker.status, "blocked");
  assert.equal(docker.runtimeOutcome.runtimeErrorCode, "VIHS_E_DOCKER_PROVIDER_VERSION_NOT_IMPLEMENTED");
  assert.equal(docker.runtimeOutcome.runtimeImplementationStatus, "not-implemented");
  assert.equal(platform.runtimeOutcome.runtimeErrorCode, "VIHS_E_PLATFORM_UNSUPPORTED");
  assert.equal(platform.runtimeOutcome.runtimeImplementationStatus, "not-implemented");
});

test("T012 maps LabVIEW not-found and unknown blocked reasons to stable public facts", () => {
  const labviewMissing = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: {
      provider: "unavailable",
      blockedReason: "labview-exe-not-found"
    }
  });
  const unknown = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection: {
      provider: "unavailable",
      blockedReason: "surprising-runtime-blocker"
    }
  });

  assert.equal(labviewMissing.runtimeOutcome.runtimeErrorCode, "VIHS_E_LABVIEW_NOT_FOUND");
  assert.equal(labviewMissing.runtimeOutcome.runtimeImplementationStatus, "blocked-or-missing-prerequisite");
  assert.equal(unknown.runtimeOutcome.runtimeErrorCode, "VIHS_E_RUNTIME_VALIDATION_BLOCKED");
  assert.equal(unknown.runtimeOutcome.runtimeProofStatus, "blocked-with-actionable-error");
});

test("T013 generated runtimeOutcome facts compose into readback and proof artifacts", () => {
  const validation = readyValidationReadback();
  const artifact = createRuntimeSettingsValidationProofArtifact({
    validation,
    environment: {
      NORMAL_FLAG: "public"
    }
  });

  assert.equal(validation.status, "ready");
  assert.deepEqual(validation.runtime, readyRuntimeOutcome().runtimeOutcome);
  assert.equal(artifact.status, "ready");
  assert.equal(artifact.proofJson.validation.runtime.runtimeErrorCode, "VIHS_OK");
  assert.equal(artifact.proofJson.validation.runtime.runtimeImplementationStatus, "implemented");
});

test("T014 generated facts compose into proof-out adapter and file emission", async (t) => {
  const baseDirectory = await makeTempBase(t);
  const adapter = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "proof/runtime-outcome",
    validation: readyValidationReadback()
  });
  const result = await writeRuntimeSettingsValidationProofOutFiles({
    proofOutAdapter: adapter,
    baseDirectory
  });
  const proofText = await fsp.readFile(
    path.join(baseDirectory, "proof/runtime-outcome/vihs-validation-proof.json"),
    "utf8"
  );

  assert.equal(adapter.status, "ready");
  assert.equal(result.status, "ready");
  assert.equal(result.files.proofJson.fileName, "vihs-validation-proof.json");
  assert.equal(JSON.parse(proofText).validation.runtime.runtimeErrorCode, "VIHS_OK");
});

test("T015 traces runtime outcome IDs and keeps runtime side effects blocked", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationRuntimeOutcomeRequirementIds();
  const result = readyRuntimeOutcome();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
  assert.deepEqual(result.blockedSideEffects, RUNTIME_SETTINGS_VALIDATION_RUNTIME_OUTCOME_BLOCKED_SIDE_EFFECTS);
  assert.equal(Object.values(result.blockedSideEffects).every((value) => value === false), true);
});
