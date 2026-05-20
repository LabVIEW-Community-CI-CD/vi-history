// ============================================================================
// Type Definitions
// ============================================================================

export type ObservationTriggerType =
  | "marketplace-publication-closed"
  | "public-feedback"
  | "repeated-confusion"
  | "video-planning-evidence"
  | "semver-candidate-opening"
  | "no-later-than-review";

export type ObservationFactBucket = "observed" | "deferred" | "blocked";

export type ObservationSourceType =
  | "public-feedback"
  | "validation-receipt"
  | "compare-receipt"
  | "user-review-note"
  | "planned-observation"
  | "host-dependency"
  | "proof-gate"
  | "release-change"
  | "repeated-confusion"
  | "video-planning-evidence"
  | "semver-candidate";

export type RoutingTarget =
  | "user-documentation"
  | "bundled-documentation"
  | "video-planning-candidate"
  | "future-issue"
  | "proof-gate"
  | "none";

export interface ObservationFact {
  readonly kind: "observation-fact";
  readonly factId: string;
  readonly bucket: ObservationFactBucket;
  readonly sourceType: ObservationSourceType;
  readonly routingTarget: RoutingTarget;
  readonly description: string;
  readonly tags: readonly string[];
  readonly observedAt: string;
  readonly notes: readonly string[];
  readonly requirementIds: readonly string[];
}

export interface ObservationTrigger {
  readonly kind: "observation-trigger";
  readonly triggerId: string;
  readonly triggerType: ObservationTriggerType;
  readonly description: string;
  readonly triggeredAt: string;
  readonly tags: readonly string[];
  readonly notes: readonly string[];
  readonly requirementIds: readonly string[];
}

export interface ObservationModel {
  readonly kind: "observation-model";
  readonly modelId: string;
  readonly facts: readonly ObservationFact[];
  readonly triggers: readonly ObservationTrigger[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly notes: readonly string[];
  readonly requirementIds: readonly string[];
}

// ============================================================================
// Requirement Constants
// ============================================================================

export const INSTALLED_USER_OBSERVATION_REQUIREMENTS = {
  observationModel: ["VHS-REQ-595"] as const
} as const;

export const OBSERVATION_TRIGGER_TYPES = [
  "marketplace-publication-closed",
  "public-feedback",
  "repeated-confusion",
  "video-planning-evidence",
  "semver-candidate-opening",
  "no-later-than-review"
] as const;

export const OBSERVATION_FACT_BUCKETS = [
  "observed",
  "deferred",
  "blocked"
] as const;

export const OBSERVATION_SOURCE_TYPES = [
  "public-feedback",
  "validation-receipt",
  "compare-receipt",
  "user-review-note",
  "planned-observation",
  "host-dependency",
  "proof-gate",
  "release-change",
  "repeated-confusion",
  "video-planning-evidence",
  "semver-candidate"
] as const;

export const ROUTING_TARGETS = [
  "user-documentation",
  "bundled-documentation",
  "video-planning-candidate",
  "future-issue",
  "proof-gate",
  "none"
] as const;

// ============================================================================
// Internal Constants and Utilities
// ============================================================================

const TRIGGERS = new Set<ObservationTriggerType>(OBSERVATION_TRIGGER_TYPES);
const FACT_BUCKETS = new Set<ObservationFactBucket>(OBSERVATION_FACT_BUCKETS);
const SOURCE_TYPES = new Set<ObservationSourceType>(OBSERVATION_SOURCE_TYPES);
const ROUTES = new Set<RoutingTarget>(ROUTING_TARGETS);

function requireValue<T>(value: T | undefined | null, label: string): T {
  if (value === undefined || value === null || value === "") {
    throw new Error(`${label} is required`);
  }
  return value;
}

function requireOneOf<T>(value: T, allowed: Set<T>, label: string): T {
  requireValue(value, label);
  if (!allowed.has(value)) {
    throw new Error(`${label} must be one of ${Array.from(allowed).join(", ")}`);
  }
  return value;
}

function normalizeArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function freezeRecord<T extends object>(record: T): Readonly<T> {
  for (const value of Object.values(record)) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      freezeRecord(value as object);
    }
  }
  return Object.freeze(record);
}

