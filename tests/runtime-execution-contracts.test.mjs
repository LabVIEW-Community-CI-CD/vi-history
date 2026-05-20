import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTION_BLOCKED_SIDE_EFFECTS,
  RUNTIME_EXECUTION_CONTRACTS_REQUIREMENTS,
  allRuntimeExecutionContractsRequirementIds,
  createComparisonReportCommand,
  createComparisonReportExecutionOutcome,
  createDockerComparisonReportCommand,
  createHostNativeComparisonReportCommand
} from "../out/src/runtime-execution-contracts.js";

const sliceId = "runtime-execution-contracts-v1";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function idsFromText(filePath) {
  return [...fs.readFileSync(filePath, "utf8").matchAll(/\bVHS-REQ-\d+\b/g)].map((match) => match[0]);
}

// TEST-UNIT-EXEC-001: CreateComparisonReport command assembly
test("T009 CreateComparisonReport command assembly produces valid LabVIEWCLI invocation", () => {
  const result = createComparisonReportCommand({
    viPath1: "/path/to/base.vi",
    viPath2: "/path/to/compare.vi",
    outputPath: "/path/to/output.html",
    executionContext: "host-native"
  });

  assert.equal(result.kind, "comparison-report-command");
  assert.equal(result.status, "ready");
  assert.equal(result.operationName, "CreateComparisonReport");
  assert.ok(result.arguments.includes("-OperationName"));
  assert.ok(result.arguments.includes("CreateComparisonReport"));
});

// TEST-UNIT-EXEC-002: Required arguments presence
test("T010 CreateComparisonReport includes required -VIPath1 -VIPath2 -OutputPath arguments", () => {
  const result = createHostNativeComparisonReportCommand({
    viPath1: "C:\\base\\file.vi",
    viPath2: "C:\\compare\\file.vi",
    outputPath: "C:\\reports\\output.html"
  });

  assert.ok(result.arguments.includes("-VIPath1"));
  assert.ok(result.arguments.includes("C:\\base\\file.vi"));
  assert.ok(result.arguments.includes("-VIPath2"));
  assert.ok(result.arguments.includes("C:\\compare\\file.vi"));
  assert.ok(result.arguments.includes("-OutputPath"));
  assert.ok(result.arguments.includes("C:\\reports\\output.html"));
});

// TEST-UNIT-EXEC-003: Host-native LabVIEWCLI path derivation
test("T011 Host-native execution derives LabVIEWCLI path from runtime discovery facts", () => {
  const result = createHostNativeComparisonReportCommand({
    viPath1: "C:\\base\\file.vi",
    viPath2: "C:\\compare\\file.vi",
    outputPath: "C:\\reports\\output.html",
    runtimeDiscoveryFacts: {
      labviewCliPath: "D:\\Custom\\LabVIEW 2026\\LabVIEWCLI.exe"
    }
  });

  assert.equal(result.executable, "D:\\Custom\\LabVIEW 2026\\LabVIEWCLI.exe");
});

// TEST-UNIT-EXEC-004: Docker image hardcoded
test("T012 Docker execution uses hardcoded nationalinstruments/labview:latest-linux image", () => {
  const result = createDockerComparisonReportCommand({
    viPath1: "/workspace/base.vi",
    viPath2: "/workspace/compare.vi",
    outputPath: "/workspace/output.html"
  });

  assert.equal(result.dockerImage, "nationalinstruments/labview:latest-linux");
  assert.ok(result.arguments.includes("nationalinstruments/labview:latest-linux"));
});

// TEST-UNIT-EXEC-005: Argument formatting
test("T013 CreateComparisonReport arguments are properly formatted", () => {
  const result = createHostNativeComparisonReportCommand({
    viPath1: "C:\\My Projects\\base file.vi",
    viPath2: "C:\\My Projects\\compare file.vi",
    outputPath: "C:\\reports\\output report.html"
  });

  assert.ok(result.commandLine.includes("C:\\My Projects\\base file.vi"));
  assert.ok(result.commandLine.includes("C:\\My Projects\\compare file.vi"));
});

// TEST-UNIT-EXEC-006: ReportType html flag
test("T014 CreateComparisonReport includes -ReportType html flag", () => {
  const result = createHostNativeComparisonReportCommand({
    viPath1: "C:\\base.vi",
    viPath2: "C:\\compare.vi",
    outputPath: "C:\\output.html"
  });

  assert.ok(result.arguments.includes("-ReportType"));
  assert.ok(result.arguments.includes("html"));
  assert.equal(result.inputs.reportType, "html");
});

// TEST-UNIT-EXEC-007: Docker Headless flag
test("T015 Docker execution includes -Headless flag", () => {
  const result = createDockerComparisonReportCommand({
    viPath1: "/workspace/base.vi",
    viPath2: "/workspace/compare.vi",
    outputPath: "/workspace/output.html"
  });

  assert.ok(result.arguments.includes("-Headless"));
  assert.equal(result.headless, true);
});

