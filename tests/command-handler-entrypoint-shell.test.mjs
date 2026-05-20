import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  activate,
  allEntrypointShellRequirementIds
} from "../out/src/extension-contracts.js";

const sliceId = "command-handler-entrypoint-shell-v1";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function idsFromText(path) {
  return [...fs.readFileSync(path, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

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

// T009: add tests proving extension activation registers the admitted command entrypoint shell

test("T009 activate registers labviewViHistory.open and related command handlers", () => {
  const commands = makeCommandDouble();
  const context = makeContextDouble(commands);

  activate(context);

  const registeredIds = commands.registered.map((entry) => entry.id);
  assert.ok(
    registeredIds.includes("labviewViHistory.open"),
    "labviewViHistory.open must be registered after activate"
  );
  assert.ok(
    registeredIds.includes("labviewViHistory.openDocumentation"),
    "labviewViHistory.openDocumentation must be registered after activate"
  );
  assert.ok(
    registeredIds.includes("labviewViHistory.prepareLocalRuntimeSettingsCli"),
    "labviewViHistory.prepareLocalRuntimeSettingsCli must be registered after activate"
  );
  assert.equal(context.subscriptions.length, 3, "activate must push three subscriptions");
});

test("T009 registered labviewViHistory.open handler is a function", () => {
  const commands = makeCommandDouble();
  const context = makeContextDouble(commands);

  activate(context);

  const entry = commands.registered.find((r) => r.id === "labviewViHistory.open");
  assert.ok(entry, "labviewViHistory.open entry must exist");
  assert.equal(typeof entry.handler, "function", "handler must be a function");
});

// T010: add tests proving handler registration does not initialize Git,
// LabVIEWCLI, Docker, packaging, or Marketplace behavior

test("T010 activate registers only admitted command handlers", () => {
  const commands = makeCommandDouble();
  const context = makeContextDouble(commands);

  activate(context);

  assert.equal(commands.registered.length, 3, "activate must register exactly three commands");
  const ids = commands.registered.map((r) => r.id);
  assert.ok(ids.includes("labviewViHistory.open"), "labviewViHistory.open must be registered");
  assert.ok(ids.includes("labviewViHistory.openDocumentation"), "labviewViHistory.openDocumentation must be registered");
  assert.ok(
    ids.includes("labviewViHistory.prepareLocalRuntimeSettingsCli"),
    "labviewViHistory.prepareLocalRuntimeSettingsCli must be registered"
  );
});

test("T010 activate does not throw and produces no unexpected side-effects", () => {
  const commands = makeCommandDouble();
  const context = makeContextDouble(commands);

  assert.doesNotThrow(() => activate(context), "activate must not throw");
  assert.equal(commands.registered.length, 3, "three commands registered");
  const ids = commands.registered.map((r) => r.id);
  assert.ok(ids.includes("labviewViHistory.open"), "labviewViHistory.open must be registered");
  assert.ok(ids.includes("labviewViHistory.openDocumentation"), "labviewViHistory.openDocumentation must be registered");
  assert.ok(
    ids.includes("labviewViHistory.prepareLocalRuntimeSettingsCli"),
    "labviewViHistory.prepareLocalRuntimeSettingsCli must be registered"
  );
});

test("T010 handler invocation does not throw and returns undefined", () => {
  const commands = makeCommandDouble();
  const context = makeContextDouble(commands);

  activate(context);

  const { handler } = commands.registered.find((r) => r.id === "labviewViHistory.open");

  assert.doesNotThrow(() => handler(), "handler must not throw");
  assert.equal(handler(), undefined, "handler must return undefined (no blocked async behavior started)");
});

// T011: require IDs tracing

test("T011 traces entrypoint shell requirement IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allEntrypointShellRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});
