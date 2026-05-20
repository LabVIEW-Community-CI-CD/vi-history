import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  RUNTIME_SETTINGS_INTERACTIVE_DEFAULT_SELECTION,
  allRuntimeSettingsCliInteractiveSelectionRequirementIds,
  createRuntimeSettingsInteractiveSelection
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-interactive-selection-v1";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function idsFromText(path) {
  return [...fs.readFileSync(path, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

function hostInstallations() {
  return [
    {
      platform: "windows",
      labviewVersion: "2025",
      labviewBitness: "x86"
    },
    {
      platform: "windows",
      labviewVersion: "2026",
      labviewBitness: "x64"
    },
    {
      platform: "linux",
      labviewVersion: "2026",
      labviewBitness: "x64"
    },
    {
      platform: "windows",
      labviewVersion: "2027",
      labviewBitness: "x64"
    }
  ];
}

test("T009 bare vihs seeds missing settings and reports the current bundle", () => {
  const seeded = createRuntimeSettingsInteractiveSelection({
    settings: {},
    availableHostInstallations: hostInstallations()
  });

  assert.equal(seeded.status, "ready");
  assert.equal(seeded.type, "runtime-settings-cli-interactive-selection-contract");
  assert.equal(seeded.command, "vihs");
  assert.equal(seeded.defaultSelectionApplied, true);
  assert.deepEqual(seeded.selection, RUNTIME_SETTINGS_INTERACTIVE_DEFAULT_SELECTION);
  assert.deepEqual(seeded.guidance.copyableNextCommands, [
    "vihs --set-provider host-native --set-platform windows --set-labview-version 2026 --set-labview-bitness x86",
    "vihs --validate"
  ]);

  const current = createRuntimeSettingsInteractiveSelection({
    settings: {
      "viHistorySuite.runtimeProvider": "host-native",
      "viHistorySuite.labviewVersion": "2026",
      "viHistorySuite.labviewBitness": "64-bit"
    },
    platform: "linux",
    availableHostInstallations: hostInstallations()
  });

  assert.equal(current.defaultSelectionApplied, false);
  assert.deepEqual(current.selection, {
    runtimeProvider: "host-native",
    platform: "linux",
    labviewVersion: "2026",
    labviewBitness: "x64"
  });
  assert.deepEqual(current.blockedSideEffects, {
    terminalPromptLoop: false,
    stdinHandling: false,
    settingsMutation: false,
    proofOut: false,
    runtimeValidation: false,
    compareExecution: false,
    labviewCli: false,
    dockerExecution: false,
    liveSessionProof: false,
    packaging: false,
    marketplace: false
  });
});

test("T010 confirmation preserves the governed selection and requests validation readback", () => {
  const result = createRuntimeSettingsInteractiveSelection({
    settings: {
      "viHistorySuite.runtimeProvider": "host-native",
      "viHistorySuite.labviewVersion": "2026",
      "viHistorySuite.labviewBitness": "x86"
    },
    platform: "windows",
    confirmation: "enter"
  });

  assert.equal(result.status, "ready");
  assert.equal(result.validationHandoff.requested, true);
  assert.equal(result.validationHandoff.command, "vihs --validate");
  assert.equal(result.validationHandoff.contract, "runtime-settings-cli-validation-readback-contract");
  assert.deepEqual(result.validationHandoff.selection, {
    runtimeProvider: "host-native",
    platform: "windows",
    labviewVersion: "2026",
    labviewBitness: "x86"
  });
  assert.equal(result.blockedSideEffects.runtimeValidation, false);
  assert.equal(result.blockedSideEffects.proofOut, false);
});

test("T011 guided host selection accepts supported local hosts and fails closed otherwise", () => {
  const accepted2025 = createRuntimeSettingsInteractiveSelection({
    requestedSelection: {
      provider: "host",
      platform: "windows",
      version: "2025",
      bitness: "32-bit"
    },
    availableHostInstallations: hostInstallations()
  });

  assert.equal(accepted2025.status, "ready");
  assert.deepEqual(accepted2025.selection, {
    runtimeProvider: "host-native",
    platform: "windows",
    labviewVersion: "2025",
    labviewBitness: "x86"
  });

  const acceptedNewer = createRuntimeSettingsInteractiveSelection({
    requestedSelection: {
      runtimeProvider: "host-native",
      platform: "windows",
      labviewVersion: "2027",
      labviewBitness: "x64"
    },
    availableHostInstallations: hostInstallations()
  });

  assert.equal(acceptedNewer.status, "ready");
  assert.equal(acceptedNewer.selection.labviewVersion, "2027");

  const unsupportedYear = createRuntimeSettingsInteractiveSelection({
    requestedSelection: {
      runtimeProvider: "host-native",
      platform: "windows",
      labviewVersion: "2024",
      labviewBitness: "x64"
    },
    availableHostInstallations: hostInstallations()
  });

  assert.equal(unsupportedYear.status, "blocked");
  assert.equal(unsupportedYear.blockedReason, "unsupported-host-year");

  const missingBitness = createRuntimeSettingsInteractiveSelection({
    requestedSelection: {
      runtimeProvider: "host-native",
      platform: "linux",
      labviewVersion: "2026",
      labviewBitness: "x86"
    },
    availableHostInstallations: hostInstallations()
  });

  assert.equal(missingBitness.status, "blocked");
  assert.equal(missingBitness.blockedReason, "missing-selected-bitness");
});

test("T012 Docker selection uses the latest NI LabVIEW image family without a bitness choice", () => {
  const acceptedDocker = createRuntimeSettingsInteractiveSelection({
    requestedSelection: {
      runtimeProvider: "docker",
      labviewVersion: "2026"
    }
  });

  assert.equal(acceptedDocker.status, "ready");
  assert.deepEqual(acceptedDocker.selection, {
    runtimeProvider: "docker",
    platform: "docker",
    labviewVersion: "2026",
    labviewBitness: "x64"
  });
  assert.deepEqual(acceptedDocker.guidance.copyableNextCommands, [
    "vihs --set-provider docker --set-platform docker --set-labview-version 2026",
    "vihs --validate"
  ]);

  const unsupportedYear = createRuntimeSettingsInteractiveSelection({
    requestedSelection: {
      runtimeProvider: "docker",
      labviewVersion: "2025",
      labviewBitness: "x64"
    }
  });

  assert.equal(unsupportedYear.status, "blocked");
  assert.equal(unsupportedYear.blockedReason, "unsupported-docker-year");

  const unsupportedBitness = createRuntimeSettingsInteractiveSelection({
    requestedSelection: {
      runtimeProvider: "docker",
      platform: "docker",
      labviewVersion: "2026",
      labviewBitness: "x86"
    }
  });

  assert.equal(unsupportedBitness.status, "blocked");
  assert.equal(unsupportedBitness.blockedReason, "docker-bitness-not-selectable");
});

test("T013 traces interactive selection IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliInteractiveSelectionRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});
