import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  RUNTIME_SETTINGS_TERMINAL_IO_ADAPTER_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliTerminalIoAdapterRequirementIds,
  createRuntimeSettingsTerminalEntrypoint,
  createRuntimeSettingsTerminalIoAdapter
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-terminal-io-adapter-v1";

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
      platform: "linux",
      labviewVersion: "2026",
      labviewBitness: "x64"
    }
  ];
}

test("T009 Enter confirmation adapts terminal input facts into the prompt-loop validation handoff", () => {
  const result = createRuntimeSettingsTerminalIoAdapter({
    entrypoint: materializedEntrypoint(),
    terminalSession: { isTTY: true },
    terminalInput: "enter",
    availableHostInstallations: hostInstallations()
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-terminal-io-adapter-contract");
  assert.equal(result.command, "vihs");
  assert.equal(result.mode, "interactive");
  assert.equal(result.promptWait, true);
  assert.deepEqual(result.terminalInput, {
    kind: "enter",
    confirmation: "enter",
    requestedSelection: null
  });
  assert.deepEqual(result.selectedBundle, {
    runtimeProvider: "host-native",
    platform: "windows",
    labviewVersion: "2026",
    labviewBitness: "x86"
  });
  assert.equal(result.validationHandoff.requested, true);
  assert.equal(result.validationHandoff.command, "vihs --validate");
  assert.equal(result.validationHandoff.contract, "runtime-settings-cli-validation-readback-contract");
  assert.equal(result.promptLoop.confirmation.accepted, true);
  assert.deepEqual(result.transcriptLines, [
    "VI History runtime settings",
    "Current runtime: host-native/windows/2026/x86",
    "Next command: vihs --validate",
    "Press Enter to confirm this runtime or choose a supported runtime."
  ]);
  assert.deepEqual(result.blockedSideEffects, RUNTIME_SETTINGS_TERMINAL_IO_ADAPTER_BLOCKED_SIDE_EFFECTS);
});

test("T010 guided host terminal selection feeds the admitted host selection contract", () => {
  const result = createRuntimeSettingsTerminalIoAdapter({
    entrypoint: materializedEntrypoint(),
    terminalInput: {
      kind: "selection",
      selection: {
        provider: "host",
        platform: "windows",
        version: "2025",
        bitness: "32-bit"
      }
    },
    availableHostInstallations: hostInstallations()
  });

  assert.equal(result.status, "ready");
  assert.equal(result.terminalInput.kind, "selection");
  assert.deepEqual(result.selectedBundle, {
    runtimeProvider: "host-native",
    platform: "windows",
    labviewVersion: "2025",
    labviewBitness: "x86"
  });
  assert.deepEqual(result.copyableGuidance, [
    "vihs --set-provider host-native --set-platform windows --set-labview-version 2025 --set-labview-bitness x86",
    "vihs --validate"
  ]);
  assert.equal(result.validationHandoff.requested, true);
});

test("T011 Docker terminal selection uses the latest image family without a bitness prompt", () => {
  const accepted = createRuntimeSettingsTerminalIoAdapter({
    entrypoint: materializedEntrypoint(),
    terminalInput: {
      kind: "selection",
      selection: {
        runtimeProvider: "docker",
        labviewVersion: "2026"
      }
    }
  });

  assert.equal(accepted.status, "ready");
  assert.deepEqual(accepted.selectedBundle, {
    runtimeProvider: "docker",
    platform: "docker",
    labviewVersion: "2026",
    labviewBitness: "x64"
  });
  assert.deepEqual(accepted.copyableGuidance, [
    "vihs --set-provider docker --set-platform docker --set-labview-version 2026",
    "vihs --validate"
  ]);
  assert.equal(accepted.copyableGuidance[0].includes("--set-labview-bitness"), false);
  assert.equal(accepted.blockedSideEffects.dockerExecution, false);
  assert.equal(accepted.blockedSideEffects.dockerOrchestration, false);

  const unsupportedBitness = createRuntimeSettingsTerminalIoAdapter({
    entrypoint: materializedEntrypoint(),
    terminalInput: {
      kind: "selection",
      selection: {
        runtimeProvider: "docker",
        platform: "docker",
        labviewVersion: "2026",
        labviewBitness: "x86"
      }
    }
  });

  assert.equal(unsupportedBitness.status, "blocked");
  assert.equal(unsupportedBitness.blockedReason, "docker-bitness-not-selectable");
  assert.equal(unsupportedBitness.validationHandoff.requested, false);
});

test("T012 non-TTY sessions return copyable guidance instead of prompting", () => {
  const result = createRuntimeSettingsTerminalIoAdapter({
    entrypoint: materializedEntrypoint(),
    terminalSession: { isTTY: false },
    availableHostInstallations: hostInstallations()
  });

  assert.equal(result.status, "ready");
  assert.equal(result.mode, "non-interactive-guidance");
  assert.equal(result.terminalSession.interactive, false);
  assert.equal(result.terminalInput.kind, "non-interactive-guidance");
  assert.equal(result.promptWait, false);
  assert.equal(result.validationHandoff.requested, false);
  assert.deepEqual(result.copyableGuidance, [
    "vihs --set-provider host-native --set-platform windows --set-labview-version 2026 --set-labview-bitness x86",
    "vihs --validate"
  ]);
  assert.ok(result.transcript.some((step) => step.kind === "non-interactive-guidance"));
});

test("T013 unsupported input EOF cancel and blocked side effects fail closed without runtime execution", () => {
  const unsupported = createRuntimeSettingsTerminalIoAdapter({
    entrypoint: materializedEntrypoint(),
    terminalInput: "run-labviewcli-now"
  });

  assert.equal(unsupported.status, "blocked");
  assert.equal(unsupported.blockedReason, "unsupported-terminal-input");

  const eof = createRuntimeSettingsTerminalIoAdapter({
    entrypoint: materializedEntrypoint(),
    terminalInput: "eof"
  });

  assert.equal(eof.status, "blocked");
  assert.equal(eof.blockedReason, "terminal-input-eof");

  const cancelled = createRuntimeSettingsTerminalIoAdapter({
    entrypoint: materializedEntrypoint(),
    terminalInput: "cancel"
  });

  assert.equal(cancelled.status, "blocked");
  assert.equal(cancelled.blockedReason, "terminal-input-cancelled");

  for (const result of [unsupported, eof, cancelled]) {
    assert.equal(result.validationHandoff.requested, false);
    assert.deepEqual(result.blockedSideEffects, {
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
      packageBinPublication: false,
      launcherProfileMutation: false,
      marketplace: false,
      sourceCopying: false
    });
  }
});

test("T014 traces terminal I/O adapter IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliTerminalIoAdapterRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});