// TEST-UNIT-EXEC-008: Execution plan facts structure
test("T016 Execution plan facts include executable, arguments, and context", () => {
  const result = createComparisonReportCommand({
    viPath1: "/path/to/base.vi",
    viPath2: "/path/to/compare.vi",
    outputPath: "/path/to/output.html",
    executionContext: "host-native"
  });

  assert.ok(typeof result.executable === "string");
  assert.ok(Array.isArray(result.arguments));
  assert.equal(result.executionContext, "host-native");
  assert.ok(result.kind === "comparison-report-command");
});

// TEST-UNIT-EXEC-009: Docker volume mount mapping
test("Docker volume mounts map workspace to /workspace", () => {
  const result = createDockerComparisonReportCommand({
    viPath1: "C:\\project\\base.vi",
    viPath2: "C:\\project\\compare.vi",
    outputPath: "C:\\project\\output.html",
    workspacePath: "C:\\project"
  });

  assert.ok(result.volumeMounts.length > 0);
  assert.equal(result.volumeMounts[0].container, "/workspace");
  assert.equal(result.volumeMounts[0].host, "C:\\project");
});

// TEST-UNIT-EXEC-010: Docker image family constraint
test("Docker image is hardcoded to latest-linux family only", () => {
  const result1 = createDockerComparisonReportCommand({
    viPath1: "/base.vi",
    viPath2: "/compare.vi",
    outputPath: "/output.html"
  });

  const result2 = createComparisonReportCommand({
    viPath1: "/base.vi",
    viPath2: "/compare.vi",
    outputPath: "/output.html",
    executionContext: "docker"
  });

  assert.equal(result1.dockerImage, "nationalinstruments/labview:latest-linux");
  assert.equal(result2.dockerImage, "nationalinstruments/labview:latest-linux");
});

// TEST-UNIT-EXEC-011: Host LabVIEWCLI from native acquisition
test("Host LabVIEWCLI path can be derived from native acquisition facts", () => {
  const result = createHostNativeComparisonReportCommand({
    viPath1: "C:\\base.vi",
    viPath2: "C:\\compare.vi",
    outputPath: "C:\\output.html",
    runtimeDiscoveryFacts: {
      nativeAcquisition: {
        labviewCliPath: "C:\\Program Files\\National Instruments\\LabVIEW 2026\\LabVIEWCLI.exe"
      }
    }
  });

  assert.equal(result.executable, "C:\\Program Files\\National Instruments\\LabVIEW 2026\\LabVIEWCLI.exe");
});

// TEST-UNIT-EXEC-012: stdout/stderr capture
test("Execution outcome captures stdout and stderr as diagnostic facts", () => {
  const commandFacts = createHostNativeComparisonReportCommand({
    viPath1: "C:\\base.vi",
    viPath2: "C:\\compare.vi",
    outputPath: "C:\\output.html"
  });

  const outcome = createComparisonReportExecutionOutcome({
    commandFacts,
    exitCode: 0,
    stdout: "Operation completed successfully",
    stderr: "",
    durationMs: 1500
  });

  assert.equal(outcome.diagnostics.stdout, "Operation completed successfully");
  assert.equal(outcome.diagnostics.stderr, "");
  assert.equal(outcome.diagnostics.durationMs, 1500);
});

// TEST-UNIT-EXEC-013: Exit code capture
test("Execution outcome returns exit code as outcome fact", () => {
  const commandFacts = createHostNativeComparisonReportCommand({
    viPath1: "C:\\base.vi",
    viPath2: "C:\\compare.vi",
    outputPath: "C:\\output.html"
  });

  const successOutcome = createComparisonReportExecutionOutcome({
    commandFacts,
    exitCode: 0
  });

  const failureOutcome = createComparisonReportExecutionOutcome({
    commandFacts,
    exitCode: 1,
    stderr: "Error: VI not found"
  });

  assert.equal(successOutcome.exitCode, 0);
  assert.equal(successOutcome.success, true);
  assert.equal(successOutcome.status, "success");

  assert.equal(failureOutcome.exitCode, 1);
  assert.equal(failureOutcome.success, false);
  assert.equal(failureOutcome.status, "failure");
});

// Fail-closed tests
test("createComparisonReportCommand fails closed for missing viPath1", () => {
  assert.throws(() => {
    createComparisonReportCommand({
      viPath2: "/compare.vi",
      outputPath: "/output.html",
      executionContext: "host-native"
    });
  }, /viPath1 is required/);
});

test("createComparisonReportCommand fails closed for missing viPath2", () => {
  assert.throws(() => {
    createComparisonReportCommand({
      viPath1: "/base.vi",
      outputPath: "/output.html",
      executionContext: "host-native"
    });
  }, /viPath2 is required/);
});

test("createComparisonReportCommand fails closed for missing outputPath", () => {
  assert.throws(() => {
    createComparisonReportCommand({
      viPath1: "/base.vi",
      viPath2: "/compare.vi",
      executionContext: "host-native"
    });
  }, /outputPath is required/);
});

