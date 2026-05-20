import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_BLOCKED_SIDE_EFFECTS,
  allRuntimeSettingsCliValidationProofOutRequirementIds,
  createRuntimeSettingsValidationProofArtifact,
  createRuntimeSettingsValidationProofOutAdapter,
  readRuntimeSettingsValidation
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-proof-out-v1";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function idsFromText(path) {
  return [...fs.readFileSync(path, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
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

test("T009 resolves --proof-out target facts to deterministic artifact file facts", () => {
  const result = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "proof/runtime-settings",
    validation: readyValidationFacts()
  });

  assert.equal(result.status, "ready");
  assert.equal(result.type, "runtime-settings-cli-validation-proof-out-adapter-contract");
  assert.equal(result.command, "vihs --validate --proof-out proof/runtime-settings");
  assert.deepEqual(result.request, {
    command: "vihs --validate --proof-out proof/runtime-settings",
    option: "--proof-out",
    proofOut: true,
    proofOutTarget: {
      kind: "proof-out-directory",
      identifier: "proof/runtime-settings",
      publicSafe: true,
      artifactPaths: {
        proofJson: "proof/runtime-settings/vihs-validation-proof.json",
        issueMarkdown: "proof/runtime-settings/vihs-validation-issue.md"
      }
    }
  });
  assert.equal(result.artifactFiles.proofJson.fileName, "vihs-validation-proof.json");
  assert.equal(result.artifactFiles.issueMarkdown.fileName, "vihs-validation-issue.md");
  assert.equal(result.artifactFiles.proofJson.relativePath, "proof/runtime-settings/vihs-validation-proof.json");
  assert.equal(result.artifactFiles.issueMarkdown.relativePath, "proof/runtime-settings/vihs-validation-issue.md");
  assert.equal(result.artifactFiles.proofJson.writeBound, false);
  assert.equal(result.artifactFiles.issueMarkdown.writeBound, false);
  assert.equal(result.artifactWrites, false);
});

test("T010 emits deterministic proof JSON and issue Markdown from the proof-artifact contract", () => {
  const proofArtifact = createRuntimeSettingsValidationProofArtifact({
    validation: readyValidationFacts(),
    environment: {
      NORMAL_FLAG: "public"
    }
  });
  const first = createRuntimeSettingsValidationProofOutAdapter({
    proofOutTarget: { identifier: "proof-out" },
    proofArtifact
  });
  const second = createRuntimeSettingsValidationProofOutAdapter({
    proofOutTarget: { identifier: "proof-out" },
    proofArtifact
  });

  assert.deepEqual(first.proofJson, proofArtifact.proofJson);
  assert.equal(first.issueMarkdown, proofArtifact.issueBody);
  assert.equal(first.artifactFiles.proofJson.text, second.artifactFiles.proofJson.text);
  assert.equal(first.artifactFiles.issueMarkdown.text, second.artifactFiles.issueMarkdown.text);
  assert.ok(first.artifactFiles.proofJson.text.includes("\"schema\": \"vi-history/runtime-settings-validation-proof@v1\""));
  assert.ok(first.artifactFiles.issueMarkdown.text.includes("- Runtime error code: VIHS_OK"));
  assert.ok(first.artifactFiles.issueMarkdown.text.includes("- Environment NORMAL_FLAG: public"));
});

test("T011 missing validation or proof facts fail closed without artifact writes", () => {
  const result = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "proof-out"
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.blockedReason, "missing-validation-proof-facts");
  assert.deepEqual(result.artifactFiles, {});
  assert.equal(result.proofJson, null);
  assert.equal(result.issueMarkdown, null);
  assert.equal(result.partialWrite, false);
  assert.equal(result.artifactWrites, false);
  assert.equal(result.promptWait, false);
});

test("T012 unsupported proof-out targets fail closed without artifact writes", () => {
  const absoluteTarget = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "/absolute/proof",
    validation: readyValidationFacts()
  });
  const privateTarget = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "proof/private-marker",
    validation: readyValidationFacts()
  });

  for (const result of [absoluteTarget, privateTarget]) {
    assert.equal(result.status, "blocked");
    assert.equal(result.blockedReason, "unsupported-proof-out-target");
    assert.deepEqual(result.artifactFiles, {});
    assert.equal(result.artifactWrites, false);
    assert.equal(result.partialWrite, false);
    assert.deepEqual(result.copyableGuidance, ["vihs --validate --proof-out <dir>"]);
  }
});

test("T013 returns copyable non-interactive guidance and keeps side effects blocked", () => {
  const result = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: "support-proof",
    validation: readyValidationFacts(),
    terminalSession: { isTTY: false }
  });

  assert.equal(result.guidance.nonInteractive, true);
  assert.equal(result.guidance.promptWait, false);
  assert.equal(result.promptWait, false);
  assert.deepEqual(result.copyableGuidance, ["vihs --validate --proof-out support-proof"]);
  assert.deepEqual(result.blockedSideEffects, RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_BLOCKED_SIDE_EFFECTS);
  assert.equal(result.blockedSideEffects.runtimeValidation, false);
  assert.equal(result.blockedSideEffects.compareExecution, false);
  assert.equal(result.blockedSideEffects.labviewCli, false);
  assert.equal(result.blockedSideEffects.dockerExecution, false);
  assert.equal(result.blockedSideEffects.dockerOrchestration, false);
  assert.equal(result.blockedSideEffects.liveTerminalProof, false);
  assert.equal(result.blockedSideEffects.packageBinPublication, false);
  assert.equal(result.blockedSideEffects.launcherProfileMutation, false);
  assert.equal(result.blockedSideEffects.marketplace, false);
  assert.equal(result.blockedSideEffects.sourceCopying, false);
  assert.equal(result.blockedSideEffects.fileSystemWrites, false);
});

test("T014 traces validation proof-out adapter IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationProofOutRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});
