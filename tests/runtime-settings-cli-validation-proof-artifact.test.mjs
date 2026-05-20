import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  allRuntimeSettingsCliValidationProofRequirementIds,
  createRuntimeSettingsValidationProofArtifact,
  createRuntimeSettingsValidationProofIssueBody,
  readRuntimeSettingsValidation
} from "../out/src/runtime-settings-cli.js";

const sliceId = "runtime-settings-cli-validation-proof-v1";

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

test("T009 retains validation readback facts as structured proof JSON without execution side effects", () => {
  const artifact = createRuntimeSettingsValidationProofArtifact({
    validation: readyValidationFacts(),
    environment: {
      CI: true
    }
  });

  assert.equal(artifact.status, "ready");
  assert.equal(artifact.type, "runtime-settings-cli-validation-proof-artifact-contract");
  assert.equal(artifact.proofJson.schema, "vi-history/runtime-settings-validation-proof@v1");
  assert.equal(artifact.proofJson.targetAuthority, "svelderrainruiz/vi-history");
  assert.equal(artifact.proofJson.command, "vihs --validate --proof-out");
  assert.deepEqual(artifact.proofJson.validation.persistedSettings, {
    runtimeProvider: "host-native",
    labviewVersion: "2026",
    labviewBitness: "64-bit"
  });
  assert.equal(artifact.proofJson.validation.runtime.runtimeErrorCode, "VIHS_OK");
  assert.equal(artifact.proofJson.validation.runtime.runtimeProofStatus, "ready");
  assert.equal(artifact.proofJson.validation.runtime.runtimeImplementationStatus, "implemented");
  assert.deepEqual(artifact.blockedSideEffects, {
    settingsMutation: false,
    interactiveSelection: false,
    runtimeValidation: false,
    compareExecution: false,
    labviewCli: false,
    docker: false,
    liveSessionProof: false,
    packaging: false,
    marketplace: false
  });

  const missingFacts = createRuntimeSettingsValidationProofArtifact({});
  assert.equal(missingFacts.status, "blocked");
  assert.equal(missingFacts.blockedReason, "missing-validation-proof-facts");
  assert.equal(
    missingFacts.proofJson.validation.runtime.runtimeErrorCode,
    "VIHS_E_MISSING_VALIDATION_PROOF_FACTS"
  );
});

test("T010 redacts secret-like environment values from public proof output", () => {
  const artifact = createRuntimeSettingsValidationProofArtifact({
    validation: readyValidationFacts(),
    environment: {
      ACCESS_PASSWORD: "open-sesame",
      NORMAL_FLAG: "public",
      SERVICE_URL: "https://example.invalid"
    }
  });

  assert.equal(artifact.proofJson.environmentFacts.ACCESS_PASSWORD, "[REDACTED]");
  assert.equal(artifact.proofJson.environmentFacts.NORMAL_FLAG, "public");
  assert.equal(artifact.proofJson.environmentFacts.SERVICE_URL, "https://example.invalid");
  assert.ok(artifact.issueBody.includes("- Environment ACCESS_PASSWORD: [REDACTED]"));
  assert.ok(!artifact.issueBody.includes("open-sesame"));
});

test("T011 creates deterministic issue-body content for the MIT public authority", () => {
  const input = {
    validation: readyValidationFacts(),
    environment: {
      NORMAL_FLAG: "public",
      CI: true
    }
  };
  const first = createRuntimeSettingsValidationProofArtifact(input);
  const second = createRuntimeSettingsValidationProofArtifact(input);

  assert.equal(first.issueBody, second.issueBody);
  assert.equal(first.issueBody, createRuntimeSettingsValidationProofIssueBody(first.proofJson));
  assert.ok(first.issueBody.includes("- Repository: svelderrainruiz/vi-history"));
  assert.ok(first.issueBody.includes("- Command: vihs --validate --proof-out"));
  assert.ok(first.issueBody.includes("- Runtime error code: VIHS_OK"));
  assert.ok(first.issueBody.includes("- Environment CI: true"));
  assert.ok(first.issueBody.indexOf("- Environment CI: true") < first.issueBody.indexOf("- Environment NORMAL_FLAG: public"));
});

test("T012 traces validation proof artifact IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allRuntimeSettingsCliValidationProofRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});
