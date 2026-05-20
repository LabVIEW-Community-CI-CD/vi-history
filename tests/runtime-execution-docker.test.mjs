import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  DOCKER_EXECUTION_BLOCKED_SIDE_EFFECTS,
  DOCKER_EXECUTION_REQUIREMENTS,
  allDockerExecutionRequirementIds,
  createMockDockerExecution
} from "../out/src/runtime-execution-docker.js";

import {
  createDockerComparisonReportCommand
} from "../out/src/runtime-execution-contracts.js";

const sliceId = "runtime-execution-docker-labviewcli-v1";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function idsFromText(filePath) {
  return [...fs.readFileSync(filePath, "utf8").matchAll(/\bVHS-REQ-\d+\b/g)].map((match) => match[0]);
}

function validCommandFacts() {
  return createDockerComparisonReportCommand({
    viPath1: "/workspace/base.vi",
    viPath2: "/workspace/compare.vi",
    outputPath: "/workspace/output.html",
    workspacePath: "/home/user/project"
  });
}

// TEST-UNIT-DOCKEREXEC-001: Hardcoded Docker image
test("T009 Docker spawn uses hardcoded nationalinstruments/labview:latest-linux image", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockDockerExecution({
    commandFacts,
    exitCode: 0
  });

  assert.equal(outcome.dockerImage, "nationalinstruments/labview:latest-linux");
});

// TEST-UNIT-DOCKEREXEC-002: Docker run --rm command
test("T010 Docker spawn includes docker run --rm command", () => {
  const commandFacts = validCommandFacts();

  assert.equal(commandFacts.executable, "docker");
  assert.ok(commandFacts.arguments.includes("run"));
  assert.ok(commandFacts.arguments.includes("--rm"));
});

// TEST-UNIT-DOCKEREXEC-003: Volume mount to /workspace
test("T011 Volume mounts map workspace to /workspace", () => {
  const commandFacts = createDockerComparisonReportCommand({
    viPath1: "/home/user/project/base.vi",
    viPath2: "/home/user/project/compare.vi",
    outputPath: "/home/user/project/output.html",
    workspacePath: "/home/user/project"
  });

  assert.ok(commandFacts.volumeMounts.length > 0);
  assert.equal(commandFacts.volumeMounts[0].container, "/workspace");
  assert.equal(commandFacts.volumeMounts[0].host, "/home/user/project");
});

// TEST-UNIT-DOCKEREXEC-004: VI paths mapped to container
test("T012 VI paths are mapped to container /workspace paths", () => {
  const commandFacts = createDockerComparisonReportCommand({
    viPath1: "/home/user/project/src/base.vi",
    viPath2: "/home/user/project/src/compare.vi",
    outputPath: "/home/user/project/reports/output.html",
    workspacePath: "/home/user/project"
  });

  assert.equal(commandFacts.inputs.viPath1, "/workspace/src/base.vi");
  assert.equal(commandFacts.inputs.viPath2, "/workspace/src/compare.vi");
  assert.equal(commandFacts.inputs.outputPath, "/workspace/reports/output.html");
});

// TEST-UNIT-DOCKEREXEC-005: Headless flag included
test("T013 LabVIEWCLI command includes -Headless flag", () => {
  const commandFacts = validCommandFacts();

  assert.ok(commandFacts.arguments.includes("-Headless"));
  assert.equal(commandFacts.headless, true);
});

// TEST-UNIT-DOCKEREXEC-006: Execution captures stdout
test("T014 Execution captures stdout in outcome facts", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockDockerExecution({
    commandFacts,
    exitCode: 0,
    stdout: "Container output: Operation completed successfully"
  });

  assert.ok(outcome.diagnostics.stdout.includes("Container output"));
  assert.ok(outcome.diagnostics.stdout.includes("Operation completed successfully"));
});

// TEST-UNIT-DOCKEREXEC-007: Execution captures stderr
test("T015 Execution captures stderr in outcome facts", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockDockerExecution({
    commandFacts,
    exitCode: 1,
    stderr: "Error: Container failed to start"
  });

  assert.ok(outcome.diagnostics.stderr.includes("Error: Container failed to start"));
});

// TEST-UNIT-DOCKEREXEC-008: Execution captures exit code
test("T016 Execution captures exit code in outcome facts", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockDockerExecution({
    commandFacts,
    exitCode: 137 // Container killed
  });

  assert.equal(outcome.exitCode, 137);
});

// TEST-UNIT-DOCKEREXEC-009: Exit code 0 maps to success
test("Exit code 0 maps to success status", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockDockerExecution({
    commandFacts,
    exitCode: 0
  });

  assert.equal(outcome.exitCode, 0);
  assert.equal(outcome.success, true);
  assert.equal(outcome.status, "success");
});

// TEST-UNIT-DOCKEREXEC-010: Non-zero exit code maps to failure
test("Non-zero exit code maps to failure status", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockDockerExecution({
    commandFacts,
    exitCode: 1
  });

  assert.equal(outcome.exitCode, 1);
  assert.equal(outcome.success, false);
  assert.equal(outcome.status, "failure");
});

// TEST-UNIT-DOCKEREXEC-013: Timeout triggers container termination
test("Timeout triggers container termination and returns timeout status", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockDockerExecution({
    commandFacts,
    timedOut: true,
    stdout: "Partial container output before timeout",
    timeoutMs: 120000
  });

  assert.equal(outcome.status, "timeout");
  assert.equal(outcome.timedOut, true);
  assert.equal(outcome.success, false);
  assert.equal(outcome.exitCode, -1);
});