function normalizeDate(value: unknown, label: string): string {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${label} must be an ISO-compatible date`);
  }
  return date.toISOString().slice(0, 10);
}

interface TriggerInput {
  type?: ObservationTriggerType;
  source?: string;
  summary?: string;
  publicFeedbackId?: string;
}

interface NormalizedTrigger {
  readonly type: ObservationTriggerType;
  readonly source: string | null;
  readonly summary: string;
  readonly publicFeedbackId: string | null;
}

function normalizeTrigger(input: string | TriggerInput): NormalizedTrigger {
  const trigger = typeof input === "string" 
    ? { type: input as ObservationTriggerType } 
    : { ...requireValue(input, "trigger") };
  const type = requireOneOf(trigger.type as ObservationTriggerType, TRIGGERS, "trigger.type");

  return freezeRecord({
    type,
    source: trigger.source ? String(trigger.source) : null,
    summary: trigger.summary ? String(trigger.summary) : "",
    publicFeedbackId: trigger.publicFeedbackId ? String(trigger.publicFeedbackId) : null
  });
}

function isNoLaterThanDue(reviewDate: string | null | undefined, observedOn: string): boolean {
  if (!reviewDate) {
    return false;
  }
  return new Date(`${observedOn}T00:00:00.000Z`).getTime() >= new Date(`${reviewDate}T00:00:00.000Z`).getTime();
}

function routeForReason(reason: string): string[] {
  switch (reason) {
    case "first-run-confusion":
      return ["user-documentation", "video-planning-candidate"];
    case "bundled-docs-confusion":
      return ["bundled-documentation"];
    case "public-docs-correction":
      return ["user-documentation"];
    case "installed-user-defect":
      return ["future-issue"];
    case "proof-gap":
      return ["proof-gate"];
    case "future-issue":
      return ["future-issue"];
    default:
      return ["none"];
  }
}

interface PublishedUpdateInput {
  installedUserDefect?: boolean;
  publicFacingDocsCorrection?: boolean;
  proofGap?: boolean;
  requiresPublishedPackage?: boolean;
  requiresPublicSourceUpdate?: boolean;
}

function requiresPublishedUpdate(input: PublishedUpdateInput = {}): boolean {
  return input.installedUserDefect === true ||
    input.publicFacingDocsCorrection === true ||
    input.proofGap === true ||
    input.requiresPublishedPackage === true ||
    input.requiresPublicSourceUpdate === true;
}

// ============================================================================
// Exported Factory Functions
// ============================================================================

export interface ObservationCycleInput {
  observedOn?: string;
  currentDate?: string;
  trigger?: string | TriggerInput;
  triggers?: (string | TriggerInput)[];
  noLaterThanReviewDate?: string;
  reason?: string;
  confusionSeverity?: string;
  notes?: string | string[];
  publicFeedback?: unknown[];
}

export interface PublicFeedbackItem {
  readonly id: string;
  readonly source: string;
  readonly summary: string;
}

export interface ObservationCycle {
  readonly kind: "installed-user-observation-cycle";
  readonly observedOn: string;
  readonly noLaterThanReviewDate: string;
  readonly triggers: readonly NormalizedTrigger[];
  readonly publicFeedback: readonly PublicFeedbackItem[];
  readonly due: boolean;
  readonly dueReasons: readonly string[];
  readonly releaseProofAccepted: boolean;
  readonly requirementIds: readonly string[];
}

export function createObservationCycle(input: ObservationCycleInput = {}): ObservationCycle {
  const observedOn = normalizeDate(requireValue(input.observedOn ?? input.currentDate, "observedOn"), "observedOn");
  const noLaterThanReviewDate = normalizeDate(input.noLaterThanReviewDate, "noLaterThanReviewDate");
  const triggers = normalizeArray(input.triggers).map(normalizeTrigger);
  const publicFeedback = normalizeArray(input.publicFeedback).map((feedback: unknown) =>
    freezeRecord({
      id: String(requireValue((feedback as PublicFeedbackItem)?.id ?? feedback, "publicFeedback.id")),
      source: (feedback as PublicFeedbackItem)?.source ? String((feedback as PublicFeedbackItem).source) : "public-feedback",
      summary: (feedback as PublicFeedbackItem)?.summary ? String((feedback as PublicFeedbackItem).summary) : ""
    })
  );
  const dueByDate = isNoLaterThanDue(noLaterThanReviewDate, observedOn);
  const triggerDueReasons = triggers.map((trigger) => trigger.type);
  const publicFeedbackDueReasons = publicFeedback.length > 0 ? ["public-feedback"] : [];
  const dueReasons = [...new Set([
    ...triggerDueReasons,
    ...publicFeedbackDueReasons,
    ...(dueByDate ? ["no-later-than-review"] : [])
  ])];

  return freezeRecord({
    kind: "installed-user-observation-cycle" as const,
    observedOn,
    noLaterThanReviewDate,
    triggers,
    publicFeedback,
    due: dueReasons.length > 0,
    dueReasons,
    releaseProofAccepted: false,
    requirementIds: [...INSTALLED_USER_OBSERVATION_REQUIREMENTS.observationModel]
  });
}

export interface ObservationFactInput {
  sourceType: ObservationSourceType;
  bucket: ObservationFactBucket;
  summary: string;
  sourceId?: string;
  followUp?: string;
  releaseProof?: boolean;
}

export interface ObservationFactResult {
  readonly kind: "installed-user-observation-fact";
  readonly bucket: ObservationFactBucket;
  readonly sourceType: ObservationSourceType;
  readonly summary: string;
  readonly sourceId: string | null;
  readonly followUp: string | null;
  readonly inputRole: string;
  readonly releaseProof: boolean;
  readonly proofStatus: string;
  readonly requirementIds: readonly string[];
}

export function createObservationFact(input: ObservationFactInput): ObservationFactResult {
  const sourceType = requireOneOf(input.sourceType, SOURCE_TYPES, "sourceType");
  const bucket = requireOneOf(input.bucket, FACT_BUCKETS, "bucket");

  if (input.releaseProof === true) {
    throw new Error("installed-user observation input is not release proof");
  }

  return freezeRecord({
    kind: "installed-user-observation-fact" as const,
    bucket,
    sourceType,
    summary: String(requireValue(input.summary, "summary")),
    sourceId: input.sourceId ? String(input.sourceId) : null,
    followUp: input.followUp ? String(input.followUp) : null,
    inputRole: "observation-input",
    releaseProof: false,
    proofStatus: "not-release-proof",
    requirementIds: [...INSTALLED_USER_OBSERVATION_REQUIREMENTS.observationModel]
  });
}

export interface RoutingDecisionInput extends PublishedUpdateInput {
  reason?: string;
  routes?: RoutingTarget[];
  notes?: string | string[];
}

export interface RoutingDecisionResult {
  readonly kind: "installed-user-observation-routing-decision";
  readonly reason: string;
  readonly routes: readonly RoutingTarget[];
  readonly semverRecommendation: string;
  readonly releaseProofAccepted: boolean;
  readonly notes: readonly string[];
  readonly requirementIds: readonly string[];
}

export function createRoutingDecision(input: RoutingDecisionInput = {}): RoutingDecisionResult {
  const reason = String(input.reason ?? "informational");
  const routes = normalizeArray(input.routes ?? routeForReason(reason) as RoutingTarget[])
    .map((route) => requireOneOf(route as RoutingTarget, ROUTES, "route"));
  const semverRecommendation = requiresPublishedUpdate(input) ? "patch-candidate" : "sustainment-only";

  return freezeRecord({
    kind: "installed-user-observation-routing-decision" as const,
    reason,
    routes,
    semverRecommendation,
    releaseProofAccepted: false,
    notes: normalizeArray(input.notes).map(String),
    requirementIds: [...INSTALLED_USER_OBSERVATION_REQUIREMENTS.observationModel]
  });
}

export function allInstalledUserObservationRequirementIds(): readonly string[] {
  return Object.freeze(
    Object.values(INSTALLED_USER_OBSERVATION_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}
