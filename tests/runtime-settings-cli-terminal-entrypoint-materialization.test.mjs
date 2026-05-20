import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  allRuntimeSettingsCliTerminalEntrypointRequirementIds,
  createRuntimeSettingsTerminalEntrypoint
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-terminal-entrypoint-v1";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function idsFromText(path) {
  return [...fs.readFileSync(path, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

test("T009 materialized vihs entrypoint is represented as a bare user-scope command without hidden path reconstruction or prebuilt payload", () => {
  const result = createRuntimeSettingsTerminalEntrypoint({
    launcher: { launcherState: "present" },
    platform: "windows",
    runtimeLookup: { vscodeRuntimeAvailable: true },
    currentBundle: {
      runtimeProvider: "host-native",
      platform: "windows",
      labviewVersion: "2026",
      labviewBitness: "64-bit"
    }
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-terminal-entrypoint-contract");
  assert.equal(result.command, "vihs");
  assert.equal(result.admissionScope, "user");
  assert.equal(result.materializationState, "materialized");
  assert.equal(result.blockedSideEffects.profileEditing, false);
  assert.equal(result.blockedSideEffects.adminElevation, false);
  assert.equal(result.blockedSideEffects.machineWideInstall, false);
  assert.equal(result.blockedSideEffects.terminalPromptLoop, false);
  assert.equal(result.blockedSideEffects.runtimeExecution, false);
  assert.equal(result.discoverability.promptLoopBound, false);
  assert.ok(Array.isArray(result.discoverability.copyableNextCommands));
  assert.ok(result.discoverability.copyableNextCommands.length > 0);
  assert.equal(result.discoverability.currentBundle.runtimeProvider, "host-native");
  assert.equal(result.discoverability.currentBundle.labviewVersion, "2026");
  assert.equal(result.discoverability.currentBundle.labviewBitness, "x64");
  assert.ok(result.discoverability.copyableNextCommands.includes("vihs --validate"));
});

test("T010 terminal-session admission records stay user-scoped and expose the intended entrypoint state", () => {
  const admitted = createRuntimeSettingsTerminalEntrypoint({
    launcher: { launcherState: "present" },
    platform: "windows",
    terminalSession: { admitted: true, scope: "user" }
  });

  assert.equal(admitted.status, "ready");
  assert.equal(admitted.admissionScope, "user");
  assert.equal(admitted.terminalSession.admitted, true);
  assert.equal(admitted.terminalSession.scope, "user");
  assert.equal(admitted.terminalSession.requestedScope, "user");
  assert.equal(admitted.terminalSession.blockedReason, null);
  assert.equal(admitted.materializationState, "materialized");
  assert.equal(admitted.validationHandoff.command, "vihs --validate");
  assert.equal(admitted.validationHandoff.contract, "runtime-settings-cli-validation-readback-contract");
  assert.equal(admitted.validationHandoff.executionBound, false);
  assert.equal(admitted.validationHandoff.proofOutBound, false);

  const machineSession = createRuntimeSettingsTerminalEntrypoint({
    launcher: { launcherState: "present" },
    platform: "windows",
    terminalSession: { admitted: false, scope: "machine" }
  });

  assert.equal(machineSession.status, "blocked");
  assert.equal(machineSession.blockedReason, "unsupported-terminal-session");
  assert.equal(machineSession.admissionScope, "user");
  assert.equal(machineSession.terminalSession.scope, "user");
  assert.equal(machineSession.terminalSession.requestedScope, "machine");
  assert.equal(machineSession.terminalSession.admitted, false);
  assert.equal(machineSession.validationHandoff.executionBound, false);
  assert.equal(machineSession.validationHandoff.proofOutBound, false);
});

test("T011 runtime lookup facts prefer VS Code runtime on Windows before global Node fallback or explicit override", () => {
  const windowsVscode = createRuntimeSettingsTerminalEntrypoint({
    launcher: { launcherState: "present" },
    platform: "windows",
    runtimeLookup: { vscodeRuntimeAvailable: true, globalNodeAvailable: true }
  });

  assert.equal(windowsVscode.status, "ready");
  assert.deepEqual(windowsVscode.runtimeLookup.order, ["vscode-runtime", "global-node", "explicit-override"]);
  assert.equal(windowsVscode.runtimeLookup.activeRuntime, "vscode-runtime");
  assert.equal(windowsVscode.runtimeLookup.platform, "windows");

  const globalNodeFallback = createRuntimeSettingsTerminalEntrypoint({
    launcher: { launcherState: "present" },
    platform: "windows",
    runtimeLookup: { vscodeRuntimeAvailable: false, globalNodeAvailable: true }
  });

  assert.equal(globalNodeFallback.runtimeLookup.activeRuntime, "global-node");

  const withOverride = createRuntimeSettingsTerminalEntrypoint({
    launcher: { launcherState: "present" },
    platform: "windows",
    runtimeLookup: { vscodeRuntimeAvailable: false, globalNodeAvailable: false, explicitOverride: "node" }
  });

  assert.equal(withOverride.runtimeLookup.activeRuntime, "explicit-override");
  assert.equal(withOverride.runtimeLookup.overrideActive, true);

  const noRuntime = createRuntimeSettingsTerminalEntrypoint({
    launcher: { launcherState: "present" },
    platform: "windows",
    runtimeLookup: { vscodeRuntimeAvailable: false, globalNodeAvailable: false }
  });

  assert.equal(noRuntime.runtimeLookup.activeRuntime, null);
  assert.equal(noRuntime.runtimeLookup.overrideActive, false);
});

test("T012 stale or missing launchers fail closed with one stable actionable recovery instruction", () => {
  const missing = createRuntimeSettingsTerminalEntrypoint({
    launcher: { launcherState: "missing" },
    platform: "windows"
  });

  assert.equal(missing.status, "blocked");
  assert.equal(missing.blockedReason, "launcher-missing");
  assert.equal(missing.materializationState, "blocked");
  assert.equal(
    missing.recoveryInstruction,
    "Run the VS Code command labviewViHistory.prepareLocalRuntimeSettingsCli to restore the local runtime settings CLI launcher."
  );
  assert.equal(missing.recoveryCommand, "labviewViHistory.prepareLocalRuntimeSettingsCli");
  assert.equal(missing.terminalSession.scope, "user");
  assert.equal(missing.blockedSideEffects.terminalPromptLoop, false);
  assert.equal(missing.blockedSideEffects.runtimeExecution, false);

  const stale = createRuntimeSettingsTerminalEntrypoint({
    launcher: { launcherState: "stale" },
    platform: "windows"
  });

  assert.equal(stale.status, "blocked");
  assert.equal(stale.blockedReason, "launcher-stale");
  assert.equal(stale.recoveryInstruction, missing.recoveryInstruction);
  assert.equal(stale.recoveryCommand, missing.recoveryCommand);
});

test("T013 traces terminal entrypoint IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliTerminalEntrypointRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});