// Timeout returns partial output
test("Timeout returns partial output in outcome diagnostics", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockDockerExecution({
    commandFacts,
    timedOut: true,
    stdout: "Starting LabVIEWCLI...\nProcessing VI 1...",
    stderr: ""
  });

  assert.ok(outcome.diagnostics.stdout.includes("Starting LabVIEWCLI"));
  assert.ok(outcome.diagnostics.stdout.includes("Processing VI 1"));
});

// Private paths redacted
test("Private paths are redacted in stdout", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockDockerExecution({
    commandFacts,
    exitCode: 0,
    stdout: "Mounting /home/johndoe/project to /workspace"
  });

  assert.ok(!outcome.diagnostics.stdout.includes("johndoe"));
  assert.ok(outcome.diagnostics.stdout.includes("[REDACTED]"));
});

// Outcome structure tests
test("Docker execution outcome has required structure", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockDockerExecution({
    commandFacts,
    exitCode: 0,
    durationMs: 5000
  });

  assert.equal(outcome.kind, "docker-execution-outcome");
  assert.equal(outcome.executionContext, "docker");
  assert.equal(outcome.headless, true);
  assert.ok(typeof outcome.status === "string");
  assert.ok(typeof outcome.exitCode === "number");
  assert.ok(typeof outcome.success === "boolean");
  assert.ok(typeof outcome.timedOut === "boolean");
  assert.ok(typeof outcome.diagnostics.durationMs === "number");
  assert.equal(outcome.diagnostics.durationMs, 5000);
});

// Fail-closed tests
test("createMockDockerExecution fails closed for missing commandFacts", () => {
  assert.throws(() => {
    createMockDockerExecution({});
  }, /commandFacts is required/);
});

test("createMockDockerExecution fails closed for invalid commandFacts kind", () => {
  assert.throws(() => {
    createMockDockerExecution({
      commandFacts: { kind: "invalid" }
    });
  }, /must come from createDockerComparisonReportCommand/);
});

test("createMockDockerExecution fails closed for host-native commandFacts", () => {
  assert.throws(() => {
    createMockDockerExecution({
      commandFacts: {
        kind: "comparison-report-command",
        executionContext: "host-native"
      }
    });
  }, /must be for docker execution context/);
});

// Blocked side effects
test("Docker execution outcome includes blocked side effects", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockDockerExecution({
    commandFacts,
    exitCode: 0
  });

  assert.deepEqual(outcome.blockedSideEffects, DOCKER_EXECUTION_BLOCKED_SIDE_EFFECTS);
  assert.ok(outcome.blockedSideEffects.includes("docker-image-building"));
  assert.ok(outcome.blockedSideEffects.includes("multi-family-image-selection"));
});

// Volume mounts preserved in outcome
test("Docker execution outcome preserves volume mounts", () => {
  const commandFacts = createDockerComparisonReportCommand({
    viPath1: "/workspace/base.vi",
    viPath2: "/workspace/compare.vi",
    outputPath: "/workspace/output.html",
    workspacePath: "/home/user/project"
  });

  const outcome = createMockDockerExecution({
    commandFacts,
    exitCode: 0
  });

  assert.ok(outcome.volumeMounts.length > 0);
  assert.equal(outcome.volumeMounts[0].host, "/home/user/project");
  assert.equal(outcome.volumeMounts[0].container, "/workspace");
});

// Requirement IDs coverage
test("allDockerExecutionRequirementIds returns all requirement IDs", () => {
  const ids = allDockerExecutionRequirementIds();

  assert.ok(ids.includes("VHS-REQ-630"));
  assert.ok(ids.includes("VHS-REQ-631"));
  assert.ok(ids.includes("VHS-REQ-632"));
  assert.ok(ids.includes("VHS-REQ-633"));
  assert.ok(ids.includes("VHS-REQ-634"));
  assert.ok(ids.includes("VHS-REQ-635"));
});

// Output path preserved in outcome
test("Docker execution outcome preserves output path from command facts", () => {
  const commandFacts = createDockerComparisonReportCommand({
    viPath1: "/workspace/base.vi",
    viPath2: "/workspace/compare.vi",
    outputPath: "/workspace/reports/comparison.html",
    workspacePath: "/home/user/project"
  });

  const outcome = createMockDockerExecution({
    commandFacts,
    exitCode: 0
  });

  assert.equal(outcome.outputPath, "/workspace/reports/comparison.html");
});

// Requirement documentation verification
test("requirements import syrs.md references all system requirements", () => {
  const syrsPath = `docs/requirements/imports/${sliceId}/syrs.md`;
  if (!fs.existsSync(syrsPath)) {
    return;
  }

  const syrsIds = idsFromText(syrsPath);

  for (const id of ["VHS-REQ-630", "VHS-REQ-631", "VHS-REQ-632", "VHS-REQ-633", "VHS-REQ-634", "VHS-REQ-635"]) {
    assert.ok(syrsIds.includes(id), `${id} should be referenced in syrs.md`);
  }
});

test("requirements import srs.md references all software requirements", () => {
  const srsPath = `docs/requirements/imports/${sliceId}/srs.md`;
  if (!fs.existsSync(srsPath)) {
    return;
  }

  const srsIds = idsFromText(srsPath);

  for (const id of ["VHS-REQ-630", "VHS-REQ-631", "VHS-REQ-632", "VHS-REQ-633", "VHS-REQ-634", "VHS-REQ-635"]) {
    assert.ok(srsIds.includes(id), `${id} should be referenced in srs.md`);
  }
});