test("createComparisonReportCommand fails closed for invalid executionContext", () => {
  assert.throws(() => {
    createComparisonReportCommand({
      viPath1: "/base.vi",
      viPath2: "/compare.vi",
      outputPath: "/output.html",
      executionContext: "invalid"
    });
  }, /executionContext must be/);
});

test("createComparisonReportExecutionOutcome fails closed for missing commandFacts", () => {
  assert.throws(() => {
    createComparisonReportExecutionOutcome({
      exitCode: 0
    });
  }, /commandFacts is required/);
});

test("createComparisonReportExecutionOutcome fails closed for missing exitCode", () => {
  const commandFacts = createHostNativeComparisonReportCommand({
    viPath1: "C:\\base.vi",
    viPath2: "C:\\compare.vi",
    outputPath: "C:\\output.html"
  });

  assert.throws(() => {
    createComparisonReportExecutionOutcome({
      commandFacts
    });
  }, /exitCode is required/);
});

// Blocked side effects
test("Command facts include blocked side effects", () => {
  const result = createHostNativeComparisonReportCommand({
    viPath1: "C:\\base.vi",
    viPath2: "C:\\compare.vi",
    outputPath: "C:\\output.html"
  });

  assert.deepEqual(result.blockedSideEffects, RUNTIME_EXECUTION_BLOCKED_SIDE_EFFECTS);
  assert.ok(result.blockedSideEffects.includes("actual-labviewcli-execution"));
  assert.ok(result.blockedSideEffects.includes("actual-docker-execution"));
});

// Requirement IDs coverage
test("allRuntimeExecutionContractsRequirementIds returns all requirement IDs", () => {
  const ids = allRuntimeExecutionContractsRequirementIds();

  assert.ok(ids.includes("VHS-REQ-600"));
  assert.ok(ids.includes("VHS-REQ-601"));
  assert.ok(ids.includes("VHS-REQ-602"));
  assert.ok(ids.includes("VHS-REQ-606"));
  assert.ok(ids.includes("VHS-REQ-611"));
});

// Requirement documentation verification
test("requirements import syrs.md references all system requirements", () => {
  const syrsPath = `docs/requirements/imports/${sliceId}/syrs.md`;
  if (!fs.existsSync(syrsPath)) {
    return;
  }

  const syrsIds = idsFromText(syrsPath);

  // System requirements are VHS-REQ-600 through VHS-REQ-605
  for (const id of ["VHS-REQ-600", "VHS-REQ-601", "VHS-REQ-602", "VHS-REQ-603", "VHS-REQ-604", "VHS-REQ-605"]) {
    assert.ok(syrsIds.includes(id), `${id} should be referenced in syrs.md`);
  }
});

test("requirements import srs.md references all software requirements", () => {
  const srsPath = `docs/requirements/imports/${sliceId}/srs.md`;
  if (!fs.existsSync(srsPath)) {
    return;
  }

  const srsIds = idsFromText(srsPath);

  for (const id of ["VHS-REQ-606", "VHS-REQ-607", "VHS-REQ-608", "VHS-REQ-609", "VHS-REQ-610", "VHS-REQ-611"]) {
    assert.ok(srsIds.includes(id), `${id} should be referenced in srs.md`);
  }
});

// Container path mapping
test("Docker paths are mapped to container /workspace paths", () => {
  const result = createDockerComparisonReportCommand({
    viPath1: "C:\\project\\src\\base.vi",
    viPath2: "C:\\project\\src\\compare.vi",
    outputPath: "C:\\project\\reports\\output.html",
    workspacePath: "C:\\project"
  });

  assert.equal(result.inputs.viPath1, "/workspace/src/base.vi");
  assert.equal(result.inputs.viPath2, "/workspace/src/compare.vi");
  assert.equal(result.inputs.outputPath, "/workspace/reports/output.html");
});

// Host inputs preserved in Docker command
test("Docker command preserves original host inputs", () => {
  const result = createDockerComparisonReportCommand({
    viPath1: "C:\\project\\base.vi",
    viPath2: "C:\\project\\compare.vi",
    outputPath: "C:\\project\\output.html",
    workspacePath: "C:\\project"
  });

  assert.equal(result.hostInputs.viPath1, "C:\\project\\base.vi");
  assert.equal(result.hostInputs.viPath2, "C:\\project\\compare.vi");
  assert.equal(result.hostInputs.outputPath, "C:\\project\\output.html");
  assert.equal(result.hostInputs.workspacePath, "C:\\project");
});

// Private path redaction in outcome
test("Execution outcome redacts private paths in diagnostics", () => {
  const commandFacts = createHostNativeComparisonReportCommand({
    viPath1: "C:\\base.vi",
    viPath2: "C:\\compare.vi",
    outputPath: "C:\\output.html"
  });

  const outcome = createComparisonReportExecutionOutcome({
    commandFacts,
    exitCode: 1,
    stderr: "Error: Cannot find file at C:\\Users\\johndoe\\secret\\file.vi"
  });

  assert.ok(!outcome.diagnostics.stderr.includes("johndoe"));
  assert.ok(outcome.diagnostics.stderr.includes("[REDACTED]"));
});
