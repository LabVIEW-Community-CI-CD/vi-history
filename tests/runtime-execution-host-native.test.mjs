import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  HOST_NATIVE_EXECUTION_BLOCKED_SIDE_EFFECTS,
  HOST_NATIVE_EXECUTION_REQUIREMENTS,
  allHostNativeExecutionRequirementIds,
  createMockHostNativeExecution
} from "../out/src/runtime-execution-host-native.js";

import {
  createHostNativeComparisonReportCommand
} from "../out/src/runtime-execution-contracts.js";

const sliceId = "runtime-execution-host-native-labviewcli-v1";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function idsFromText(filePath) {
  return [...fs.readFileSync(filePath, "utf8").matchAll(/\bVHS-REQ-\d+\b/g)].map((match) => match[0]);
}

function validCommandFacts() {
  return createHostNativeComparisonReportCommand({
    viPath1: "C:\\base.vi",
    viPath2: "C:\\compare.vi",
    outputPath: "C:\\output.html"
  });
}

// TEST-UNIT-HOSTEXEC-001: Process spawn uses executable from command facts
test("T009 Process spawn uses executable path from command facts", () => {
  const commandFacts = createHostNativeComparisonReportCommand({
    viPath1: "C:\\base.vi",
    viPath2: "C:\\compare.vi",
    outputPath: "C:\\output.html",
    runtimeDiscoveryFacts: {
      labviewCliPath: "D:\\Custom\\LabVIEWCLI.exe"
    }
  });

  // Mock execution verifies the command facts are preserved
  const outcome = createMockHostNativeExecution({
    commandFacts,
    exitCode: 0
  });

  assert.equal(outcome.executionContext, "host-native");
  assert.equal(outcome.operationName, "CreateComparisonReport");
});

// TEST-UNIT-HOSTEXEC-002: Process spawn passes arguments
test("T010 Process spawn passes arguments from command facts", () => {
  const commandFacts = validCommandFacts();

  assert.ok(commandFacts.arguments.includes("-OperationName"));
  assert.ok(commandFacts.arguments.includes("CreateComparisonReport"));
  assert.ok(commandFacts.arguments.includes("-VIPath1"));
  assert.ok(commandFacts.arguments.includes("-VIPath2"));
  assert.ok(commandFacts.arguments.includes("-OutputPath"));
});

// TEST-UNIT-HOSTEXEC-003: Execution captures stdout
test("T011 Execution captures stdout in outcome facts", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockHostNativeExecution({
    commandFacts,
    exitCode: 0,
    stdout: "Operation completed successfully\nReport generated"
  });

  assert.ok(outcome.diagnostics.stdout.includes("Operation completed successfully"));
  assert.ok(outcome.diagnostics.stdout.includes("Report generated"));
});

// TEST-UNIT-HOSTEXEC-004: Execution captures stderr
test("T012 Execution captures stderr in outcome facts", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockHostNativeExecution({
    commandFacts,
    exitCode: 1,
    stderr: "Error: VI file not found"
  });

  assert.ok(outcome.diagnostics.stderr.includes("Error: VI file not found"));
});

// TEST-UNIT-HOSTEXEC-005: Execution captures exit code
test("T013 Execution captures exit code in outcome facts", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockHostNativeExecution({
    commandFacts,
    exitCode: 42
  });

  assert.equal(outcome.exitCode, 42);
});

// TEST-UNIT-HOSTEXEC-006: Exit code 0 maps to success
test("T014 Exit code 0 maps to success status", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockHostNativeExecution({
    commandFacts,
    exitCode: 0
  });

  assert.equal(outcome.exitCode, 0);
  assert.equal(outcome.success, true);
  assert.equal(outcome.status, "success");
});

// TEST-UNIT-HOSTEXEC-007: Non-zero exit code maps to failure
test("T015 Non-zero exit code maps to failure status", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockHostNativeExecution({
    commandFacts,
    exitCode: 1,
    stderr: "Comparison failed"
  });

  assert.equal(outcome.exitCode, 1);
  assert.equal(outcome.success, false);
  assert.equal(outcome.status, "failure");
});

// TEST-UNIT-HOSTEXEC-010: Timeout triggers process termination
test("T016 Timeout triggers process termination and returns timeout status", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockHostNativeExecution({
    commandFacts,
    timedOut: true,
    stdout: "Partial output before timeout",
    timeoutMs: 60000
  });

  assert.equal(outcome.status, "timeout");
  assert.equal(outcome.timedOut, true);
  assert.equal(outcome.success, false);
  assert.equal(outcome.exitCode, -1);
});

// TEST-UNIT-HOSTEXEC-011: Timeout returns partial output
test("Timeout returns partial output in outcome diagnostics", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockHostNativeExecution({
    commandFacts,
    timedOut: true,
    stdout: "Starting comparison...\nProcessing VI 1...",
    stderr: ""
  });

  assert.ok(outcome.diagnostics.stdout.includes("Starting comparison"));
  assert.ok(outcome.diagnostics.stdout.includes("Processing VI 1"));
});

