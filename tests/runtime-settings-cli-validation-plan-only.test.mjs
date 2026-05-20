import assert from "node:assert/strict";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_COMMAND_BLOCKED_SIDE_EFFECTS,
  createRuntimeSettingsValidationCommandResult
} from "../out/src/runtime-settings-cli.js";

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

function failIfCalledFileSystem(calls) {
  return {
    async mkdir(...args) {
      calls.push(["mkdir", ...args]);
      throw new Error("mkdir should not be called for validate-plan-only");
    },
    async writeFile(...args) {
      calls.push(["writeFile", ...args]);
      throw new Error("writeFile should not be called for validate-plan-only");
    }
  };
}

test("T009 validate-plan-only is accepted only as a bounded validation request mode", async () => {
  const result = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "proof/plan-only"
  });
  const unsupported = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-and-run-private-runtime",
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "proof/plan-only"
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-validation-command-contract");
  assert.equal(result.command, "vihs --validate");
  assert.equal(result.requestMode, "validate-plan-only");
  assert.equal(result.validationStatus, "ready");
  assert.equal(result.proofOut.status, "ready");
  assert.equal(result.proofOut.type, "runtime-settings-cli-validation-proof-out-adapter-contract");
  assert.equal(unsupported.status, "blocked");
  assert.equal(unsupported.blockedReason, "unsupported-validation-command-request-mode");
});

test("T010 validate-plan-only requires ready validation facts and a supported proof-out target", async () => {
  const missingTarget = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection()
  });
  const missingRuntimeSelection = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    proofOut: "proof/plan-only"
  });
  const unsupportedTarget = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "/absolute/proof"
  });

  assert.equal(missingTarget.status, "blocked");
  assert.equal(missingTarget.blockedReason, "missing-proof-out-target");
  assert.equal(missingRuntimeSelection.status, "blocked");
  assert.equal(missingRuntimeSelection.blockedReason, "missing-runtime-selection-facts");
  assert.equal(unsupportedTarget.status, "blocked");
  assert.equal(unsupportedTarget.blockedReason, "unsupported-proof-out-target");
  assert.equal(unsupportedTarget.proofOut.status, "blocked");
  assert.equal(unsupportedTarget.artifactWrites, false);
});

test("T011 validate-plan-only composes through proof artifact and proof-out adapter without file emission", async () => {
  const calls = [];
  const result = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "proof/composed",
    environment: {
      NORMAL_FLAG: "public"
    },
    fileSystem: failIfCalledFileSystem(calls)
  });

  assert.equal(result.status, "ready");
  assert.equal(result.proofOut.proofArtifactStatus, "ready");
  assert.equal(result.proofOut.proofJson.command, "vihs --validate --proof-out");
  assert.equal(result.proofOut.proofJson.validation.status, "ready");
  assert.ok(result.proofOut.issueMarkdown.includes("- Environment NORMAL_FLAG: public"));
  assert.equal(result.proofOut.writeBound, false);
  assert.equal(result.artifactWrites, false);
  assert.equal(result.proofOut.artifactWrites, false);
  assert.equal(result.partialWrite, false);
  assert.equal(calls.length, 0);
});

test("T012 validate-plan-only returns exactly the planned proof JSON and issue Markdown file facts", async () => {
  const result = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "proof/artifacts"
  });
  const artifactFiles = result.proofOut.artifactFiles;

  assert.deepEqual(Object.keys(artifactFiles).sort(), ["issueMarkdown", "proofJson"]);
  assert.equal(artifactFiles.proofJson.fileName, "vihs-validation-proof.json");
  assert.equal(artifactFiles.issueMarkdown.fileName, "vihs-validation-issue.md");
  assert.equal(artifactFiles.proofJson.relativePath, "proof/artifacts/vihs-validation-proof.json");
  assert.equal(artifactFiles.issueMarkdown.relativePath, "proof/artifacts/vihs-validation-issue.md");
  assert.equal(artifactFiles.proofJson.writeBound, false);
  assert.equal(artifactFiles.issueMarkdown.writeBound, false);
});

test("T013 validate-plan-only does not call filesystem adapters or write proof files", async () => {
  const calls = [];
  const result = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "proof/no-writes",
    fileSystem: failIfCalledFileSystem(calls)
  });

  assert.equal(result.status, "ready");
  assert.equal(result.proofOut.artifactWrites, false);
  assert.equal(result.artifactWrites, false);
  assert.equal(result.partialWrite, false);
  assert.equal(calls.length, 0);
});

test("T014 validate-plan-only fails closed for missing validation facts and malformed inputs", async () => {
  const missingSettings = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "proof/missing-settings"
  });
  const malformedSettings = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settingsContent: "[\"not\", \"settings\"]",
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "proof/malformed-settings"
  });

  assert.equal(missingSettings.status, "blocked");
  assert.equal(missingSettings.blockedReason, "missing-persisted-runtime-settings");
  assert.equal(missingSettings.validationStatus, "blocked");
  assert.equal(malformedSettings.status, "blocked");
  assert.equal(malformedSettings.blockedReason, "unsupported-settings-target-shape");
  assert.equal(malformedSettings.validationStatus, "blocked");
  assert.equal(malformedSettings.artifactWrites, false);
  assert.equal(malformedSettings.partialWrite, false);
});

test("T015 validate-plan-only reports deterministic guidance and blocked side-effect facts", async () => {
  const first = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "proof/guidance"
  });
  const second = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "proof/guidance"
  });

  assert.deepEqual(first.guidance, second.guidance);
  assert.deepEqual(first.copyableGuidance, ["vihs --validate --proof-out proof/guidance"]);
  assert.equal(first.guidance.nonInteractive, true);
  assert.equal(first.guidance.promptWait, false);
  assert.deepEqual(first.blockedSideEffects, RUNTIME_SETTINGS_VALIDATION_COMMAND_BLOCKED_SIDE_EFFECTS);
  assert.equal(first.blockedSideEffects.fileSystemWrites, false);
  assert.equal(first.blockedSideEffects.runtimeLocator, false);
  assert.equal(first.blockedSideEffects.osInspection, false);
  assert.equal(first.blockedSideEffects.labviewCli, false);
  assert.equal(first.blockedSideEffects.dockerExecution, false);
  assert.equal(first.blockedSideEffects.marketplace, false);
  assert.equal(first.proofOut.blockedSideEffects.fileSystemWrites, false);
});

test("T016 validate-plan-only stops at the proof-out adapter instead of emission results", async () => {
  const result = await createRuntimeSettingsValidationCommandResult({
    requestMode: "validate-plan-only",
    settings: readySettings(),
    runtimeSelection: readyRuntimeSelection(),
    proofOut: "proof/adapter-boundary"
  });

  assert.equal(result.status, "ready");
  assert.equal(result.proofOut.type, "runtime-settings-cli-validation-proof-out-adapter-contract");
  assert.equal(result.proofOut.directory, undefined);
  assert.equal(result.proofOut.writeResults, undefined);
  assert.equal(result.proofOut.files, undefined);
});
