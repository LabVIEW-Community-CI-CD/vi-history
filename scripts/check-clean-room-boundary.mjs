import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const admittedSliceId = "runtime-contract-host-provider-v1";
const admissionPath = path.join(repoRoot, "docs", "requirements", "admissions", `${admittedSliceId}.json`);
const forbidden = [
  "/" + "home/" + "sergio",
  ".co" + "dex",
  "repo-" + "standards-review",
  "VIHS_ASSURANCE_" + "SKILL_ROOT",
  "project-" + "access-token",
  "resolve_local_project_" + "access_token",
  "requirements_quality_" + "check",
  "external_user_information_" + "check",
  "glab " + "auth",
  "GitLab-" + "only",
  "PolyForm Strict " + "License",
  "SEE LICENSE " + "IN LICENSE",
  "vi-history-suite" + ".git"
];
const ignoredDirectories = new Set([".git", "node_modules", "coverage", ".cache", "out", "dist", ".vi-history-suite"]);
const failures = [];

function readJson(fullPath) {
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch {
    return undefined;
  }
}

function hasImplementedFoundationScope() {
  const admission = readJson(admissionPath);
  const completedScope = admission?.completedImplementationScope;
  const iaus = admission?.implementationAdmissionUnits;
  const foundationImplemented = Array.isArray(iaus)
    && iaus.some((iau) => iau?.iauId === "IAU-runtime-contract-foundation-v1" && iau?.state === "implemented");
  return admission?.sliceId === admittedSliceId
    && admission?.implementationSharing === "none"
    && Array.isArray(completedScope)
    && completedScope.includes("T007")
    && completedScope.includes("T011")
    && foundationImplemented;
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    scanFile(fullPath);
  }
}

function scanFile(fullPath) {
  const relativePath = path.relative(repoRoot, fullPath);
  const buffer = fs.readFileSync(fullPath);
  if (buffer.includes(0)) {
    return;
  }

  const text = buffer.toString("utf8");
  for (const token of forbidden) {
    if (text.includes(token)) {
      failures.push(`${relativePath}: contains forbidden public-boundary token ${JSON.stringify(token)}`);
    }
  }
}

walk(repoRoot);

if (fs.existsSync(path.join(repoRoot, "src")) && !hasImplementedFoundationScope()) {
  failures.push("src/: implementation source requires an implemented foundation requirements scope");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Clean-room boundary scan passed.");
