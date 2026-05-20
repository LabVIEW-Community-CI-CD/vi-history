import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  activate,
  allRuntimeSettingsCliBootstrapRequirementIds,
  createRuntimeSettingsCliPrepareCommandShell
} from "../out/src/extension.js";

const sliceId = "runtime-settings-cli-bootstrap-v1";

function makeCommandDouble() {
  const registered = [];
  return {
    registerCommand(id, handler) {
      registered.push({ id, handler });
      return { dispose() {} };
    },
    registered
  };
}

function makeContextDouble(commandDouble) {
  const subscriptions = [];
  return {
    commands: commandDouble,
    subscriptions
  };
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function idsFromText(path) {
  return [...fs.readFileSync(path, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

test("T009 activate registers prepareLocalRuntimeSettingsCli as a separate handler", () => {
  const commands = makeCommandDouble();
  const context = makeContextDouble(commands);
  activate(context);

  const openEntry = commands.registered.find((r) => r.id === "labviewViHistory.open");
  const documentationEntry = commands.registered.find((r) => r.id === "labviewViHistory.openDocumentation");
  const prepareEntry = commands.registered.find((r) => r.id === "labviewViHistory.prepareLocalRuntimeSettingsCli");

  assert.ok(openEntry, "labviewViHistory.open must be registered");
  assert.ok(documentationEntry, "labviewViHistory.openDocumentation must be registered");
  assert.ok(prepareEntry, "labviewViHistory.prepareLocalRuntimeSettingsCli must be registered");
  assert.notEqual(prepareEntry.handler, openEntry.handler, "prepare-command handler must be separate from open");
  assert.notEqual(
    prepareEntry.handler,
    documentationEntry.handler,
    "prepare-command handler must be separate from openDocumentation"
  );
  assert.equal(context.subscriptions.length, 3, "activate must push three command subscriptions");
});

test("T010 prepare-command shell reports launcher and recovery facts without settings mutation", () => {
  const commands = makeCommandDouble();
  const context = makeContextDouble(commands);
  activate(context);

  const prepareEntry = commands.registered.find((r) => r.id === "labviewViHistory.prepareLocalRuntimeSettingsCli");
  const result = prepareEntry.handler();

  assert.deepEqual(result, createRuntimeSettingsCliPrepareCommandShell());
  assert.equal(result.type, "runtime-settings-cli-prepare-command-shell");
  assert.equal(result.commandId, "labviewViHistory.prepareLocalRuntimeSettingsCli");
  assert.deepEqual(result.launcher, {
    entrypoint: "vihs",
    materialization: "extension-managed-terminal-bootstrap",
    status: "prepared",
    prebuiltExternalCliPayload: false
  });
  assert.deepEqual(result.recovery, {
    missingLauncher: "rerun labviewViHistory.prepareLocalRuntimeSettingsCli",
    staleLauncher: "rerun labviewViHistory.prepareLocalRuntimeSettingsCli",
    hiddenPathReconstructionRequired: false,
    profileEditingRequired: false,
    adminElevationRequired: false,
    machineWideInstallRequired: false
  });
  assert.deepEqual(result.blockedSideEffects, {
    settingsMutation: false,
    jsoncSettingsRewrite: false,
    runtimeValidation: false,
    compareExecution: false,
    labviewCli: false,
    docker: false,
    packaging: false,
    marketplace: false
  });
});

test("T011 traces runtime settings CLI bootstrap IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliBootstrapRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});
