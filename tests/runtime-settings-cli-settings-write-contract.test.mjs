import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  RUNTIME_SETTINGS_KEYS,
  allRuntimeSettingsCliSettingsWriteRequirementIds,
  writeRuntimeSettingsFacts
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-settings-write-v1";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function idsFromText(path) {
  return [...fs.readFileSync(path, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

test("T009 writes only governed runtime settings keys", () => {
  const settings = {
    "editor.tabSize": 2,
    "viHistorySuite.runtimeProvider": "docker",
    "viHistorySuite.labviewVersion": "2025",
    "viHistorySuite.labviewBitness": "32-bit",
    "viHistorySuite.unrelated": "preserved"
  };

  const result = writeRuntimeSettingsFacts({
    settings,
    runtimeFacts: {
      runtimeProvider: "host-native",
      labviewVersion: "2026",
      labviewBitness: "64-bit"
    },
    target: {
      scope: "user",
      identifier: "User/settings.json"
    }
  });

  assert.equal(result.status, "updated");
  assert.equal(result.settings[RUNTIME_SETTINGS_KEYS.runtimeProvider], "host-native");
  assert.equal(result.settings[RUNTIME_SETTINGS_KEYS.labviewVersion], "2026");
  assert.equal(result.settings[RUNTIME_SETTINGS_KEYS.labviewBitness], "64-bit");
  assert.equal(result.settings["editor.tabSize"], 2);
  assert.equal(result.settings["viHistorySuite.unrelated"], "preserved");
  assert.deepEqual(Object.keys(result.settings).sort(), Object.keys(settings).sort());
  assert.deepEqual(result.updatedKeys, Object.values(RUNTIME_SETTINGS_KEYS));
  assert.deepEqual(result.blockedSideEffects, {
    runtimeValidation: false,
    compareExecution: false,
    labviewCli: false,
    docker: false,
    liveSessionProof: false,
    packaging: false,
    marketplace: false
  });
});

test("T010 preserves unrelated settings and reports explicit effective target", () => {
  const result = writeRuntimeSettingsFacts({
    settingsContent: {
      "files.autoSave": "afterDelay",
      "workbench.colorTheme": "Default Light Modern",
      nested: {
        keep: true
      }
    },
    runtimeProvider: "host-native",
    labviewVersion: 2026,
    labviewBitness: "64-bit",
    effectiveSettingsTarget: {
      scope: "workspace",
      path: ".vscode/settings.json"
    }
  });

  assert.equal(result.status, "updated");
  assert.deepEqual(result.effectiveSettingsTarget, {
    scope: "workspace",
    identifier: ".vscode/settings.json"
  });
  assert.equal(result.settings["files.autoSave"], "afterDelay");
  assert.equal(result.settings["workbench.colorTheme"], "Default Light Modern");
  assert.deepEqual(result.settings.nested, { keep: true });
  assert.equal(result.settings[RUNTIME_SETTINGS_KEYS.runtimeProvider], "host-native");
  assert.equal(result.settings[RUNTIME_SETTINGS_KEYS.labviewVersion], "2026");
  assert.equal(result.settings[RUNTIME_SETTINGS_KEYS.labviewBitness], "64-bit");
});

test("T011 handles comments and trailing commas or fails closed without partial writes", () => {
  const jsoncSettings = `{
    // Existing editor preference.
    "editor.tabSize": 4,
    "viHistorySuite.runtimeProvider": "docker",
    "viHistorySuite.labviewVersion": "2025",
  }`;

  const updated = writeRuntimeSettingsFacts({
    settingsContent: jsoncSettings,
    runtimeFacts: {
      runtimeProvider: "host-native",
      labviewVersion: "2026",
      labviewBitness: "64-bit"
    },
    target: "user"
  });

  assert.equal(updated.status, "updated");
  assert.equal(updated.settings["editor.tabSize"], 4);
  assert.equal(updated.settings[RUNTIME_SETTINGS_KEYS.runtimeProvider], "host-native");
  assert.equal(updated.settings[RUNTIME_SETTINGS_KEYS.labviewVersion], "2026");
  assert.equal(updated.settings[RUNTIME_SETTINGS_KEYS.labviewBitness], "64-bit");
  assert.deepEqual(JSON.parse(updated.content), updated.settings);

  const unsupportedShape = writeRuntimeSettingsFacts({
    settingsContent: "[\"not\", \"a\", \"settings\", \"object\"]",
    runtimeFacts: {
      runtimeProvider: "host-native",
      labviewVersion: "2026",
      labviewBitness: "64-bit"
    },
    target: "user"
  });

  assert.equal(unsupportedShape.status, "blocked");
  assert.equal(unsupportedShape.blockedReason, "unsupported-settings-target-shape");
  assert.equal(unsupportedShape.partialWrite, false);
  assert.equal("settings" in unsupportedShape, false);

  const invalidTarget = writeRuntimeSettingsFacts({
    settingsContent: "{}",
    runtimeFacts: {
      runtimeProvider: "host-native",
      labviewVersion: "2026",
      labviewBitness: "64-bit"
    },
    target: []
  });

  assert.equal(invalidTarget.status, "blocked");
  assert.equal(invalidTarget.blockedReason, "unsupported-effective-settings-target");
  assert.equal(invalidTarget.partialWrite, false);
});

test("T012 traces settings-write IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliSettingsWriteRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});
