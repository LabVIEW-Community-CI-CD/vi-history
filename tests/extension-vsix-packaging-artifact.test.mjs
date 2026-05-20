import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const sliceId = "extension-vsix-packaging-artifact-v1";
const iauId = "IAU-extension-vsix-packaging-artifact-v1";
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const vscodeIgnore = fs.readFileSync(".vscodeignore", "utf8").split(/\r?\n/).filter(Boolean);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

test("VSIX packaging manifest exposes local artifact fields without publication scripts", () => {
  assert.equal(packageJson.name, "vi-history");
  assert.equal(packageJson.displayName, "VI History");
  assert.equal(packageJson.publisher, "svelderrainruiz");
  assert.equal(packageJson.version, "0.1.0");
  assert.equal(packageJson.private, false);
  assert.equal(packageJson.type, "module");
  assert.equal(packageJson.main, "./out/src/extension.js");
  assert.equal(packageJson.engines?.vscode, "^1.95.0");
  assert.equal(packageJson.scripts?.["package:vsix"], "npm run compile && node scripts/package-vsix.mjs");
  assert.equal(packageJson.scripts?.["inspect:vsix"], "node scripts/inspect-vsix-package.mjs");
  assert.equal(typeof packageJson.devDependencies?.["@vscode/vsce"], "string");

  const allScriptText = JSON.stringify(packageJson.scripts);
  assert.equal(/vsce publish|ovsx|marketplace|release/i.test(allScriptText), false);
});

test("VSIX package keeps command contributions stable", () => {
  assert.deepEqual(new Set(packageJson.activationEvents), new Set([
    "onCommand:labviewViHistory.open",
    "onCommand:labviewViHistory.openDocumentation",
    "onCommand:labviewViHistory.prepareLocalRuntimeSettingsCli"
  ]));
  assert.deepEqual(
    packageJson.contributes.commands.map((command) => [command.command, command.title]),
    [
      ["labviewViHistory.open", "VI History"],
      ["labviewViHistory.openDocumentation", "Open Documentation"],
      ["labviewViHistory.prepareLocalRuntimeSettingsCli", "Prepare Local Runtime Settings CLI"]
    ]
  );
});

test("VSIX ignore rules exclude governance tests scripts caches and generated artifacts", () => {
  for (const expected of [
    ".specify/**",
    "docs/requirements/**",
    "docs/decisions/**",
    "docs/governance/**",
    "docs/development/**",
    "tests/**",
    "scripts/**",
    "src/installed-user-observation.mjs",
    "src/runtime-contracts.mjs",
    "src/runtime-settings-cli.mjs",
    "node_modules/**",
    "dist/**",
    "out/**",
    ".cache/**",
    "*.vsix",
    ".gitignore",
    "AGENTS.md",
    "package-lock.json"
  ]) {
    assert.ok(vscodeIgnore.includes(expected), `${expected} must be excluded from VSIX`);
  }
});

test("VSIX packaging admission records mark only local artifact packaging implemented", () => {
  const manifest = readJson(`docs/requirements/imports/${sliceId}/manifest.json`);
  const admission = readJson(`docs/requirements/admissions/${sliceId}.json`);
  const iau = readJson(`docs/requirements/admissions/${sliceId}/${iauId}.json`);
  const preflight = readJson(`docs/requirements/admissions/${sliceId}/${iauId}-preflight-v1.json`);

  assert.equal(manifest.sliceId, sliceId);
  assert.equal(manifest.contractName, "createExtensionVsixPackagingArtifact");
  assert.equal(manifest.packageArtifact, "dist/vi-history-0.1.0.vsix");
  assert.equal(manifest.marketplacePublication, "out-of-scope");
  assert.equal(admission.state, "implemented");
  assert.equal(admission.issue.number, 137);
  assert.equal(admission.implementationHandoffIssue.number, 136);
  assert.equal(admission.implementationPullRequest.number, 138);
  assert.equal(admission.currentImplementationAdmissionUnit, null);
  assert.deepEqual(admission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014"]);
  assert.equal(iau.iauId, iauId);
  assert.equal(iau.state, "implemented");
  assert.equal(iau.implementationPullRequest.number, 138);
  assert.deepEqual(iau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014"]);
  assert.equal(preflight.status, "pass");
  assert.equal(preflight.implementationStartAllowed, true);
  assert.equal(preflight.marketplacePublication, "out-of-scope");
});