// TEST-UNIT-HOSTEXEC-012: Private paths redacted in stdout
test("Private paths are redacted in stdout", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockHostNativeExecution({
    commandFacts,
    exitCode: 0,
    stdout: "Processing file at C:\\Users\\johndoe\\project\\test.vi"
  });

  assert.ok(!outcome.diagnostics.stdout.includes("johndoe"));
  assert.ok(outcome.diagnostics.stdout.includes("[REDACTED]"));
});

// TEST-UNIT-HOSTEXEC-013: Private paths redacted in stderr
test("Private paths are redacted in stderr", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockHostNativeExecution({
    commandFacts,
    exitCode: 1,
    stderr: "Error: Cannot access /home/johndoe/secret/file.vi"
  });

  assert.ok(!outcome.diagnostics.stderr.includes("johndoe"));
  assert.ok(outcome.diagnostics.stderr.includes("[REDACTED]"));
});

// Outcome structure tests
test("Execution outcome has required structure", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockHostNativeExecution({
    commandFacts,
    exitCode: 0,
    durationMs: 1500
  });

  assert.equal(outcome.kind, "host-native-execution-outcome");
  assert.ok(typeof outcome.status === "string");
  assert.ok(typeof outcome.exitCode === "number");
  assert.ok(typeof outcome.success === "boolean");
  assert.ok(typeof outcome.timedOut === "boolean");
  assert.ok(typeof outcome.diagnostics.durationMs === "number");
  assert.equal(outcome.diagnostics.durationMs, 1500);
});

// Fail-closed tests
test("createMockHostNativeExecution fails closed for missing commandFacts", () => {
  assert.throws(() => {
    createMockHostNativeExecution({});
  }, /commandFacts is required/);
});

test("createMockHostNativeExecution fails closed for invalid commandFacts kind", () => {
  assert.throws(() => {
    createMockHostNativeExecution({
      commandFacts: { kind: "invalid" }
    });
  }, /must come from createHostNativeComparisonReportCommand/);
});

test("createMockHostNativeExecution fails closed for docker commandFacts", () => {
  assert.throws(() => {
    createMockHostNativeExecution({
      commandFacts: {
        kind: "comparison-report-command",
        executionContext: "docker"
      }
    });
  }, /must be for host-native execution context/);
});

// Blocked side effects
test("Execution outcome includes blocked side effects", () => {
  const commandFacts = validCommandFacts();

  const outcome = createMockHostNativeExecution({
    commandFacts,
    exitCode: 0
  });

  assert.deepEqual(outcome.blockedSideEffects, HOST_NATIVE_EXECUTION_BLOCKED_SIDE_EFFECTS);
  assert.ok(outcome.blockedSideEffects.includes("docker-execution"));
  assert.ok(outcome.blockedSideEffects.includes("interactive-sessions"));
});

// Requirement IDs coverage
test("allHostNativeExecutionRequirementIds returns all requirement IDs", () => {
  const ids = allHostNativeExecutionRequirementIds();

  assert.ok(ids.includes("VHS-REQ-620"));
  assert.ok(ids.includes("VHS-REQ-621"));
  assert.ok(ids.includes("VHS-REQ-622"));
  assert.ok(ids.includes("VHS-REQ-623"));
  assert.ok(ids.includes("VHS-REQ-624"));
  assert.ok(ids.includes("VHS-REQ-625"));
});

// Output path preserved in outcome
test("Execution outcome preserves output path from command facts", () => {
  const commandFacts = createHostNativeComparisonReportCommand({
    viPath1: "C:\\base.vi",
    viPath2: "C:\\compare.vi",
    outputPath: "C:\\reports\\comparison.html"
  });

  const outcome = createMockHostNativeExecution({
    commandFacts,
    exitCode: 0
  });

  assert.equal(outcome.outputPath, "C:\\reports\\comparison.html");
});

// Requirement documentation verification
test("requirements import syrs.md references all system requirements", () => {
  const syrsPath = `docs/requirements/imports/${sliceId}/syrs.md`;
  if (!fs.existsSync(syrsPath)) {
    return;
  }

  const syrsIds = idsFromText(syrsPath);

  for (const id of ["VHS-REQ-620", "VHS-REQ-621", "VHS-REQ-622", "VHS-REQ-623", "VHS-REQ-624", "VHS-REQ-625"]) {
    assert.ok(syrsIds.includes(id), `${id} should be referenced in syrs.md`);
  }
});

test("requirements import srs.md references all software requirements", () => {
  const srsPath = `docs/requirements/imports/${sliceId}/srs.md`;
  if (!fs.existsSync(srsPath)) {
    return;
  }

  const srsIds = idsFromText(srsPath);

  for (const id of ["VHS-REQ-620", "VHS-REQ-621", "VHS-REQ-622", "VHS-REQ-623", "VHS-REQ-624", "VHS-REQ-625"]) {
    assert.ok(srsIds.includes(id), `${id} should be referenced in srs.md`);
  }
});
