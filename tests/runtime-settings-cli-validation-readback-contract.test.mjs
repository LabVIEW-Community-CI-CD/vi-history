import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  allRuntimeSettingsCliValidationReadbackRequirementIds,
  readRuntimeSettingsValidation
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-readback-v1";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function idsFromText(path) {
  return [...fs.readFileSync(path, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

test("T009 validation readback reports persisted settings and effective target without mutation", () => {
  const settings = {
    "editor.tabSize": 2,
    "viHistorySuite.runtimeProvider": "host-native",
    "viHistorySuite.labviewVersion": "2026",
    "viHistorySuite.labviewBitness": "64-bit"
  };
  const original = structuredClone(settings);

  const result = readRuntimeSettingsValidation({
    settings,
    effectiveSettingsTarget: {
      scope: "user",
      identifier: "User/settings.json"
    },
    runtimeOutcome: {
      runtimeValidationOutcome: "ready",
      runtimeProvider: "host",
      runtimeEngine: "labview-cli",
      runtimeBlockedReason: null,
      runtimeErrorCode: "VIHS_OK",
      runtimeProofStatus: "ready",
      runtimeImplementationStatus: "implemented"
    }
  });

  assert.equal(result.status, "ready");
  assert.deepEqual(settings, original);
  assert.deepEqual(result.effectiveSettingsTarget, {
    scope: "user",
    identifier: "User/settings.json"
  });
  assert.deepEqual(result.persistedSettings, {
    runtimeProvider: "host-native",
    labviewVersion: "2026",
    labviewBitness: "64-bit"
  });
  assert.equal(result.blockedSideEffects.settingsMutation, false);
});

test("T010 validation readback reports runtime outcome facts without execution or picker behavior", () => {
  const result = readRuntimeSettingsValidation({
    settingsContent: `{
      "viHistorySuite.runtimeProvider": "docker",
      "viHistorySuite.labviewVersion": "2026",
      "viHistorySuite.labviewBitness": "64-bit",
    }`,
    target: "user",
    runtimeOutcome: {
      runtimeValidationOutcome: "blocked",
      runtimeProvider: "unavailable",
      runtimeEngine: null,
      runtimeBlockedReason: "docker-provider-not-enabled",
      runtimeErrorCode: "VIHS_E_DOCKER_PROVIDER_NOT_ENABLED",
      runtimeProofStatus: "blocked-with-actionable-error",
      runtimeImplementationStatus: "not-implemented"
    }
  });

  assert.equal(result.status, "blocked");
  assert.deepEqual(result.runtime, {
    runtimeValidationOutcome: "blocked",
    runtimeProvider: "unavailable",
    runtimeEngine: null,
    runtimeBlockedReason: "docker-provider-not-enabled",
    runtimeErrorCode: "VIHS_E_DOCKER_PROVIDER_NOT_ENABLED",
    runtimeProofStatus: "blocked-with-actionable-error",
    runtimeImplementationStatus: "not-implemented"
  });
  assert.deepEqual(result.blockedSideEffects, {
    settingsMutation: false,
    interactiveSelection: false,
    proofOut: false,
    picker: false,
    runtimeValidation: false,
    compareExecution: false,
    labviewCli: false,
    docker: false,
    liveSessionProof: false,
    packaging: false,
    marketplace: false
  });
});

test("T011 validation readback fails closed for missing or unsupported settings", () => {
  const missingSettings = readRuntimeSettingsValidation({
    settings: {
      "viHistorySuite.runtimeProvider": "host-native"
    },
    target: "user",
    runtimeOutcome: {
      runtimeValidationOutcome: "ready",
      runtimeProvider: "host",
      runtimeEngine: "labview-cli",
      runtimeBlockedReason: null,
      runtimeErrorCode: "VIHS_OK",
      runtimeProofStatus: "ready",
      runtimeImplementationStatus: "implemented"
    }
  });

  assert.equal(missingSettings.status, "blocked");
  assert.equal(missingSettings.blockedReason, "missing-persisted-runtime-settings");
  assert.equal(missingSettings.runtime.runtimeErrorCode, "VIHS_E_MISSING_PERSISTED_RUNTIME_SETTINGS");
  assert.equal(missingSettings.partialWrite, false);

  const unsupportedSettings = readRuntimeSettingsValidation({
    settingsContent: "[\"not\", \"settings\"]",
    target: "user"
  });

  assert.equal(unsupportedSettings.status, "blocked");
  assert.equal(unsupportedSettings.blockedReason, "unsupported-settings-target-shape");
  assert.equal(unsupportedSettings.runtime.runtimeErrorCode, "VIHS_E_UNSUPPORTED_SETTINGS_TARGET_SHAPE");
});

test("T012 traces validation readback IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationReadbackRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});
