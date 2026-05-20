import assert from "node:assert/strict";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_FILE_EMISSION_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliValidationProofOutFileEmissionRequirementIds,
  createRuntimeSettingsValidationProofOutAdapter,
  readRuntimeSettingsValidation,
  writeRuntimeSettingsValidationProofOutFiles
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-proof-out-file-emission-v1";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function idsFromText(filePath) {
  return [...fs.readFileSync(filePath, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

function readyValidationFacts() {
  return readRuntimeSettingsValidation({
    settings: {
      "viHistorySuite.runtimeProvider": "host-native",
      "viHistorySuite.labviewVersion": "2026",
      "viHistorySuite.labviewBitness": "64-bit"
    },
    effectiveSettingsTarget: {
      scope: "user",
      identifier: "User/settings.json"
    },
    runtimeOutcome: {
      runtimeValidationOutcome: "ready",
      runtimeProvider: "host-native",
      runtimeEngine: "labview-cli",
      runtimeBlockedReason: null,
      runtimeErrorCode: "VIHS_OK",
      runtimeProofStatus: "ready",
      runtimeImplementationStatus: "implemented"
    }
  });
}

function readyProofOutAdapter(target = "proof/runtime-settings") {
  return createRuntimeSettingsValidationProofOutAdapter({
    proofOut: target,
    validation: readyValidationFacts(),
    environment: {
      NORMAL_FLAG: "public"
    }
  });
}

async function makeTempBase(t) {
  const baseDirectory = await fsp.mkdtemp(path.join(os.tmpdir(), "vi-history-proof-out-"));
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

test("T009 writes exactly the two public validation proof-out files", async (t) => {
  const baseDirectory = await makeTempBase(t);
  const adapter = readyProofOutAdapter();

  const result = await writeRuntimeSettingsValidationProofOutFiles({
    proofOutAdapter: adapter,
    baseDirectory
  });

  const outputDirectory = path.join(baseDirectory, "proof/runtime-settings");
  const entries = (await fsp.readdir(outputDirectory)).sort();

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-validation-proof-out-file-emission-contract");
  assert.deepEqual(entries, ["vihs-validation-issue.md", "vihs-validation-proof.json"]);
  assert.equal(result.files.proofJson.fileName, "vihs-validation-proof.json");
  assert.equal(result.files.issueMarkdown.fileName, "vihs-validation-issue.md");
  assert.equal(result.files.proofJson.relativePath, "proof/runtime-settings/vihs-validation-proof.json");
  assert.equal(result.files.issueMarkdown.relativePath, "proof/runtime-settings/vihs-validation-issue.md");
  assert.equal(result.artifactWrites, true);
  assert.equal(result.partialWrite, false);
});

test("T010 writes deterministic file content from ready adapter payload facts", async (t) => {
  const baseDirectory = await makeTempBase(t);
  const adapter = readyProofOutAdapter("proof/deterministic");

  const result = await writeRuntimeSettingsValidationProofOutFiles({
    proofOutAdapter: adapter,
    baseDirectory
  });

  const proofText = await fsp.readFile(
    path.join(baseDirectory, "proof/deterministic/vihs-validation-proof.json"),
    "utf8"
  );
  const issueText = await fsp.readFile(
    path.join(baseDirectory, "proof/deterministic/vihs-validation-issue.md"),
    "utf8"
  );

  assert.equal(proofText, adapter.artifactFiles.proofJson.text);
  assert.equal(issueText, adapter.artifactFiles.issueMarkdown.text);
  assert.equal(result.files.proofJson.bytes, Buffer.byteLength(proofText, "utf8"));
  assert.equal(result.files.issueMarkdown.bytes, Buffer.byteLength(issueText, "utf8"));
});

test("T011 creates the supported output directory when safe", async (t) => {
  const baseDirectory = await makeTempBase(t);
  const outputDirectory = path.join(baseDirectory, "support/proof");
  const adapter = readyProofOutAdapter("support/proof");

  await assert.rejects(fsp.stat(outputDirectory), { code: "ENOENT" });
  const result = await writeRuntimeSettingsValidationProofOutFiles({
    proofOutAdapter: adapter,
    baseDirectory
  });
  const stats = await fsp.stat(outputDirectory);

  assert.equal(result.status, "ready");
  assert.equal(stats.isDirectory(), true);
  assert.equal(result.directory.identifier, "support/proof");
  assert.equal(result.directory.createdWhenMissing, true);
});

test("T012 missing or unready proof-out adapters fail closed before file writes", async () => {
  const calls = [];
  const missing = await writeRuntimeSettingsValidationProofOutFiles({
    proofOutAdapter: null,
    fileSystem: failIfCalledFileSystem(calls)
  });
  const unreadyAdapter = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "proof-out"
  });
  const unready = await writeRuntimeSettingsValidationProofOutFiles({
    proofOutAdapter: unreadyAdapter,
    fileSystem: failIfCalledFileSystem(calls)
  });

  assert.equal(missing.status, "blocked");
  assert.equal(missing.blockedReason, "missing-ready-proof-out-adapter");
  assert.equal(unready.status, "blocked");
  assert.equal(unready.blockedReason, "missing-validation-proof-facts");
  assert.equal(missing.artifactWrites, false);
  assert.equal(unready.artifactWrites, false);
  assert.equal(calls.length, 0);
});

test("T013 unsupported output targets fail closed before file writes", async () => {
  const calls = [];
  const unsupportedAdapter = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "/absolute/proof",
    validation: readyValidationFacts()
  });

  const result = await writeRuntimeSettingsValidationProofOutFiles({
    proofOutAdapter: unsupportedAdapter,
    fileSystem: failIfCalledFileSystem(calls)
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.blockedReason, "unsupported-proof-out-target");
  assert.equal(result.partialWrite, false);
  assert.equal(result.artifactWrites, false);
  assert.equal(calls.length, 0);
});

