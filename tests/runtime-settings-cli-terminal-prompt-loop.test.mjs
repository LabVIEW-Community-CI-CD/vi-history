import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  allRuntimeSettingsCliTerminalPromptLoopRequirementIds,
  createRuntimeSettingsTerminalEntrypoint,
  createRuntimeSettingsTerminalPromptLoop
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-terminal-prompt-loop-v1";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function idsFromText(path) {
  return [...fs.readFileSync(path, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

function materializedEntrypoint() {
  return createRuntimeSettingsTerminalEntrypoint({
    launcher: { launcherState: "present" },
    platform: "windows",
    runtimeLookup: { vscodeRuntimeAvailable: true },
    currentBundle: {
      runtimeProvider: "host-native",
      platform: "windows",
      labviewVersion: "2026",
      labviewBitness: "x86"
    }
  });
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
      platform: "windows",
      labviewVersion: "2027",
      labviewBitness: "x64"
    }
  ];
}

test("T009 no-argument vihs produces a deterministic prompt transcript from materialized entrypoint facts", () => {
  const result = createRuntimeSettingsTerminalPromptLoop({
    entrypoint: materializedEntrypoint(),
    availableHostInstallations: hostInstallations()
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-terminal-prompt-loop-contract");
  assert.equal(result.command, "vihs");
  assert.equal(result.promptMode, "interactive");
  assert.equal(result.entrypoint.materializationState, "materialized");
  assert.deepEqual(result.currentSelection, {
    runtimeProvider: "host-native",
    platform: "windows",
    labviewVersion: "2026",
    labviewBitness: "x86"
  });
  assert.deepEqual(result.transcript.map((step) => step.kind), [
    "heading",
    "current-selection",
    "next-command",
    "confirmation"
  ]);
  assert.deepEqual(result.transcript.map((step) => step.text), [
    "VI History runtime settings",
    "Current runtime: host-native/windows/2026/x86",
    "Next command: vihs --validate",
    "Press Enter to confirm this runtime or choose a supported runtime."
  ]);
  assert.equal(result.blockedSideEffects.stdinHandling, false);
  assert.equal(result.blockedSideEffects.spawnedTerminalIo, false);
  assert.equal(result.blockedSideEffects.runtimeExecution, false);
  assert.deepEqual(result.blockedSideEffects, {
    stdinHandling: false,
    rawTerminalIo: false,
    spawnedTerminalIo: false,
    settingsMutation: false,
    runtimeValidation: false,
    runtimeExecution: false,
    compareExecution: false,
    labviewCli: false,
    dockerExecution: false,
    dockerOrchestration: false,
    proofOut: false,
    liveSessionProof: false,
    packaging: false,
    marketplace: false
  });
});

test("T010 Enter-through confirmation preserves the governed selection and requests validation handoff", () => {
  const result = createRuntimeSettingsTerminalPromptLoop({
    entrypoint: materializedEntrypoint(),
    confirmation: "enter"
  });

  assert.equal(result.status, "ready");
  assert.equal(result.confirmation.accepted, true);
  assert.deepEqual(result.selectedBundle, {
    runtimeProvider: "host-native",
    platform: "windows",
    labviewVersion: "2026",
    labviewBitness: "x86"
  });
  assert.equal(result.validationHandoff.requested, true);
  assert.equal(result.validationHandoff.command, "vihs --validate");
  assert.equal(result.validationHandoff.contract, "runtime-settings-cli-validation-readback-contract");
  assert.deepEqual(result.validationHandoff.selection, result.selectedBundle);
  assert.equal(result.blockedSideEffects.runtimeValidation, false);
  assert.equal(result.blockedSideEffects.proofOut, false);
});

test("T011 guided host selection accepts supported local hosts and fails closed otherwise", () => {
  const accepted = createRuntimeSettingsTerminalPromptLoop({
    entrypoint: materializedEntrypoint(),
    requestedSelection: {
      provider: "host",
      platform: "windows",
      version: "2025",
      bitness: "32-bit"
    },
    availableHostInstallations: hostInstallations(),
    confirmation: "enter"
  });

  assert.equal(accepted.status, "ready");
  assert.deepEqual(accepted.selectedBundle, {
    runtimeProvider: "host-native",
    platform: "windows",
    labviewVersion: "2025",
    labviewBitness: "x86"
  });
  assert.equal(accepted.validationHandoff.requested, true);

  const unsupportedYear = createRuntimeSettingsTerminalPromptLoop({
    entrypoint: materializedEntrypoint(),
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
  assert.deepEqual(unsupportedYear.currentSelection, {
    runtimeProvider: "host-native",
    platform: "windows",
    labviewVersion: "2026",
    labviewBitness: "x86"
  });
  assert.deepEqual(unsupportedYear.attemptedSelection, {
    runtimeProvider: "host-native",
    platform: "windows",
    labviewVersion: "2024",
    labviewBitness: "x64"
  });
  assert.equal(unsupportedYear.selectedBundle, null);
  assert.equal(unsupportedYear.validationHandoff.requested, false);

  const missingBitness = createRuntimeSettingsTerminalPromptLoop({
    entrypoint: materializedEntrypoint(),
    requestedSelection: {
      runtimeProvider: "host-native",
      platform: "windows",
      labviewVersion: "2026",
      labviewBitness: "x86"
    },
    availableHostInstallations: hostInstallations()
  });

  assert.equal(missingBitness.status, "blocked");
  assert.equal(missingBitness.blockedReason, "missing-selected-bitness");

  const platformMismatch = createRuntimeSettingsTerminalPromptLoop({
    entrypoint: materializedEntrypoint(),
    requestedSelection: {
      runtimeProvider: "host-native",
      platform: "docker",
      labviewVersion: "2026",
      labviewBitness: "x64"
    },
    availableHostInstallations: hostInstallations()
  });

  assert.equal(platformMismatch.status, "blocked");
  assert.equal(platformMismatch.blockedReason, "host-platform-mismatch");
});

test("T012 Docker selection uses the latest NI LabVIEW image family without a bitness choice", () => {
  const acceptedDocker = createRuntimeSettingsTerminalPromptLoop({
    entrypoint: materializedEntrypoint(),
    requestedSelection: {
      runtimeProvider: "docker",
      labviewVersion: "2026"
    },
    confirmation: "enter"
  });

  assert.equal(acceptedDocker.status, "ready");
  assert.deepEqual(acceptedDocker.selectedBundle, {
    runtimeProvider: "docker",
    platform: "docker",
    labviewVersion: "2026",
    labviewBitness: "x64"
  });
  assert.deepEqual(acceptedDocker.guidance.copyableNextCommands, [
    "vihs --set-provider docker --set-platform docker --set-labview-version 2026",
    "vihs --validate"
  ]);
  assert.equal(acceptedDocker.validationHandoff.requested, true);

  const unsupportedYear = createRuntimeSettingsTerminalPromptLoop({
    entrypoint: materializedEntrypoint(),
    requestedSelection: {
      runtimeProvider: "docker",
      labviewVersion: "2025",
      labviewBitness: "x64"
    }
  });

  assert.equal(unsupportedYear.status, "blocked");
  assert.equal(unsupportedYear.blockedReason, "unsupported-docker-year");

  const unsupportedBitness = createRuntimeSettingsTerminalPromptLoop({
    entrypoint: materializedEntrypoint(),
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

test("T013 traces terminal prompt-loop IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliTerminalPromptLoopRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});
