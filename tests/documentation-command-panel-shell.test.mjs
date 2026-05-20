import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  BUNDLED_DOCUMENTATION_MANIFEST,
  BUNDLED_DOCUMENTATION_MANIFEST_PATH,
  activate,
  allDocumentationCommandRequirementIds,
  createDocumentationCommandPanelShell
} from "../out/src/extension.js";

const sliceId = "installed-user-documentation-command-v1";

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

function assertPublicSafeBundledContent(content) {
  const forbiddenPatterns = [
    /\bprivate\b/i,
    /\bauthority-only\b/i,
    /\bGitLab\b/i,
    /\bstandards-only\b/i,
    /\bcredential\b/i,
    /\bsecret\b/i,
    /\bsource copying\b/i,
    /\/home\/[A-Za-z0-9._-]+/,
    /\bfile:\/\//i,
    /\b[A-Za-z]:\\/
  ];

  for (const pattern of forbiddenPatterns) {
    assert.ok(!pattern.test(content), `Bundled content must not match ${pattern}: ${content}`);
  }
}

test("T009 activate registers openDocumentation as a separate handler", () => {
  const commands = makeCommandDouble();
  const context = makeContextDouble(commands);
  activate(context);
  const registeredIds = commands.registered.map((entry) => entry.id);
  assert.ok(
    registeredIds.includes("labviewViHistory.openDocumentation"),
    "labviewViHistory.openDocumentation must be registered after activate"
  );
  assert.ok(
    registeredIds.includes("labviewViHistory.open"),
    "labviewViHistory.open must be registered after activate"
  );
  assert.notEqual(
    commands.registered.find((r) => r.id === "labviewViHistory.open").handler,
    commands.registered.find((r) => r.id === "labviewViHistory.openDocumentation").handler,
    "Handlers for open and openDocumentation must be separate"
  );
});

test("T010 bundled documentation manifest and page contract is public-safe", () => {
  const manifest = readJson(BUNDLED_DOCUMENTATION_MANIFEST_PATH);
  assert.deepEqual(manifest, BUNDLED_DOCUMENTATION_MANIFEST);
  assert.equal(manifest.schema, "vi-history/bundled-documentation-manifest@v1");
  assert.equal(manifest.manifestVersion, 1, "Manifest version must be 1");
  assert.ok(Array.isArray(manifest.pages), "Manifest must have a pages array");
  assert.ok(manifest.pages.length > 0, "Manifest must list at least one page");
  for (const page of manifest.pages) {
    assert.ok(page.id && page.title && page.path, "Each page must have id, title, and path");
    assert.ok(page.path.startsWith("docs/installed-user/"), "Page path must be inside public bundled docs");
    const content = fs.readFileSync(page.path, "utf8");
    assertPublicSafeBundledContent(content);
  }
});

test("T011 documentation command panel shell returns minimum structure", () => {
  const commands = makeCommandDouble();
  const context = makeContextDouble(commands);
  activate(context);
  const docEntry = commands.registered.find((r) => r.id === "labviewViHistory.openDocumentation");
  assert.ok(docEntry, "openDocumentation command must be registered");
  const result = docEntry.handler();
  assert.deepEqual(result, createDocumentationCommandPanelShell());
  assert.ok(result && result.type === "documentation-panel-shell", "Handler must return documentation-panel-shell structure");
  assert.equal(result.manifestPath, BUNDLED_DOCUMENTATION_MANIFEST_PATH);
  assert.ok(Array.isArray(result.pages) && result.pages.length > 0, "Shell must list at least one page");
  assert.deepEqual(result.blockedSideEffects, {
    git: false,
    labviewCli: false,
    docker: false,
    compareExecution: false,
    runtimeSettingsCli: false,
    packaging: false,
    marketplace: false
  });
  for (const page of result.pages) {
    assert.ok(page.id && page.title && page.path, "Each page must have id, title, and path");
    assert.ok(page.path.startsWith("docs/installed-user/"), "Page path must be inside public bundled docs");
  }
});

test("T011 traces documentation command IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allDocumentationCommandRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});