test("T014 I/O failures report deterministic failure facts without hidden partial success", async () => {
  const adapter = readyProofOutAdapter("proof/io-failure");
  const calls = [];
  const fileSystem = {
    async mkdir(target, options) {
      calls.push(["mkdir", path.basename(target), options.recursive]);
    },
    async writeFile(target, text, encoding) {
      calls.push(["writeFile", path.basename(target), Buffer.byteLength(text, encoding), encoding]);
      if (path.basename(target) === "vihs-validation-issue.md") {
        const error = new Error("write denied");
        error.code = "EACCES";
        throw error;
      }
    }
  };

  const result = await writeRuntimeSettingsValidationProofOutFiles({
    proofOutAdapter: adapter,
    baseDirectory: ".",
    fileSystem
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.blockedReason, "proof-out-file-emission-failed");
  assert.equal(result.errorCode, "EACCES");
  assert.equal(result.partialWrite, true);
  assert.equal(result.artifactWrites, true);
  assert.equal(result.completedFiles.length, 1);
  assert.equal(result.completedFiles[0].fileName, "vihs-validation-proof.json");
  assert.equal(result.failedFile.fileName, "vihs-validation-issue.md");
  assert.deepEqual(
    calls.map((call) => call[0]),
    ["mkdir", "writeFile", "writeFile"]
  );
});

test("T015 traces file-emission IDs and keeps runtime side effects blocked", async () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationProofOutFileEmissionRequirementIds();
  const adapter = readyProofOutAdapter("proof/trace");
  const result = await writeRuntimeSettingsValidationProofOutFiles({
    proofOutAdapter: adapter,
    fileSystem: {
      async mkdir() {},
      async writeFile() {}
    }
  });

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
  assert.deepEqual(result.blockedSideEffects, RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_FILE_EMISSION_BLOCKED_SIDE_EFFECTS);
  assert.equal(result.blockedSideEffects.runtimeValidation, false);
  assert.equal(result.blockedSideEffects.validationFactGeneration, false);
  assert.equal(result.blockedSideEffects.compareExecution, false);
  assert.equal(result.blockedSideEffects.labviewCli, false);
  assert.equal(result.blockedSideEffects.dockerExecution, false);
  assert.equal(result.blockedSideEffects.dockerOrchestration, false);
  assert.equal(result.blockedSideEffects.liveTerminalProof, false);
  assert.equal(result.blockedSideEffects.packageBinPublication, false);
  assert.equal(result.blockedSideEffects.launcherProfileMutation, false);
  assert.equal(result.blockedSideEffects.marketplace, false);
  assert.equal(result.blockedSideEffects.sourceCopying, false);
  assert.equal(result.blockedSideEffects.extraFileSystemWrites, false);
});
