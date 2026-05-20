import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const packagePath = path.join("dist", `${packageJson.name}-${packageJson.version}.vsix`);
const failures = [];

if (!fs.existsSync(packagePath)) {
  failures.push(`${packagePath}: missing; run npm run package:vsix first`);
} else {
  const entries = execFileSync("unzip", ["-Z1", packagePath], { encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean)
    .sort();
  const entrySet = new Set(entries);

  const requiredEntries = [
    "extension/package.json",
    "extension/readme.md",
    "extension/LICENSE.txt",
    "extension/out/src/extension.js",
    "extension/docs/installed-user/bundled-docs-manifest.json",
    "extension/docs/installed-user/getting-started.md"
  ];

  for (const entry of requiredEntries) {
    if (!entrySet.has(entry)) {
      failures.push(`${packagePath}: missing required package entry ${entry}`);
    }
  }

  const forbiddenPrefixes = [
    "extension/.agents/",
    "extension/.cache/",
    "extension/.github/",
    "extension/.git/",
    "extension/.specify/",
    "extension/coverage/",
    "extension/dist/",
    "extension/docs/decisions/",
    "extension/docs/development/",
    "extension/docs/governance/",
    "extension/docs/requirements/",
    "extension/node_modules/",
    "extension/scripts/",
    "extension/tests/",
    "extension/src/"
  ];
  const forbiddenExactEntries = new Set([
    "extension/.gitignore",
    "extension/.vscodeignore",
    "extension/AGENTS.md",
    "extension/package-lock.json",
    "extension/src/installed-user-observation.mjs",
    "extension/src/runtime-contracts.mjs",
    "extension/out/src/runtime-settings-cli.js"
  ]);

  for (const entry of entries) {
    if (forbiddenExactEntries.has(entry) || forbiddenPrefixes.some((prefix) => entry.startsWith(prefix))) {
      failures.push(`${packagePath}: forbidden package entry ${entry}`);
    }
    if (entry.endsWith(".vsix") || entry.endsWith(".log")) {
      failures.push(`${packagePath}: forbidden generated artifact entry ${entry}`);
    }
  }

  const packedPackageJson = execFileSync("unzip", ["-p", packagePath, "extension/package.json"], { encoding: "utf8" });
  const packedManifest = JSON.parse(packedPackageJson);
  const scriptText = JSON.stringify(packedManifest.scripts ?? {});
  if (/publish|ovsx|marketplace|release/i.test(scriptText)) {
    failures.push("extension/package.json: package scripts must not publish, release, or target a Marketplace");
  }
}

const localPackageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const localScripts = JSON.stringify(localPackageJson.scripts ?? {});
if (/vsce publish|ovsx|marketplace|release/i.test(localScripts)) {
  failures.push("package.json: local scripts must not publish, release, or target a Marketplace");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`VSIX package inspection passed: ${packagePath}`);
