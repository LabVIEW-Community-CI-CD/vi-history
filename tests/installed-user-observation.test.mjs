import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  allInstalledUserObservationRequirementIds,
  createObservationCycle,
  createObservationFact,
  createRoutingDecision
} from "../out/src/installed-user-observation.js";

const sliceId = "installed-user-observation-public-surface-v1";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function idsFromText(path) {
  return [...fs.readFileSync(path, "utf8").matchAll(/\bVHS-(?:SYS-)?REQ-\d+\b/g)].map((match) => match[0]);
}

test("T009 defines an observation-cycle data contract", () => {
  const cycle = createObservationCycle({
    observedOn: "2026-05-17",
    noLaterThanReviewDate: "2026-05-17",
    triggers: [
      { type: "marketplace-publication-closed", summary: "publication decision closed" },
      { type: "repeated-confusion", summary: "first-run setup question repeated" }
    ],
    publicFeedback: [
      { id: "issue-27", source: "github-issue", summary: "installed-user report" }
    ]
  });

  assert.equal(cycle.kind, "installed-user-observation-cycle");
  assert.equal(cycle.due, true);
  assert.deepEqual(cycle.dueReasons, [
    "marketplace-publication-closed",
    "repeated-confusion",
    "public-feedback",
    "no-later-than-review"
  ]);
  assert.equal(cycle.publicFeedback[0].id, "issue-27");
  assert.equal(cycle.releaseProofAccepted, false);
  assert.deepEqual(cycle.requirementIds, ["VHS-REQ-595"]);
});

test("T010 defines an observation-fact classification contract", () => {
  const fact = createObservationFact({
    bucket: "observed",
    sourceType: "public-feedback",
    sourceId: "issue-27",
    summary: "user reported the install path worked"
  });

  assert.equal(fact.kind, "installed-user-observation-fact");
  assert.equal(fact.bucket, "observed");
  assert.equal(fact.sourceType, "public-feedback");
  assert.equal(fact.inputRole, "observation-input");
  assert.equal(fact.releaseProof, false);
  assert.equal(fact.proofStatus, "not-release-proof");

  assert.throws(
    () => createObservationFact({
      bucket: "accepted",
      sourceType: "public-feedback",
      summary: "unsupported bucket"
    }),
    /bucket must be one of observed, deferred, blocked/
  );
});

test("T011 defines routing-decision and SemVer recommendation contracts", () => {
  const confusion = createRoutingDecision({
    reason: "first-run-confusion"
  });
  assert.deepEqual(confusion.routes, ["user-documentation", "video-planning-candidate"]);
  assert.equal(confusion.semverRecommendation, "sustainment-only");
  assert.equal(confusion.releaseProofAccepted, false);

  const docsPatch = createRoutingDecision({
    reason: "public-docs-correction",
    publicFacingDocsCorrection: true,
    requiresPublicSourceUpdate: true
  });
  assert.deepEqual(docsPatch.routes, ["user-documentation"]);
  assert.equal(docsPatch.semverRecommendation, "patch-candidate");

  const informational = createRoutingDecision({ reason: "informational" });
  assert.deepEqual(informational.routes, ["none"]);
  assert.equal(informational.semverRecommendation, "sustainment-only");
});

test("T011 traces observation model IDs to the imported manifest and RTM", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const rtmIds = new Set(idsFromText(`docs/requirements/imports/${sliceId}/rtm.csv`));
  const implementationIds = allInstalledUserObservationRequirementIds();

  assert.deepEqual(implementationIds, [...manifest.importedRequirementIds].sort());
  for (const id of implementationIds) {
    assert.ok(rtmIds.has(id), `${id} must appear in imported RTM`);
  }
});

test("T012 classifies observed, deferred, and blocked fact buckets", () => {
  const observed = createObservationFact({
    bucket: "observed",
    sourceType: "validation-receipt",
    summary: "clean install observation completed"
  });
  const deferred = createObservationFact({
    bucket: "deferred",
    sourceType: "planned-observation",
    summary: "installed-user observation waits for the next review cycle"
  });
  const blocked = createObservationFact({
    bucket: "blocked",
    sourceType: "host-dependency",
    summary: "required installed-user host is unavailable"
  });

  assert.equal(observed.bucket, "observed");
  assert.equal(deferred.bucket, "deferred");
  assert.equal(blocked.bucket, "blocked");
  assert.equal(observed.releaseProof, false);
  assert.equal(deferred.releaseProof, false);
  assert.equal(blocked.releaseProof, false);
});

test("T013 retains public feedback as observation input, not release proof", () => {
  const feedbackFact = createObservationFact({
    bucket: "observed",
    sourceType: "public-feedback",
    sourceId: "issue-27",
    summary: "public user feedback is useful observation input"
  });
  assert.equal(feedbackFact.inputRole, "observation-input");
  assert.equal(feedbackFact.releaseProof, false);
  assert.equal(feedbackFact.proofStatus, "not-release-proof");

  const cycle = createObservationCycle({
    observedOn: "2026-05-17",
    publicFeedback: [{ id: "issue-27" }]
  });
  assert.equal(cycle.due, true);
  assert.deepEqual(cycle.dueReasons, ["public-feedback"]);
  assert.equal(cycle.releaseProofAccepted, false);

  assert.throws(
    () => createObservationFact({
      bucket: "observed",
      sourceType: "public-feedback",
      summary: "attempted release proof",
      releaseProof: true
    }),
    /installed-user observation input is not release proof/
  );
});
