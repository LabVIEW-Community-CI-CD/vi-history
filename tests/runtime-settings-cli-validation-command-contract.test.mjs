import assert from "node:assert/strict";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_COMMAND_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliValidationCommandRequirementIds,
  createRuntimeSettingsValidationCommandResult
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-command-contract-v1";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function idsFromText(filePath) {
  return [...fs.readFileSync(filePath, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

function readySettings() {
  return {
    "viHistorySuite.runtimeProvider": "host-native",
    "viHistorySuite.labviewVersion": "2026",
    "viHistorySuite.labviewBitness": "64-bit"
  };
}

function readyRuntimeSelection() {
  return {
    provider: "host-native",
    engine: "labview-cli"
  };
}

async function makeTempBase(t) {
  const baseDirectory = await fsp.mkdtemp(path.join(os.tmpdir(), "vi-history-validation-command-"));
  t.after(async () => {
    await fsp.rm(baseDirectory, { recursive: true, force: true });
  });
  return baseDirectory;
}

function failIfCalledFileSystem(calls) {
  return {
    async mkdir(...args) {
      calls.push(["mkdir", ...args]);
      throw new Error("mkdir should not be called");
    },
    async writeFile(...args) {
      calls.push(["writeFile", ...args]);
      throw new Error("writeFile should not be called");
    }
  };
}

test("T009 returns deterministic ready validate-only command composition", async () => {
  const result = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    effectiveSettingsTarget: {
      scope: "user",
      identifier: "User/settings.json"
    },
    runtimeSelection: readyRuntimeSelection()
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-validation-command-contract");
  assert.equal(result.command, "vihs --validate");
  assert.equal(result.requestMode, "validate-only");
  assert.equal(result.validationStatus, "ready");
  assert.deepEqual(result.persistedSettings, {
    runtimeProvider: "host-native",
    labviewVersion: "2026",
    labviewBitness: "64-bit"
  });
  assert.deepEqual(result.runtimeOutcome, {
    runtimeValidationOutcome: "ready",
    runtimeProvider: "host-native",
    runtimeEngine: "labview-cli",
    runtimeBlockedReason: null,
    runtimeErrorCode: "VIHS_OK",
    runtimeProofStatus: "ready",
    runtimeImplementationStatus: "implemented"
  });
  assert.equal(result.proofOut, null);
  assert.equal(result.artifactWrites, false);
  assert.equal(result.partialWrite, false);
});

test("T010 fails closed for missing or invalid persisted settings", async () => {
  const missing = await createRuntimeSettingsValidationCommandResult({
    settings: {
      "viHistorySuite.runtimeProvider": "host-native"
    },
    runtimeSelection: readyRuntimeSelection()
  });
  const invalid = await createRuntimeSettingsValidationCommandResult({
    settingsContent: "[\"not\", \"settings\"]",
    runtimeSelection: readyRuntimeSelection()
  });

  assert.equal(missing.status, "blocked");
  assert.equal(missing.blockedReason, "missing-persisted-runtime-settings");
  assert.equal(missing.validationStatus, "blocked");
  assert.equal(invalid.status, "blocked");
  assert.equal(invalid.blockedReason, "unsupported-settings-target-shape");
  assert.equal(invalid.validationStatus, "blocked");
});

test("T011 fails closed when runtime selection facts are missing", async () => {
  const result = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings()
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.blockedReason, "missing-runtime-selection-facts");
  assert.equal(result.validationStatus, "blocked");
  assert.equal(result.runtimeOutcome.runtimeErrorCode, "VIHS_E_RUNTIME_SELECTION_REQUIRED");
});

test("T012 preserves unknown runtime blocked-reason fallback through command result", async () => {
  const result = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    runtimeSelection: {
      provider: "unavailable",
      blockedReason: "surprising-runtime-blocker"
    }
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.blockedReason, "surprising-runtime-blocker");
  assert.equal(result.runtimeOutcome.runtimeErrorCode, "VIHS_E_RUNTIME_VALIDATION_BLOCKED");
  assert.equal(result.runtimeOutcome.runtimeProofStatus, "blocked-with-actionable-error");
});

test("T013 composes --proof-out through admitted two-file emission contract", async (t) => {
  const baseDirectory = await makeTempBase(t);
  const result = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "proof/command",
    baseDirectory
  });
  const entries = (await fsp.readdir(path.join(baseDirectory, "proof/command"))).sort();

  assert.equal(result.status, "ready");
  assert.equal(result.requestMode, "validate-with-proof-out-ready");
  assert.equal(result.proofOut.status, "ready");
  assert.deepEqual(entries, ["vihs-validation-issue.md", "vihs-validation-proof.json"]);
  assert.equal(result.proofOut.files.proofJson.fileName, "vihs-validation-proof.json");
  assert.equal(result.proofOut.files.issueMarkdown.fileName, "vihs-validation-issue.md");
  assert.deepEqual(result.copyableGuidance, ["vihs --validate --proof-out proof/command"]);
});

test("T014 omitting --proof-out avoids file writes", async () => {
  const calls = [];
  const result = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    fileSystem: failIfCalledFileSystem(calls)
  });

  assert.equal(result.status, "ready");
  assert.equal(result.requestMode, "validate-only");
  assert.equal(result.proofOut, null);
  assert.equal(result.artifactWrites, false);
  assert.equal(calls.length, 0);
});

test("T015 unsupported proof-out targets and I/O failures fail closed without hidden success", async () => {
  const calls = [];
  const unsupported = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "/absolute/proof",
    fileSystem: failIfCalledFileSystem(calls)
  });
  const ioFailure = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "proof/io-failure",
    fileSystem: {
      async mkdir() {},
      async writeFile(target) {
        if (path.basename(target) === "vihs-validation-issue.md") {
          const error = new Error("write denied");
          error.code = "EACCES";
          throw error;
        }
      }
    }
  });

  assert.equal(unsupported.status, "blocked");
  assert.equal(unsupported.blockedReason, "unsupported-proof-out-target");
  assert.equal(unsupported.partialWrite, false);
  assert.equal(unsupported.artifactWrites, false);
  assert.deepEqual(unsupported.copyableGuidance, ["vihs --validate --proof-out <dir>"]);
  assert.equal(unsupported.copyableGuidance.join(" ").includes("/absolute/proof"), false);
  assert.equal(calls.length, 0);
  assert.equal(ioFailure.status, "blocked");
  assert.equal(ioFailure.blockedReason, "proof-out-file-emission-failed");
  assert.equal(ioFailure.partialWrite, true);
  assert.equal(ioFailure.artifactWrites, true);
});

test("T016 returns deterministic copyable non-interactive guidance", async () => {
  const first = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection()
  });
  const second = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection()
  });

  assert.deepEqual(first.guidance, second.guidance);
  assert.deepEqual(first.copyableGuidance, ["vihs --validate"]);
  assert.equal(first.guidance.nonInteractive, true);
  assert.equal(first.guidance.promptWait, false);
});

test("T017 keeps blocked execution side effects stable and traces requirement IDs", async () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationCommandRequirementIds();
  const result = await createRuntimeSettingsValidationCommandResult({
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    requestMode: "validate-and-run-private-runtime"
  });

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
  assert.equal(result.status, "blocked");
  assert.equal(result.blockedReason, "unsupported-validation-command-request-mode");
  assert.equal(result.blockedSideEffects.runtimeLocator, false);
  assert.equal(result.blockedSideEffects.labviewCli, false);
  assert.equal(result.blockedSideEffects.dockerExecution, false);
  assert.equal(result.blockedSideEffects.sourceCopying, false);
});
