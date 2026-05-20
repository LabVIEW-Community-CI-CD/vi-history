import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const sliceId = "runtime-contract-host-provider-v1";
const featureDir = ".specify/specs/runtime-contract-host-provider-v1";
const importDir = `docs/requirements/imports/${sliceId}`;
const admissionPath = `docs/requirements/admissions/${sliceId}.json`;
const observationSliceId = "installed-user-observation-public-surface-v1";
const observationFeatureDir = `.specify/specs/${observationSliceId}`;
const observationImportDir = `docs/requirements/imports/${observationSliceId}`;
const observationAdmissionPath = `docs/requirements/admissions/${observationSliceId}.json`;
const observationModelIauPath = `docs/requirements/admissions/${observationSliceId}/IAU-installed-user-observation-model-v1.json`;
const observationModelPreflightPath = `docs/requirements/admissions/${observationSliceId}/IAU-installed-user-observation-model-v1-preflight-v1.json`;
const commandSliceId = "command-activation-surface-v1";
const commandFeatureDir = `.specify/specs/${commandSliceId}`;
const commandImportDir = `docs/requirements/imports/${commandSliceId}`;
const commandAdmissionPath = `docs/requirements/admissions/${commandSliceId}.json`;
const commandManifestIauPath = `docs/requirements/admissions/${commandSliceId}/IAU-command-activation-manifest-contract-v1.json`;
const commandManifestPreflightPath = `docs/requirements/admissions/${commandSliceId}/IAU-command-activation-manifest-contract-v1-preflight-v1.json`;
const handlerSliceId = "command-handler-entrypoint-shell-v1";
const handlerFeatureDir = `.specify/specs/${handlerSliceId}`;
const handlerImportDir = `docs/requirements/imports/${handlerSliceId}`;
const handlerAdmissionPath = `docs/requirements/admissions/${handlerSliceId}.json`;
const handlerIauPath = `docs/requirements/admissions/${handlerSliceId}/IAU-command-handler-entrypoint-shell-v1.json`;
const handlerPreflightPath = `docs/requirements/admissions/${handlerSliceId}/IAU-command-handler-entrypoint-shell-v1-preflight-v1.json`;
const documentationSliceId = "installed-user-documentation-command-v1";
const documentationFeatureDir = `.specify/specs/${documentationSliceId}`;
const documentationImportDir = `docs/requirements/imports/${documentationSliceId}`;
const documentationAdmissionPath = `docs/requirements/admissions/${documentationSliceId}.json`;
const documentationIauPath = `docs/requirements/admissions/${documentationSliceId}/IAU-documentation-command-panel-shell-v1.json`;
const documentationPreflightPath = `docs/requirements/admissions/${documentationSliceId}/IAU-documentation-command-panel-shell-v1-preflight-v1.json`;
const runtimeSettingsSliceId = "runtime-settings-cli-bootstrap-v1";
const runtimeSettingsFeatureDir = `.specify/specs/${runtimeSettingsSliceId}`;
const runtimeSettingsImportDir = `docs/requirements/imports/${runtimeSettingsSliceId}`;
const runtimeSettingsAdmissionPath = `docs/requirements/admissions/${runtimeSettingsSliceId}.json`;
const runtimeSettingsIauPath = `docs/requirements/admissions/${runtimeSettingsSliceId}/IAU-runtime-settings-cli-prepare-command-shell-v1.json`;
const runtimeSettingsPreflightPath = `docs/requirements/admissions/${runtimeSettingsSliceId}/IAU-runtime-settings-cli-prepare-command-shell-v1-preflight-v1.json`;
const runtimeSettingsWriteSliceId = "runtime-settings-cli-settings-write-v1";
const runtimeSettingsWriteFeatureDir = `.specify/specs/${runtimeSettingsWriteSliceId}`;
const runtimeSettingsWriteImportDir = `docs/requirements/imports/${runtimeSettingsWriteSliceId}`;
const runtimeSettingsWriteAdmissionPath = `docs/requirements/admissions/${runtimeSettingsWriteSliceId}.json`;
const runtimeSettingsWriteIauPath = `docs/requirements/admissions/${runtimeSettingsWriteSliceId}/IAU-runtime-settings-cli-settings-write-contract-v1.json`;
const runtimeSettingsWritePreflightPath = `docs/requirements/admissions/${runtimeSettingsWriteSliceId}/IAU-runtime-settings-cli-settings-write-contract-v1-preflight-v1.json`;
const runtimeSettingsValidateSliceId = "runtime-settings-cli-validation-readback-v1";
const runtimeSettingsValidateFeatureDir = `.specify/specs/${runtimeSettingsValidateSliceId}`;
const runtimeSettingsValidateImportDir = `docs/requirements/imports/${runtimeSettingsValidateSliceId}`;
const runtimeSettingsValidateAdmissionPath = `docs/requirements/admissions/${runtimeSettingsValidateSliceId}.json`;
const runtimeSettingsValidateIauPath = `docs/requirements/admissions/${runtimeSettingsValidateSliceId}/IAU-runtime-settings-cli-validation-readback-contract-v1.json`;
const runtimeSettingsValidatePreflightPath = `docs/requirements/admissions/${runtimeSettingsValidateSliceId}/IAU-runtime-settings-cli-validation-readback-contract-v1-preflight-v1.json`;
const runtimeSettingsProofSliceId = "runtime-settings-cli-validation-proof-v1";
const runtimeSettingsProofFeatureDir = `.specify/specs/${runtimeSettingsProofSliceId}`;
const runtimeSettingsProofImportDir = `docs/requirements/imports/${runtimeSettingsProofSliceId}`;
const runtimeSettingsProofAdmissionPath = `docs/requirements/admissions/${runtimeSettingsProofSliceId}.json`;
const runtimeSettingsProofIauPath = `docs/requirements/admissions/${runtimeSettingsProofSliceId}/IAU-runtime-settings-cli-validation-proof-artifact-v1.json`;
const runtimeSettingsProofPreflightPath = `docs/requirements/admissions/${runtimeSettingsProofSliceId}/IAU-runtime-settings-cli-validation-proof-artifact-v1-preflight-v1.json`;
const runtimeSettingsInteractiveSliceId = "runtime-settings-cli-interactive-selection-v1";
const runtimeSettingsInteractiveFeatureDir = `.specify/specs/${runtimeSettingsInteractiveSliceId}`;
const runtimeSettingsInteractiveImportDir = `docs/requirements/imports/${runtimeSettingsInteractiveSliceId}`;
const runtimeSettingsInteractiveAdmissionPath = `docs/requirements/admissions/${runtimeSettingsInteractiveSliceId}.json`;
const runtimeSettingsInteractiveIauPath = `docs/requirements/admissions/${runtimeSettingsInteractiveSliceId}/IAU-runtime-settings-cli-interactive-selection-contract-v1.json`;
const runtimeSettingsInteractivePreflightPath = `docs/requirements/admissions/${runtimeSettingsInteractiveSliceId}/IAU-runtime-settings-cli-interactive-selection-contract-v1-preflight-v1.json`;
const runtimeSettingsTerminalSliceId = "runtime-settings-cli-terminal-entrypoint-v1";
const runtimeSettingsTerminalFeatureDir = `.specify/specs/${runtimeSettingsTerminalSliceId}`;
const runtimeSettingsTerminalImportDir = `docs/requirements/imports/${runtimeSettingsTerminalSliceId}`;
const runtimeSettingsTerminalAdmissionPath = `docs/requirements/admissions/${runtimeSettingsTerminalSliceId}.json`;
const runtimeSettingsTerminalIauPath = `docs/requirements/admissions/${runtimeSettingsTerminalSliceId}/IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1.json`;
const runtimeSettingsTerminalPreflightPath = `docs/requirements/admissions/${runtimeSettingsTerminalSliceId}/IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1-preflight-v1.json`;
const runtimeSettingsPromptLoopSliceId = "runtime-settings-cli-terminal-prompt-loop-v1";
const runtimeSettingsPromptLoopFeatureDir = `.specify/specs/${runtimeSettingsPromptLoopSliceId}`;
const runtimeSettingsPromptLoopImportDir = `docs/requirements/imports/${runtimeSettingsPromptLoopSliceId}`;
const runtimeSettingsPromptLoopAdmissionPath = `docs/requirements/admissions/${runtimeSettingsPromptLoopSliceId}.json`;
const runtimeSettingsPromptLoopIauPath = `docs/requirements/admissions/${runtimeSettingsPromptLoopSliceId}/IAU-runtime-settings-cli-terminal-prompt-loop-v1.json`;
const runtimeSettingsPromptLoopPreflightPath = `docs/requirements/admissions/${runtimeSettingsPromptLoopSliceId}/IAU-runtime-settings-cli-terminal-prompt-loop-v1-preflight-v1.json`;
const runtimeSettingsTerminalIoSliceId = "runtime-settings-cli-terminal-io-adapter-v1";
const runtimeSettingsTerminalIoFeatureDir = `.specify/specs/${runtimeSettingsTerminalIoSliceId}`;
const runtimeSettingsTerminalIoImportDir = `docs/requirements/imports/${runtimeSettingsTerminalIoSliceId}`;
const runtimeSettingsTerminalIoAdmissionPath = `docs/requirements/admissions/${runtimeSettingsTerminalIoSliceId}.json`;
const runtimeSettingsTerminalIoIauPath = `docs/requirements/admissions/${runtimeSettingsTerminalIoSliceId}/IAU-runtime-settings-cli-terminal-io-adapter-v1.json`;
const runtimeSettingsTerminalIoPreflightPath = `docs/requirements/admissions/${runtimeSettingsTerminalIoSliceId}/IAU-runtime-settings-cli-terminal-io-adapter-v1-preflight-v1.json`;
const runtimeSettingsProofOutSliceId = "runtime-settings-cli-validation-proof-out-v1";
const runtimeSettingsProofOutFeatureDir = `.specify/specs/${runtimeSettingsProofOutSliceId}`;
const runtimeSettingsProofOutImportDir = `docs/requirements/imports/${runtimeSettingsProofOutSliceId}`;
const runtimeSettingsProofOutAdmissionPath = `docs/requirements/admissions/${runtimeSettingsProofOutSliceId}.json`;
const runtimeSettingsProofOutIauPath = `docs/requirements/admissions/${runtimeSettingsProofOutSliceId}/IAU-runtime-settings-cli-validation-proof-out-v1.json`;
const runtimeSettingsProofOutPreflightPath = `docs/requirements/admissions/${runtimeSettingsProofOutSliceId}/IAU-runtime-settings-cli-validation-proof-out-v1-preflight-v1.json`;
const runtimeSettingsProofOutFileEmissionSliceId = "runtime-settings-cli-validation-proof-out-file-emission-v1";
const runtimeSettingsProofOutFileEmissionFeatureDir = `.specify/specs/${runtimeSettingsProofOutFileEmissionSliceId}`;
const runtimeSettingsProofOutFileEmissionImportDir = `docs/requirements/imports/${runtimeSettingsProofOutFileEmissionSliceId}`;
const runtimeSettingsProofOutFileEmissionAdmissionPath = `docs/requirements/admissions/${runtimeSettingsProofOutFileEmissionSliceId}.json`;
const runtimeSettingsProofOutFileEmissionIauPath = `docs/requirements/admissions/${runtimeSettingsProofOutFileEmissionSliceId}/IAU-runtime-settings-cli-validation-proof-out-file-emission-v1.json`;
const runtimeSettingsProofOutFileEmissionPreflightPath = `docs/requirements/admissions/${runtimeSettingsProofOutFileEmissionSliceId}/IAU-runtime-settings-cli-validation-proof-out-file-emission-v1-preflight-v1.json`;
const runtimeSettingsRuntimeOutcomeSliceId = "runtime-settings-cli-validation-runtime-outcome-v1";
const runtimeSettingsRuntimeOutcomeFeatureDir = `.specify/specs/${runtimeSettingsRuntimeOutcomeSliceId}`;
const runtimeSettingsRuntimeOutcomeImportDir = `docs/requirements/imports/${runtimeSettingsRuntimeOutcomeSliceId}`;
const runtimeSettingsRuntimeOutcomeAdmissionPath = `docs/requirements/admissions/${runtimeSettingsRuntimeOutcomeSliceId}.json`;
const runtimeSettingsRuntimeOutcomeIauPath = `docs/requirements/admissions/${runtimeSettingsRuntimeOutcomeSliceId}/IAU-runtime-settings-cli-validation-runtime-outcome-v1.json`;
const runtimeSettingsRuntimeOutcomePreflightPath = `docs/requirements/admissions/${runtimeSettingsRuntimeOutcomeSliceId}/IAU-runtime-settings-cli-validation-runtime-outcome-v1-preflight-v1.json`;
const runtimeSettingsCommandContractSliceId = "runtime-settings-cli-validation-command-contract-v1";
const runtimeSettingsCommandContractFeatureDir = `.specify/specs/${runtimeSettingsCommandContractSliceId}`;
const runtimeSettingsCommandContractImportDir = `docs/requirements/imports/${runtimeSettingsCommandContractSliceId}`;
const runtimeSettingsCommandContractAdmissionPath = `docs/requirements/admissions/${runtimeSettingsCommandContractSliceId}.json`;
const runtimeSettingsCommandContractIauPath = `docs/requirements/admissions/${runtimeSettingsCommandContractSliceId}/IAU-runtime-settings-cli-validation-command-contract-v1.json`;
const runtimeSettingsCommandContractPreflightPath = `docs/requirements/admissions/${runtimeSettingsCommandContractSliceId}/IAU-runtime-settings-cli-validation-command-contract-v1-preflight-v1.json`;
const runtimeSettingsPlanOnlySliceId = "runtime-settings-cli-validation-plan-only-v1";
const runtimeSettingsPlanOnlyFeatureDir = `.specify/specs/${runtimeSettingsPlanOnlySliceId}`;
const runtimeSettingsPlanOnlyImportDir = `docs/requirements/imports/${runtimeSettingsPlanOnlySliceId}`;
const runtimeSettingsPlanOnlyAdmissionPath = `docs/requirements/admissions/${runtimeSettingsPlanOnlySliceId}.json`;
const runtimeSettingsPlanOnlyIauPath = `docs/requirements/admissions/${runtimeSettingsPlanOnlySliceId}/IAU-runtime-settings-cli-validation-plan-only-v1.json`;
const runtimeSettingsPlanOnlyPreflightPath = `docs/requirements/admissions/${runtimeSettingsPlanOnlySliceId}/IAU-runtime-settings-cli-validation-plan-only-v1-preflight-v1.json`;
const runtimeSettingsHostRuntimePreflightSliceId = "runtime-settings-cli-validation-host-runtime-preflight-v1";
const runtimeSettingsHostRuntimePreflightFeatureDir = `.specify/specs/${runtimeSettingsHostRuntimePreflightSliceId}`;
const runtimeSettingsHostRuntimePreflightImportDir = `docs/requirements/imports/${runtimeSettingsHostRuntimePreflightSliceId}`;
const runtimeSettingsHostRuntimePreflightAdmissionPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimePreflightSliceId}.json`;
const runtimeSettingsHostRuntimePreflightIauPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimePreflightSliceId}/IAU-runtime-settings-cli-validation-host-runtime-preflight-v1.json`;
const runtimeSettingsHostRuntimePreflightPreflightPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimePreflightSliceId}/IAU-runtime-settings-cli-validation-host-runtime-preflight-v1-preflight-v1.json`;
const runtimeSettingsHostPreflightCommandCompositionSliceId = "runtime-settings-cli-validation-host-preflight-command-composition-v1";
const runtimeSettingsHostPreflightCommandCompositionFeatureDir = `.specify/specs/${runtimeSettingsHostPreflightCommandCompositionSliceId}`;
const runtimeSettingsHostPreflightCommandCompositionImportDir = `docs/requirements/imports/${runtimeSettingsHostPreflightCommandCompositionSliceId}`;
const runtimeSettingsHostPreflightCommandCompositionAdmissionPath = `docs/requirements/admissions/${runtimeSettingsHostPreflightCommandCompositionSliceId}.json`;
const runtimeSettingsHostPreflightCommandCompositionIauPath = `docs/requirements/admissions/${runtimeSettingsHostPreflightCommandCompositionSliceId}/IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1.json`;
const runtimeSettingsHostPreflightCommandCompositionPreflightPath = `docs/requirements/admissions/${runtimeSettingsHostPreflightCommandCompositionSliceId}/IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1-preflight-v1.json`;
const runtimeSettingsHostRuntimeDiscoverySliceId = "runtime-settings-cli-validation-host-runtime-discovery-v1";
const runtimeSettingsHostRuntimeDiscoveryFeatureDir = `.specify/specs/${runtimeSettingsHostRuntimeDiscoverySliceId}`;
const runtimeSettingsHostRuntimeDiscoveryImportDir = `docs/requirements/imports/${runtimeSettingsHostRuntimeDiscoverySliceId}`;
const runtimeSettingsHostRuntimeDiscoveryAdmissionPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeDiscoverySliceId}.json`;
const runtimeSettingsHostRuntimeDiscoveryIauPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeDiscoverySliceId}/IAU-runtime-settings-cli-validation-host-runtime-discovery-v1.json`;
const runtimeSettingsHostRuntimeDiscoveryPreflightPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeDiscoverySliceId}/IAU-runtime-settings-cli-validation-host-runtime-discovery-v1-preflight-v1.json`;
const runtimeSettingsHostRuntimeObservationSliceId = "runtime-settings-cli-validation-host-runtime-observation-adapter-v1";
const runtimeSettingsHostRuntimeObservationFeatureDir = `.specify/specs/${runtimeSettingsHostRuntimeObservationSliceId}`;
const runtimeSettingsHostRuntimeObservationImportDir = `docs/requirements/imports/${runtimeSettingsHostRuntimeObservationSliceId}`;
const runtimeSettingsHostRuntimeObservationAdmissionPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSliceId}.json`;
const runtimeSettingsHostRuntimeObservationIauPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1.json`;
const runtimeSettingsHostRuntimeObservationPreflightPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1-preflight-v1.json`;
const runtimeSettingsHostRuntimeObservationSourceSliceId = "runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1";
const runtimeSettingsHostRuntimeObservationSourceFeatureDir = `.specify/specs/${runtimeSettingsHostRuntimeObservationSourceSliceId}`;
const runtimeSettingsHostRuntimeObservationSourceImportDir = `docs/requirements/imports/${runtimeSettingsHostRuntimeObservationSourceSliceId}`;
const runtimeSettingsHostRuntimeObservationSourceAdmissionPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSourceSliceId}.json`;
const runtimeSettingsHostRuntimeObservationSourceIauPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSourceSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1.json`;
const runtimeSettingsHostRuntimeObservationSourcePreflightPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSourceSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1-preflight-v1.json`;
const runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId = "runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1";
const runtimeSettingsHostRuntimeObservationSourceAcquisitionFeatureDir = `.specify/specs/${runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId}`;
const runtimeSettingsHostRuntimeObservationSourceAcquisitionImportDir = `docs/requirements/imports/${runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId}`;
const runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmissionPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId}.json`;
const runtimeSettingsHostRuntimeObservationSourceAcquisitionIauPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1.json`;
const runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflightPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1-preflight-v1.json`;
const runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId = "runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1";
const runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionFeatureDir = `.specify/specs/${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId}`;
const runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionImportDir = `docs/requirements/imports/${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId}`;
const runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmissionPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId}.json`;
const runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIauPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1.json`;
const runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflightPath = `docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1-preflight-v1.json`;
const extensionVsixPackagingSliceId = "extension-vsix-packaging-artifact-v1";
const extensionVsixPackagingFeatureDir = `.specify/specs/${extensionVsixPackagingSliceId}`;
const extensionVsixPackagingImportDir = `docs/requirements/imports/${extensionVsixPackagingSliceId}`;
const extensionVsixPackagingAdmissionPath = `docs/requirements/admissions/${extensionVsixPackagingSliceId}.json`;
const extensionVsixPackagingIauPath = `docs/requirements/admissions/${extensionVsixPackagingSliceId}/IAU-extension-vsix-packaging-artifact-v1.json`;
const extensionVsixPackagingPreflightPath = `docs/requirements/admissions/${extensionVsixPackagingSliceId}/IAU-extension-vsix-packaging-artifact-v1-preflight-v1.json`;
const marketplaceAdrPath = "docs/decisions/ADR-001-marketplace-publication-disabled.md";
const vsixPackagingAdrPath = "docs/decisions/ADR-002-vsix-packaging-artifact-only.md";
const explicitCompareIauPath = `docs/requirements/admissions/${sliceId}/IAU-runtime-contract-explicit-compare-v1.json`;
const explicitComparePreflightPath = `docs/requirements/admissions/${sliceId}/IAU-runtime-contract-explicit-compare-v1-preflight-v1.json`;
const runtimeFactsIauPath = `docs/requirements/admissions/${sliceId}/IAU-runtime-contract-runtime-facts-v1.json`;
const runtimeFactsPreflightPath = `docs/requirements/admissions/${sliceId}/IAU-runtime-contract-runtime-facts-v1-preflight-v1.json`;
const providerPolicyIauPath = `docs/requirements/admissions/${sliceId}/IAU-runtime-contract-provider-policy-v1.json`;
const providerPolicyPreflightPath = `docs/requirements/admissions/${sliceId}/IAU-runtime-contract-provider-policy-v1-preflight-v1.json`;
const proofIntakeIauPath = `docs/requirements/admissions/${sliceId}/IAU-runtime-contract-proof-intake-v1.json`;
const proofIntakePreflightPath = `docs/requirements/admissions/${sliceId}/IAU-runtime-contract-proof-intake-v1-preflight-v1.json`;
const expectedIds = [
  "VHS-SYS-REQ-004",
  "VHS-SYS-REQ-005",
  "VHS-SYS-REQ-006",
  "VHS-SYS-REQ-007",
  "VHS-SYS-REQ-008",
  "VHS-REQ-094",
  "VHS-REQ-095",
  "VHS-REQ-138",
  "VHS-REQ-141",
  "VHS-REQ-144",
  "VHS-REQ-146",
  "VHS-REQ-148",
  "VHS-REQ-194",
  "VHS-REQ-588",
  "VHS-REQ-589",
  "VHS-REQ-590"
];
const observationExpectedIds = [
  "VHS-REQ-595"
];
const commandExpectedIds = [
  "VHS-REQ-594"
];
const handlerExpectedIds = [
  "VHS-REQ-082",
  "VHS-REQ-083",
  "VHS-REQ-594"
];
const documentationExpectedIds = [
  "VHS-REQ-368",
  "VHS-REQ-369",
  "VHS-REQ-489",
  "VHS-REQ-594"
];
const runtimeSettingsExpectedIds = [
  "VHS-REQ-537",
  "VHS-REQ-544",
  "VHS-REQ-594"
];
const runtimeSettingsWriteExpectedIds = [
  "VHS-REQ-537",
  "VHS-REQ-543"
];
const runtimeSettingsValidateExpectedIds = [
  "VHS-REQ-543",
  "VHS-REQ-546"
];
const runtimeSettingsProofExpectedIds = [
  "VHS-REQ-546"
];
const runtimeSettingsInteractiveExpectedIds = [
  "VHS-REQ-545",
  "VHS-REQ-546"
];
const runtimeSettingsTerminalExpectedIds = [
  "VHS-REQ-537",
  "VHS-REQ-544",
  "VHS-REQ-545",
  "VHS-REQ-546"
];
const runtimeSettingsPromptLoopExpectedIds = [
  "VHS-REQ-545",
  "VHS-REQ-546"
];
const runtimeSettingsTerminalIoExpectedIds = [
  "VHS-REQ-545",
  "VHS-REQ-546"
];
const runtimeSettingsProofOutExpectedIds = [
  "VHS-REQ-546"
];
const runtimeSettingsProofOutFileEmissionExpectedIds = [
  "VHS-REQ-546"
];
const runtimeSettingsRuntimeOutcomeExpectedIds = [
  "VHS-REQ-546"
];
const runtimeSettingsCommandContractExpectedIds = [
  "VHS-REQ-546"
];
const runtimeSettingsPlanOnlyExpectedIds = [
  "VHS-REQ-546"
];
const runtimeSettingsHostRuntimePreflightExpectedIds = [
  "VHS-REQ-532",
  "VHS-REQ-546",
  "VHS-REQ-550"
];
const runtimeSettingsHostPreflightCommandCompositionExpectedIds = [
  "VHS-REQ-546"
];
const runtimeSettingsHostRuntimeDiscoveryExpectedIds = [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "VHS-REQ-532",
  "VHS-REQ-546",
  "VHS-REQ-550"
];
const runtimeSettingsHostRuntimeObservationExpectedIds = [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "VHS-REQ-532",
  "VHS-REQ-546",
  "VHS-REQ-550"
];
const runtimeSettingsHostRuntimeObservationSourceExpectedIds = [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "VHS-REQ-532",
  "VHS-REQ-546",
  "VHS-REQ-550"
];
const runtimeSettingsHostRuntimeObservationSourceAcquisitionExpectedIds = [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "VHS-REQ-532",
  "VHS-REQ-546",
  "VHS-REQ-550"
];
const runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionExpectedIds = [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "VHS-REQ-532",
  "VHS-REQ-546",
  "VHS-REQ-550"
];
const extensionVsixPackagingExpectedIds = [
  "VHS-REQ-596",
  "VHS-REQ-597",
  "VHS-REQ-598",
  "VHS-REQ-599",
  "VHS-REQ-600"
];

const failures = [];

function readJson(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    failures.push(`${relativePath}: ${error.message}`);
    return {};
  }
}

function requireFile(relativePath) {
  if (!fs.existsSync(path.join(repoRoot, relativePath))) {
    failures.push(`${relativePath}: missing`);
  }
}

function requireEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function requireArrayEqual(actual, expected, label) {
  if (!Array.isArray(actual) || actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    failures.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function requireTextIncludes(relativePath, snippets) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${relativePath}: missing`);
    return;
  }

  const text = fs.readFileSync(fullPath, "utf8");
  for (const snippet of snippets) {
    if (!text.includes(snippet)) {
      failures.push(`${relativePath}: missing ${JSON.stringify(snippet)}`);
    }
  }
}

function requireTextExcludes(relativePath, snippets) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${relativePath}: missing`);
    return;
  }

  const text = fs.readFileSync(fullPath, "utf8");
  for (const snippet of snippets) {
    if (text.includes(snippet)) {
      failures.push(`${relativePath}: unexpectedly contains ${JSON.stringify(snippet)}`);
    }
  }
}

function requireMarketplacePosture(record, label) {
  requireEqual(record.marketplacePublication, "disabled", `${label} marketplacePublication`);
  requireEqual(record.marketplacePublicationAdr, marketplaceAdrPath, `${label} marketplacePublicationAdr`);
}

const packageJson = readJson("package.json");
requireEqual(packageJson.name, "vi-history", "package name");
requireEqual(packageJson.displayName, "VI History", "displayName");
requireEqual(packageJson.publisher, "svelderrainruiz", "publisher");
requireEqual(packageJson.version, "0.1.0", "version");
requireEqual(packageJson.license, "MIT", "license");
requireEqual(packageJson.private, false, "private");
requireEqual(packageJson.type, "module", "package type");
requireEqual(packageJson.main, "./out/src/extension.js", "package main");
requireEqual(packageJson.engines?.vscode, "^1.95.0", "VS Code engine");
requireEqual(packageJson.scripts?.["package:vsix"], "npm run compile && node scripts/package-vsix.mjs", "package:vsix script");
requireEqual(packageJson.scripts?.["inspect:vsix"], "node scripts/inspect-vsix-package.mjs", "inspect:vsix script");
requireEqual(typeof packageJson.devDependencies?.["@vscode/vsce"], "string", "@vscode/vsce dev dependency");
requireFile("docs/governance/marketplace-posture.md");
requireFile(marketplaceAdrPath);
requireFile(vsixPackagingAdrPath);

const integration = readJson(".specify/integration.json");
requireEqual(integration.integration, "codex", "Spec Kit integration");

requireTextIncludes(".specify/memory/constitution.md", [
  "runtime-contract-host-provider-v1",
  "installed-user-observation-public-surface-v1",
  "command-activation-surface-v1",
  "command-handler-entrypoint-shell-v1",
  "installed-user-documentation-command-v1",
  "runtime-settings-cli-bootstrap-v1",
  "runtime-settings-cli-settings-write-v1",
  "runtime-settings-cli-validation-readback-v1",
  "runtime-settings-cli-validation-proof-v1",
  "runtime-settings-cli-interactive-selection-v1",
  "runtime-settings-cli-terminal-entrypoint-v1",
  "runtime-settings-cli-terminal-prompt-loop-v1",
  "runtime-settings-cli-terminal-io-adapter-v1",
  "runtime-settings-cli-validation-proof-out-v1",
  "runtime-settings-cli-validation-proof-out-file-emission-v1",
  "runtime-settings-cli-validation-runtime-outcome-v1",
  "runtime-settings-cli-validation-command-contract-v1",
  "runtime-settings-cli-validation-plan-only-v1",
  "runtime-settings-cli-validation-host-runtime-preflight-v1",
  "runtime-settings-cli-validation-host-preflight-command-composition-v1",
  "runtime-settings-cli-validation-host-runtime-discovery-v1",
  "runtime-settings-cli-validation-host-runtime-observation-adapter-v1",
  "runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1",
  "runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1",
  "runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1",
  "extension-vsix-packaging-artifact-v1",
  "**Version**: 0.1.22"
]);

const featureJson = readJson(".specify/feature.json");
requireEqual(featureJson.feature_directory, runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionFeatureDir, "pinned Spec Kit feature directory");

const admission = readJson(admissionPath);
requireEqual(admission.schema, "vi-history/requirements-admission@v1", "admission schema");
requireEqual(admission.sliceId, sliceId, "admission sliceId");
requireEqual(admission.state, "implemented", "admission state");
requireEqual(admission.targetProduct, "vi-history", "admission targetProduct");
requireEqual(admission.targetFeature, sliceId, "admission targetFeature");
requireEqual(admission.sourceBaselineTag, "v1.3.16", "admission sourceBaselineTag");
requireEqual(admission.sourceCommit, "31add781bd04cc832d9fb55aa821a69305a91a37", "admission sourceCommit");
requireEqual(admission.implementationSharing, "none", "admission implementationSharing");
requireMarketplacePosture(admission, "admission");
requireEqual(admission.currentImplementationAdmissionUnit, null, "currentImplementationAdmissionUnit");
requireArrayEqual(admission.completedImplementationScope, ["T007", "T008", "T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016", "T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028", "T029", "T030"], "completedImplementationScope");
requireArrayEqual(admission.admittedImplementationScope, [], "admittedImplementationScope");
requireEqual(admission.preImplementationPreflight?.iauId, "IAU-runtime-contract-proof-intake-v1", "admission preImplementationPreflight iauId");
requireEqual(admission.preImplementationPreflight?.status, "pass", "admission preImplementationPreflight status");
requireEqual(admission.preImplementationPreflight?.implementationStartAllowed, true, "admission preImplementationPreflight implementationStartAllowed");
requireEqual(admission.preImplementationPreflight?.record, proofIntakePreflightPath, "admission preImplementationPreflight record");
requireFile(`docs/requirements/admissions/${sliceId}.md`);

const explicitCompareAdmissionUnit = (admission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-contract-explicit-compare-v1");
requireEqual(explicitCompareAdmissionUnit?.state, "implemented", "explicit compare admission unit state");
requireEqual(explicitCompareAdmissionUnit?.preflightRecord, explicitComparePreflightPath, "explicit compare admission unit preflightRecord");

const runtimeFactsAdmissionUnit = (admission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-contract-runtime-facts-v1");
requireEqual(runtimeFactsAdmissionUnit?.state, "implemented", "runtime facts admission unit state");
requireEqual(runtimeFactsAdmissionUnit?.preflightRecord, runtimeFactsPreflightPath, "runtime facts admission unit preflightRecord");

const providerPolicyAdmissionUnit = (admission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-contract-provider-policy-v1");
requireEqual(providerPolicyAdmissionUnit?.state, "implemented", "provider policy admission unit state");
requireEqual(providerPolicyAdmissionUnit?.preflightRecord, providerPolicyPreflightPath, "provider policy admission unit preflightRecord");

const proofIntakeAdmissionUnit = (admission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-contract-proof-intake-v1");
requireEqual(proofIntakeAdmissionUnit?.state, "implemented", "proof intake admission unit state");
requireEqual(proofIntakeAdmissionUnit?.preflightRecord, proofIntakePreflightPath, "proof intake admission unit preflightRecord");

const explicitCompareIau = readJson(explicitCompareIauPath);
requireEqual(explicitCompareIau.schema, "vi-history/implementation-admission-unit@v1", "explicit compare IAU schema");
requireEqual(explicitCompareIau.iauId, "IAU-runtime-contract-explicit-compare-v1", "explicit compare IAU id");
requireEqual(explicitCompareIau.state, "implemented", "explicit compare IAU state");
requireEqual(explicitCompareIau.parentSliceId, sliceId, "explicit compare IAU parentSliceId");
requireArrayEqual(explicitCompareIau.admittedTasks, ["T012", "T013", "T014", "T015"], "explicit compare IAU admittedTasks");
requireEqual(explicitCompareIau.implementationSharing, "none", "explicit compare IAU implementationSharing");
requireMarketplacePosture(explicitCompareIau, "explicit compare IAU");
requireEqual(explicitCompareIau.preImplementationPreflight?.status, "pass", "explicit compare IAU preImplementationPreflight status");
requireEqual(explicitCompareIau.preImplementationPreflight?.record, "IAU-runtime-contract-explicit-compare-v1-preflight-v1.json", "explicit compare IAU preImplementationPreflight record");
requireEqual(explicitCompareIau.preImplementationPreflight?.implementationStartAllowed, true, "explicit compare IAU preImplementationPreflight implementationStartAllowed");
requireFile(`docs/requirements/admissions/${sliceId}/IAU-runtime-contract-explicit-compare-v1.md`);

const explicitComparePreflight = readJson(explicitComparePreflightPath);
requireEqual(explicitComparePreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "explicit compare preflight schema");
requireEqual(explicitComparePreflight.iauId, "IAU-runtime-contract-explicit-compare-v1", "explicit compare preflight iauId");
requireEqual(explicitComparePreflight.status, "pass", "explicit compare preflight status");
requireEqual(explicitComparePreflight.implementationStartAllowed, true, "explicit compare preflight implementationStartAllowed");
requireEqual(explicitComparePreflight.parentSliceId, sliceId, "explicit compare preflight parentSliceId");
requireEqual(explicitComparePreflight.implementationSharing, "none", "explicit compare preflight implementationSharing");
requireMarketplacePosture(explicitComparePreflight, "explicit compare preflight");
requireArrayEqual(explicitComparePreflight.implementationStartScope, ["T012", "T013", "T014", "T015"], "explicit compare preflight implementationStartScope");
if (!Array.isArray(explicitComparePreflight.checkResults) || explicitComparePreflight.checkResults.length !== explicitComparePreflight.requiredChecks.length) {
  failures.push("explicit compare preflight checkResults: must match requiredChecks length");
} else {
  for (const result of explicitComparePreflight.checkResults) {
    requireEqual(result.status, "pass", `explicit compare preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${sliceId}/IAU-runtime-contract-explicit-compare-v1-preflight-v1.md`);

const runtimeFactsIau = readJson(runtimeFactsIauPath);
requireEqual(runtimeFactsIau.schema, "vi-history/implementation-admission-unit@v1", "runtime facts IAU schema");
requireEqual(runtimeFactsIau.iauId, "IAU-runtime-contract-runtime-facts-v1", "runtime facts IAU id");
requireEqual(runtimeFactsIau.state, "implemented", "runtime facts IAU state");
requireEqual(runtimeFactsIau.parentSliceId, sliceId, "runtime facts IAU parentSliceId");
requireArrayEqual(runtimeFactsIau.admittedTasks, ["T016", "T017", "T018", "T019", "T020", "T021"], "runtime facts IAU admittedTasks");
requireEqual(runtimeFactsIau.implementationSharing, "none", "runtime facts IAU implementationSharing");
requireMarketplacePosture(runtimeFactsIau, "runtime facts IAU");
requireEqual(runtimeFactsIau.preImplementationPreflight?.status, "pass", "runtime facts IAU preImplementationPreflight status");
requireEqual(runtimeFactsIau.preImplementationPreflight?.record, "IAU-runtime-contract-runtime-facts-v1-preflight-v1.json", "runtime facts IAU preImplementationPreflight record");
requireEqual(runtimeFactsIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime facts IAU preImplementationPreflight implementationStartAllowed");
requireFile(`docs/requirements/admissions/${sliceId}/IAU-runtime-contract-runtime-facts-v1.md`);

const runtimeFactsPreflight = readJson(runtimeFactsPreflightPath);
requireEqual(runtimeFactsPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime facts preflight schema");
requireEqual(runtimeFactsPreflight.iauId, "IAU-runtime-contract-runtime-facts-v1", "runtime facts preflight iauId");
requireEqual(runtimeFactsPreflight.status, "pass", "runtime facts preflight status");
requireEqual(runtimeFactsPreflight.implementationStartAllowed, true, "runtime facts preflight implementationStartAllowed");
requireEqual(runtimeFactsPreflight.parentSliceId, sliceId, "runtime facts preflight parentSliceId");
requireEqual(runtimeFactsPreflight.implementationSharing, "none", "runtime facts preflight implementationSharing");
requireMarketplacePosture(runtimeFactsPreflight, "runtime facts preflight");
requireArrayEqual(runtimeFactsPreflight.implementationStartScope, ["T016", "T017", "T018", "T019", "T020", "T021"], "runtime facts preflight implementationStartScope");
if (!Array.isArray(runtimeFactsPreflight.checkResults) || runtimeFactsPreflight.checkResults.length !== runtimeFactsPreflight.requiredChecks.length) {
  failures.push("runtime facts preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeFactsPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime facts preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${sliceId}/IAU-runtime-contract-runtime-facts-v1-preflight-v1.md`);

const providerPolicyIau = readJson(providerPolicyIauPath);
requireEqual(providerPolicyIau.schema, "vi-history/implementation-admission-unit@v1", "provider policy IAU schema");
requireEqual(providerPolicyIau.iauId, "IAU-runtime-contract-provider-policy-v1", "provider policy IAU id");
requireEqual(providerPolicyIau.state, "implemented", "provider policy IAU state");
requireEqual(providerPolicyIau.parentSliceId, sliceId, "provider policy IAU parentSliceId");
requireArrayEqual(providerPolicyIau.admittedTasks, ["T022", "T023", "T024", "T025"], "provider policy IAU admittedTasks");
requireEqual(providerPolicyIau.implementationSharing, "none", "provider policy IAU implementationSharing");
requireMarketplacePosture(providerPolicyIau, "provider policy IAU");
requireEqual(providerPolicyIau.preImplementationPreflight?.status, "pass", "provider policy IAU preImplementationPreflight status");
requireEqual(providerPolicyIau.preImplementationPreflight?.record, "IAU-runtime-contract-provider-policy-v1-preflight-v1.json", "provider policy IAU preImplementationPreflight record");
requireEqual(providerPolicyIau.preImplementationPreflight?.implementationStartAllowed, true, "provider policy IAU preImplementationPreflight implementationStartAllowed");
requireFile(`docs/requirements/admissions/${sliceId}/IAU-runtime-contract-provider-policy-v1.md`);

const providerPolicyPreflight = readJson(providerPolicyPreflightPath);
requireEqual(providerPolicyPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "provider policy preflight schema");
requireEqual(providerPolicyPreflight.iauId, "IAU-runtime-contract-provider-policy-v1", "provider policy preflight iauId");
requireEqual(providerPolicyPreflight.status, "pass", "provider policy preflight status");
requireEqual(providerPolicyPreflight.implementationStartAllowed, true, "provider policy preflight implementationStartAllowed");
requireEqual(providerPolicyPreflight.parentSliceId, sliceId, "provider policy preflight parentSliceId");
requireEqual(providerPolicyPreflight.implementationSharing, "none", "provider policy preflight implementationSharing");
requireMarketplacePosture(providerPolicyPreflight, "provider policy preflight");
requireArrayEqual(providerPolicyPreflight.implementationStartScope, ["T022", "T023", "T024", "T025"], "provider policy preflight implementationStartScope");
if (!Array.isArray(providerPolicyPreflight.checkResults) || providerPolicyPreflight.checkResults.length !== providerPolicyPreflight.requiredChecks.length) {
  failures.push("provider policy preflight checkResults: must match requiredChecks length");
} else {
  for (const result of providerPolicyPreflight.checkResults) {
    requireEqual(result.status, "pass", `provider policy preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${sliceId}/IAU-runtime-contract-provider-policy-v1-preflight-v1.md`);

const proofIntakeIau = readJson(proofIntakeIauPath);
requireEqual(proofIntakeIau.schema, "vi-history/implementation-admission-unit@v1", "proof intake IAU schema");
requireEqual(proofIntakeIau.iauId, "IAU-runtime-contract-proof-intake-v1", "proof intake IAU id");
requireEqual(proofIntakeIau.state, "implemented", "proof intake IAU state");
requireEqual(proofIntakeIau.parentSliceId, sliceId, "proof intake IAU parentSliceId");
requireArrayEqual(proofIntakeIau.admittedTasks, ["T026", "T027", "T028", "T029", "T030"], "proof intake IAU admittedTasks");
requireEqual(proofIntakeIau.implementationSharing, "none", "proof intake IAU implementationSharing");
requireMarketplacePosture(proofIntakeIau, "proof intake IAU");
requireEqual(proofIntakeIau.preImplementationPreflight?.status, "pass", "proof intake IAU preImplementationPreflight status");
requireEqual(proofIntakeIau.preImplementationPreflight?.record, "IAU-runtime-contract-proof-intake-v1-preflight-v1.json", "proof intake IAU preImplementationPreflight record");
requireEqual(proofIntakeIau.preImplementationPreflight?.implementationStartAllowed, true, "proof intake IAU preImplementationPreflight implementationStartAllowed");
requireFile(`docs/requirements/admissions/${sliceId}/IAU-runtime-contract-proof-intake-v1.md`);

const proofIntakePreflight = readJson(proofIntakePreflightPath);
requireEqual(proofIntakePreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "proof intake preflight schema");
requireEqual(proofIntakePreflight.iauId, "IAU-runtime-contract-proof-intake-v1", "proof intake preflight iauId");
requireEqual(proofIntakePreflight.status, "pass", "proof intake preflight status");
requireEqual(proofIntakePreflight.implementationStartAllowed, true, "proof intake preflight implementationStartAllowed");
requireEqual(proofIntakePreflight.parentSliceId, sliceId, "proof intake preflight parentSliceId");
requireEqual(proofIntakePreflight.implementationSharing, "none", "proof intake preflight implementationSharing");
requireMarketplacePosture(proofIntakePreflight, "proof intake preflight");
requireArrayEqual(proofIntakePreflight.implementationStartScope, ["T026", "T027", "T028", "T029", "T030"], "proof intake preflight implementationStartScope");
if (!Array.isArray(proofIntakePreflight.checkResults) || proofIntakePreflight.checkResults.length !== proofIntakePreflight.requiredChecks.length) {
  failures.push("proof intake preflight checkResults: must match requiredChecks length");
} else {
  for (const result of proofIntakePreflight.checkResults) {
    requireEqual(result.status, "pass", `proof intake preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${sliceId}/IAU-runtime-contract-proof-intake-v1-preflight-v1.md`);

const manifest = readJson(`${importDir}/manifest.json`);
requireEqual(manifest.schema, "vi-history/requirements-import@v1", "manifest schema");
requireEqual(manifest.sliceId, sliceId, "sliceId");
requireEqual(manifest.sourceBaselineTag, "v1.3.16", "sourceBaselineTag");
requireEqual(manifest.sourceCommit, "31add781bd04cc832d9fb55aa821a69305a91a37", "sourceCommit");
requireEqual(manifest.targetProduct, "vi-history", "targetProduct");
requireEqual(manifest.targetFeature, sliceId, "targetFeature");
requireEqual(manifest.redactionStatus, "pass", "redactionStatus");
requireEqual(manifest.implementationSharing, "none", "implementationSharing");
requireEqual(manifest.marketplacePublication, "disabled-until-later-adr", "marketplacePublication");
requireArrayEqual(manifest.importedRequirementIds, expectedIds, "importedRequirementIds");
requireArrayEqual(manifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "manifest files");

for (const file of manifest.files ?? []) {
  requireFile(`${importDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${featureDir}/${file}`);
}

requireTextIncludes(`${featureDir}/spec.md`, [
  "Runtime Contract Host Provider",
  "VHS-SYS-REQ-004",
  "VHS-REQ-590",
  "clean-room"
]);
requireTextIncludes(`${featureDir}/plan.md`, [
  "Spec Kit",
  "MIT",
  "no implementation source"
]);
requireTextIncludes("README.md", [
  "IAU-installed-user-observation-model-v1",
  "command-activation-surface-v1",
  "ADR-002 admits local",
  "docs/governance/marketplace-posture.md"
]);
requireTextIncludes("AGENTS.md", [
  "VSIX packaging is authorized only as a local/CI artifact",
  "docs/decisions/ADR-002-vsix-packaging-artifact-only.md",
  "IAU-installed-user-observation-model-v1",
  "command-activation-surface-v1"
]);
requireTextIncludes(marketplaceAdrPath, [
  "ADR-001: Marketplace Publication Disabled",
  "Marketplace publication is out of scope",
  "ADR-002 separately admits local/CI VSIX artifact packaging"
]);
requireTextIncludes(vsixPackagingAdrPath, [
  "ADR-002: VSIX Packaging Artifact Only",
  "local VSIX artifact creation only",
  "Marketplace publication is out of scope"
]);
requireTextIncludes("docs/governance/marketplace-posture.md", [
  "admits local VSIX artifact packaging only",
  "docs/decisions/ADR-001-marketplace-publication-disabled.md",
  "docs/decisions/ADR-002-vsix-packaging-artifact-only.md",
  "No Marketplace publication workflow is admitted"
]);
requireTextIncludes(`${featureDir}/tasks.md`, [
  "Issue #4",
  "blocked until",
  "T007",
  "T011",
  "IAU-runtime-contract-explicit-compare-v1",
  "IAU-runtime-contract-runtime-facts-v1",
  "IAU-runtime-contract-provider-policy-v1",
  "IAU-runtime-contract-proof-intake-v1",
  "runtime-contract closeout PR",
  "Issue #5 records that Marketplace publication remains disabled",
  "- [x] T012",
  "- [x] T013",
  "- [x] T014",
  "- [x] T015",
  "- [x] T016",
  "- [x] T017",
  "- [x] T018",
  "- [x] T019",
  "- [x] T020",
  "- [x] T021",
  "- [x] T022",
  "- [x] T023",
  "- [x] T024",
  "- [x] T025",
  "- [x] T026",
  "- [x] T027",
  "- [x] T028",
  "- [x] T029",
  "- [x] T030",
  "T026",
  "T030"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "Issue #5 closed the Marketplace publication governance decision",
  "docs/decisions/ADR-001-marketplace-publication-disabled.md",
  "IAU-runtime-contract-proof-intake-v1",
  "command-activation-surface-v1",
  "`T026`",
  "`T030`",
  "Docker command execution or container orchestration",
  "plan first",
  "GitHub Issue #4",
  "npm test",
  "npm run check",
  "git diff --check"
]);
requireTextIncludes(`${importDir}/rtm.csv`, expectedIds);

const observationAdmission = readJson(observationAdmissionPath);
requireEqual(observationAdmission.schema, "vi-history/requirements-admission@v1", "observation admission schema");
requireEqual(observationAdmission.sliceId, observationSliceId, "observation admission sliceId");
requireEqual(observationAdmission.state, "implemented", "observation admission state");
requireEqual(observationAdmission.targetProduct, "vi-history", "observation admission targetProduct");
requireEqual(observationAdmission.targetFeature, observationSliceId, "observation admission targetFeature");
requireEqual(observationAdmission.sourceBaselineTag, "v1.3.16", "observation admission sourceBaselineTag");
requireEqual(observationAdmission.sourceCommit, "48232bcc620d4dbe89ff846fda2bfe048b7768fb", "observation admission sourceCommit");
requireEqual(observationAdmission.implementationSharing, "none", "observation admission implementationSharing");
requireMarketplacePosture(observationAdmission, "observation admission");
requireEqual(observationAdmission.currentImplementationAdmissionUnit, null, "observation currentImplementationAdmissionUnit");
requireArrayEqual(observationAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013"], "observation completedImplementationScope");
requireArrayEqual(observationAdmission.admittedImplementationScope, [], "observation admittedImplementationScope");
requireEqual(observationAdmission.preImplementationPreflight?.iauId, "IAU-installed-user-observation-model-v1", "observation preImplementationPreflight iauId");
requireEqual(observationAdmission.preImplementationPreflight?.status, "pass", "observation preImplementationPreflight status");
requireEqual(observationAdmission.preImplementationPreflight?.implementationStartAllowed, true, "observation preImplementationPreflight implementationStartAllowed");
requireEqual(observationAdmission.preImplementationPreflight?.record, observationModelPreflightPath, "observation preImplementationPreflight record");
requireFile(`docs/requirements/admissions/${observationSliceId}.md`);

const observationModelIau = readJson(observationModelIauPath);
requireEqual(observationModelIau.schema, "vi-history/implementation-admission-unit@v1", "observation model IAU schema");
requireEqual(observationModelIau.iauId, "IAU-installed-user-observation-model-v1", "observation model IAU id");
requireEqual(observationModelIau.state, "implemented", "observation model IAU state");
requireEqual(observationModelIau.parentSliceId, observationSliceId, "observation model IAU parentSliceId");
requireArrayEqual(observationModelIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013"], "observation model IAU admittedTasks");
requireArrayEqual(observationModelIau.blockedTasks, ["T014", "T015", "T016"], "observation model IAU blockedTasks");
requireEqual(observationModelIau.implementationSharing, "none", "observation model IAU implementationSharing");
requireMarketplacePosture(observationModelIau, "observation model IAU");
requireEqual(observationModelIau.preImplementationPreflight?.status, "pass", "observation model IAU preImplementationPreflight status");
requireEqual(observationModelIau.preImplementationPreflight?.record, "IAU-installed-user-observation-model-v1-preflight-v1.json", "observation model IAU preImplementationPreflight record");
requireEqual(observationModelIau.preImplementationPreflight?.implementationStartAllowed, true, "observation model IAU preImplementationPreflight implementationStartAllowed");
requireEqual(observationModelIau.implementationCloseout?.status, "pass", "observation model IAU implementationCloseout status");
requireArrayEqual(observationModelIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013"], "observation model IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${observationSliceId}/IAU-installed-user-observation-model-v1.md`);

const observationModelPreflight = readJson(observationModelPreflightPath);
requireEqual(observationModelPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "observation model preflight schema");
requireEqual(observationModelPreflight.iauId, "IAU-installed-user-observation-model-v1", "observation model preflight iauId");
requireEqual(observationModelPreflight.status, "pass", "observation model preflight status");
requireEqual(observationModelPreflight.implementationStartAllowed, true, "observation model preflight implementationStartAllowed");
requireEqual(observationModelPreflight.parentSliceId, observationSliceId, "observation model preflight parentSliceId");
requireEqual(observationModelPreflight.implementationSharing, "none", "observation model preflight implementationSharing");
requireMarketplacePosture(observationModelPreflight, "observation model preflight");
requireArrayEqual(observationModelPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013"], "observation model preflight implementationStartScope");
if (!Array.isArray(observationModelPreflight.checkResults) || observationModelPreflight.checkResults.length !== observationModelPreflight.requiredChecks.length) {
  failures.push("observation model preflight checkResults: must match requiredChecks length");
} else {
  for (const result of observationModelPreflight.checkResults) {
    requireEqual(result.status, "pass", `observation model preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${observationSliceId}/IAU-installed-user-observation-model-v1-preflight-v1.md`);

const observationManifest = readJson(`${observationImportDir}/manifest.json`);
requireEqual(observationManifest.schema, "vi-history/requirements-import@v1", "observation manifest schema");
requireEqual(observationManifest.sliceId, observationSliceId, "observation sliceId");
requireEqual(observationManifest.sourceBaselineTag, "v1.3.16", "observation sourceBaselineTag");
requireEqual(observationManifest.sourceCommit, "48232bcc620d4dbe89ff846fda2bfe048b7768fb", "observation sourceCommit");
requireEqual(observationManifest.targetProduct, "vi-history", "observation targetProduct");
requireEqual(observationManifest.targetFeature, observationSliceId, "observation targetFeature");
requireEqual(observationManifest.redactionStatus, "pass", "observation redactionStatus");
requireEqual(observationManifest.implementationSharing, "none", "observation implementationSharing");
requireEqual(observationManifest.marketplacePublication, "disabled-until-later-adr", "observation marketplacePublication");
requireArrayEqual(observationManifest.importedRequirementIds, observationExpectedIds, "observation importedRequirementIds");
requireArrayEqual(observationManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "observation manifest files");

for (const file of observationManifest.files ?? []) {
  requireFile(`${observationImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${observationFeatureDir}/${file}`);
}

requireTextIncludes(`${observationFeatureDir}/spec.md`, [
  "Installed-User Observation Public Surface",
  "VHS-REQ-595",
  "observed",
  "deferred",
  "blocked",
  "IAU-installed-user-observation-model-v1"
]);
requireTextIncludes(`${observationFeatureDir}/plan.md`, [
  "import/spec baseline",
  "IAU-installed-user-observation-model-v1",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${observationFeatureDir}/tasks.md`, [
  "Issue #25",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T013",
  "IAU-installed-user-observation-model-v1",
  "T009",
  "T013",
  "[BLOCKED]",
  "Issue #27"
]);
requireTextIncludes(`${observationImportDir}/rtm.csv`, observationExpectedIds);
requireTextIncludes("README.md", [
  "installed-user-observation-public-surface-v1",
  "docs/requirements/admissions/installed-user-observation-public-surface-v1.json",
  "IAU-installed-user-observation-model-v1"
]);
requireTextIncludes("AGENTS.md", [
  "installed-user-observation-public-surface-v1",
  "IAU-installed-user-observation-model-v1",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);

const commandAdmission = readJson(commandAdmissionPath);
requireEqual(commandAdmission.schema, "vi-history/requirements-admission@v1", "command admission schema");
requireEqual(commandAdmission.sliceId, commandSliceId, "command admission sliceId");
requireEqual(commandAdmission.state, "implemented", "command admission state");
requireEqual(commandAdmission.targetProduct, "vi-history", "command admission targetProduct");
requireEqual(commandAdmission.targetFeature, commandSliceId, "command admission targetFeature");
requireEqual(commandAdmission.sourceBaselineTag, "v1.3.16", "command admission sourceBaselineTag");
requireEqual(commandAdmission.sourceCommit, "54a9e713bcd788bd91d6893f3c6550716691b7d4", "command admission sourceCommit");
requireEqual(commandAdmission.governedAdmissionCommit, "01ff907ad878ca335e402b37cdf0929d09c17caf", "command admission governedAdmissionCommit");
requireEqual(commandAdmission.implementationSharing, "none", "command admission implementationSharing");
requireMarketplacePosture(commandAdmission, "command admission");
requireEqual(commandAdmission.currentImplementationAdmissionUnit, null, "command currentImplementationAdmissionUnit");
requireArrayEqual(commandAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "command completedSpecScope");
requireArrayEqual(commandAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012"], "command completedImplementationScope");
requireArrayEqual(commandAdmission.admittedImplementationScope, [], "command admittedImplementationScope");
requireEqual(commandAdmission.preImplementationPreflight?.iauId, "IAU-command-activation-manifest-contract-v1", "command preImplementationPreflight iauId");
requireEqual(commandAdmission.preImplementationPreflight?.status, "pass", "command preImplementationPreflight status");
requireEqual(commandAdmission.preImplementationPreflight?.implementationStartAllowed, true, "command preImplementationPreflight implementationStartAllowed");
requireEqual(commandAdmission.preImplementationPreflight?.record, commandManifestPreflightPath, "command preImplementationPreflight record");
requireFile(`docs/requirements/admissions/${commandSliceId}.md`);

const commandManifestIau = readJson(commandManifestIauPath);
requireEqual(commandManifestIau.schema, "vi-history/implementation-admission-unit@v1", "command manifest IAU schema");
requireEqual(commandManifestIau.iauId, "IAU-command-activation-manifest-contract-v1", "command manifest IAU id");
requireEqual(commandManifestIau.state, "implemented", "command manifest IAU state");
requireEqual(commandManifestIau.parentSliceId, commandSliceId, "command manifest IAU parentSliceId");
requireArrayEqual(commandManifestIau.admittedTasks, ["T009", "T010", "T011", "T012"], "command manifest IAU admittedTasks");
requireArrayEqual(commandManifestIau.blockedTasks, ["T013", "T014", "T015", "T016", "T017"], "command manifest IAU blockedTasks");
requireEqual(commandManifestIau.implementationSharing, "none", "command manifest IAU implementationSharing");
requireMarketplacePosture(commandManifestIau, "command manifest IAU");
requireEqual(commandManifestIau.preImplementationPreflight?.status, "pass", "command manifest IAU preImplementationPreflight status");
requireEqual(commandManifestIau.preImplementationPreflight?.record, "IAU-command-activation-manifest-contract-v1-preflight-v1.json", "command manifest IAU preImplementationPreflight record");
requireEqual(commandManifestIau.preImplementationPreflight?.implementationStartAllowed, true, "command manifest IAU preImplementationPreflight implementationStartAllowed");
requireEqual(commandManifestIau.implementationCloseout?.status, "pass", "command manifest IAU implementationCloseout status");
requireArrayEqual(commandManifestIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012"], "command manifest IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${commandSliceId}/IAU-command-activation-manifest-contract-v1.md`);

const commandManifestPreflight = readJson(commandManifestPreflightPath);
requireEqual(commandManifestPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "command manifest preflight schema");
requireEqual(commandManifestPreflight.iauId, "IAU-command-activation-manifest-contract-v1", "command manifest preflight iauId");
requireEqual(commandManifestPreflight.status, "pass", "command manifest preflight status");
requireEqual(commandManifestPreflight.implementationStartAllowed, true, "command manifest preflight implementationStartAllowed");
requireEqual(commandManifestPreflight.parentSliceId, commandSliceId, "command manifest preflight parentSliceId");
requireEqual(commandManifestPreflight.implementationSharing, "none", "command manifest preflight implementationSharing");
requireMarketplacePosture(commandManifestPreflight, "command manifest preflight");
requireArrayEqual(commandManifestPreflight.implementationStartScope, ["T009", "T010", "T011", "T012"], "command manifest preflight implementationStartScope");
if (!Array.isArray(commandManifestPreflight.checkResults) || commandManifestPreflight.checkResults.length !== commandManifestPreflight.requiredChecks.length) {
  failures.push("command manifest preflight checkResults: must match requiredChecks length");
} else {
  for (const result of commandManifestPreflight.checkResults) {
    requireEqual(result.status, "pass", `command manifest preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${commandSliceId}/IAU-command-activation-manifest-contract-v1-preflight-v1.md`);

const commandManifest = readJson(`${commandImportDir}/manifest.json`);
requireEqual(commandManifest.schema, "vi-history/requirements-import@v1", "command manifest schema");
requireEqual(commandManifest.sliceId, commandSliceId, "command sliceId");
requireEqual(commandManifest.sourceBaselineTag, "v1.3.16", "command sourceBaselineTag");
requireEqual(commandManifest.sourceCommit, "54a9e713bcd788bd91d6893f3c6550716691b7d4", "command sourceCommit");
requireEqual(commandManifest.targetProduct, "vi-history", "command targetProduct");
requireEqual(commandManifest.targetFeature, commandSliceId, "command targetFeature");
requireEqual(commandManifest.redactionStatus, "pass", "command redactionStatus");
requireEqual(commandManifest.implementationSharing, "none", "command implementationSharing");
requireEqual(commandManifest.marketplacePublication, "disabled-until-later-adr", "command marketplacePublication");
requireArrayEqual(commandManifest.importedRequirementIds, commandExpectedIds, "command importedRequirementIds");
requireArrayEqual(commandManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "command manifest files");

for (const file of commandManifest.files ?? []) {
  requireFile(`${commandImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${commandFeatureDir}/${file}`);
}

requireTextIncludes(`${commandFeatureDir}/spec.md`, [
  "Command Activation Surface",
  "VHS-REQ-594",
  "labviewViHistory.open",
  "labviewViHistory.openDocumentation",
  "labviewViHistory.prepareLocalRuntimeSettingsCli",
  "manifest-contract IAU implemented"
]);
requireTextIncludes(`${commandFeatureDir}/plan.md`, [
  "import/spec-lock issue",
  "IAU-command-activation-manifest-contract-v1",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${commandFeatureDir}/tasks.md`, [
  "Issue #30",
  "Issue #32",
  "- [x] T001",
  "- [x] T008",
  "IAU-command-activation-manifest-contract-v1",
  "[BLOCKED]",
  "T009",
  "T017",
  "No current IAU is admitted"
]);
requireTextIncludes(`${commandImportDir}/rtm.csv`, commandExpectedIds);
requireTextIncludes(`${commandImportDir}/srs.md`, [
  "VHS-REQ-594",
  "onCommand:labviewViHistory.open",
  "onCommand:labviewViHistory.openDocumentation",
  "onCommand:labviewViHistory.prepareLocalRuntimeSettingsCli"
]);
requireTextIncludes("README.md", [
  "command-activation-surface-v1",
  "docs/requirements/admissions/command-activation-surface-v1.json",
  "Issue #30",
  "Issue #32",
  "IAU-command-activation-manifest-contract-v1"
]);
requireTextIncludes("AGENTS.md", [
  "command-activation-surface-v1",
  "command-handler-entrypoint-shell-v1",
  "Current Implementation Admission Unit",
  "IAU-command-handler-entrypoint-shell-v1"
]);

const handlerAdmission = readJson(handlerAdmissionPath);
requireEqual(handlerAdmission.schema, "vi-history/requirements-admission@v1", "handler admission schema");
requireEqual(handlerAdmission.sliceId, handlerSliceId, "handler admission sliceId");
requireEqual(handlerAdmission.state, "implemented", "handler admission state");
requireEqual(handlerAdmission.targetProduct, "vi-history", "handler admission targetProduct");
requireEqual(handlerAdmission.targetFeature, handlerSliceId, "handler admission targetFeature");
requireEqual(handlerAdmission.sourceBaselineTag, "v1.3.16", "handler admission sourceBaselineTag");
requireEqual(handlerAdmission.sourceCommit, "01ff907ad878ca335e402b37cdf0929d09c17caf", "handler admission sourceCommit");
requireEqual(handlerAdmission.governedAdmissionCommit, "47f5b67ae35d5bb8b18c2bd2db12e0e7f835313d", "handler admission governedAdmissionCommit");
requireEqual(handlerAdmission.implementationSharing, "none", "handler admission implementationSharing");
requireMarketplacePosture(handlerAdmission, "handler admission");
requireEqual(handlerAdmission.currentImplementationAdmissionUnit, null, "handler currentImplementationAdmissionUnit");
requireArrayEqual(handlerAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "handler completedSpecScope");
requireArrayEqual(handlerAdmission.completedImplementationScope, ["T009", "T010", "T011"], "handler completedImplementationScope");
requireArrayEqual(handlerAdmission.admittedImplementationScope, [], "handler admittedImplementationScope");
requireArrayEqual(handlerAdmission.blockedImplementationScope, ["T012", "T013", "T014", "T015"], "handler blockedImplementationScope");
requireEqual(handlerAdmission.preImplementationPreflight?.iauId, "IAU-command-handler-entrypoint-shell-v1", "handler preImplementationPreflight iauId");
requireEqual(handlerAdmission.preImplementationPreflight?.status, "pass", "handler preImplementationPreflight status");
requireEqual(handlerAdmission.preImplementationPreflight?.implementationStartAllowed, true, "handler preImplementationPreflight implementationStartAllowed");
requireEqual(handlerAdmission.preImplementationPreflight?.record, handlerPreflightPath, "handler preImplementationPreflight record");
requireFile(`docs/requirements/admissions/${handlerSliceId}.md`);

const handlerIau = readJson(handlerIauPath);
requireEqual(handlerIau.schema, "vi-history/implementation-admission-unit@v1", "handler IAU schema");
requireEqual(handlerIau.iauId, "IAU-command-handler-entrypoint-shell-v1", "handler IAU id");
requireEqual(handlerIau.state, "implemented", "handler IAU state");
requireEqual(handlerIau.parentSliceId, handlerSliceId, "handler IAU parentSliceId");
requireArrayEqual(handlerIau.admittedTasks, ["T009", "T010", "T011"], "handler IAU admittedTasks");
requireArrayEqual(handlerIau.blockedTasks, ["T012", "T013", "T014", "T015"], "handler IAU blockedTasks");
requireEqual(handlerIau.implementationSharing, "none", "handler IAU implementationSharing");
requireMarketplacePosture(handlerIau, "handler IAU");
requireEqual(handlerIau.preImplementationPreflight?.status, "pass", "handler IAU preImplementationPreflight status");
requireEqual(handlerIau.preImplementationPreflight?.record, "IAU-command-handler-entrypoint-shell-v1-preflight-v1.json", "handler IAU preImplementationPreflight record");
requireEqual(handlerIau.preImplementationPreflight?.implementationStartAllowed, true, "handler IAU preImplementationPreflight implementationStartAllowed");
requireEqual(handlerIau.implementationCloseout?.status, "pass", "handler IAU implementationCloseout status");
requireArrayEqual(handlerIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011"], "handler IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${handlerSliceId}/IAU-command-handler-entrypoint-shell-v1.md`);

const handlerPreflight = readJson(handlerPreflightPath);
requireEqual(handlerPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "handler preflight schema");
requireEqual(handlerPreflight.iauId, "IAU-command-handler-entrypoint-shell-v1", "handler preflight iauId");
requireEqual(handlerPreflight.status, "pass", "handler preflight status");
requireEqual(handlerPreflight.implementationStartAllowed, true, "handler preflight implementationStartAllowed");
requireEqual(handlerPreflight.parentSliceId, handlerSliceId, "handler preflight parentSliceId");
requireEqual(handlerPreflight.implementationSharing, "none", "handler preflight implementationSharing");
requireMarketplacePosture(handlerPreflight, "handler preflight");
requireArrayEqual(handlerPreflight.implementationStartScope, ["T009", "T010", "T011"], "handler preflight implementationStartScope");
if (!Array.isArray(handlerPreflight.checkResults) || handlerPreflight.checkResults.length !== handlerPreflight.requiredChecks.length) {
  failures.push("handler preflight checkResults: must match requiredChecks length");
} else {
  for (const result of handlerPreflight.checkResults) {
    requireEqual(result.status, "pass", `handler preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${handlerSliceId}/IAU-command-handler-entrypoint-shell-v1-preflight-v1.md`);

const handlerManifest = readJson(`${handlerImportDir}/manifest.json`);
requireEqual(handlerManifest.schema, "vi-history/requirements-import@v1", "handler manifest schema");
requireEqual(handlerManifest.sliceId, handlerSliceId, "handler sliceId");
requireEqual(handlerManifest.sourceBaselineTag, "v1.3.16", "handler sourceBaselineTag");
requireEqual(handlerManifest.sourceCommit, "01ff907ad878ca335e402b37cdf0929d09c17caf", "handler sourceCommit");
requireEqual(handlerManifest.governedAdmissionCommit, "47f5b67ae35d5bb8b18c2bd2db12e0e7f835313d", "handler governedAdmissionCommit");
requireEqual(handlerManifest.targetProduct, "vi-history", "handler targetProduct");
requireEqual(handlerManifest.targetFeature, handlerSliceId, "handler targetFeature");
requireEqual(handlerManifest.redactionStatus, "pass", "handler redactionStatus");
requireEqual(handlerManifest.implementationSharing, "none", "handler implementationSharing");
requireEqual(handlerManifest.marketplacePublication, "disabled-until-later-adr", "handler marketplacePublication");
requireArrayEqual(handlerManifest.importedRequirementIds, handlerExpectedIds, "handler importedRequirementIds");
requireArrayEqual(handlerManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "handler manifest files");

for (const file of handlerManifest.files ?? []) {
  requireFile(`${handlerImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${handlerFeatureDir}/${file}`);
}

requireTextIncludes(`${handlerFeatureDir}/spec.md`, [
  "Command Handler Entrypoint Shell",
  "VHS-REQ-082",
  "VHS-REQ-083",
  "VHS-REQ-594",
  "IAU-command-handler-entrypoint-shell-v1"
]);
requireTextIncludes(`${handlerFeatureDir}/plan.md`, [
  "IAU-command-handler-entrypoint-shell-v1",
  "Issue #36",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${handlerFeatureDir}/tasks.md`, [
  "Issue #36",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T010",
  "- [x] T011",
  "IAU-command-handler-entrypoint-shell-v1",
  "[BLOCKED]",
  "T015"
]);
requireTextIncludes(`${handlerImportDir}/rtm.csv`, handlerExpectedIds);
requireTextIncludes(`${handlerImportDir}/srs.md`, [
  "VHS-REQ-082",
  "VHS-REQ-083",
  "VHS-REQ-594",
  "labviewViHistory.open"
]);
requireTextIncludes("README.md", [
  "command-handler-entrypoint-shell-v1",
  "docs/requirements/admissions/command-handler-entrypoint-shell-v1.json",
  "Issue #36",
  "IAU-command-handler-entrypoint-shell-v1"
]);

const documentationAdmission = readJson(documentationAdmissionPath);
requireEqual(documentationAdmission.schema, "vi-history/requirements-admission@v1", "documentation admission schema");
requireEqual(documentationAdmission.sliceId, documentationSliceId, "documentation admission sliceId");
requireEqual(documentationAdmission.state, "implemented", "documentation admission state");
requireEqual(documentationAdmission.targetProduct, "vi-history", "documentation admission targetProduct");
requireEqual(documentationAdmission.targetFeature, documentationSliceId, "documentation admission targetFeature");
requireEqual(documentationAdmission.sourceBaselineTag, "v1.3.16", "documentation admission sourceBaselineTag");
requireEqual(documentationAdmission.sourceCommit, "47f5b67ae35d5bb8b18c2bd2db12e0e7f835313d", "documentation admission sourceCommit");
requireEqual(documentationAdmission.governedAdmissionCommit, "ff950d6b7401fe31c5a12aea28bcad9099b254f1", "documentation admission governedAdmissionCommit");
requireEqual(documentationAdmission.implementationSharing, "none", "documentation admission implementationSharing");
requireMarketplacePosture(documentationAdmission, "documentation admission");
requireEqual(documentationAdmission.currentImplementationAdmissionUnit, null, "documentation currentImplementationAdmissionUnit");
requireArrayEqual(documentationAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "documentation completedSpecScope");
requireArrayEqual(documentationAdmission.completedImplementationScope, ["T009", "T010", "T011"], "documentation completedImplementationScope");
requireArrayEqual(documentationAdmission.admittedImplementationScope, [], "documentation admittedImplementationScope");
requireArrayEqual(documentationAdmission.blockedImplementationScope, ["T012", "T013", "T014", "T015"], "documentation blockedImplementationScope");
requireEqual(documentationAdmission.preImplementationPreflight?.iauId, "IAU-documentation-command-panel-shell-v1", "documentation preImplementationPreflight iauId");
requireEqual(documentationAdmission.preImplementationPreflight?.status, "pass", "documentation preImplementationPreflight status");
requireEqual(documentationAdmission.preImplementationPreflight?.implementationStartAllowed, true, "documentation preImplementationPreflight implementationStartAllowed");
requireEqual(documentationAdmission.preImplementationPreflight?.record, documentationPreflightPath, "documentation preImplementationPreflight record");
requireFile(`docs/requirements/admissions/${documentationSliceId}.md`);

const documentationIau = readJson(documentationIauPath);
requireEqual(documentationIau.schema, "vi-history/implementation-admission-unit@v1", "documentation IAU schema");
requireEqual(documentationIau.iauId, "IAU-documentation-command-panel-shell-v1", "documentation IAU id");
requireEqual(documentationIau.state, "implemented", "documentation IAU state");
requireEqual(documentationIau.parentSliceId, documentationSliceId, "documentation IAU parentSliceId");
requireArrayEqual(documentationIau.admittedTasks, ["T009", "T010", "T011"], "documentation IAU admittedTasks");
requireArrayEqual(documentationIau.blockedTasks, ["T012", "T013", "T014", "T015"], "documentation IAU blockedTasks");
requireEqual(documentationIau.implementationSharing, "none", "documentation IAU implementationSharing");
requireMarketplacePosture(documentationIau, "documentation IAU");
requireEqual(documentationIau.preImplementationPreflight?.status, "pass", "documentation IAU preImplementationPreflight status");
requireEqual(documentationIau.preImplementationPreflight?.record, "IAU-documentation-command-panel-shell-v1-preflight-v1.json", "documentation IAU preImplementationPreflight record");
requireEqual(documentationIau.preImplementationPreflight?.implementationStartAllowed, true, "documentation IAU preImplementationPreflight implementationStartAllowed");
requireFile(`docs/requirements/admissions/${documentationSliceId}/IAU-documentation-command-panel-shell-v1.md`);

const documentationPreflight = readJson(documentationPreflightPath);
requireEqual(documentationPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "documentation preflight schema");
requireEqual(documentationPreflight.iauId, "IAU-documentation-command-panel-shell-v1", "documentation preflight iauId");
requireEqual(documentationPreflight.status, "pass", "documentation preflight status");
requireEqual(documentationPreflight.implementationStartAllowed, true, "documentation preflight implementationStartAllowed");
requireEqual(documentationPreflight.parentSliceId, documentationSliceId, "documentation preflight parentSliceId");
requireEqual(documentationPreflight.implementationSharing, "none", "documentation preflight implementationSharing");
requireMarketplacePosture(documentationPreflight, "documentation preflight");
requireArrayEqual(documentationPreflight.implementationStartScope, ["T009", "T010", "T011"], "documentation preflight implementationStartScope");
if (!Array.isArray(documentationPreflight.checkResults) || documentationPreflight.checkResults.length !== documentationPreflight.requiredChecks.length) {
  failures.push("documentation preflight checkResults: must match requiredChecks length");
} else {
  for (const result of documentationPreflight.checkResults) {
    requireEqual(result.status, "pass", `documentation preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${documentationSliceId}/IAU-documentation-command-panel-shell-v1-preflight-v1.md`);

const documentationManifest = readJson(`${documentationImportDir}/manifest.json`);
requireEqual(documentationManifest.schema, "vi-history/requirements-import@v1", "documentation manifest schema");
requireEqual(documentationManifest.sliceId, documentationSliceId, "documentation sliceId");
requireEqual(documentationManifest.sourceBaselineTag, "v1.3.16", "documentation sourceBaselineTag");
requireEqual(documentationManifest.sourceCommit, "47f5b67ae35d5bb8b18c2bd2db12e0e7f835313d", "documentation sourceCommit");
requireEqual(documentationManifest.governedAdmissionCommit, "ff950d6b7401fe31c5a12aea28bcad9099b254f1", "documentation governedAdmissionCommit");
requireEqual(documentationManifest.targetProduct, "vi-history", "documentation targetProduct");
requireEqual(documentationManifest.targetFeature, documentationSliceId, "documentation targetFeature");
requireEqual(documentationManifest.redactionStatus, "pass", "documentation redactionStatus");
requireEqual(documentationManifest.implementationSharing, "none", "documentation implementationSharing");
requireEqual(documentationManifest.marketplacePublication, "disabled-until-later-adr", "documentation marketplacePublication");
requireArrayEqual(documentationManifest.importedRequirementIds, documentationExpectedIds, "documentation importedRequirementIds");
requireArrayEqual(documentationManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "documentation manifest files");

for (const file of documentationManifest.files ?? []) {
  requireFile(`${documentationImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${documentationFeatureDir}/${file}`);
}

requireTextIncludes(`${documentationFeatureDir}/spec.md`, [
  "Installed-User Documentation Command",
  "VHS-REQ-368",
  "VHS-REQ-369",
  "VHS-REQ-489",
  "VHS-REQ-594",
  "IAU-documentation-command-panel-shell-v1"
]);
requireTextIncludes(`${documentationFeatureDir}/plan.md`, [
  "IAU-documentation-command-panel-shell-v1",
  "Issue #39",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${documentationFeatureDir}/tasks.md`, [
  "Issue #39",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T010",
  "- [x] T011",
  "IAU-documentation-command-panel-shell-v1",
  "Issue #41",
  "[BLOCKED]",
  "T015"
]);
requireTextIncludes(`${documentationImportDir}/rtm.csv`, documentationExpectedIds);
requireTextIncludes(`${documentationImportDir}/srs.md`, [
  "VHS-REQ-368",
  "VHS-REQ-369",
  "VHS-REQ-489",
  "VHS-REQ-594",
  "labviewViHistory.openDocumentation"
]);
requireTextIncludes("README.md", [
  "installed-user-documentation-command-v1",
  "docs/requirements/admissions/installed-user-documentation-command-v1.json",
  "Issue #39",
  "Issue #41",
  "IAU-documentation-command-panel-shell-v1"
]);
requireTextIncludes("AGENTS.md", [
  "installed-user-documentation-command-v1",
  "Current Implementation Admission Unit",
  "IAU-documentation-command-panel-shell-v1"
]);

const runtimeSettingsAdmission = readJson(runtimeSettingsAdmissionPath);
requireEqual(runtimeSettingsAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings admission schema");
requireEqual(runtimeSettingsAdmission.sliceId, runtimeSettingsSliceId, "runtime settings admission sliceId");
requireEqual(runtimeSettingsAdmission.state, "implemented", "runtime settings admission state");
requireEqual(runtimeSettingsAdmission.targetProduct, "vi-history", "runtime settings admission targetProduct");
requireEqual(runtimeSettingsAdmission.targetFeature, runtimeSettingsSliceId, "runtime settings admission targetFeature");
requireEqual(runtimeSettingsAdmission.sourceBaselineTag, "v1.3.16", "runtime settings admission sourceBaselineTag");
requireEqual(runtimeSettingsAdmission.sourceCommit, "ff950d6b7401fe31c5a12aea28bcad9099b254f1", "runtime settings admission sourceCommit");
requireEqual(runtimeSettingsAdmission.governedAdmissionCommit, "110bf8e0a98478d141244ae0c53240e4cf93a790", "runtime settings admission governedAdmissionCommit");
requireEqual(runtimeSettingsAdmission.implementationSharing, "none", "runtime settings admission implementationSharing");
requireMarketplacePosture(runtimeSettingsAdmission, "runtime settings admission");
requireEqual(runtimeSettingsAdmission.currentImplementationAdmissionUnit, null, "runtime settings currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings completedSpecScope");
requireArrayEqual(runtimeSettingsAdmission.completedImplementationScope, ["T009", "T010", "T011"], "runtime settings completedImplementationScope");
requireArrayEqual(runtimeSettingsAdmission.admittedImplementationScope, [], "runtime settings admittedImplementationScope");
requireArrayEqual(runtimeSettingsAdmission.blockedImplementationScope, ["T012", "T013", "T014", "T015"], "runtime settings blockedImplementationScope");
requireEqual(runtimeSettingsAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-prepare-command-shell-v1", "runtime settings preImplementationPreflight iauId");
requireEqual(runtimeSettingsAdmission.preImplementationPreflight?.status, "pass", "runtime settings preImplementationPreflight status");
requireEqual(runtimeSettingsAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsAdmission.preImplementationPreflight?.record, runtimeSettingsPreflightPath, "runtime settings preImplementationPreflight record");
requireFile(`docs/requirements/admissions/${runtimeSettingsSliceId}.md`);

const runtimeSettingsAdmissionUnit = (runtimeSettingsAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-prepare-command-shell-v1");
requireEqual(runtimeSettingsAdmissionUnit?.state, "implemented", "runtime settings admission unit state");
requireEqual(runtimeSettingsAdmissionUnit?.preflightRecord, runtimeSettingsPreflightPath, "runtime settings admission unit preflightRecord");

const runtimeSettingsIau = readJson(runtimeSettingsIauPath);
requireEqual(runtimeSettingsIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings IAU schema");
requireEqual(runtimeSettingsIau.iauId, "IAU-runtime-settings-cli-prepare-command-shell-v1", "runtime settings IAU id");
requireEqual(runtimeSettingsIau.state, "implemented", "runtime settings IAU state");
requireEqual(runtimeSettingsIau.parentSliceId, runtimeSettingsSliceId, "runtime settings IAU parentSliceId");
requireArrayEqual(runtimeSettingsIau.admittedTasks, ["T009", "T010", "T011"], "runtime settings IAU admittedTasks");
requireArrayEqual(runtimeSettingsIau.blockedTasks, ["T012", "T013", "T014", "T015"], "runtime settings IAU blockedTasks");
requireEqual(runtimeSettingsIau.implementationSharing, "none", "runtime settings IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsIau, "runtime settings IAU");
requireEqual(runtimeSettingsIau.preImplementationPreflight?.status, "pass", "runtime settings IAU preImplementationPreflight status");
requireEqual(runtimeSettingsIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-prepare-command-shell-v1-preflight-v1.json", "runtime settings IAU preImplementationPreflight record");
requireEqual(runtimeSettingsIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsIau.implementationCloseout?.status, "pass", "runtime settings IAU implementationCloseout status");
requireArrayEqual(runtimeSettingsIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011"], "runtime settings IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsSliceId}/IAU-runtime-settings-cli-prepare-command-shell-v1.md`);

const runtimeSettingsPreflight = readJson(runtimeSettingsPreflightPath);
requireEqual(runtimeSettingsPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings preflight schema");
requireEqual(runtimeSettingsPreflight.iauId, "IAU-runtime-settings-cli-prepare-command-shell-v1", "runtime settings preflight iauId");
requireEqual(runtimeSettingsPreflight.status, "pass", "runtime settings preflight status");
requireEqual(runtimeSettingsPreflight.implementationStartAllowed, true, "runtime settings preflight implementationStartAllowed");
requireEqual(runtimeSettingsPreflight.parentSliceId, runtimeSettingsSliceId, "runtime settings preflight parentSliceId");
requireEqual(runtimeSettingsPreflight.implementationSharing, "none", "runtime settings preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsPreflight, "runtime settings preflight");
requireArrayEqual(runtimeSettingsPreflight.implementationStartScope, ["T009", "T010", "T011"], "runtime settings preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsPreflight.checkResults) || runtimeSettingsPreflight.checkResults.length !== runtimeSettingsPreflight.requiredChecks.length) {
  failures.push("runtime settings preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsSliceId}/IAU-runtime-settings-cli-prepare-command-shell-v1-preflight-v1.md`);

const runtimeSettingsManifest = readJson(`${runtimeSettingsImportDir}/manifest.json`);
requireEqual(runtimeSettingsManifest.schema, "vi-history/requirements-import@v1", "runtime settings manifest schema");
requireEqual(runtimeSettingsManifest.sliceId, runtimeSettingsSliceId, "runtime settings sliceId");
requireEqual(runtimeSettingsManifest.sourceBaselineTag, "v1.3.16", "runtime settings sourceBaselineTag");
requireEqual(runtimeSettingsManifest.sourceCommit, "ff950d6b7401fe31c5a12aea28bcad9099b254f1", "runtime settings sourceCommit");
requireEqual(runtimeSettingsManifest.governedAdmissionCommit, "110bf8e0a98478d141244ae0c53240e4cf93a790", "runtime settings governedAdmissionCommit");
requireEqual(runtimeSettingsManifest.targetProduct, "vi-history", "runtime settings targetProduct");
requireEqual(runtimeSettingsManifest.targetFeature, runtimeSettingsSliceId, "runtime settings targetFeature");
requireEqual(runtimeSettingsManifest.redactionStatus, "pass", "runtime settings redactionStatus");
requireEqual(runtimeSettingsManifest.implementationSharing, "none", "runtime settings implementationSharing");
requireEqual(runtimeSettingsManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings marketplacePublication");
requireArrayEqual(runtimeSettingsManifest.importedRequirementIds, runtimeSettingsExpectedIds, "runtime settings importedRequirementIds");
requireArrayEqual(runtimeSettingsManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings manifest files");

for (const file of runtimeSettingsManifest.files ?? []) {
  requireFile(`${runtimeSettingsImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsFeatureDir}/spec.md`, [
  "Runtime Settings CLI Bootstrap",
  "VHS-REQ-537",
  "VHS-REQ-544",
  "VHS-REQ-594",
  "IAU-runtime-settings-cli-prepare-command-shell-v1",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-prepare-command-shell-v1",
  "Issue #43",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${runtimeSettingsFeatureDir}/tasks.md`, [
  "Issue #43",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T010",
  "- [x] T011",
  "IAU-runtime-settings-cli-prepare-command-shell-v1",
  "Issue #45",
  "[BLOCKED]",
  "T015"
]);
requireTextIncludes(`${runtimeSettingsImportDir}/rtm.csv`, runtimeSettingsExpectedIds);
requireTextIncludes(`${runtimeSettingsImportDir}/srs.md`, [
  "VHS-REQ-537",
  "VHS-REQ-544",
  "VHS-REQ-594",
  "labviewViHistory.prepareLocalRuntimeSettingsCli"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-bootstrap-v1",
  "docs/requirements/admissions/runtime-settings-cli-bootstrap-v1.json",
  "Issue #43",
  "Issue #45",
  "IAU-runtime-settings-cli-prepare-command-shell-v1"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-bootstrap-v1",
  "Current Implementation Admission Unit",
  "IAU-runtime-settings-cli-prepare-command-shell-v1",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-bootstrap-v1",
  "Issue #43",
  "Issue #45",
  "IAU-runtime-settings-cli-prepare-command-shell-v1",
  "runtime settings mutation beyond the admitted provider/version/bitness"
]);

const runtimeSettingsWriteAdmission = readJson(runtimeSettingsWriteAdmissionPath);
requireEqual(runtimeSettingsWriteAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings write admission schema");
requireEqual(runtimeSettingsWriteAdmission.sliceId, runtimeSettingsWriteSliceId, "runtime settings write admission sliceId");
requireEqual(runtimeSettingsWriteAdmission.state, "implemented", "runtime settings write admission state");
requireEqual(runtimeSettingsWriteAdmission.targetProduct, "vi-history", "runtime settings write admission targetProduct");
requireEqual(runtimeSettingsWriteAdmission.targetFeature, runtimeSettingsWriteSliceId, "runtime settings write admission targetFeature");
requireEqual(runtimeSettingsWriteAdmission.sourceBaselineTag, "v1.3.16", "runtime settings write admission sourceBaselineTag");
requireEqual(runtimeSettingsWriteAdmission.sourceCommit, "110bf8e0a98478d141244ae0c53240e4cf93a790", "runtime settings write admission sourceCommit");
requireEqual(runtimeSettingsWriteAdmission.governedAdmissionCommit, "72c9a700da501eba23e16e3d35b385ec8d8d6808", "runtime settings write admission governedAdmissionCommit");
requireEqual(runtimeSettingsWriteAdmission.implementationSharing, "none", "runtime settings write admission implementationSharing");
requireMarketplacePosture(runtimeSettingsWriteAdmission, "runtime settings write admission");
requireEqual(runtimeSettingsWriteAdmission.currentImplementationAdmissionUnit, null, "runtime settings write currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsWriteAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings write completedSpecScope");
requireArrayEqual(runtimeSettingsWriteAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012"], "runtime settings write completedImplementationScope");
requireArrayEqual(runtimeSettingsWriteAdmission.admittedImplementationScope, [], "runtime settings write admittedImplementationScope");
requireArrayEqual(runtimeSettingsWriteAdmission.blockedImplementationScope, ["T013", "T014", "T015", "T016", "T017"], "runtime settings write blockedImplementationScope");
requireEqual(runtimeSettingsWriteAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-settings-write-contract-v1", "runtime settings write preImplementationPreflight iauId");
requireEqual(runtimeSettingsWriteAdmission.preImplementationPreflight?.status, "pass", "runtime settings write preImplementationPreflight status");
requireEqual(runtimeSettingsWriteAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings write preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsWriteAdmission.preImplementationPreflight?.record, runtimeSettingsWritePreflightPath, "runtime settings write preImplementationPreflight record");
requireEqual(runtimeSettingsWriteAdmission.implementationCloseout?.status, "pass", "runtime settings write implementationCloseout status");
requireArrayEqual(runtimeSettingsWriteAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012"], "runtime settings write implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsWriteSliceId}.md`);

const runtimeSettingsWriteAdmissionUnit = (runtimeSettingsWriteAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-settings-write-contract-v1");
requireEqual(runtimeSettingsWriteAdmissionUnit?.state, "implemented", "runtime settings write admission unit state");
requireEqual(runtimeSettingsWriteAdmissionUnit?.preflightRecord, runtimeSettingsWritePreflightPath, "runtime settings write admission unit preflightRecord");

const runtimeSettingsWriteIau = readJson(runtimeSettingsWriteIauPath);
requireEqual(runtimeSettingsWriteIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings write IAU schema");
requireEqual(runtimeSettingsWriteIau.iauId, "IAU-runtime-settings-cli-settings-write-contract-v1", "runtime settings write IAU id");
requireEqual(runtimeSettingsWriteIau.state, "implemented", "runtime settings write IAU state");
requireEqual(runtimeSettingsWriteIau.parentSliceId, runtimeSettingsWriteSliceId, "runtime settings write IAU parentSliceId");
requireArrayEqual(runtimeSettingsWriteIau.admittedTasks, ["T009", "T010", "T011", "T012"], "runtime settings write IAU admittedTasks");
requireArrayEqual(runtimeSettingsWriteIau.blockedTasks, ["T013", "T014", "T015", "T016", "T017"], "runtime settings write IAU blockedTasks");
requireEqual(runtimeSettingsWriteIau.implementationSharing, "none", "runtime settings write IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsWriteIau, "runtime settings write IAU");
requireEqual(runtimeSettingsWriteIau.preImplementationPreflight?.status, "pass", "runtime settings write IAU preImplementationPreflight status");
requireEqual(runtimeSettingsWriteIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-settings-write-contract-v1-preflight-v1.json", "runtime settings write IAU preImplementationPreflight record");
requireEqual(runtimeSettingsWriteIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings write IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsWriteIau.implementationCloseout?.status, "pass", "runtime settings write IAU implementationCloseout status");
requireArrayEqual(runtimeSettingsWriteIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012"], "runtime settings write IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsWriteSliceId}/IAU-runtime-settings-cli-settings-write-contract-v1.md`);

const runtimeSettingsWritePreflight = readJson(runtimeSettingsWritePreflightPath);
requireEqual(runtimeSettingsWritePreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings write preflight schema");
requireEqual(runtimeSettingsWritePreflight.iauId, "IAU-runtime-settings-cli-settings-write-contract-v1", "runtime settings write preflight iauId");
requireEqual(runtimeSettingsWritePreflight.status, "pass", "runtime settings write preflight status");
requireEqual(runtimeSettingsWritePreflight.implementationStartAllowed, true, "runtime settings write preflight implementationStartAllowed");
requireEqual(runtimeSettingsWritePreflight.parentSliceId, runtimeSettingsWriteSliceId, "runtime settings write preflight parentSliceId");
requireEqual(runtimeSettingsWritePreflight.implementationSharing, "none", "runtime settings write preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsWritePreflight, "runtime settings write preflight");
requireArrayEqual(runtimeSettingsWritePreflight.implementationStartScope, ["T009", "T010", "T011", "T012"], "runtime settings write preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsWritePreflight.checkResults) || runtimeSettingsWritePreflight.checkResults.length !== runtimeSettingsWritePreflight.requiredChecks.length) {
  failures.push("runtime settings write preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsWritePreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings write preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsWriteSliceId}/IAU-runtime-settings-cli-settings-write-contract-v1-preflight-v1.md`);

const runtimeSettingsWriteManifest = readJson(`${runtimeSettingsWriteImportDir}/manifest.json`);
requireEqual(runtimeSettingsWriteManifest.schema, "vi-history/requirements-import@v1", "runtime settings write manifest schema");
requireEqual(runtimeSettingsWriteManifest.sliceId, runtimeSettingsWriteSliceId, "runtime settings write sliceId");
requireEqual(runtimeSettingsWriteManifest.sourceBaselineTag, "v1.3.16", "runtime settings write sourceBaselineTag");
requireEqual(runtimeSettingsWriteManifest.sourceCommit, "110bf8e0a98478d141244ae0c53240e4cf93a790", "runtime settings write sourceCommit");
requireEqual(runtimeSettingsWriteManifest.governedAdmissionCommit, "72c9a700da501eba23e16e3d35b385ec8d8d6808", "runtime settings write governedAdmissionCommit");
requireEqual(runtimeSettingsWriteManifest.targetProduct, "vi-history", "runtime settings write targetProduct");
requireEqual(runtimeSettingsWriteManifest.targetFeature, runtimeSettingsWriteSliceId, "runtime settings write targetFeature");
requireEqual(runtimeSettingsWriteManifest.redactionStatus, "pass", "runtime settings write redactionStatus");
requireEqual(runtimeSettingsWriteManifest.implementationSharing, "none", "runtime settings write implementationSharing");
requireEqual(runtimeSettingsWriteManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings write marketplacePublication");
requireArrayEqual(runtimeSettingsWriteManifest.importedRequirementIds, runtimeSettingsWriteExpectedIds, "runtime settings write importedRequirementIds");
requireArrayEqual(runtimeSettingsWriteManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings write manifest files");

for (const file of runtimeSettingsWriteManifest.files ?? []) {
  requireFile(`${runtimeSettingsWriteImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsWriteFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsWriteFeatureDir}/spec.md`, [
  "Runtime Settings CLI Settings Write",
  "VHS-REQ-537",
  "VHS-REQ-543",
  "IAU-runtime-settings-cli-settings-write-contract-v1",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsWriteFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-settings-write-contract-v1",
  "Issue #47",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${runtimeSettingsWriteFeatureDir}/tasks.md`, [
  "Issue #47",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T012",
  "IAU-runtime-settings-cli-settings-write-contract-v1",
  "Issue #49",
  "[BLOCKED]",
  "T017"
]);
requireTextIncludes(`${runtimeSettingsWriteImportDir}/rtm.csv`, runtimeSettingsWriteExpectedIds);
requireTextIncludes(`${runtimeSettingsWriteImportDir}/srs.md`, [
  "VHS-REQ-537",
  "VHS-REQ-543",
  "runtimeProvider",
  "labviewVersion",
  "labviewBitness"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-settings-write-v1",
  "docs/requirements/admissions/runtime-settings-cli-settings-write-v1.json",
  "Issue #47",
  "IAU-runtime-settings-cli-settings-write-contract-v1"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-settings-write-v1",
  "Current Implementation Admission Unit",
  "IAU-runtime-settings-cli-settings-write-contract-v1",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-settings-write-v1",
  "Issue #47",
  "Issue #49",
  "IAU-runtime-settings-cli-settings-write-contract-v1",
  "runtime settings mutation beyond the admitted provider/version/bitness"
]);

const runtimeSettingsValidateAdmission = readJson(runtimeSettingsValidateAdmissionPath);
requireEqual(runtimeSettingsValidateAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings validate admission schema");
requireEqual(runtimeSettingsValidateAdmission.sliceId, runtimeSettingsValidateSliceId, "runtime settings validate admission sliceId");
requireEqual(runtimeSettingsValidateAdmission.state, "implemented", "runtime settings validate admission state");
requireEqual(runtimeSettingsValidateAdmission.targetProduct, "vi-history", "runtime settings validate admission targetProduct");
requireEqual(runtimeSettingsValidateAdmission.targetFeature, runtimeSettingsValidateSliceId, "runtime settings validate admission targetFeature");
requireEqual(runtimeSettingsValidateAdmission.sourceBaselineTag, "v1.3.16", "runtime settings validate admission sourceBaselineTag");
requireEqual(runtimeSettingsValidateAdmission.sourceCommit, "72c9a700da501eba23e16e3d35b385ec8d8d6808", "runtime settings validate admission sourceCommit");
requireEqual(runtimeSettingsValidateAdmission.governedAdmissionCommit, "f9b2cb76f6de98e97354d1fb8e5c81e3adc8f6e2", "runtime settings validate admission governedAdmissionCommit");
requireEqual(runtimeSettingsValidateAdmission.implementationSharing, "none", "runtime settings validate admission implementationSharing");
requireMarketplacePosture(runtimeSettingsValidateAdmission, "runtime settings validate admission");
requireEqual(runtimeSettingsValidateAdmission.currentImplementationAdmissionUnit, null, "runtime settings validate currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsValidateAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings validate completedSpecScope");
requireArrayEqual(runtimeSettingsValidateAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012"], "runtime settings validate completedImplementationScope");
requireArrayEqual(runtimeSettingsValidateAdmission.admittedImplementationScope, [], "runtime settings validate admittedImplementationScope");
requireArrayEqual(runtimeSettingsValidateAdmission.blockedImplementationScope, ["T013", "T014", "T015", "T016", "T017", "T018"], "runtime settings validate blockedImplementationScope");
requireEqual(runtimeSettingsValidateAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-readback-contract-v1", "runtime settings validate preImplementationPreflight iauId");
requireEqual(runtimeSettingsValidateAdmission.preImplementationPreflight?.status, "pass", "runtime settings validate preImplementationPreflight status");
requireEqual(runtimeSettingsValidateAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings validate preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsValidateAdmission.preImplementationPreflight?.record, runtimeSettingsValidatePreflightPath, "runtime settings validate preImplementationPreflight record");
requireEqual(runtimeSettingsValidateAdmission.implementationCloseout?.status, "pass", "runtime settings validate implementationCloseout status");
requireArrayEqual(runtimeSettingsValidateAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012"], "runtime settings validate implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsValidateSliceId}.md`);

const runtimeSettingsValidateAdmissionUnit = (runtimeSettingsValidateAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-readback-contract-v1");
requireEqual(runtimeSettingsValidateAdmissionUnit?.state, "implemented", "runtime settings validate admission unit state");
requireEqual(runtimeSettingsValidateAdmissionUnit?.preflightRecord, runtimeSettingsValidatePreflightPath, "runtime settings validate admission unit preflightRecord");

const runtimeSettingsValidateIau = readJson(runtimeSettingsValidateIauPath);
requireEqual(runtimeSettingsValidateIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings validate IAU schema");
requireEqual(runtimeSettingsValidateIau.iauId, "IAU-runtime-settings-cli-validation-readback-contract-v1", "runtime settings validate IAU id");
requireEqual(runtimeSettingsValidateIau.state, "implemented", "runtime settings validate IAU state");
requireEqual(runtimeSettingsValidateIau.parentSliceId, runtimeSettingsValidateSliceId, "runtime settings validate IAU parentSliceId");
requireArrayEqual(runtimeSettingsValidateIau.admittedTasks, ["T009", "T010", "T011", "T012"], "runtime settings validate IAU admittedTasks");
requireArrayEqual(runtimeSettingsValidateIau.blockedTasks, ["T013", "T014", "T015", "T016", "T017", "T018"], "runtime settings validate IAU blockedTasks");
requireEqual(runtimeSettingsValidateIau.implementationSharing, "none", "runtime settings validate IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsValidateIau, "runtime settings validate IAU");
requireEqual(runtimeSettingsValidateIau.preImplementationPreflight?.status, "pass", "runtime settings validate IAU preImplementationPreflight status");
requireEqual(runtimeSettingsValidateIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-readback-contract-v1-preflight-v1.json", "runtime settings validate IAU preImplementationPreflight record");
requireEqual(runtimeSettingsValidateIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings validate IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsValidateIau.implementationCloseout?.status, "pass", "runtime settings validate IAU implementationCloseout status");
requireArrayEqual(runtimeSettingsValidateIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012"], "runtime settings validate IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsValidateSliceId}/IAU-runtime-settings-cli-validation-readback-contract-v1.md`);

const runtimeSettingsValidatePreflight = readJson(runtimeSettingsValidatePreflightPath);
requireEqual(runtimeSettingsValidatePreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings validate preflight schema");
requireEqual(runtimeSettingsValidatePreflight.iauId, "IAU-runtime-settings-cli-validation-readback-contract-v1", "runtime settings validate preflight iauId");
requireEqual(runtimeSettingsValidatePreflight.status, "pass", "runtime settings validate preflight status");
requireEqual(runtimeSettingsValidatePreflight.implementationStartAllowed, true, "runtime settings validate preflight implementationStartAllowed");
requireEqual(runtimeSettingsValidatePreflight.parentSliceId, runtimeSettingsValidateSliceId, "runtime settings validate preflight parentSliceId");
requireEqual(runtimeSettingsValidatePreflight.implementationSharing, "none", "runtime settings validate preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsValidatePreflight, "runtime settings validate preflight");
requireArrayEqual(runtimeSettingsValidatePreflight.implementationStartScope, ["T009", "T010", "T011", "T012"], "runtime settings validate preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsValidatePreflight.checkResults) || runtimeSettingsValidatePreflight.checkResults.length !== runtimeSettingsValidatePreflight.requiredChecks.length) {
  failures.push("runtime settings validate preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsValidatePreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings validate preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsValidateSliceId}/IAU-runtime-settings-cli-validation-readback-contract-v1-preflight-v1.md`);

const runtimeSettingsValidateManifest = readJson(`${runtimeSettingsValidateImportDir}/manifest.json`);
requireEqual(runtimeSettingsValidateManifest.schema, "vi-history/requirements-import@v1", "runtime settings validate manifest schema");
requireEqual(runtimeSettingsValidateManifest.sliceId, runtimeSettingsValidateSliceId, "runtime settings validate sliceId");
requireEqual(runtimeSettingsValidateManifest.sourceBaselineTag, "v1.3.16", "runtime settings validate sourceBaselineTag");
requireEqual(runtimeSettingsValidateManifest.sourceCommit, "72c9a700da501eba23e16e3d35b385ec8d8d6808", "runtime settings validate sourceCommit");
requireEqual(runtimeSettingsValidateManifest.governedAdmissionCommit, "f9b2cb76f6de98e97354d1fb8e5c81e3adc8f6e2", "runtime settings validate governedAdmissionCommit");
requireEqual(runtimeSettingsValidateManifest.targetProduct, "vi-history", "runtime settings validate targetProduct");
requireEqual(runtimeSettingsValidateManifest.targetFeature, runtimeSettingsValidateSliceId, "runtime settings validate targetFeature");
requireEqual(runtimeSettingsValidateManifest.redactionStatus, "pass", "runtime settings validate redactionStatus");
requireEqual(runtimeSettingsValidateManifest.implementationSharing, "none", "runtime settings validate implementationSharing");
requireEqual(runtimeSettingsValidateManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings validate marketplacePublication");
requireArrayEqual(runtimeSettingsValidateManifest.importedRequirementIds, runtimeSettingsValidateExpectedIds, "runtime settings validate importedRequirementIds");
requireArrayEqual(runtimeSettingsValidateManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings validate manifest files");

for (const file of runtimeSettingsValidateManifest.files ?? []) {
  requireFile(`${runtimeSettingsValidateImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsValidateFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsValidateFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Readback",
  "VHS-REQ-543",
  "VHS-REQ-546",
  "IAU-runtime-settings-cli-validation-readback-contract-v1",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsValidateFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-validation-readback-contract-v1",
  "Issue #51",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${runtimeSettingsValidateFeatureDir}/tasks.md`, [
  "Issue #51",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T012",
  "IAU-runtime-settings-cli-validation-readback-contract-v1",
  "Issue #53",
  "[BLOCKED]",
  "T018"
]);
requireTextIncludes(`${runtimeSettingsValidateImportDir}/rtm.csv`, runtimeSettingsValidateExpectedIds);
requireTextIncludes(`${runtimeSettingsValidateImportDir}/srs.md`, [
  "VHS-REQ-543",
  "VHS-REQ-546",
  "vihs --validate",
  "runtime-validation outcome"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-readback-v1",
  "docs/requirements/admissions/runtime-settings-cli-validation-readback-v1.json",
  "Issue #51",
  "IAU-runtime-settings-cli-validation-readback-contract-v1"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-readback-v1",
  "Current Implementation Admission Unit",
  "IAU-runtime-settings-cli-validation-readback-contract-v1",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-readback-v1",
  "Issue #51",
  "Issue #53",
  "IAU-runtime-settings-cli-validation-readback-contract-v1",
  "validation behavior beyond the admitted pure `vihs --validate` readback"
]);

const runtimeSettingsProofAdmission = readJson(runtimeSettingsProofAdmissionPath);
requireEqual(runtimeSettingsProofAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings proof admission schema");
requireEqual(runtimeSettingsProofAdmission.sliceId, runtimeSettingsProofSliceId, "runtime settings proof admission sliceId");
requireEqual(runtimeSettingsProofAdmission.state, "implemented", "runtime settings proof admission state");
requireEqual(runtimeSettingsProofAdmission.targetProduct, "vi-history", "runtime settings proof admission targetProduct");
requireEqual(runtimeSettingsProofAdmission.targetFeature, runtimeSettingsProofSliceId, "runtime settings proof admission targetFeature");
requireEqual(runtimeSettingsProofAdmission.sourceBaselineTag, "v1.3.16", "runtime settings proof admission sourceBaselineTag");
requireEqual(runtimeSettingsProofAdmission.sourceCommit, "f9b2cb74d74c2bc31a8af54ce44c1eec62add04e", "runtime settings proof admission sourceCommit");
requireEqual(runtimeSettingsProofAdmission.governedAdmissionCommit, "edb8bfaa53237a8f3b63052573d6bfe728376424", "runtime settings proof admission governedAdmissionCommit");
requireEqual(runtimeSettingsProofAdmission.implementationSharing, "none", "runtime settings proof admission implementationSharing");
requireMarketplacePosture(runtimeSettingsProofAdmission, "runtime settings proof admission");
requireEqual(runtimeSettingsProofAdmission.currentImplementationAdmissionUnit, null, "runtime settings proof currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsProofAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings proof completedSpecScope");
requireArrayEqual(runtimeSettingsProofAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012"], "runtime settings proof completedImplementationScope");
requireArrayEqual(runtimeSettingsProofAdmission.admittedImplementationScope, [], "runtime settings proof admittedImplementationScope");
requireArrayEqual(runtimeSettingsProofAdmission.blockedImplementationScope, ["T013", "T014", "T015", "T016", "T017", "T018"], "runtime settings proof blockedImplementationScope");
requireEqual(runtimeSettingsProofAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-proof-artifact-v1", "runtime settings proof preImplementationPreflight iauId");
requireEqual(runtimeSettingsProofAdmission.preImplementationPreflight?.status, "pass", "runtime settings proof preImplementationPreflight status");
requireEqual(runtimeSettingsProofAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings proof preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsProofAdmission.preImplementationPreflight?.record, runtimeSettingsProofPreflightPath, "runtime settings proof preImplementationPreflight record");
requireEqual(runtimeSettingsProofAdmission.implementationHandoffIssue?.number, 57, "runtime settings proof implementationHandoffIssue number");
requireEqual(runtimeSettingsProofAdmission.implementationCloseout?.status, "pass", "runtime settings proof implementationCloseout status");
requireArrayEqual(runtimeSettingsProofAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012"], "runtime settings proof implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsProofSliceId}.md`);

const runtimeSettingsProofAdmissionUnit = (runtimeSettingsProofAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-proof-artifact-v1");
requireEqual(runtimeSettingsProofAdmissionUnit?.state, "implemented", "runtime settings proof admission unit state");
requireEqual(runtimeSettingsProofAdmissionUnit?.preflightRecord, runtimeSettingsProofPreflightPath, "runtime settings proof admission unit preflightRecord");

const runtimeSettingsProofIau = readJson(runtimeSettingsProofIauPath);
requireEqual(runtimeSettingsProofIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings proof IAU schema");
requireEqual(runtimeSettingsProofIau.iauId, "IAU-runtime-settings-cli-validation-proof-artifact-v1", "runtime settings proof IAU id");
requireEqual(runtimeSettingsProofIau.state, "implemented", "runtime settings proof IAU state");
requireEqual(runtimeSettingsProofIau.parentSliceId, runtimeSettingsProofSliceId, "runtime settings proof IAU parentSliceId");
requireArrayEqual(runtimeSettingsProofIau.admittedTasks, ["T009", "T010", "T011", "T012"], "runtime settings proof IAU admittedTasks");
requireArrayEqual(runtimeSettingsProofIau.blockedTasks, ["T013", "T014", "T015", "T016", "T017", "T018"], "runtime settings proof IAU blockedTasks");
requireEqual(runtimeSettingsProofIau.implementationSharing, "none", "runtime settings proof IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsProofIau, "runtime settings proof IAU");
requireEqual(runtimeSettingsProofIau.preImplementationPreflight?.status, "pass", "runtime settings proof IAU preImplementationPreflight status");
requireEqual(runtimeSettingsProofIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-proof-artifact-v1-preflight-v1.json", "runtime settings proof IAU preImplementationPreflight record");
requireEqual(runtimeSettingsProofIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings proof IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsProofIau.implementationHandoffIssue?.number, 57, "runtime settings proof IAU implementationHandoffIssue number");
requireEqual(runtimeSettingsProofIau.implementationCloseout?.status, "pass", "runtime settings proof IAU implementationCloseout status");
requireArrayEqual(runtimeSettingsProofIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012"], "runtime settings proof IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsProofSliceId}/IAU-runtime-settings-cli-validation-proof-artifact-v1.md`);

const runtimeSettingsProofPreflight = readJson(runtimeSettingsProofPreflightPath);
requireEqual(runtimeSettingsProofPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings proof preflight schema");
requireEqual(runtimeSettingsProofPreflight.iauId, "IAU-runtime-settings-cli-validation-proof-artifact-v1", "runtime settings proof preflight iauId");
requireEqual(runtimeSettingsProofPreflight.status, "pass", "runtime settings proof preflight status");
requireEqual(runtimeSettingsProofPreflight.implementationStartAllowed, true, "runtime settings proof preflight implementationStartAllowed");
requireEqual(runtimeSettingsProofPreflight.parentSliceId, runtimeSettingsProofSliceId, "runtime settings proof preflight parentSliceId");
requireEqual(runtimeSettingsProofPreflight.implementationSharing, "none", "runtime settings proof preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsProofPreflight, "runtime settings proof preflight");
requireArrayEqual(runtimeSettingsProofPreflight.implementationStartScope, ["T009", "T010", "T011", "T012"], "runtime settings proof preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsProofPreflight.checkResults) || runtimeSettingsProofPreflight.checkResults.length !== runtimeSettingsProofPreflight.requiredChecks.length) {
  failures.push("runtime settings proof preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsProofPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings proof preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsProofSliceId}/IAU-runtime-settings-cli-validation-proof-artifact-v1-preflight-v1.md`);

const runtimeSettingsProofManifest = readJson(`${runtimeSettingsProofImportDir}/manifest.json`);
requireEqual(runtimeSettingsProofManifest.schema, "vi-history/requirements-import@v1", "runtime settings proof manifest schema");
requireEqual(runtimeSettingsProofManifest.sliceId, runtimeSettingsProofSliceId, "runtime settings proof sliceId");
requireEqual(runtimeSettingsProofManifest.sourceBaselineTag, "v1.3.16", "runtime settings proof sourceBaselineTag");
requireEqual(runtimeSettingsProofManifest.sourceCommit, "f9b2cb74d74c2bc31a8af54ce44c1eec62add04e", "runtime settings proof sourceCommit");
requireEqual(runtimeSettingsProofManifest.governedAdmissionCommit, "edb8bfaa53237a8f3b63052573d6bfe728376424", "runtime settings proof governedAdmissionCommit");
requireEqual(runtimeSettingsProofManifest.targetProduct, "vi-history", "runtime settings proof targetProduct");
requireEqual(runtimeSettingsProofManifest.targetFeature, runtimeSettingsProofSliceId, "runtime settings proof targetFeature");
requireEqual(runtimeSettingsProofManifest.redactionStatus, "pass", "runtime settings proof redactionStatus");
requireEqual(runtimeSettingsProofManifest.implementationSharing, "none", "runtime settings proof implementationSharing");
requireEqual(runtimeSettingsProofManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings proof marketplacePublication");
requireArrayEqual(runtimeSettingsProofManifest.importedRequirementIds, runtimeSettingsProofExpectedIds, "runtime settings proof importedRequirementIds");
requireArrayEqual(runtimeSettingsProofManifest.supportingTestIds, ["TEST-UNIT-392"], "runtime settings proof supportingTestIds");
requireArrayEqual(runtimeSettingsProofManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings proof manifest files");

for (const file of runtimeSettingsProofManifest.files ?? []) {
  requireFile(`${runtimeSettingsProofImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsProofFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsProofFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Proof",
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "IAU-runtime-settings-cli-validation-proof-artifact-v1",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsProofFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-validation-proof-artifact-v1",
  "Issue #55",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${runtimeSettingsProofFeatureDir}/tasks.md`, [
  "Issue #55",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T012",
  "IAU-runtime-settings-cli-validation-proof-artifact-v1",
  "Issue #57",
  "[BLOCKED]",
  "T018"
]);
requireTextIncludes(`${runtimeSettingsProofImportDir}/rtm.csv`, runtimeSettingsProofExpectedIds);
requireTextIncludes(`${runtimeSettingsProofImportDir}/srs.md`, [
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "vihs --validate --proof-out",
  "runtimeErrorCode",
  "runtimeProofStatus",
  "runtimeImplementationStatus"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-proof-v1",
  "docs/requirements/admissions/runtime-settings-cli-validation-proof-v1.json",
  "Issue #55",
  "Issue #57",
  "IAU-runtime-settings-cli-validation-proof-artifact-v1"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-proof-v1",
  "Issue #55",
  "Issue #57",
  "Current Implementation Admission Unit",
  "IAU-runtime-settings-cli-validation-proof-artifact-v1",
  "IAU-runtime-settings-cli-interactive-selection-contract-v1",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-proof-v1",
  "Issue #55",
  "Issue #57",
  "IAU-runtime-settings-cli-validation-proof-artifact-v1",
  "validation proof artifact behavior beyond the admitted pure proof JSON"
]);

const runtimeSettingsInteractiveAdmission = readJson(runtimeSettingsInteractiveAdmissionPath);
requireEqual(runtimeSettingsInteractiveAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings interactive admission schema");
requireEqual(runtimeSettingsInteractiveAdmission.sliceId, runtimeSettingsInteractiveSliceId, "runtime settings interactive admission sliceId");
requireEqual(runtimeSettingsInteractiveAdmission.state, "implemented", "runtime settings interactive admission state");
requireEqual(runtimeSettingsInteractiveAdmission.targetProduct, "vi-history", "runtime settings interactive admission targetProduct");
requireEqual(runtimeSettingsInteractiveAdmission.targetFeature, runtimeSettingsInteractiveSliceId, "runtime settings interactive admission targetFeature");
requireEqual(runtimeSettingsInteractiveAdmission.sourceBaselineTag, "v1.3.16", "runtime settings interactive admission sourceBaselineTag");
requireEqual(runtimeSettingsInteractiveAdmission.sourceCommit, "edb8bfaa53237a8f3b63052573d6bfe728376424", "runtime settings interactive admission sourceCommit");
requireEqual(runtimeSettingsInteractiveAdmission.governedAdmissionCommit, "3716d35a7ba57031464a81902f37862128f53681", "runtime settings interactive admission governedAdmissionCommit");
requireEqual(runtimeSettingsInteractiveAdmission.implementationSharing, "none", "runtime settings interactive admission implementationSharing");
requireMarketplacePosture(runtimeSettingsInteractiveAdmission, "runtime settings interactive admission");
requireEqual(runtimeSettingsInteractiveAdmission.currentImplementationAdmissionUnit, null, "runtime settings interactive currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsInteractiveAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings interactive completedSpecScope");
requireArrayEqual(runtimeSettingsInteractiveAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013"], "runtime settings interactive completedImplementationScope");
requireArrayEqual(runtimeSettingsInteractiveAdmission.admittedImplementationScope, [], "runtime settings interactive admittedImplementationScope");
requireArrayEqual(runtimeSettingsInteractiveAdmission.blockedImplementationScope, ["T014", "T015", "T016", "T017", "T018", "T019"], "runtime settings interactive blockedImplementationScope");
requireEqual(runtimeSettingsInteractiveAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-interactive-selection-contract-v1", "runtime settings interactive preImplementationPreflight iauId");
requireEqual(runtimeSettingsInteractiveAdmission.preImplementationPreflight?.status, "pass", "runtime settings interactive preImplementationPreflight status");
requireEqual(runtimeSettingsInteractiveAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings interactive preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsInteractiveAdmission.preImplementationPreflight?.record, runtimeSettingsInteractivePreflightPath, "runtime settings interactive preImplementationPreflight record");
requireEqual(runtimeSettingsInteractiveAdmission.implementationHandoffIssue?.number, 62, "runtime settings interactive implementationHandoffIssue number");
requireEqual(runtimeSettingsInteractiveAdmission.implementationCloseout?.status, "pass", "runtime settings interactive implementationCloseout status");
requireArrayEqual(runtimeSettingsInteractiveAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013"], "runtime settings interactive implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsInteractiveSliceId}.md`);

const runtimeSettingsInteractiveAdmissionUnit = (runtimeSettingsInteractiveAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-interactive-selection-contract-v1");
requireEqual(runtimeSettingsInteractiveAdmissionUnit?.state, "implemented", "runtime settings interactive admission unit state");
requireEqual(runtimeSettingsInteractiveAdmissionUnit?.preflightRecord, runtimeSettingsInteractivePreflightPath, "runtime settings interactive admission unit preflightRecord");

const runtimeSettingsInteractiveIau = readJson(runtimeSettingsInteractiveIauPath);
requireEqual(runtimeSettingsInteractiveIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings interactive IAU schema");
requireEqual(runtimeSettingsInteractiveIau.iauId, "IAU-runtime-settings-cli-interactive-selection-contract-v1", "runtime settings interactive IAU id");
requireEqual(runtimeSettingsInteractiveIau.state, "implemented", "runtime settings interactive IAU state");
requireEqual(runtimeSettingsInteractiveIau.parentSliceId, runtimeSettingsInteractiveSliceId, "runtime settings interactive IAU parentSliceId");
requireArrayEqual(runtimeSettingsInteractiveIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013"], "runtime settings interactive IAU admittedTasks");
requireArrayEqual(runtimeSettingsInteractiveIau.blockedTasks, ["T014", "T015", "T016", "T017", "T018", "T019"], "runtime settings interactive IAU blockedTasks");
requireEqual(runtimeSettingsInteractiveIau.implementationSharing, "none", "runtime settings interactive IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsInteractiveIau, "runtime settings interactive IAU");
requireEqual(runtimeSettingsInteractiveIau.preImplementationPreflight?.status, "pass", "runtime settings interactive IAU preImplementationPreflight status");
requireEqual(runtimeSettingsInteractiveIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-interactive-selection-contract-v1-preflight-v1.json", "runtime settings interactive IAU preImplementationPreflight record");
requireEqual(runtimeSettingsInteractiveIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings interactive IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsInteractiveIau.implementationHandoffIssue?.number, 62, "runtime settings interactive IAU implementationHandoffIssue number");
requireEqual(runtimeSettingsInteractiveIau.implementationCloseout?.status, "pass", "runtime settings interactive IAU implementationCloseout status");
requireArrayEqual(runtimeSettingsInteractiveIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013"], "runtime settings interactive IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsInteractiveSliceId}/IAU-runtime-settings-cli-interactive-selection-contract-v1.md`);

const runtimeSettingsInteractivePreflight = readJson(runtimeSettingsInteractivePreflightPath);
requireEqual(runtimeSettingsInteractivePreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings interactive preflight schema");
requireEqual(runtimeSettingsInteractivePreflight.iauId, "IAU-runtime-settings-cli-interactive-selection-contract-v1", "runtime settings interactive preflight iauId");
requireEqual(runtimeSettingsInteractivePreflight.status, "pass", "runtime settings interactive preflight status");
requireEqual(runtimeSettingsInteractivePreflight.implementationStartAllowed, true, "runtime settings interactive preflight implementationStartAllowed");
requireEqual(runtimeSettingsInteractivePreflight.parentSliceId, runtimeSettingsInteractiveSliceId, "runtime settings interactive preflight parentSliceId");
requireEqual(runtimeSettingsInteractivePreflight.implementationSharing, "none", "runtime settings interactive preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsInteractivePreflight, "runtime settings interactive preflight");
requireArrayEqual(runtimeSettingsInteractivePreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013"], "runtime settings interactive preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsInteractivePreflight.checkResults) || runtimeSettingsInteractivePreflight.checkResults.length !== runtimeSettingsInteractivePreflight.requiredChecks.length) {
  failures.push("runtime settings interactive preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsInteractivePreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings interactive preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsInteractiveSliceId}/IAU-runtime-settings-cli-interactive-selection-contract-v1-preflight-v1.md`);

const runtimeSettingsInteractiveManifest = readJson(`${runtimeSettingsInteractiveImportDir}/manifest.json`);
requireEqual(runtimeSettingsInteractiveManifest.schema, "vi-history/requirements-import@v1", "runtime settings interactive manifest schema");
requireEqual(runtimeSettingsInteractiveManifest.sliceId, runtimeSettingsInteractiveSliceId, "runtime settings interactive sliceId");
requireEqual(runtimeSettingsInteractiveManifest.sourceBaselineTag, "v1.3.16", "runtime settings interactive sourceBaselineTag");
requireEqual(runtimeSettingsInteractiveManifest.sourceCommit, "edb8bfaa53237a8f3b63052573d6bfe728376424", "runtime settings interactive sourceCommit");
requireEqual(runtimeSettingsInteractiveManifest.governedAdmissionCommit, "3716d35a7ba57031464a81902f37862128f53681", "runtime settings interactive governedAdmissionCommit");
requireEqual(runtimeSettingsInteractiveManifest.targetProduct, "vi-history", "runtime settings interactive targetProduct");
requireEqual(runtimeSettingsInteractiveManifest.targetFeature, runtimeSettingsInteractiveSliceId, "runtime settings interactive targetFeature");
requireEqual(runtimeSettingsInteractiveManifest.redactionStatus, "pass", "runtime settings interactive redactionStatus");
requireEqual(runtimeSettingsInteractiveManifest.implementationSharing, "none", "runtime settings interactive implementationSharing");
requireEqual(runtimeSettingsInteractiveManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings interactive marketplacePublication");
requireArrayEqual(runtimeSettingsInteractiveManifest.importedRequirementIds, runtimeSettingsInteractiveExpectedIds, "runtime settings interactive importedRequirementIds");
requireArrayEqual(runtimeSettingsInteractiveManifest.supportingTestIds, ["TEST-UNIT-353", "TEST-UNIT-354"], "runtime settings interactive supportingTestIds");
requireArrayEqual(runtimeSettingsInteractiveManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings interactive manifest files");

for (const file of runtimeSettingsInteractiveManifest.files ?? []) {
  requireFile(`${runtimeSettingsInteractiveImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsInteractiveFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsInteractiveFeatureDir}/spec.md`, [
  "Runtime Settings CLI Interactive Selection",
  "VHS-REQ-545",
  "VHS-REQ-546",
  "TEST-UNIT-353",
  "TEST-UNIT-354",
  "IAU-runtime-settings-cli-interactive-selection-contract-v1",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsInteractiveFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-interactive-selection-contract-v1",
  "Issue #60",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${runtimeSettingsInteractiveFeatureDir}/tasks.md`, [
  "Issue #60",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T013",
  "IAU-runtime-settings-cli-interactive-selection-contract-v1",
  "[BLOCKED]",
  "T019"
]);
requireTextIncludes(`${runtimeSettingsInteractiveImportDir}/rtm.csv`, runtimeSettingsInteractiveExpectedIds);
requireTextIncludes(`${runtimeSettingsInteractiveImportDir}/srs.md`, [
  "VHS-REQ-545",
  "VHS-REQ-546",
  "TEST-UNIT-353",
  "TEST-UNIT-354",
  "host/windows/2026/x86",
  "validation readback contract"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-interactive-selection-v1",
  "docs/requirements/admissions/runtime-settings-cli-interactive-selection-v1.json",
  "Issue #60",
  "Issue #62",
  "IAU-runtime-settings-cli-interactive-selection-contract-v1"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-interactive-selection-v1",
  "Issue #60",
  "Issue #62",
  "Current Implementation Admission Unit:\n`none`.",
  "IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1",
  "IAU-runtime-settings-cli-interactive-selection-contract-v1",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-interactive-selection-v1",
  "Issue #60",
  "Issue #62",
  "IAU-runtime-settings-cli-interactive-selection-contract-v1",
  "no-argument interactive selection beyond the admitted pure selection-state"
]);

const runtimeSettingsTerminalAdmission = readJson(runtimeSettingsTerminalAdmissionPath);
requireEqual(runtimeSettingsTerminalAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings terminal admission schema");
requireEqual(runtimeSettingsTerminalAdmission.sliceId, runtimeSettingsTerminalSliceId, "runtime settings terminal admission sliceId");
requireEqual(runtimeSettingsTerminalAdmission.state, "implemented", "runtime settings terminal admission state");
requireEqual(runtimeSettingsTerminalAdmission.targetProduct, "vi-history", "runtime settings terminal admission targetProduct");
requireEqual(runtimeSettingsTerminalAdmission.targetFeature, runtimeSettingsTerminalSliceId, "runtime settings terminal admission targetFeature");
requireEqual(runtimeSettingsTerminalAdmission.sourceBaselineTag, "v1.3.16", "runtime settings terminal admission sourceBaselineTag");
requireEqual(runtimeSettingsTerminalAdmission.sourceCommit, "3716d35a7ba57031464a81902f37862128f53681", "runtime settings terminal admission sourceCommit");
requireEqual(runtimeSettingsTerminalAdmission.governedAdmissionCommit, "913f840a9dd23319d91d5fcf5862be9615d5b8d0", "runtime settings terminal admission governedAdmissionCommit");
requireEqual(runtimeSettingsTerminalAdmission.implementationSharing, "none", "runtime settings terminal admission implementationSharing");
requireMarketplacePosture(runtimeSettingsTerminalAdmission, "runtime settings terminal admission");
requireEqual(runtimeSettingsTerminalAdmission.currentImplementationAdmissionUnit, null, "runtime settings terminal currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsTerminalAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings terminal completedSpecScope");
requireArrayEqual(runtimeSettingsTerminalAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013"], "runtime settings terminal completedImplementationScope");
requireArrayEqual(runtimeSettingsTerminalAdmission.admittedImplementationScope, [], "runtime settings terminal admittedImplementationScope");
requireArrayEqual(runtimeSettingsTerminalAdmission.blockedImplementationScope, ["T014", "T015", "T016", "T017", "T018", "T019"], "runtime settings terminal blockedImplementationScope");
requireEqual(runtimeSettingsTerminalAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1", "runtime settings terminal preImplementationPreflight iauId");
requireEqual(runtimeSettingsTerminalAdmission.preImplementationPreflight?.status, "pass", "runtime settings terminal preImplementationPreflight status");
requireEqual(runtimeSettingsTerminalAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings terminal preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsTerminalAdmission.preImplementationPreflight?.record, runtimeSettingsTerminalPreflightPath, "runtime settings terminal preImplementationPreflight record");
requireEqual(runtimeSettingsTerminalAdmission.issue?.number, 65, "runtime settings terminal issue number");
requireEqual(runtimeSettingsTerminalAdmission.implementationHandoffIssue?.number, 67, "runtime settings terminal implementationHandoffIssue number");
requireEqual(runtimeSettingsTerminalAdmission.implementationCloseout?.status, "pass", "runtime settings terminal implementationCloseout status");
requireArrayEqual(runtimeSettingsTerminalAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013"], "runtime settings terminal implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsTerminalSliceId}.md`);

const runtimeSettingsTerminalAdmissionUnit = (runtimeSettingsTerminalAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1");
requireEqual(runtimeSettingsTerminalAdmissionUnit?.state, "implemented", "runtime settings terminal admission unit state");
requireEqual(runtimeSettingsTerminalAdmissionUnit?.preflightRecord, runtimeSettingsTerminalPreflightPath, "runtime settings terminal admission unit preflightRecord");

const runtimeSettingsTerminalIau = readJson(runtimeSettingsTerminalIauPath);
requireEqual(runtimeSettingsTerminalIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings terminal IAU schema");
requireEqual(runtimeSettingsTerminalIau.iauId, "IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1", "runtime settings terminal IAU id");
requireEqual(runtimeSettingsTerminalIau.state, "implemented", "runtime settings terminal IAU state");
requireEqual(runtimeSettingsTerminalIau.parentSliceId, runtimeSettingsTerminalSliceId, "runtime settings terminal IAU parentSliceId");
requireArrayEqual(runtimeSettingsTerminalIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013"], "runtime settings terminal IAU admittedTasks");
requireArrayEqual(runtimeSettingsTerminalIau.blockedTasks, ["T014", "T015", "T016", "T017", "T018", "T019"], "runtime settings terminal IAU blockedTasks");
requireEqual(runtimeSettingsTerminalIau.implementationSharing, "none", "runtime settings terminal IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsTerminalIau, "runtime settings terminal IAU");
requireEqual(runtimeSettingsTerminalIau.preImplementationPreflight?.status, "pass", "runtime settings terminal IAU preImplementationPreflight status");
requireEqual(runtimeSettingsTerminalIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1-preflight-v1.json", "runtime settings terminal IAU preImplementationPreflight record");
requireEqual(runtimeSettingsTerminalIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings terminal IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsTerminalIau.implementationHandoffIssue?.number, 67, "runtime settings terminal IAU implementationHandoffIssue number");
requireEqual(runtimeSettingsTerminalIau.implementationCloseout?.status, "pass", "runtime settings terminal IAU implementationCloseout status");
requireArrayEqual(runtimeSettingsTerminalIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013"], "runtime settings terminal IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsTerminalSliceId}/IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1.md`);

const runtimeSettingsTerminalPreflight = readJson(runtimeSettingsTerminalPreflightPath);
requireEqual(runtimeSettingsTerminalPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings terminal preflight schema");
requireEqual(runtimeSettingsTerminalPreflight.iauId, "IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1", "runtime settings terminal preflight iauId");
requireEqual(runtimeSettingsTerminalPreflight.status, "pass", "runtime settings terminal preflight status");
requireEqual(runtimeSettingsTerminalPreflight.implementationStartAllowed, true, "runtime settings terminal preflight implementationStartAllowed");
requireEqual(runtimeSettingsTerminalPreflight.parentSliceId, runtimeSettingsTerminalSliceId, "runtime settings terminal preflight parentSliceId");
requireEqual(runtimeSettingsTerminalPreflight.implementationSharing, "none", "runtime settings terminal preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsTerminalPreflight, "runtime settings terminal preflight");
requireArrayEqual(runtimeSettingsTerminalPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013"], "runtime settings terminal preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsTerminalPreflight.checkResults) || runtimeSettingsTerminalPreflight.checkResults.length !== runtimeSettingsTerminalPreflight.requiredChecks.length) {
  failures.push("runtime settings terminal preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsTerminalPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings terminal preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsTerminalSliceId}/IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1-preflight-v1.md`);

const runtimeSettingsTerminalManifest = readJson(`${runtimeSettingsTerminalImportDir}/manifest.json`);
requireEqual(runtimeSettingsTerminalManifest.schema, "vi-history/requirements-import@v1", "runtime settings terminal manifest schema");
requireEqual(runtimeSettingsTerminalManifest.sliceId, runtimeSettingsTerminalSliceId, "runtime settings terminal sliceId");
requireEqual(runtimeSettingsTerminalManifest.sourceBaselineTag, "v1.3.16", "runtime settings terminal sourceBaselineTag");
requireEqual(runtimeSettingsTerminalManifest.sourceCommit, "3716d35a7ba57031464a81902f37862128f53681", "runtime settings terminal sourceCommit");
requireEqual(runtimeSettingsTerminalManifest.governedAdmissionCommit, "913f840a9dd23319d91d5fcf5862be9615d5b8d0", "runtime settings terminal governedAdmissionCommit");
requireEqual(runtimeSettingsTerminalManifest.targetProduct, "vi-history", "runtime settings terminal targetProduct");
requireEqual(runtimeSettingsTerminalManifest.targetFeature, runtimeSettingsTerminalSliceId, "runtime settings terminal targetFeature");
requireEqual(runtimeSettingsTerminalManifest.redactionStatus, "pass", "runtime settings terminal redactionStatus");
requireEqual(runtimeSettingsTerminalManifest.implementationSharing, "none", "runtime settings terminal implementationSharing");
requireEqual(runtimeSettingsTerminalManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings terminal marketplacePublication");
requireArrayEqual(runtimeSettingsTerminalManifest.importedRequirementIds, runtimeSettingsTerminalExpectedIds, "runtime settings terminal importedRequirementIds");
requireArrayEqual(runtimeSettingsTerminalManifest.supportingTestIds, ["TEST-UNIT-345", "TEST-UNIT-352", "TEST-UNIT-353", "TEST-UNIT-354", "TEST-INTEG-009", "TEST-INTEG-010", "TEST-INTEG-011"], "runtime settings terminal supportingTestIds");
requireArrayEqual(runtimeSettingsTerminalManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings terminal manifest files");

for (const file of runtimeSettingsTerminalManifest.files ?? []) {
  requireFile(`${runtimeSettingsTerminalImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsTerminalFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsTerminalFeatureDir}/spec.md`, [
  "Runtime Settings CLI Terminal Entrypoint",
  "VHS-REQ-537",
  "VHS-REQ-544",
  "VHS-REQ-545",
  "VHS-REQ-546",
  "IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsTerminalFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1",
  "Issue #65",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${runtimeSettingsTerminalFeatureDir}/tasks.md`, [
  "Issue #65",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T013",
  "IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1",
  "[BLOCKED]",
  "T019"
]);
requireTextIncludes(`${runtimeSettingsTerminalImportDir}/rtm.csv`, runtimeSettingsTerminalExpectedIds);
requireTextIncludes(`${runtimeSettingsTerminalImportDir}/srs.md`, [
  "VHS-REQ-537",
  "VHS-REQ-544",
  "VHS-REQ-545",
  "VHS-REQ-546",
  "TEST-UNIT-345",
  "TEST-UNIT-352",
  "TEST-UNIT-353",
  "TEST-UNIT-354",
  "user-scope admission",
  "validation handoff"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-terminal-entrypoint-v1",
  "docs/requirements/admissions/runtime-settings-cli-terminal-entrypoint-v1.json",
  "Issue #65",
  "Issue #67",
  "IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1",
  "Current Implementation Admission Unit:\n`none`."
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-terminal-entrypoint-v1",
  "Issue #65",
  "Issue #67",
  "Current Implementation Admission Unit:\n`none`.",
  "IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-terminal-entrypoint-v1",
  "Issue #65",
  "Issue #67",
  "IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1",
  "terminal entrypoint implementation beyond"
]);

const runtimeSettingsPromptLoopAdmission = readJson(runtimeSettingsPromptLoopAdmissionPath);
requireEqual(runtimeSettingsPromptLoopAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings prompt-loop admission schema");
requireEqual(runtimeSettingsPromptLoopAdmission.sliceId, runtimeSettingsPromptLoopSliceId, "runtime settings prompt-loop admission sliceId");
requireEqual(runtimeSettingsPromptLoopAdmission.state, "implemented", "runtime settings prompt-loop admission state");
requireEqual(runtimeSettingsPromptLoopAdmission.targetProduct, "vi-history", "runtime settings prompt-loop admission targetProduct");
requireEqual(runtimeSettingsPromptLoopAdmission.targetFeature, runtimeSettingsPromptLoopSliceId, "runtime settings prompt-loop admission targetFeature");
requireEqual(runtimeSettingsPromptLoopAdmission.sourceBaselineTag, "v1.3.16", "runtime settings prompt-loop admission sourceBaselineTag");
requireEqual(runtimeSettingsPromptLoopAdmission.sourceCommit, "913f840a9dd23319d91d5fcf5862be9615d5b8d0", "runtime settings prompt-loop admission sourceCommit");
requireEqual(runtimeSettingsPromptLoopAdmission.governedAdmissionCommit, "bb795ace470bcb17d9436fd34c59344077c37777", "runtime settings prompt-loop admission governedAdmissionCommit");
requireEqual(runtimeSettingsPromptLoopAdmission.implementationSharing, "none", "runtime settings prompt-loop admission implementationSharing");
requireMarketplacePosture(runtimeSettingsPromptLoopAdmission, "runtime settings prompt-loop admission");
requireEqual(runtimeSettingsPromptLoopAdmission.currentImplementationAdmissionUnit, null, "runtime settings prompt-loop currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsPromptLoopAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings prompt-loop completedSpecScope");
requireArrayEqual(runtimeSettingsPromptLoopAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013"], "runtime settings prompt-loop completedImplementationScope");
requireArrayEqual(runtimeSettingsPromptLoopAdmission.admittedImplementationScope, [], "runtime settings prompt-loop admittedImplementationScope");
requireArrayEqual(runtimeSettingsPromptLoopAdmission.blockedImplementationScope, ["T014", "T015", "T016", "T017", "T018", "T019"], "runtime settings prompt-loop blockedImplementationScope");
requireEqual(runtimeSettingsPromptLoopAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-terminal-prompt-loop-v1", "runtime settings prompt-loop preImplementationPreflight iauId");
requireEqual(runtimeSettingsPromptLoopAdmission.preImplementationPreflight?.status, "pass", "runtime settings prompt-loop preImplementationPreflight status");
requireEqual(runtimeSettingsPromptLoopAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings prompt-loop preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsPromptLoopAdmission.preImplementationPreflight?.record, runtimeSettingsPromptLoopPreflightPath, "runtime settings prompt-loop preImplementationPreflight record");
requireEqual(runtimeSettingsPromptLoopAdmission.issue?.number, 71, "runtime settings prompt-loop issue number");
requireEqual(runtimeSettingsPromptLoopAdmission.implementationHandoffIssue?.number, 73, "runtime settings prompt-loop implementationHandoffIssue number");
requireEqual(runtimeSettingsPromptLoopAdmission.implementationCloseout?.status, "pass", "runtime settings prompt-loop implementationCloseout status");
requireArrayEqual(runtimeSettingsPromptLoopAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013"], "runtime settings prompt-loop implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsPromptLoopSliceId}.md`);

const runtimeSettingsPromptLoopAdmissionUnit = (runtimeSettingsPromptLoopAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-terminal-prompt-loop-v1");
requireEqual(runtimeSettingsPromptLoopAdmissionUnit?.state, "implemented", "runtime settings prompt-loop admission unit state");
requireEqual(runtimeSettingsPromptLoopAdmissionUnit?.preflightRecord, runtimeSettingsPromptLoopPreflightPath, "runtime settings prompt-loop admission unit preflightRecord");

const runtimeSettingsPromptLoopIau = readJson(runtimeSettingsPromptLoopIauPath);
requireEqual(runtimeSettingsPromptLoopIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings prompt-loop IAU schema");
requireEqual(runtimeSettingsPromptLoopIau.iauId, "IAU-runtime-settings-cli-terminal-prompt-loop-v1", "runtime settings prompt-loop IAU id");
requireEqual(runtimeSettingsPromptLoopIau.state, "implemented", "runtime settings prompt-loop IAU state");
requireEqual(runtimeSettingsPromptLoopIau.parentSliceId, runtimeSettingsPromptLoopSliceId, "runtime settings prompt-loop IAU parentSliceId");
requireArrayEqual(runtimeSettingsPromptLoopIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013"], "runtime settings prompt-loop IAU admittedTasks");
requireArrayEqual(runtimeSettingsPromptLoopIau.blockedTasks, ["T014", "T015", "T016", "T017", "T018", "T019"], "runtime settings prompt-loop IAU blockedTasks");
requireEqual(runtimeSettingsPromptLoopIau.implementationSharing, "none", "runtime settings prompt-loop IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsPromptLoopIau, "runtime settings prompt-loop IAU");
requireEqual(runtimeSettingsPromptLoopIau.preImplementationPreflight?.status, "pass", "runtime settings prompt-loop IAU preImplementationPreflight status");
requireEqual(runtimeSettingsPromptLoopIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-terminal-prompt-loop-v1-preflight-v1.json", "runtime settings prompt-loop IAU preImplementationPreflight record");
requireEqual(runtimeSettingsPromptLoopIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings prompt-loop IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsPromptLoopIau.implementationHandoffIssue?.number, 73, "runtime settings prompt-loop IAU implementationHandoffIssue number");
requireEqual(runtimeSettingsPromptLoopIau.implementationCloseout?.status, "pass", "runtime settings prompt-loop IAU implementationCloseout status");
requireArrayEqual(runtimeSettingsPromptLoopIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013"], "runtime settings prompt-loop IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsPromptLoopSliceId}/IAU-runtime-settings-cli-terminal-prompt-loop-v1.md`);

const runtimeSettingsPromptLoopPreflight = readJson(runtimeSettingsPromptLoopPreflightPath);
requireEqual(runtimeSettingsPromptLoopPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings prompt-loop preflight schema");
requireEqual(runtimeSettingsPromptLoopPreflight.iauId, "IAU-runtime-settings-cli-terminal-prompt-loop-v1", "runtime settings prompt-loop preflight iauId");
requireEqual(runtimeSettingsPromptLoopPreflight.status, "pass", "runtime settings prompt-loop preflight status");
requireEqual(runtimeSettingsPromptLoopPreflight.implementationStartAllowed, true, "runtime settings prompt-loop preflight implementationStartAllowed");
requireEqual(runtimeSettingsPromptLoopPreflight.parentSliceId, runtimeSettingsPromptLoopSliceId, "runtime settings prompt-loop preflight parentSliceId");
requireEqual(runtimeSettingsPromptLoopPreflight.implementationSharing, "none", "runtime settings prompt-loop preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsPromptLoopPreflight, "runtime settings prompt-loop preflight");
requireArrayEqual(runtimeSettingsPromptLoopPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013"], "runtime settings prompt-loop preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsPromptLoopPreflight.checkResults) || runtimeSettingsPromptLoopPreflight.checkResults.length !== runtimeSettingsPromptLoopPreflight.requiredChecks.length) {
  failures.push("runtime settings prompt-loop preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsPromptLoopPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings prompt-loop preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsPromptLoopSliceId}/IAU-runtime-settings-cli-terminal-prompt-loop-v1-preflight-v1.md`);

const runtimeSettingsPromptLoopManifest = readJson(`${runtimeSettingsPromptLoopImportDir}/manifest.json`);
requireEqual(runtimeSettingsPromptLoopManifest.schema, "vi-history/requirements-import@v1", "runtime settings prompt-loop manifest schema");
requireEqual(runtimeSettingsPromptLoopManifest.sliceId, runtimeSettingsPromptLoopSliceId, "runtime settings prompt-loop sliceId");
requireEqual(runtimeSettingsPromptLoopManifest.sourceBaselineTag, "v1.3.16", "runtime settings prompt-loop sourceBaselineTag");
requireEqual(runtimeSettingsPromptLoopManifest.sourceCommit, "913f840a9dd23319d91d5fcf5862be9615d5b8d0", "runtime settings prompt-loop sourceCommit");
requireEqual(runtimeSettingsPromptLoopManifest.governedAdmissionCommit, "bb795ace470bcb17d9436fd34c59344077c37777", "runtime settings prompt-loop governedAdmissionCommit");
requireEqual(runtimeSettingsPromptLoopManifest.targetProduct, "vi-history", "runtime settings prompt-loop targetProduct");
requireEqual(runtimeSettingsPromptLoopManifest.targetFeature, runtimeSettingsPromptLoopSliceId, "runtime settings prompt-loop targetFeature");
requireEqual(runtimeSettingsPromptLoopManifest.redactionStatus, "pass", "runtime settings prompt-loop redactionStatus");
requireEqual(runtimeSettingsPromptLoopManifest.implementationSharing, "none", "runtime settings prompt-loop implementationSharing");
requireEqual(runtimeSettingsPromptLoopManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings prompt-loop marketplacePublication");
requireArrayEqual(runtimeSettingsPromptLoopManifest.importedRequirementIds, runtimeSettingsPromptLoopExpectedIds, "runtime settings prompt-loop importedRequirementIds");
requireArrayEqual(runtimeSettingsPromptLoopManifest.prerequisiteRequirementIds, ["VHS-REQ-537", "VHS-REQ-544"], "runtime settings prompt-loop prerequisiteRequirementIds");
requireArrayEqual(runtimeSettingsPromptLoopManifest.supportingTestIds, ["TEST-UNIT-353", "TEST-UNIT-354"], "runtime settings prompt-loop supportingTestIds");
requireArrayEqual(runtimeSettingsPromptLoopManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings prompt-loop manifest files");

for (const file of runtimeSettingsPromptLoopManifest.files ?? []) {
  requireFile(`${runtimeSettingsPromptLoopImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsPromptLoopFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsPromptLoopFeatureDir}/spec.md`, [
  "Runtime Settings CLI Terminal Prompt Loop",
  "VHS-REQ-545",
  "VHS-REQ-546",
  "IAU-runtime-settings-cli-terminal-prompt-loop-v1",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsPromptLoopFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-terminal-prompt-loop-v1",
  "Issue #71",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${runtimeSettingsPromptLoopFeatureDir}/tasks.md`, [
  "Issue #71",
  "Issue #73",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T013",
  "IAU-runtime-settings-cli-terminal-prompt-loop-v1",
  "[BLOCKED]",
  "T019"
]);
requireTextIncludes(`${runtimeSettingsPromptLoopImportDir}/rtm.csv`, runtimeSettingsPromptLoopExpectedIds);
requireTextIncludes(`${runtimeSettingsPromptLoopImportDir}/srs.md`, [
  "VHS-REQ-545",
  "VHS-REQ-546",
  "TEST-UNIT-353",
  "TEST-UNIT-354",
  "VHS-REQ-537",
  "VHS-REQ-544",
  "validation handoff"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-terminal-prompt-loop-v1",
  "docs/requirements/admissions/runtime-settings-cli-terminal-prompt-loop-v1.json",
  "Issue #71",
  "Issue #73",
  "IAU-runtime-settings-cli-terminal-prompt-loop-v1",
  "latest supported NI LabVIEW Docker image selection",
  "no user-facing Docker bitness choice",
  "Current Implementation Admission Unit:\n`none`."
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-terminal-prompt-loop-v1",
  "Issue #71",
  "Issue #73",
  "Issue #75",
  "Current Implementation Admission Unit:\n`none`.",
  "IAU-runtime-settings-cli-terminal-prompt-loop-v1",
  "no separate Docker bitness\nchoice",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-terminal-prompt-loop-v1",
  "Issue #71",
  "Issue #73",
  "Issue #75",
  "IAU-runtime-settings-cli-terminal-prompt-loop-v1",
  "latest supported NI LabVIEW Docker image family",
  "OS-specific raw stdin/TTY process drivers"
]);

const runtimeSettingsTerminalIoAdmission = readJson(runtimeSettingsTerminalIoAdmissionPath);
requireEqual(runtimeSettingsTerminalIoAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings terminal I/O admission schema");
requireEqual(runtimeSettingsTerminalIoAdmission.sliceId, runtimeSettingsTerminalIoSliceId, "runtime settings terminal I/O admission sliceId");
requireEqual(runtimeSettingsTerminalIoAdmission.state, "implemented", "runtime settings terminal I/O admission state");
requireEqual(runtimeSettingsTerminalIoAdmission.targetProduct, "vi-history", "runtime settings terminal I/O admission targetProduct");
requireEqual(runtimeSettingsTerminalIoAdmission.targetFeature, runtimeSettingsTerminalIoSliceId, "runtime settings terminal I/O admission targetFeature");
requireEqual(runtimeSettingsTerminalIoAdmission.sourceBaselineTag, "v1.3.16", "runtime settings terminal I/O admission sourceBaselineTag");
requireEqual(runtimeSettingsTerminalIoAdmission.sourceCommit, "bb795ace470bcb17d9436fd34c59344077c37777", "runtime settings terminal I/O admission sourceCommit");
requireEqual(runtimeSettingsTerminalIoAdmission.governedAdmissionCommit, "087b08493c4f0f4fea55aca379a585a2110c5b63", "runtime settings terminal I/O admission governedAdmissionCommit");
requireEqual(runtimeSettingsTerminalIoAdmission.implementationSharing, "none", "runtime settings terminal I/O admission implementationSharing");
requireMarketplacePosture(runtimeSettingsTerminalIoAdmission, "runtime settings terminal I/O admission");
requireEqual(runtimeSettingsTerminalIoAdmission.currentImplementationAdmissionUnit, null, "runtime settings terminal I/O currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsTerminalIoAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings terminal I/O completedSpecScope");
requireArrayEqual(runtimeSettingsTerminalIoAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014"], "runtime settings terminal I/O completedImplementationScope");
requireArrayEqual(runtimeSettingsTerminalIoAdmission.admittedImplementationScope, [], "runtime settings terminal I/O admittedImplementationScope");
requireArrayEqual(runtimeSettingsTerminalIoAdmission.blockedImplementationScope, ["T015", "T016", "T017", "T018", "T019", "T020", "T021", "T022", "T023"], "runtime settings terminal I/O blockedImplementationScope");
requireEqual(runtimeSettingsTerminalIoAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-terminal-io-adapter-v1", "runtime settings terminal I/O preImplementationPreflight iauId");
requireEqual(runtimeSettingsTerminalIoAdmission.preImplementationPreflight?.status, "pass", "runtime settings terminal I/O preImplementationPreflight status");
requireEqual(runtimeSettingsTerminalIoAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings terminal I/O preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsTerminalIoAdmission.preImplementationPreflight?.record, runtimeSettingsTerminalIoPreflightPath, "runtime settings terminal I/O preImplementationPreflight record");
requireEqual(runtimeSettingsTerminalIoAdmission.issue?.number, 77, "runtime settings terminal I/O issue number");
requireEqual(runtimeSettingsTerminalIoAdmission.implementationHandoffIssue?.number, 79, "runtime settings terminal I/O implementationHandoffIssue number");
requireEqual(runtimeSettingsTerminalIoAdmission.implementationCloseout?.status, "pass", "runtime settings terminal I/O implementationCloseout status");
requireArrayEqual(runtimeSettingsTerminalIoAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014"], "runtime settings terminal I/O implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsTerminalIoSliceId}.md`);

const runtimeSettingsTerminalIoAdmissionUnit = (runtimeSettingsTerminalIoAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-terminal-io-adapter-v1");
requireEqual(runtimeSettingsTerminalIoAdmissionUnit?.state, "implemented", "runtime settings terminal I/O admission unit state");
requireEqual(runtimeSettingsTerminalIoAdmissionUnit?.preflightRecord, runtimeSettingsTerminalIoPreflightPath, "runtime settings terminal I/O admission unit preflightRecord");

const runtimeSettingsTerminalIoIau = readJson(runtimeSettingsTerminalIoIauPath);
requireEqual(runtimeSettingsTerminalIoIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings terminal I/O IAU schema");
requireEqual(runtimeSettingsTerminalIoIau.iauId, "IAU-runtime-settings-cli-terminal-io-adapter-v1", "runtime settings terminal I/O IAU id");
requireEqual(runtimeSettingsTerminalIoIau.state, "implemented", "runtime settings terminal I/O IAU state");
requireEqual(runtimeSettingsTerminalIoIau.parentSliceId, runtimeSettingsTerminalIoSliceId, "runtime settings terminal I/O IAU parentSliceId");
requireArrayEqual(runtimeSettingsTerminalIoIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014"], "runtime settings terminal I/O IAU admittedTasks");
requireArrayEqual(runtimeSettingsTerminalIoIau.blockedTasks, ["T015", "T016", "T017", "T018", "T019", "T020", "T021", "T022", "T023"], "runtime settings terminal I/O IAU blockedTasks");
requireEqual(runtimeSettingsTerminalIoIau.implementationSharing, "none", "runtime settings terminal I/O IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsTerminalIoIau, "runtime settings terminal I/O IAU");
requireEqual(runtimeSettingsTerminalIoIau.preImplementationPreflight?.status, "pass", "runtime settings terminal I/O IAU preImplementationPreflight status");
requireEqual(runtimeSettingsTerminalIoIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-terminal-io-adapter-v1-preflight-v1.json", "runtime settings terminal I/O IAU preImplementationPreflight record");
requireEqual(runtimeSettingsTerminalIoIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings terminal I/O IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsTerminalIoIau.implementationHandoffIssue?.number, 79, "runtime settings terminal I/O IAU implementationHandoffIssue number");
requireEqual(runtimeSettingsTerminalIoIau.implementationCloseout?.status, "pass", "runtime settings terminal I/O IAU implementationCloseout status");
requireArrayEqual(runtimeSettingsTerminalIoIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014"], "runtime settings terminal I/O IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsTerminalIoSliceId}/IAU-runtime-settings-cli-terminal-io-adapter-v1.md`);

const runtimeSettingsTerminalIoPreflight = readJson(runtimeSettingsTerminalIoPreflightPath);
requireEqual(runtimeSettingsTerminalIoPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings terminal I/O preflight schema");
requireEqual(runtimeSettingsTerminalIoPreflight.iauId, "IAU-runtime-settings-cli-terminal-io-adapter-v1", "runtime settings terminal I/O preflight iauId");
requireEqual(runtimeSettingsTerminalIoPreflight.status, "pass", "runtime settings terminal I/O preflight status");
requireEqual(runtimeSettingsTerminalIoPreflight.implementationStartAllowed, true, "runtime settings terminal I/O preflight implementationStartAllowed");
requireEqual(runtimeSettingsTerminalIoPreflight.parentSliceId, runtimeSettingsTerminalIoSliceId, "runtime settings terminal I/O preflight parentSliceId");
requireEqual(runtimeSettingsTerminalIoPreflight.implementationSharing, "none", "runtime settings terminal I/O preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsTerminalIoPreflight, "runtime settings terminal I/O preflight");
requireArrayEqual(runtimeSettingsTerminalIoPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014"], "runtime settings terminal I/O preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsTerminalIoPreflight.checkResults) || runtimeSettingsTerminalIoPreflight.checkResults.length !== runtimeSettingsTerminalIoPreflight.requiredChecks.length) {
  failures.push("runtime settings terminal I/O preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsTerminalIoPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings terminal I/O preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsTerminalIoSliceId}/IAU-runtime-settings-cli-terminal-io-adapter-v1-preflight-v1.md`);

const runtimeSettingsTerminalIoManifest = readJson(`${runtimeSettingsTerminalIoImportDir}/manifest.json`);
requireEqual(runtimeSettingsTerminalIoManifest.schema, "vi-history/requirements-import@v1", "runtime settings terminal I/O manifest schema");
requireEqual(runtimeSettingsTerminalIoManifest.sliceId, runtimeSettingsTerminalIoSliceId, "runtime settings terminal I/O sliceId");
requireEqual(runtimeSettingsTerminalIoManifest.sourceBaselineTag, "v1.3.16", "runtime settings terminal I/O sourceBaselineTag");
requireEqual(runtimeSettingsTerminalIoManifest.sourceCommit, "bb795ace470bcb17d9436fd34c59344077c37777", "runtime settings terminal I/O sourceCommit");
requireEqual(runtimeSettingsTerminalIoManifest.governedAdmissionCommit, "087b08493c4f0f4fea55aca379a585a2110c5b63", "runtime settings terminal I/O governedAdmissionCommit");
requireEqual(runtimeSettingsTerminalIoManifest.targetProduct, "vi-history", "runtime settings terminal I/O targetProduct");
requireEqual(runtimeSettingsTerminalIoManifest.targetFeature, runtimeSettingsTerminalIoSliceId, "runtime settings terminal I/O targetFeature");
requireEqual(runtimeSettingsTerminalIoManifest.redactionStatus, "pass", "runtime settings terminal I/O redactionStatus");
requireEqual(runtimeSettingsTerminalIoManifest.implementationSharing, "none", "runtime settings terminal I/O implementationSharing");
requireEqual(runtimeSettingsTerminalIoManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings terminal I/O marketplacePublication");
requireArrayEqual(runtimeSettingsTerminalIoManifest.importedRequirementIds, runtimeSettingsTerminalIoExpectedIds, "runtime settings terminal I/O importedRequirementIds");
requireArrayEqual(runtimeSettingsTerminalIoManifest.prerequisiteRequirementIds, ["VHS-REQ-537", "VHS-REQ-544"], "runtime settings terminal I/O prerequisiteRequirementIds");
requireArrayEqual(runtimeSettingsTerminalIoManifest.supportingTestIds, ["TEST-UNIT-353", "TEST-UNIT-354"], "runtime settings terminal I/O supportingTestIds");
requireArrayEqual(runtimeSettingsTerminalIoManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings terminal I/O manifest files");
requireEqual(runtimeSettingsTerminalIoManifest.dockerImageFacts?.latestLinuxTag, "latest-linux", "runtime settings terminal I/O Docker latestLinuxTag");
requireEqual(runtimeSettingsTerminalIoManifest.dockerImageFacts?.latestLinuxVersionedTag, "2026q1patch2-linux", "runtime settings terminal I/O Docker latestLinuxVersionedTag");
requireEqual(runtimeSettingsTerminalIoManifest.dockerImageFacts?.latestLinuxPlatform, "linux/amd64", "runtime settings terminal I/O Docker latestLinuxPlatform");
requireEqual(runtimeSettingsTerminalIoManifest.dockerImageFacts?.latestWindowsTag, "latest-windows", "runtime settings terminal I/O Docker latestWindowsTag");
requireEqual(runtimeSettingsTerminalIoManifest.dockerImageFacts?.latestWindowsVersionedTag, "2026q1patch2-windows", "runtime settings terminal I/O Docker latestWindowsVersionedTag");
requireEqual(runtimeSettingsTerminalIoManifest.dockerImageFacts?.latestWindowsPlatform, "windows/amd64", "runtime settings terminal I/O Docker latestWindowsPlatform");

for (const file of runtimeSettingsTerminalIoManifest.files ?? []) {
  requireFile(`${runtimeSettingsTerminalIoImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsTerminalIoFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsTerminalIoFeatureDir}/spec.md`, [
  "Runtime Settings CLI Terminal I/O Adapter",
  "VHS-REQ-545",
  "VHS-REQ-546",
  "IAU-runtime-settings-cli-terminal-io-adapter-v1",
  "latest supported NI LabVIEW Docker image family",
  "MUST NOT expose or accept a\n  separate Docker bitness choice",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsTerminalIoFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-terminal-io-adapter-v1",
  "Issue #77",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${runtimeSettingsTerminalIoFeatureDir}/tasks.md`, [
  "Issue #77",
  "Issue #79",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T014",
  "IAU-runtime-settings-cli-terminal-io-adapter-v1",
  "[BLOCKED]",
  "T023"
]);
requireTextIncludes(`${runtimeSettingsTerminalIoImportDir}/rtm.csv`, runtimeSettingsTerminalIoExpectedIds);
requireTextIncludes(`${runtimeSettingsTerminalIoImportDir}/srs.md`, [
  "VHS-REQ-545",
  "VHS-REQ-546",
  "TEST-UNIT-353",
  "TEST-UNIT-354",
  "VHS-REQ-537",
  "VHS-REQ-544",
  "no Docker bitness choice"
]);
requireTextIncludes(`${runtimeSettingsTerminalIoImportDir}/test-plan.md`, [
  "TEST-UNIT-RSTIO-001",
  "TEST-UNIT-RSTIO-006",
  "non-TTY",
  "unsupported input"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-terminal-io-adapter-v1",
  "docs/requirements/admissions/runtime-settings-cli-terminal-io-adapter-v1.json",
  "Issue #77",
  "Issue #79",
  "IAU-runtime-settings-cli-terminal-io-adapter-v1",
  "Current Implementation Admission Unit:\n`none`.",
  "latest supported NI LabVIEW image-family selection with no Docker bitness\nprompt",
  "source copying remain blocked"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-terminal-io-adapter-v1",
  "Issue #77",
  "Issue #79",
  "Current Implementation Admission Unit:\n`none`.",
  "IAU-runtime-settings-cli-terminal-io-adapter-v1",
  "no Docker bitness prompt",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-terminal-io-adapter-v1",
  "Issue #77",
  "Issue #79",
  "IAU-runtime-settings-cli-terminal-io-adapter-v1",
  "Docker latest supported NI\nLabVIEW image-family selection without a Docker bitness prompt",
  "runtime settings CLI terminal I/O adapter behavior beyond pure terminal"
]);

const runtimeSettingsProofOutAdmission = readJson(runtimeSettingsProofOutAdmissionPath);
requireEqual(runtimeSettingsProofOutAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings proof-out admission schema");
requireEqual(runtimeSettingsProofOutAdmission.sliceId, runtimeSettingsProofOutSliceId, "runtime settings proof-out admission sliceId");
requireEqual(runtimeSettingsProofOutAdmission.state, "implemented", "runtime settings proof-out admission state");
requireEqual(runtimeSettingsProofOutAdmission.targetProduct, "vi-history", "runtime settings proof-out admission targetProduct");
requireEqual(runtimeSettingsProofOutAdmission.targetFeature, runtimeSettingsProofOutSliceId, "runtime settings proof-out admission targetFeature");
requireEqual(runtimeSettingsProofOutAdmission.sourceBaselineTag, "v1.3.16", "runtime settings proof-out admission sourceBaselineTag");
requireEqual(runtimeSettingsProofOutAdmission.sourceCommit, "087b08493c4f0f4fea55aca379a585a2110c5b63", "runtime settings proof-out admission sourceCommit");
requireEqual(runtimeSettingsProofOutAdmission.governedAdmissionCommit, "31810efff02ba5fe38c0642e6b2175f511ee12fa", "runtime settings proof-out admission governedAdmissionCommit");
requireEqual(runtimeSettingsProofOutAdmission.implementationSharing, "none", "runtime settings proof-out admission implementationSharing");
requireMarketplacePosture(runtimeSettingsProofOutAdmission, "runtime settings proof-out admission");
requireEqual(runtimeSettingsProofOutAdmission.currentImplementationAdmissionUnit, null, "runtime settings proof-out currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsProofOutAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings proof-out completedSpecScope");
requireArrayEqual(runtimeSettingsProofOutAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014"], "runtime settings proof-out completedImplementationScope");
requireArrayEqual(runtimeSettingsProofOutAdmission.admittedImplementationScope, [], "runtime settings proof-out admittedImplementationScope");
requireArrayEqual(runtimeSettingsProofOutAdmission.blockedImplementationScope, ["T015", "T016", "T017", "T018", "T019", "T020", "T021", "T022", "T023"], "runtime settings proof-out blockedImplementationScope");
requireEqual(runtimeSettingsProofOutAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-proof-out-v1", "runtime settings proof-out preImplementationPreflight iauId");
requireEqual(runtimeSettingsProofOutAdmission.preImplementationPreflight?.status, "pass", "runtime settings proof-out preImplementationPreflight status");
requireEqual(runtimeSettingsProofOutAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings proof-out preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsProofOutAdmission.preImplementationPreflight?.record, runtimeSettingsProofOutPreflightPath, "runtime settings proof-out preImplementationPreflight record");
requireEqual(runtimeSettingsProofOutAdmission.issue?.number, 81, "runtime settings proof-out issue number");
requireEqual(runtimeSettingsProofOutAdmission.implementationHandoffIssue?.number, 83, "runtime settings proof-out implementation handoff issue number");
requireEqual(runtimeSettingsProofOutAdmission.implementationCloseout?.status, "pass", "runtime settings proof-out implementation closeout status");
requireEqual(runtimeSettingsProofOutAdmission.implementationCloseout?.issue, 83, "runtime settings proof-out implementation closeout issue");
requireArrayEqual(runtimeSettingsProofOutAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014"], "runtime settings proof-out implementation closeout completedTasks");
requireArrayEqual(runtimeSettingsProofOutAdmission.implementationCloseout?.blockedScopeRetained, ["T015", "T016", "T017", "T018", "T019", "T020", "T021", "T022", "T023"], "runtime settings proof-out implementation closeout blockedScopeRetained");
requireFile(`docs/requirements/admissions/${runtimeSettingsProofOutSliceId}.md`);

const runtimeSettingsProofOutAdmissionUnit = (runtimeSettingsProofOutAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-proof-out-v1");
requireEqual(runtimeSettingsProofOutAdmissionUnit?.state, "implemented", "runtime settings proof-out admission unit state");
requireEqual(runtimeSettingsProofOutAdmissionUnit?.preflightRecord, runtimeSettingsProofOutPreflightPath, "runtime settings proof-out admission unit preflightRecord");

const runtimeSettingsProofOutIau = readJson(runtimeSettingsProofOutIauPath);
requireEqual(runtimeSettingsProofOutIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings proof-out IAU schema");
requireEqual(runtimeSettingsProofOutIau.iauId, "IAU-runtime-settings-cli-validation-proof-out-v1", "runtime settings proof-out IAU id");
requireEqual(runtimeSettingsProofOutIau.state, "implemented", "runtime settings proof-out IAU state");
requireEqual(runtimeSettingsProofOutIau.parentSliceId, runtimeSettingsProofOutSliceId, "runtime settings proof-out IAU parentSliceId");
requireEqual(runtimeSettingsProofOutIau.implementationHandoffIssue?.number, 83, "runtime settings proof-out IAU implementation handoff issue number");
requireArrayEqual(runtimeSettingsProofOutIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014"], "runtime settings proof-out IAU admittedTasks");
requireArrayEqual(runtimeSettingsProofOutIau.blockedTasks, ["T015", "T016", "T017", "T018", "T019", "T020", "T021", "T022", "T023"], "runtime settings proof-out IAU blockedTasks");
requireEqual(runtimeSettingsProofOutIau.implementationSharing, "none", "runtime settings proof-out IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsProofOutIau, "runtime settings proof-out IAU");
requireEqual(runtimeSettingsProofOutIau.preImplementationPreflight?.status, "pass", "runtime settings proof-out IAU preImplementationPreflight status");
requireEqual(runtimeSettingsProofOutIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-proof-out-v1-preflight-v1.json", "runtime settings proof-out IAU preImplementationPreflight record");
requireEqual(runtimeSettingsProofOutIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings proof-out IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsProofOutIau.implementationCloseout?.status, "pass", "runtime settings proof-out IAU implementationCloseout status");
requireEqual(runtimeSettingsProofOutIau.implementationCloseout?.issue, 83, "runtime settings proof-out IAU implementationCloseout issue");
requireArrayEqual(runtimeSettingsProofOutIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014"], "runtime settings proof-out IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsProofOutSliceId}/IAU-runtime-settings-cli-validation-proof-out-v1.md`);

const runtimeSettingsProofOutPreflight = readJson(runtimeSettingsProofOutPreflightPath);
requireEqual(runtimeSettingsProofOutPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings proof-out preflight schema");
requireEqual(runtimeSettingsProofOutPreflight.iauId, "IAU-runtime-settings-cli-validation-proof-out-v1", "runtime settings proof-out preflight iauId");
requireEqual(runtimeSettingsProofOutPreflight.status, "pass", "runtime settings proof-out preflight status");
requireEqual(runtimeSettingsProofOutPreflight.implementationStartAllowed, true, "runtime settings proof-out preflight implementationStartAllowed");
requireEqual(runtimeSettingsProofOutPreflight.parentSliceId, runtimeSettingsProofOutSliceId, "runtime settings proof-out preflight parentSliceId");
requireEqual(runtimeSettingsProofOutPreflight.implementationSharing, "none", "runtime settings proof-out preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsProofOutPreflight, "runtime settings proof-out preflight");
requireArrayEqual(runtimeSettingsProofOutPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014"], "runtime settings proof-out preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsProofOutPreflight.checkResults) || runtimeSettingsProofOutPreflight.checkResults.length !== runtimeSettingsProofOutPreflight.requiredChecks.length) {
  failures.push("runtime settings proof-out preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsProofOutPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings proof-out preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsProofOutSliceId}/IAU-runtime-settings-cli-validation-proof-out-v1-preflight-v1.md`);

const runtimeSettingsProofOutManifest = readJson(`${runtimeSettingsProofOutImportDir}/manifest.json`);
requireEqual(runtimeSettingsProofOutManifest.schema, "vi-history/requirements-import@v1", "runtime settings proof-out manifest schema");
requireEqual(runtimeSettingsProofOutManifest.sliceId, runtimeSettingsProofOutSliceId, "runtime settings proof-out sliceId");
requireEqual(runtimeSettingsProofOutManifest.sourceBaselineTag, "v1.3.16", "runtime settings proof-out sourceBaselineTag");
requireEqual(runtimeSettingsProofOutManifest.sourceCommit, "087b08493c4f0f4fea55aca379a585a2110c5b63", "runtime settings proof-out sourceCommit");
requireEqual(runtimeSettingsProofOutManifest.governedAdmissionCommit, "31810efff02ba5fe38c0642e6b2175f511ee12fa", "runtime settings proof-out governedAdmissionCommit");
requireEqual(runtimeSettingsProofOutManifest.targetProduct, "vi-history", "runtime settings proof-out targetProduct");
requireEqual(runtimeSettingsProofOutManifest.targetFeature, runtimeSettingsProofOutSliceId, "runtime settings proof-out targetFeature");
requireEqual(runtimeSettingsProofOutManifest.redactionStatus, "pass", "runtime settings proof-out redactionStatus");
requireEqual(runtimeSettingsProofOutManifest.implementationSharing, "none", "runtime settings proof-out implementationSharing");
requireEqual(runtimeSettingsProofOutManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings proof-out marketplacePublication");
requireArrayEqual(runtimeSettingsProofOutManifest.importedRequirementIds, runtimeSettingsProofOutExpectedIds, "runtime settings proof-out importedRequirementIds");
requireArrayEqual(runtimeSettingsProofOutManifest.prerequisiteRequirementIds, ["VHS-REQ-537", "VHS-REQ-544", "VHS-REQ-545"], "runtime settings proof-out prerequisiteRequirementIds");
requireArrayEqual(runtimeSettingsProofOutManifest.supportingTestIds, ["TEST-UNIT-392"], "runtime settings proof-out supportingTestIds");
requireArrayEqual(runtimeSettingsProofOutManifest.artifactNames, ["vihs-validation-proof.json", "vihs-validation-issue.md"], "runtime settings proof-out artifactNames");
requireArrayEqual(runtimeSettingsProofOutManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings proof-out manifest files");

for (const file of runtimeSettingsProofOutManifest.files ?? []) {
  requireFile(`${runtimeSettingsProofOutImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsProofOutFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsProofOutFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Proof-Out Adapter",
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "IAU-runtime-settings-cli-validation-proof-out-v1",
  "vihs-validation-proof.json",
  "vihs-validation-issue.md",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsProofOutFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-validation-proof-out-v1",
  "Issue #81",
  "Issue #83",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${runtimeSettingsProofOutFeatureDir}/tasks.md`, [
  "Issue #81",
  "Issue #83",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T014",
  "IAU-runtime-settings-cli-validation-proof-out-v1",
  "[BLOCKED]",
  "T023"
]);
requireTextIncludes(`${runtimeSettingsProofOutImportDir}/rtm.csv`, runtimeSettingsProofOutExpectedIds);
requireTextIncludes(`${runtimeSettingsProofOutImportDir}/srs.md`, [
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "vihs --validate --proof-out",
  "vihs-validation-proof.json",
  "vihs-validation-issue.md"
]);
requireTextIncludes(`${runtimeSettingsProofOutImportDir}/test-plan.md`, [
  "TEST-UNIT-RSPROOFOUT-001",
  "TEST-UNIT-RSPROOFOUT-005",
  "non-interactive",
  "side effects remain blocked"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-proof-out-v1",
  "docs/requirements/admissions/runtime-settings-cli-validation-proof-out-v1.json",
  "Issue #81",
  "Issue #83",
  "IAU-runtime-settings-cli-validation-proof-out-v1",
  "Current Implementation Admission Unit:\n`none`.",
  "Runtime validation execution",
  "source copying remain blocked"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-proof-out-v1",
  "Issue #81",
  "Issue #83",
  "Current Implementation Admission Unit:\n`none`.",
  "IAU-runtime-settings-cli-validation-proof-out-v1",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-proof-out-v1",
  "Issue #81",
  "Issue #83",
  "IAU-runtime-settings-cli-validation-proof-out-v1",
  "validation proof-out\nadapter behavior beyond pure proof-out",
  "proof-out adapter consumes supplied validation/proof"
]);

const runtimeSettingsProofOutFileEmissionAdmission = readJson(runtimeSettingsProofOutFileEmissionAdmissionPath);
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings proof-out file-emission admission schema");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.sliceId, runtimeSettingsProofOutFileEmissionSliceId, "runtime settings proof-out file-emission admission sliceId");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.state, "implemented", "runtime settings proof-out file-emission admission state");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.targetProduct, "vi-history", "runtime settings proof-out file-emission admission targetProduct");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.targetFeature, runtimeSettingsProofOutFileEmissionSliceId, "runtime settings proof-out file-emission admission targetFeature");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.sourceBaselineTag, "v1.3.16", "runtime settings proof-out file-emission admission sourceBaselineTag");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.sourceCommit, "31810efff02ba5fe38c0642e6b2175f511ee12fa", "runtime settings proof-out file-emission admission sourceCommit");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.governedAdmissionCommit, "567157f4a77536c4efa07ba72eea3314083ccde2", "runtime settings proof-out file-emission admission governedAdmissionCommit");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.implementationSharing, "none", "runtime settings proof-out file-emission admission implementationSharing");
requireMarketplacePosture(runtimeSettingsProofOutFileEmissionAdmission, "runtime settings proof-out file-emission admission");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.currentImplementationAdmissionUnit, null, "runtime settings proof-out file-emission currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsProofOutFileEmissionAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings proof-out file-emission completedSpecScope");
requireArrayEqual(runtimeSettingsProofOutFileEmissionAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings proof-out file-emission completedImplementationScope");
requireArrayEqual(runtimeSettingsProofOutFileEmissionAdmission.admittedImplementationScope, [], "runtime settings proof-out file-emission admittedImplementationScope");
requireArrayEqual(runtimeSettingsProofOutFileEmissionAdmission.blockedImplementationScope, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026"], "runtime settings proof-out file-emission blockedImplementationScope");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-proof-out-file-emission-v1", "runtime settings proof-out file-emission preImplementationPreflight iauId");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.preImplementationPreflight?.status, "pass", "runtime settings proof-out file-emission preImplementationPreflight status");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings proof-out file-emission preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.preImplementationPreflight?.record, runtimeSettingsProofOutFileEmissionPreflightPath, "runtime settings proof-out file-emission preImplementationPreflight record");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.issue?.number, 85, "runtime settings proof-out file-emission issue number");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.implementationHandoffIssue?.number, 87, "runtime settings proof-out file-emission implementation handoff issue number");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.implementationCloseout?.status, "pass", "runtime settings proof-out file-emission implementation closeout status");
requireEqual(runtimeSettingsProofOutFileEmissionAdmission.implementationCloseout?.issue, 87, "runtime settings proof-out file-emission implementation closeout issue");
requireArrayEqual(runtimeSettingsProofOutFileEmissionAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings proof-out file-emission implementation closeout completedTasks");
requireArrayEqual(runtimeSettingsProofOutFileEmissionAdmission.implementationCloseout?.blockedScopeRetained, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026"], "runtime settings proof-out file-emission implementation closeout blockedScopeRetained");
requireFile(`docs/requirements/admissions/${runtimeSettingsProofOutFileEmissionSliceId}.md`);

const runtimeSettingsProofOutFileEmissionAdmissionUnit = (runtimeSettingsProofOutFileEmissionAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-proof-out-file-emission-v1");
requireEqual(runtimeSettingsProofOutFileEmissionAdmissionUnit?.state, "implemented", "runtime settings proof-out file-emission admission unit state");
requireEqual(runtimeSettingsProofOutFileEmissionAdmissionUnit?.preflightRecord, runtimeSettingsProofOutFileEmissionPreflightPath, "runtime settings proof-out file-emission admission unit preflightRecord");

const runtimeSettingsProofOutFileEmissionIau = readJson(runtimeSettingsProofOutFileEmissionIauPath);
requireEqual(runtimeSettingsProofOutFileEmissionIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings proof-out file-emission IAU schema");
requireEqual(runtimeSettingsProofOutFileEmissionIau.iauId, "IAU-runtime-settings-cli-validation-proof-out-file-emission-v1", "runtime settings proof-out file-emission IAU id");
requireEqual(runtimeSettingsProofOutFileEmissionIau.state, "implemented", "runtime settings proof-out file-emission IAU state");
requireEqual(runtimeSettingsProofOutFileEmissionIau.parentSliceId, runtimeSettingsProofOutFileEmissionSliceId, "runtime settings proof-out file-emission IAU parentSliceId");
requireEqual(runtimeSettingsProofOutFileEmissionIau.implementationHandoffIssue?.number, 87, "runtime settings proof-out file-emission IAU implementation handoff issue number");
requireArrayEqual(runtimeSettingsProofOutFileEmissionIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings proof-out file-emission IAU admittedTasks");
requireArrayEqual(runtimeSettingsProofOutFileEmissionIau.blockedTasks, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026"], "runtime settings proof-out file-emission IAU blockedTasks");
requireEqual(runtimeSettingsProofOutFileEmissionIau.implementationSharing, "none", "runtime settings proof-out file-emission IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsProofOutFileEmissionIau, "runtime settings proof-out file-emission IAU");
requireEqual(runtimeSettingsProofOutFileEmissionIau.preImplementationPreflight?.status, "pass", "runtime settings proof-out file-emission IAU preImplementationPreflight status");
requireEqual(runtimeSettingsProofOutFileEmissionIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-proof-out-file-emission-v1-preflight-v1.json", "runtime settings proof-out file-emission IAU preImplementationPreflight record");
requireEqual(runtimeSettingsProofOutFileEmissionIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings proof-out file-emission IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsProofOutFileEmissionIau.implementationCloseout?.status, "pass", "runtime settings proof-out file-emission IAU implementationCloseout status");
requireEqual(runtimeSettingsProofOutFileEmissionIau.implementationCloseout?.issue, 87, "runtime settings proof-out file-emission IAU implementationCloseout issue");
requireArrayEqual(runtimeSettingsProofOutFileEmissionIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings proof-out file-emission IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsProofOutFileEmissionSliceId}/IAU-runtime-settings-cli-validation-proof-out-file-emission-v1.md`);

const runtimeSettingsProofOutFileEmissionPreflight = readJson(runtimeSettingsProofOutFileEmissionPreflightPath);
requireEqual(runtimeSettingsProofOutFileEmissionPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings proof-out file-emission preflight schema");
requireEqual(runtimeSettingsProofOutFileEmissionPreflight.iauId, "IAU-runtime-settings-cli-validation-proof-out-file-emission-v1", "runtime settings proof-out file-emission preflight iauId");
requireEqual(runtimeSettingsProofOutFileEmissionPreflight.status, "pass", "runtime settings proof-out file-emission preflight status");
requireEqual(runtimeSettingsProofOutFileEmissionPreflight.implementationStartAllowed, true, "runtime settings proof-out file-emission preflight implementationStartAllowed");
requireEqual(runtimeSettingsProofOutFileEmissionPreflight.parentSliceId, runtimeSettingsProofOutFileEmissionSliceId, "runtime settings proof-out file-emission preflight parentSliceId");
requireEqual(runtimeSettingsProofOutFileEmissionPreflight.implementationSharing, "none", "runtime settings proof-out file-emission preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsProofOutFileEmissionPreflight, "runtime settings proof-out file-emission preflight");
requireArrayEqual(runtimeSettingsProofOutFileEmissionPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings proof-out file-emission preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsProofOutFileEmissionPreflight.checkResults) || runtimeSettingsProofOutFileEmissionPreflight.checkResults.length !== runtimeSettingsProofOutFileEmissionPreflight.requiredChecks.length) {
  failures.push("runtime settings proof-out file-emission preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsProofOutFileEmissionPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings proof-out file-emission preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsProofOutFileEmissionSliceId}/IAU-runtime-settings-cli-validation-proof-out-file-emission-v1-preflight-v1.md`);

const runtimeSettingsProofOutFileEmissionManifest = readJson(`${runtimeSettingsProofOutFileEmissionImportDir}/manifest.json`);
requireEqual(runtimeSettingsProofOutFileEmissionManifest.schema, "vi-history/requirements-import@v1", "runtime settings proof-out file-emission manifest schema");
requireEqual(runtimeSettingsProofOutFileEmissionManifest.sliceId, runtimeSettingsProofOutFileEmissionSliceId, "runtime settings proof-out file-emission sliceId");
requireEqual(runtimeSettingsProofOutFileEmissionManifest.sourceBaselineTag, "v1.3.16", "runtime settings proof-out file-emission sourceBaselineTag");
requireEqual(runtimeSettingsProofOutFileEmissionManifest.sourceCommit, "31810efff02ba5fe38c0642e6b2175f511ee12fa", "runtime settings proof-out file-emission sourceCommit");
requireEqual(runtimeSettingsProofOutFileEmissionManifest.governedAdmissionCommit, "567157f4a77536c4efa07ba72eea3314083ccde2", "runtime settings proof-out file-emission governedAdmissionCommit");
requireEqual(runtimeSettingsProofOutFileEmissionManifest.targetProduct, "vi-history", "runtime settings proof-out file-emission targetProduct");
requireEqual(runtimeSettingsProofOutFileEmissionManifest.targetFeature, runtimeSettingsProofOutFileEmissionSliceId, "runtime settings proof-out file-emission targetFeature");
requireEqual(runtimeSettingsProofOutFileEmissionManifest.redactionStatus, "pass", "runtime settings proof-out file-emission redactionStatus");
requireEqual(runtimeSettingsProofOutFileEmissionManifest.implementationSharing, "none", "runtime settings proof-out file-emission implementationSharing");
requireEqual(runtimeSettingsProofOutFileEmissionManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings proof-out file-emission marketplacePublication");
requireArrayEqual(runtimeSettingsProofOutFileEmissionManifest.importedRequirementIds, runtimeSettingsProofOutFileEmissionExpectedIds, "runtime settings proof-out file-emission importedRequirementIds");
requireArrayEqual(runtimeSettingsProofOutFileEmissionManifest.prerequisiteRequirementIds, ["VHS-REQ-537", "VHS-REQ-544", "VHS-REQ-545"], "runtime settings proof-out file-emission prerequisiteRequirementIds");
requireArrayEqual(runtimeSettingsProofOutFileEmissionManifest.supportingTestIds, ["TEST-UNIT-392"], "runtime settings proof-out file-emission supportingTestIds");
requireArrayEqual(runtimeSettingsProofOutFileEmissionManifest.artifactNames, ["vihs-validation-proof.json", "vihs-validation-issue.md"], "runtime settings proof-out file-emission artifactNames");
requireArrayEqual(runtimeSettingsProofOutFileEmissionManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings proof-out file-emission manifest files");

for (const file of runtimeSettingsProofOutFileEmissionManifest.files ?? []) {
  requireFile(`${runtimeSettingsProofOutFileEmissionImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsProofOutFileEmissionFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsProofOutFileEmissionFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Proof-Out File Emission",
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "IAU-runtime-settings-cli-validation-proof-out-file-emission-v1",
  "runtime-settings-cli-validation-proof-out-adapter-contract",
  "vihs-validation-proof.json",
  "vihs-validation-issue.md",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsProofOutFileEmissionFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-validation-proof-out-file-emission-v1",
  "Issue #85",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${runtimeSettingsProofOutFileEmissionFeatureDir}/tasks.md`, [
  "Issue #85",
  "Issue #87",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T016",
  "IAU-runtime-settings-cli-validation-proof-out-file-emission-v1",
  "[BLOCKED]",
  "T026"
]);
requireTextIncludes(`${runtimeSettingsProofOutFileEmissionImportDir}/rtm.csv`, runtimeSettingsProofOutFileEmissionExpectedIds);
requireTextIncludes(`${runtimeSettingsProofOutFileEmissionImportDir}/srs.md`, [
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "vihs --validate --proof-out",
  "runtime-settings-cli-validation-proof-out-adapter-contract",
  "vihs-validation-proof.json",
  "vihs-validation-issue.md"
]);
requireTextIncludes(`${runtimeSettingsProofOutFileEmissionImportDir}/test-plan.md`, [
  "TEST-UNIT-RSPROOFOUTEMIT-001",
  "TEST-UNIT-RSPROOFOUTEMIT-007",
  "hidden partial success",
  "source copying remain blocked"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-proof-out-file-emission-v1",
  "docs/requirements/admissions/runtime-settings-cli-validation-proof-out-file-emission-v1.json",
  "Issue #85",
  "Issue #87",
  "IAU-runtime-settings-cli-validation-proof-out-file-emission-v1",
  "new validation fact generation",
  "source copying remain\nblocked"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-proof-out-file-emission-v1",
  "Issue #85",
  "Issue #87",
  "IAU-runtime-settings-cli-validation-proof-out-file-emission-v1",
  "IAU-runtime-settings-cli-validation-runtime-outcome-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-proof-out-file-emission-v1",
  "Issue #85",
  "Issue #87",
  "IAU-runtime-settings-cli-validation-proof-out-file-emission-v1",
  "file emission from ready proof-out adapter facts",
  "new\nvalidation facts"
]);

const runtimeSettingsRuntimeOutcomeAdmission = readJson(runtimeSettingsRuntimeOutcomeAdmissionPath);
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings runtime outcome admission schema");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.sliceId, runtimeSettingsRuntimeOutcomeSliceId, "runtime settings runtime outcome admission sliceId");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.state, "implemented", "runtime settings runtime outcome admission state");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.targetProduct, "vi-history", "runtime settings runtime outcome admission targetProduct");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.targetFeature, runtimeSettingsRuntimeOutcomeSliceId, "runtime settings runtime outcome admission targetFeature");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.sourceBaselineTag, "v1.3.16", "runtime settings runtime outcome admission sourceBaselineTag");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.sourceCommit, "567157f4a77536c4efa07ba72eea3314083ccde2", "runtime settings runtime outcome admission sourceCommit");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.governedAdmissionCommit, "263e378a3781e2122d7f850998c4c07e2786078a", "runtime settings runtime outcome admission governedAdmissionCommit");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.implementationSharing, "none", "runtime settings runtime outcome admission implementationSharing");
requireMarketplacePosture(runtimeSettingsRuntimeOutcomeAdmission, "runtime settings runtime outcome admission");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.currentImplementationAdmissionUnit, null, "runtime settings runtime outcome currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsRuntimeOutcomeAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings runtime outcome completedSpecScope");
requireArrayEqual(runtimeSettingsRuntimeOutcomeAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings runtime outcome completedImplementationScope");
requireArrayEqual(runtimeSettingsRuntimeOutcomeAdmission.admittedImplementationScope, [], "runtime settings runtime outcome admittedImplementationScope");
requireArrayEqual(runtimeSettingsRuntimeOutcomeAdmission.blockedImplementationScope, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025"], "runtime settings runtime outcome blockedImplementationScope");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-runtime-outcome-v1", "runtime settings runtime outcome preImplementationPreflight iauId");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.preImplementationPreflight?.status, "pass", "runtime settings runtime outcome preImplementationPreflight status");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings runtime outcome preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.preImplementationPreflight?.record, runtimeSettingsRuntimeOutcomePreflightPath, "runtime settings runtime outcome preImplementationPreflight record");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.issue?.number, 89, "runtime settings runtime outcome issue number");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.implementationHandoffIssue?.number, 91, "runtime settings runtime outcome implementation handoff issue number");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.implementationCloseout?.status, "pass", "runtime settings runtime outcome implementation closeout status");
requireEqual(runtimeSettingsRuntimeOutcomeAdmission.implementationCloseout?.issue, 91, "runtime settings runtime outcome implementation closeout issue");
requireArrayEqual(runtimeSettingsRuntimeOutcomeAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings runtime outcome implementation closeout completedTasks");
requireArrayEqual(runtimeSettingsRuntimeOutcomeAdmission.implementationCloseout?.blockedScopeRetained, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025"], "runtime settings runtime outcome implementation closeout blockedScopeRetained");
requireFile(`docs/requirements/admissions/${runtimeSettingsRuntimeOutcomeSliceId}.md`);

const runtimeSettingsRuntimeOutcomeAdmissionUnit = (runtimeSettingsRuntimeOutcomeAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-runtime-outcome-v1");
requireEqual(runtimeSettingsRuntimeOutcomeAdmissionUnit?.state, "implemented", "runtime settings runtime outcome admission unit state");
requireEqual(runtimeSettingsRuntimeOutcomeAdmissionUnit?.preflightRecord, runtimeSettingsRuntimeOutcomePreflightPath, "runtime settings runtime outcome admission unit preflightRecord");

const runtimeSettingsRuntimeOutcomeIau = readJson(runtimeSettingsRuntimeOutcomeIauPath);
requireEqual(runtimeSettingsRuntimeOutcomeIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings runtime outcome IAU schema");
requireEqual(runtimeSettingsRuntimeOutcomeIau.iauId, "IAU-runtime-settings-cli-validation-runtime-outcome-v1", "runtime settings runtime outcome IAU id");
requireEqual(runtimeSettingsRuntimeOutcomeIau.state, "implemented", "runtime settings runtime outcome IAU state");
requireEqual(runtimeSettingsRuntimeOutcomeIau.parentSliceId, runtimeSettingsRuntimeOutcomeSliceId, "runtime settings runtime outcome IAU parentSliceId");
requireEqual(runtimeSettingsRuntimeOutcomeIau.implementationHandoffIssue?.number, 91, "runtime settings runtime outcome IAU implementation handoff issue number");
requireArrayEqual(runtimeSettingsRuntimeOutcomeIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings runtime outcome IAU admittedTasks");
requireArrayEqual(runtimeSettingsRuntimeOutcomeIau.blockedTasks, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025"], "runtime settings runtime outcome IAU blockedTasks");
requireEqual(runtimeSettingsRuntimeOutcomeIau.implementationSharing, "none", "runtime settings runtime outcome IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsRuntimeOutcomeIau, "runtime settings runtime outcome IAU");
requireEqual(runtimeSettingsRuntimeOutcomeIau.preImplementationPreflight?.status, "pass", "runtime settings runtime outcome IAU preImplementationPreflight status");
requireEqual(runtimeSettingsRuntimeOutcomeIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-runtime-outcome-v1-preflight-v1.json", "runtime settings runtime outcome IAU preImplementationPreflight record");
requireEqual(runtimeSettingsRuntimeOutcomeIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings runtime outcome IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsRuntimeOutcomeIau.implementationCloseout?.status, "pass", "runtime settings runtime outcome IAU implementationCloseout status");
requireEqual(runtimeSettingsRuntimeOutcomeIau.implementationCloseout?.issue, 91, "runtime settings runtime outcome IAU implementationCloseout issue");
requireArrayEqual(runtimeSettingsRuntimeOutcomeIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings runtime outcome IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsRuntimeOutcomeSliceId}/IAU-runtime-settings-cli-validation-runtime-outcome-v1.md`);

const runtimeSettingsRuntimeOutcomePreflight = readJson(runtimeSettingsRuntimeOutcomePreflightPath);
requireEqual(runtimeSettingsRuntimeOutcomePreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings runtime outcome preflight schema");
requireEqual(runtimeSettingsRuntimeOutcomePreflight.iauId, "IAU-runtime-settings-cli-validation-runtime-outcome-v1", "runtime settings runtime outcome preflight iauId");
requireEqual(runtimeSettingsRuntimeOutcomePreflight.status, "pass", "runtime settings runtime outcome preflight status");
requireEqual(runtimeSettingsRuntimeOutcomePreflight.implementationStartAllowed, true, "runtime settings runtime outcome preflight implementationStartAllowed");
requireEqual(runtimeSettingsRuntimeOutcomePreflight.parentSliceId, runtimeSettingsRuntimeOutcomeSliceId, "runtime settings runtime outcome preflight parentSliceId");
requireEqual(runtimeSettingsRuntimeOutcomePreflight.implementationSharing, "none", "runtime settings runtime outcome preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsRuntimeOutcomePreflight, "runtime settings runtime outcome preflight");
requireArrayEqual(runtimeSettingsRuntimeOutcomePreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings runtime outcome preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsRuntimeOutcomePreflight.checkResults) || runtimeSettingsRuntimeOutcomePreflight.checkResults.length !== runtimeSettingsRuntimeOutcomePreflight.requiredChecks.length) {
  failures.push("runtime settings runtime outcome preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsRuntimeOutcomePreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings runtime outcome preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsRuntimeOutcomeSliceId}/IAU-runtime-settings-cli-validation-runtime-outcome-v1-preflight-v1.md`);

const runtimeSettingsRuntimeOutcomeManifest = readJson(`${runtimeSettingsRuntimeOutcomeImportDir}/manifest.json`);
requireEqual(runtimeSettingsRuntimeOutcomeManifest.schema, "vi-history/requirements-import@v1", "runtime settings runtime outcome manifest schema");
requireEqual(runtimeSettingsRuntimeOutcomeManifest.sliceId, runtimeSettingsRuntimeOutcomeSliceId, "runtime settings runtime outcome sliceId");
requireEqual(runtimeSettingsRuntimeOutcomeManifest.sourceBaselineTag, "v1.3.16", "runtime settings runtime outcome sourceBaselineTag");
requireEqual(runtimeSettingsRuntimeOutcomeManifest.sourceCommit, "567157f4a77536c4efa07ba72eea3314083ccde2", "runtime settings runtime outcome sourceCommit");
requireEqual(runtimeSettingsRuntimeOutcomeManifest.governedAdmissionCommit, "263e378a3781e2122d7f850998c4c07e2786078a", "runtime settings runtime outcome governedAdmissionCommit");
requireEqual(runtimeSettingsRuntimeOutcomeManifest.targetProduct, "vi-history", "runtime settings runtime outcome targetProduct");
requireEqual(runtimeSettingsRuntimeOutcomeManifest.targetFeature, runtimeSettingsRuntimeOutcomeSliceId, "runtime settings runtime outcome targetFeature");
requireEqual(runtimeSettingsRuntimeOutcomeManifest.redactionStatus, "pass", "runtime settings runtime outcome redactionStatus");
requireEqual(runtimeSettingsRuntimeOutcomeManifest.implementationSharing, "none", "runtime settings runtime outcome implementationSharing");
requireEqual(runtimeSettingsRuntimeOutcomeManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings runtime outcome marketplacePublication");
requireArrayEqual(runtimeSettingsRuntimeOutcomeManifest.importedRequirementIds, runtimeSettingsRuntimeOutcomeExpectedIds, "runtime settings runtime outcome importedRequirementIds");
requireArrayEqual(runtimeSettingsRuntimeOutcomeManifest.prerequisiteRequirementIds, ["VHS-REQ-537", "VHS-REQ-543", "VHS-REQ-544", "VHS-REQ-545"], "runtime settings runtime outcome prerequisiteRequirementIds");
requireArrayEqual(runtimeSettingsRuntimeOutcomeManifest.supportingTestIds, ["TEST-UNIT-392"], "runtime settings runtime outcome supportingTestIds");
requireEqual(runtimeSettingsRuntimeOutcomeManifest.contractName, "createRuntimeSettingsValidationRuntimeOutcome", "runtime settings runtime outcome contractName");
requireArrayEqual(runtimeSettingsRuntimeOutcomeManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings runtime outcome manifest files");

for (const file of runtimeSettingsRuntimeOutcomeManifest.files ?? []) {
  requireFile(`${runtimeSettingsRuntimeOutcomeImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsRuntimeOutcomeFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsRuntimeOutcomeFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Runtime Outcome Facts",
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "IAU-runtime-settings-cli-validation-runtime-outcome-v1",
  "createRuntimeSettingsValidationRuntimeOutcome",
  "runtime-settings-cli-validation-runtime-outcome-contract",
  "runtimeOutcome",
  "Current Implementation Admission Unit\n  is `none`",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsRuntimeOutcomeFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-validation-runtime-outcome-v1",
  "Issue #89",
  "Issue #91",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${runtimeSettingsRuntimeOutcomeFeatureDir}/tasks.md`, [
  "Issue #89",
  "Issue #91",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T016",
  "IAU-runtime-settings-cli-validation-runtime-outcome-v1",
  "[BLOCKED]",
  "T025"
]);
requireTextIncludes(`${runtimeSettingsRuntimeOutcomeImportDir}/rtm.csv`, runtimeSettingsRuntimeOutcomeExpectedIds);
requireTextIncludes(`${runtimeSettingsRuntimeOutcomeImportDir}/srs.md`, [
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "runtimeValidationOutcome",
  "runtimeImplementationStatus",
  "VIHS_E_RUNTIME_VALIDATION_BLOCKED"
]);
requireTextIncludes(`${runtimeSettingsRuntimeOutcomeImportDir}/test-plan.md`, [
  "TEST-UNIT-RSRUNTIMEOUTCOME-001",
  "TEST-UNIT-RSRUNTIMEOUTCOME-006",
  "runtimeOutcome",
  "source-copying side effects remain blocked"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-runtime-outcome-v1",
  "docs/requirements/admissions/runtime-settings-cli-validation-runtime-outcome-v1.json",
  "Issue #89",
  "Issue #91",
  "IAU-runtime-settings-cli-validation-runtime-outcome-v1",
  "Current Implementation Admission Unit:\n`none`.",
  "createRuntimeSettingsValidationRuntimeOutcome(input = {})",
  "validation fact generation beyond supplied\nruntime outcome fact shaping"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-runtime-outcome-v1",
  "Issue #89",
  "Issue #91",
  "Current Implementation Admission Unit:\n`none`.",
  "IAU-runtime-settings-cli-validation-runtime-outcome-v1",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-runtime-outcome-v1",
  "Issue #89",
  "Issue #91",
  "IAU-runtime-settings-cli-validation-runtime-outcome-v1",
  "pure runtime outcome fact\nshaping",
  "runtime locator invocation or OS inspection"
]);

const runtimeSettingsCommandContractAdmission = readJson(runtimeSettingsCommandContractAdmissionPath);
requireEqual(runtimeSettingsCommandContractAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings command contract admission schema");
requireEqual(runtimeSettingsCommandContractAdmission.sliceId, runtimeSettingsCommandContractSliceId, "runtime settings command contract admission sliceId");
requireEqual(runtimeSettingsCommandContractAdmission.state, "implemented", "runtime settings command contract admission state");
requireEqual(runtimeSettingsCommandContractAdmission.targetProduct, "vi-history", "runtime settings command contract admission targetProduct");
requireEqual(runtimeSettingsCommandContractAdmission.targetFeature, runtimeSettingsCommandContractSliceId, "runtime settings command contract admission targetFeature");
requireEqual(runtimeSettingsCommandContractAdmission.sourceBaselineTag, "v1.3.16", "runtime settings command contract admission sourceBaselineTag");
requireEqual(runtimeSettingsCommandContractAdmission.sourceCommit, "7b3d15af11df545de21501106c9b62734fb177f5", "runtime settings command contract admission sourceCommit");
requireEqual(runtimeSettingsCommandContractAdmission.governedAdmissionCommit, "93177a013b5294c0e05745f5af67b866e9b15568", "runtime settings command contract admission governedAdmissionCommit");
requireEqual(runtimeSettingsCommandContractAdmission.implementationSharing, "none", "runtime settings command contract admission implementationSharing");
requireMarketplacePosture(runtimeSettingsCommandContractAdmission, "runtime settings command contract admission");
requireEqual(runtimeSettingsCommandContractAdmission.currentImplementationAdmissionUnit, null, "runtime settings command contract currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsCommandContractAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings command contract completedSpecScope");
requireArrayEqual(runtimeSettingsCommandContractAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016", "T017", "T018"], "runtime settings command contract completedImplementationScope");
requireArrayEqual(runtimeSettingsCommandContractAdmission.admittedImplementationScope, [], "runtime settings command contract admittedImplementationScope");
requireArrayEqual(runtimeSettingsCommandContractAdmission.blockedImplementationScope, ["T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027"], "runtime settings command contract blockedImplementationScope");
requireEqual(runtimeSettingsCommandContractAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-command-contract-v1", "runtime settings command contract preImplementationPreflight iauId");
requireEqual(runtimeSettingsCommandContractAdmission.preImplementationPreflight?.status, "pass", "runtime settings command contract preImplementationPreflight status");
requireEqual(runtimeSettingsCommandContractAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings command contract preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsCommandContractAdmission.preImplementationPreflight?.record, runtimeSettingsCommandContractPreflightPath, "runtime settings command contract preImplementationPreflight record");
requireEqual(runtimeSettingsCommandContractAdmission.issue?.number, 93, "runtime settings command contract issue number");
requireFile(`docs/requirements/admissions/${runtimeSettingsCommandContractSliceId}.md`);

const runtimeSettingsCommandContractAdmissionUnit = (runtimeSettingsCommandContractAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-command-contract-v1");
requireEqual(runtimeSettingsCommandContractAdmissionUnit?.state, "implemented", "runtime settings command contract admission unit state");
requireEqual(runtimeSettingsCommandContractAdmissionUnit?.preflightRecord, runtimeSettingsCommandContractPreflightPath, "runtime settings command contract admission unit preflightRecord");

const runtimeSettingsCommandContractIau = readJson(runtimeSettingsCommandContractIauPath);
requireEqual(runtimeSettingsCommandContractIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings command contract IAU schema");
requireEqual(runtimeSettingsCommandContractIau.iauId, "IAU-runtime-settings-cli-validation-command-contract-v1", "runtime settings command contract IAU id");
requireEqual(runtimeSettingsCommandContractIau.state, "implemented", "runtime settings command contract IAU state");
requireEqual(runtimeSettingsCommandContractIau.parentSliceId, runtimeSettingsCommandContractSliceId, "runtime settings command contract IAU parentSliceId");
requireArrayEqual(runtimeSettingsCommandContractIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016", "T017", "T018"], "runtime settings command contract IAU admittedTasks");
requireArrayEqual(runtimeSettingsCommandContractIau.blockedTasks, ["T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027"], "runtime settings command contract IAU blockedTasks");
requireEqual(runtimeSettingsCommandContractIau.implementationSharing, "none", "runtime settings command contract IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsCommandContractIau, "runtime settings command contract IAU");
requireEqual(runtimeSettingsCommandContractIau.preImplementationPreflight?.status, "pass", "runtime settings command contract IAU preImplementationPreflight status");
requireEqual(runtimeSettingsCommandContractIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-command-contract-v1-preflight-v1.json", "runtime settings command contract IAU preImplementationPreflight record");
requireEqual(runtimeSettingsCommandContractIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings command contract IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsCommandContractIau.implementationCloseout?.status, "pass", "runtime settings command contract IAU implementationCloseout status");
requireEqual(runtimeSettingsCommandContractIau.implementationCloseout?.issue, 95, "runtime settings command contract IAU implementationCloseout issue");
requireEqual(runtimeSettingsCommandContractIau.implementationCloseout?.pullRequest, 96, "runtime settings command contract IAU implementationCloseout pullRequest");
requireFile(`docs/requirements/admissions/${runtimeSettingsCommandContractSliceId}/IAU-runtime-settings-cli-validation-command-contract-v1.md`);

const runtimeSettingsCommandContractPreflight = readJson(runtimeSettingsCommandContractPreflightPath);
requireEqual(runtimeSettingsCommandContractPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings command contract preflight schema");
requireEqual(runtimeSettingsCommandContractPreflight.iauId, "IAU-runtime-settings-cli-validation-command-contract-v1", "runtime settings command contract preflight iauId");
requireEqual(runtimeSettingsCommandContractPreflight.status, "pass", "runtime settings command contract preflight status");
requireEqual(runtimeSettingsCommandContractPreflight.implementationStartAllowed, true, "runtime settings command contract preflight implementationStartAllowed");
requireEqual(runtimeSettingsCommandContractPreflight.parentSliceId, runtimeSettingsCommandContractSliceId, "runtime settings command contract preflight parentSliceId");
requireEqual(runtimeSettingsCommandContractPreflight.implementationSharing, "none", "runtime settings command contract preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsCommandContractPreflight, "runtime settings command contract preflight");
requireArrayEqual(runtimeSettingsCommandContractPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016", "T017", "T018"], "runtime settings command contract preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsCommandContractPreflight.checkResults) || runtimeSettingsCommandContractPreflight.checkResults.length !== runtimeSettingsCommandContractPreflight.requiredChecks.length) {
  failures.push("runtime settings command contract preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsCommandContractPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings command contract preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsCommandContractSliceId}/IAU-runtime-settings-cli-validation-command-contract-v1-preflight-v1.md`);

const runtimeSettingsCommandContractManifest = readJson(`${runtimeSettingsCommandContractImportDir}/manifest.json`);
requireEqual(runtimeSettingsCommandContractManifest.schema, "vi-history/requirements-import@v1", "runtime settings command contract manifest schema");
requireEqual(runtimeSettingsCommandContractManifest.sliceId, runtimeSettingsCommandContractSliceId, "runtime settings command contract sliceId");
requireEqual(runtimeSettingsCommandContractManifest.sourceBaselineTag, "v1.3.16", "runtime settings command contract sourceBaselineTag");
requireEqual(runtimeSettingsCommandContractManifest.sourceCommit, "7b3d15af11df545de21501106c9b62734fb177f5", "runtime settings command contract sourceCommit");
requireEqual(runtimeSettingsCommandContractManifest.governedAdmissionCommit, "93177a013b5294c0e05745f5af67b866e9b15568", "runtime settings command contract governedAdmissionCommit");
requireEqual(runtimeSettingsCommandContractManifest.targetProduct, "vi-history", "runtime settings command contract targetProduct");
requireEqual(runtimeSettingsCommandContractManifest.targetFeature, runtimeSettingsCommandContractSliceId, "runtime settings command contract targetFeature");
requireEqual(runtimeSettingsCommandContractManifest.redactionStatus, "pass", "runtime settings command contract redactionStatus");
requireEqual(runtimeSettingsCommandContractManifest.implementationSharing, "none", "runtime settings command contract implementationSharing");
requireEqual(runtimeSettingsCommandContractManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings command contract marketplacePublication");
requireArrayEqual(runtimeSettingsCommandContractManifest.importedRequirementIds, runtimeSettingsCommandContractExpectedIds, "runtime settings command contract importedRequirementIds");
requireArrayEqual(runtimeSettingsCommandContractManifest.prerequisiteRequirementIds, ["VHS-REQ-537", "VHS-REQ-543", "VHS-REQ-544", "VHS-REQ-545"], "runtime settings command contract prerequisiteRequirementIds");
requireArrayEqual(runtimeSettingsCommandContractManifest.supportingTestIds, ["TEST-UNIT-392"], "runtime settings command contract supportingTestIds");
requireEqual(runtimeSettingsCommandContractManifest.contractName, "createRuntimeSettingsValidationCommandResult", "runtime settings command contract contractName");
requireArrayEqual(runtimeSettingsCommandContractManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings command contract manifest files");

for (const file of runtimeSettingsCommandContractManifest.files ?? []) {
  requireFile(`${runtimeSettingsCommandContractImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsCommandContractFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsCommandContractFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Command Contract",
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "IAU-runtime-settings-cli-validation-command-contract-v1",
  "createRuntimeSettingsValidationCommandResult",
  "vihs --validate",
  "validate-plan-only",
  "Current Implementation Admission Unit is\n  `none`",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsCommandContractFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-validation-command-contract-v1",
  "Issue #93",
  "Issue #95",
  "PR #96",
  "Marketplace publication remains disabled"
]);
requireTextIncludes(`${runtimeSettingsCommandContractFeatureDir}/tasks.md`, [
  "Issue #93",
  "Issue #95",
  "PR #96",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T018",
  "IAU-runtime-settings-cli-validation-command-contract-v1",
  "[BLOCKED]",
  "T027"
]);
requireTextIncludes(`${runtimeSettingsCommandContractImportDir}/rtm.csv`, runtimeSettingsCommandContractExpectedIds);
requireTextIncludes(`${runtimeSettingsCommandContractImportDir}/srs.md`, [
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "createRuntimeSettingsValidationCommandResult",
  "vihs-validation-proof.json",
  "validate-plan-only"
]);
requireTextIncludes(`${runtimeSettingsCommandContractImportDir}/test-plan.md`, [
  "TEST-UNIT-RSCOMMAND-001",
  "TEST-UNIT-RSCOMMAND-008",
  "hidden partial success",
  "source-copying side effects remain blocked"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-command-contract-v1",
  "docs/requirements/admissions/runtime-settings-cli-validation-command-contract-v1.json",
  "Issue #93",
  "Issue #95",
  "PR #96",
  "IAU-runtime-settings-cli-validation-command-contract-v1",
  "Current Implementation Admission Unit:\n`none`.",
  "createRuntimeSettingsValidationCommandResult(input = {})",
  "validate-plan-only"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-command-contract-v1",
  "Issue #93",
  "Issue #95",
  "PR #96",
  "Current Implementation Admission Unit:\n`none`.",
  "IAU-runtime-settings-cli-validation-command-contract-v1",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-command-contract-v1",
  "Issue #93",
  "Issue #95",
  "PR #96",
  "IAU-runtime-settings-cli-validation-command-contract-v1",
  "createRuntimeSettingsValidationCommandResult(input = {})",
  "validate-plan-only"
]);

const runtimeSettingsPlanOnlyAdmission = readJson(runtimeSettingsPlanOnlyAdmissionPath);
requireEqual(runtimeSettingsPlanOnlyAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings plan-only admission schema");
requireEqual(runtimeSettingsPlanOnlyAdmission.sliceId, runtimeSettingsPlanOnlySliceId, "runtime settings plan-only admission sliceId");
requireEqual(runtimeSettingsPlanOnlyAdmission.state, "implemented", "runtime settings plan-only admission state");
requireEqual(runtimeSettingsPlanOnlyAdmission.targetProduct, "vi-history", "runtime settings plan-only admission targetProduct");
requireEqual(runtimeSettingsPlanOnlyAdmission.targetFeature, runtimeSettingsPlanOnlySliceId, "runtime settings plan-only admission targetFeature");
requireEqual(runtimeSettingsPlanOnlyAdmission.sourceBaselineTag, "v1.3.16", "runtime settings plan-only admission sourceBaselineTag");
requireEqual(runtimeSettingsPlanOnlyAdmission.sourceCommit, "93177a013b5294c0e05745f5af67b866e9b15568", "runtime settings plan-only admission sourceCommit");
requireEqual(runtimeSettingsPlanOnlyAdmission.governedAdmissionCommit, "331b6eab04068299b85405d36bf0ba033dbd9b26", "runtime settings plan-only admission governedAdmissionCommit");
requireEqual(runtimeSettingsPlanOnlyAdmission.implementationSharing, "none", "runtime settings plan-only admission implementationSharing");
requireMarketplacePosture(runtimeSettingsPlanOnlyAdmission, "runtime settings plan-only admission");
requireEqual(runtimeSettingsPlanOnlyAdmission.currentImplementationAdmissionUnit, null, "runtime settings plan-only currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsPlanOnlyAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings plan-only completedSpecScope");
requireArrayEqual(runtimeSettingsPlanOnlyAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings plan-only completedImplementationScope");
requireArrayEqual(runtimeSettingsPlanOnlyAdmission.admittedImplementationScope, [], "runtime settings plan-only admittedImplementationScope");
requireArrayEqual(runtimeSettingsPlanOnlyAdmission.blockedImplementationScope, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026"], "runtime settings plan-only blockedImplementationScope");
requireEqual(runtimeSettingsPlanOnlyAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-plan-only-v1", "runtime settings plan-only preImplementationPreflight iauId");
requireEqual(runtimeSettingsPlanOnlyAdmission.preImplementationPreflight?.status, "pass", "runtime settings plan-only preImplementationPreflight status");
requireEqual(runtimeSettingsPlanOnlyAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings plan-only preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsPlanOnlyAdmission.preImplementationPreflight?.record, runtimeSettingsPlanOnlyPreflightPath, "runtime settings plan-only preImplementationPreflight record");
requireEqual(runtimeSettingsPlanOnlyAdmission.issue?.number, 99, "runtime settings plan-only issue number");
requireEqual(runtimeSettingsPlanOnlyAdmission.implementationHandoffIssue?.number, 101, "runtime settings plan-only implementation handoff issue number");
requireEqual(runtimeSettingsPlanOnlyAdmission.implementationRepairIssue?.number, 102, "runtime settings plan-only implementation repair issue number");
requireEqual(runtimeSettingsPlanOnlyAdmission.implementationPullRequest?.number, 103, "runtime settings plan-only implementation pull request number");
requireEqual(runtimeSettingsPlanOnlyAdmission.implementationCloseout?.status, "pass", "runtime settings plan-only implementation closeout status");
requireArrayEqual(runtimeSettingsPlanOnlyAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings plan-only implementation closeout completedTasks");
requireArrayEqual(runtimeSettingsPlanOnlyAdmission.implementationCloseout?.blockedScopeRetained, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026"], "runtime settings plan-only implementation closeout blockedScopeRetained");
requireFile(`docs/requirements/admissions/${runtimeSettingsPlanOnlySliceId}.md`);

const runtimeSettingsPlanOnlyAdmissionUnit = (runtimeSettingsPlanOnlyAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-plan-only-v1");
requireEqual(runtimeSettingsPlanOnlyAdmissionUnit?.state, "implemented", "runtime settings plan-only admission unit state");
requireEqual(runtimeSettingsPlanOnlyAdmissionUnit?.preflightRecord, runtimeSettingsPlanOnlyPreflightPath, "runtime settings plan-only admission unit preflightRecord");

const runtimeSettingsPlanOnlyIau = readJson(runtimeSettingsPlanOnlyIauPath);
requireEqual(runtimeSettingsPlanOnlyIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings plan-only IAU schema");
requireEqual(runtimeSettingsPlanOnlyIau.iauId, "IAU-runtime-settings-cli-validation-plan-only-v1", "runtime settings plan-only IAU id");
requireEqual(runtimeSettingsPlanOnlyIau.state, "implemented", "runtime settings plan-only IAU state");
requireEqual(runtimeSettingsPlanOnlyIau.parentSliceId, runtimeSettingsPlanOnlySliceId, "runtime settings plan-only IAU parentSliceId");
requireArrayEqual(runtimeSettingsPlanOnlyIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings plan-only IAU admittedTasks");
requireArrayEqual(runtimeSettingsPlanOnlyIau.blockedTasks, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026"], "runtime settings plan-only IAU blockedTasks");
requireEqual(runtimeSettingsPlanOnlyIau.implementationHandoffIssue?.number, 101, "runtime settings plan-only IAU implementation handoff issue number");
requireEqual(runtimeSettingsPlanOnlyIau.implementationRepairIssue?.number, 102, "runtime settings plan-only IAU implementation repair issue number");
requireEqual(runtimeSettingsPlanOnlyIau.implementationPullRequest?.number, 103, "runtime settings plan-only IAU implementation pull request number");
requireEqual(runtimeSettingsPlanOnlyIau.implementationCloseout?.status, "pass", "runtime settings plan-only IAU implementation closeout status");
requireArrayEqual(runtimeSettingsPlanOnlyIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings plan-only IAU implementationCloseout completedTasks");
requireArrayEqual(runtimeSettingsPlanOnlyIau.implementationCloseout?.blockedScopeRetained, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026"], "runtime settings plan-only IAU implementationCloseout blockedScopeRetained");
requireEqual(runtimeSettingsPlanOnlyIau.implementationSharing, "none", "runtime settings plan-only IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsPlanOnlyIau, "runtime settings plan-only IAU");
requireEqual(runtimeSettingsPlanOnlyIau.preImplementationPreflight?.status, "pass", "runtime settings plan-only IAU preImplementationPreflight status");
requireEqual(runtimeSettingsPlanOnlyIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-plan-only-v1-preflight-v1.json", "runtime settings plan-only IAU preImplementationPreflight record");
requireEqual(runtimeSettingsPlanOnlyIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings plan-only IAU preImplementationPreflight implementationStartAllowed");
requireFile(`docs/requirements/admissions/${runtimeSettingsPlanOnlySliceId}/IAU-runtime-settings-cli-validation-plan-only-v1.md`);

const runtimeSettingsPlanOnlyPreflight = readJson(runtimeSettingsPlanOnlyPreflightPath);
requireEqual(runtimeSettingsPlanOnlyPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings plan-only preflight schema");
requireEqual(runtimeSettingsPlanOnlyPreflight.iauId, "IAU-runtime-settings-cli-validation-plan-only-v1", "runtime settings plan-only preflight iauId");
requireEqual(runtimeSettingsPlanOnlyPreflight.status, "pass", "runtime settings plan-only preflight status");
requireEqual(runtimeSettingsPlanOnlyPreflight.implementationStartAllowed, true, "runtime settings plan-only preflight implementationStartAllowed");
requireEqual(runtimeSettingsPlanOnlyPreflight.parentSliceId, runtimeSettingsPlanOnlySliceId, "runtime settings plan-only preflight parentSliceId");
requireEqual(runtimeSettingsPlanOnlyPreflight.implementationSharing, "none", "runtime settings plan-only preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsPlanOnlyPreflight, "runtime settings plan-only preflight");
requireArrayEqual(runtimeSettingsPlanOnlyPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings plan-only preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsPlanOnlyPreflight.checkResults) || runtimeSettingsPlanOnlyPreflight.checkResults.length !== runtimeSettingsPlanOnlyPreflight.requiredChecks.length) {
  failures.push("runtime settings plan-only preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsPlanOnlyPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings plan-only preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsPlanOnlySliceId}/IAU-runtime-settings-cli-validation-plan-only-v1-preflight-v1.md`);

const runtimeSettingsPlanOnlyManifest = readJson(`${runtimeSettingsPlanOnlyImportDir}/manifest.json`);
requireEqual(runtimeSettingsPlanOnlyManifest.schema, "vi-history/requirements-import@v1", "runtime settings plan-only manifest schema");
requireEqual(runtimeSettingsPlanOnlyManifest.sliceId, runtimeSettingsPlanOnlySliceId, "runtime settings plan-only sliceId");
requireEqual(runtimeSettingsPlanOnlyManifest.sourceBaselineTag, "v1.3.16", "runtime settings plan-only sourceBaselineTag");
requireEqual(runtimeSettingsPlanOnlyManifest.sourceCommit, "93177a013b5294c0e05745f5af67b866e9b15568", "runtime settings plan-only sourceCommit");
requireEqual(runtimeSettingsPlanOnlyManifest.governedAdmissionCommit, "331b6eab04068299b85405d36bf0ba033dbd9b26", "runtime settings plan-only governedAdmissionCommit");
requireEqual(runtimeSettingsPlanOnlyManifest.targetProduct, "vi-history", "runtime settings plan-only targetProduct");
requireEqual(runtimeSettingsPlanOnlyManifest.targetFeature, runtimeSettingsPlanOnlySliceId, "runtime settings plan-only targetFeature");
requireEqual(runtimeSettingsPlanOnlyManifest.redactionStatus, "pass", "runtime settings plan-only redactionStatus");
requireEqual(runtimeSettingsPlanOnlyManifest.implementationSharing, "none", "runtime settings plan-only implementationSharing");
requireEqual(runtimeSettingsPlanOnlyManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings plan-only marketplacePublication");
requireArrayEqual(runtimeSettingsPlanOnlyManifest.importedRequirementIds, runtimeSettingsPlanOnlyExpectedIds, "runtime settings plan-only importedRequirementIds");
requireArrayEqual(runtimeSettingsPlanOnlyManifest.prerequisiteRequirementIds, ["VHS-REQ-537", "VHS-REQ-543", "VHS-REQ-544", "VHS-REQ-545"], "runtime settings plan-only prerequisiteRequirementIds");
requireArrayEqual(runtimeSettingsPlanOnlyManifest.supportingTestIds, ["TEST-UNIT-392"], "runtime settings plan-only supportingTestIds");
requireEqual(runtimeSettingsPlanOnlyManifest.contractName, "createRuntimeSettingsValidationCommandResult", "runtime settings plan-only contractName");
requireEqual(runtimeSettingsPlanOnlyManifest.requestMode, "validate-plan-only", "runtime settings plan-only requestMode");
requireArrayEqual(runtimeSettingsPlanOnlyManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings plan-only manifest files");

for (const file of runtimeSettingsPlanOnlyManifest.files ?? []) {
  requireFile(`${runtimeSettingsPlanOnlyImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsPlanOnlyFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsPlanOnlyFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Plan-Only",
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "IAU-runtime-settings-cli-validation-plan-only-v1",
  "createRuntimeSettingsValidationCommandResult",
  "validate-plan-only",
  "Current Implementation Admission Unit is `none`",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsPlanOnlyFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-validation-plan-only-v1",
  "Issue #99",
  "Issue #101",
  "PR #103",
  "Marketplace publication: disabled",
  "Implementation sharing: none"
]);
requireTextIncludes(`${runtimeSettingsPlanOnlyFeatureDir}/tasks.md`, [
  "Issue #99",
  "Issue #101",
  "PR #103",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T016",
  "IAU-runtime-settings-cli-validation-plan-only-v1",
  "[BLOCKED]",
  "T026"
]);
requireTextIncludes(`${runtimeSettingsPlanOnlyImportDir}/rtm.csv`, runtimeSettingsPlanOnlyExpectedIds);
requireTextIncludes(`${runtimeSettingsPlanOnlyImportDir}/srs.md`, [
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "createRuntimeSettingsValidationCommandResult",
  "vihs-validation-proof.json",
  "validate-plan-only",
  "MUST NOT write proof files"
]);
requireTextIncludes(`${runtimeSettingsPlanOnlyImportDir}/test-plan.md`, [
  "TEST-UNIT-RSPLANONLY-001",
  "TEST-UNIT-RSPLANONLY-007",
  "without hidden success",
  "file emission, or source copying"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-plan-only-v1",
  "docs/requirements/admissions/runtime-settings-cli-validation-plan-only-v1.json",
  "Issue #99",
  "Issue #101",
  "PR #103",
  "IAU-runtime-settings-cli-validation-plan-only-v1",
  "Current Implementation Admission Unit:\n`none`.",
  "validate-plan-only",
  "proof-out file-emission writer"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-plan-only-v1",
  "Issue #99",
  "Issue #101",
  "PR #103",
  "Current Implementation Admission Unit:\n`none`.",
  "IAU-runtime-settings-cli-validation-plan-only-v1",
  "018-runtime-settings-cli-validation-plan-only-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-plan-only-v1",
  "Issue #99",
  "Issue #101",
  "PR #103",
  "IAU-runtime-settings-cli-validation-plan-only-v1",
  "validate-plan-only",
  "proof-out file-emission writer",
  "no-write proof-out planning facts branch"
]);

const runtimeSettingsHostRuntimePreflightAdmission = readJson(runtimeSettingsHostRuntimePreflightAdmissionPath);
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings host runtime preflight admission schema");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.sliceId, runtimeSettingsHostRuntimePreflightSliceId, "runtime settings host runtime preflight admission sliceId");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.state, "implemented", "runtime settings host runtime preflight admission state");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.targetProduct, "vi-history", "runtime settings host runtime preflight admission targetProduct");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.targetFeature, runtimeSettingsHostRuntimePreflightSliceId, "runtime settings host runtime preflight admission targetFeature");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.sourceBaselineTag, "v1.3.16", "runtime settings host runtime preflight admission sourceBaselineTag");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.sourceCommit, "331b6eab04068299b85405d36bf0ba033dbd9b26", "runtime settings host runtime preflight admission sourceCommit");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.governedAdmissionCommit, "b5ed9e5a77a096c342fc74c42e3e901d6bad041f", "runtime settings host runtime preflight admission governedAdmissionCommit");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.implementationSharing, "none", "runtime settings host runtime preflight admission implementationSharing");
requireMarketplacePosture(runtimeSettingsHostRuntimePreflightAdmission, "runtime settings host runtime preflight admission");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.currentImplementationAdmissionUnit, null, "runtime settings host runtime preflight currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsHostRuntimePreflightAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings host runtime preflight completedSpecScope");
requireArrayEqual(runtimeSettingsHostRuntimePreflightAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime preflight completedImplementationScope");
requireArrayEqual(runtimeSettingsHostRuntimePreflightAdmission.admittedImplementationScope, [], "runtime settings host runtime preflight admittedImplementationScope");
requireArrayEqual(runtimeSettingsHostRuntimePreflightAdmission.blockedImplementationScope, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026"], "runtime settings host runtime preflight blockedImplementationScope");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-host-runtime-preflight-v1", "runtime settings host runtime preflight preImplementationPreflight iauId");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.preImplementationPreflight?.status, "pass", "runtime settings host runtime preflight preImplementationPreflight status");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings host runtime preflight preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.preImplementationPreflight?.record, runtimeSettingsHostRuntimePreflightPreflightPath, "runtime settings host runtime preflight preImplementationPreflight record");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.issue?.number, 106, "runtime settings host runtime preflight issue number");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.implementationHandoffIssue?.number, 108, "runtime settings host runtime preflight implementationHandoffIssue number");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.implementationPullRequest?.number, 109, "runtime settings host runtime preflight implementationPullRequest number");
requireEqual(runtimeSettingsHostRuntimePreflightAdmission.implementationCloseout?.status, "pass", "runtime settings host runtime preflight implementationCloseout status");
requireArrayEqual(runtimeSettingsHostRuntimePreflightAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime preflight implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimePreflightSliceId}.md`);

const runtimeSettingsHostRuntimePreflightAdmissionUnit = (runtimeSettingsHostRuntimePreflightAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-host-runtime-preflight-v1");
requireEqual(runtimeSettingsHostRuntimePreflightAdmissionUnit?.state, "implemented", "runtime settings host runtime preflight admission unit state");
requireEqual(runtimeSettingsHostRuntimePreflightAdmissionUnit?.preflightRecord, runtimeSettingsHostRuntimePreflightPreflightPath, "runtime settings host runtime preflight admission unit preflightRecord");

const runtimeSettingsHostRuntimePreflightIau = readJson(runtimeSettingsHostRuntimePreflightIauPath);
requireEqual(runtimeSettingsHostRuntimePreflightIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings host runtime preflight IAU schema");
requireEqual(runtimeSettingsHostRuntimePreflightIau.iauId, "IAU-runtime-settings-cli-validation-host-runtime-preflight-v1", "runtime settings host runtime preflight IAU id");
requireEqual(runtimeSettingsHostRuntimePreflightIau.state, "implemented", "runtime settings host runtime preflight IAU state");
requireEqual(runtimeSettingsHostRuntimePreflightIau.parentSliceId, runtimeSettingsHostRuntimePreflightSliceId, "runtime settings host runtime preflight IAU parentSliceId");
requireArrayEqual(runtimeSettingsHostRuntimePreflightIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime preflight IAU admittedTasks");
requireArrayEqual(runtimeSettingsHostRuntimePreflightIau.blockedTasks, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026"], "runtime settings host runtime preflight IAU blockedTasks");
requireEqual(runtimeSettingsHostRuntimePreflightIau.implementationSharing, "none", "runtime settings host runtime preflight IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsHostRuntimePreflightIau, "runtime settings host runtime preflight IAU");
requireEqual(runtimeSettingsHostRuntimePreflightIau.preImplementationPreflight?.status, "pass", "runtime settings host runtime preflight IAU preImplementationPreflight status");
requireEqual(runtimeSettingsHostRuntimePreflightIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-host-runtime-preflight-v1-preflight-v1.json", "runtime settings host runtime preflight IAU preImplementationPreflight record");
requireEqual(runtimeSettingsHostRuntimePreflightIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings host runtime preflight IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimePreflightIau.implementationHandoffIssue?.number, 108, "runtime settings host runtime preflight IAU implementationHandoffIssue number");
requireEqual(runtimeSettingsHostRuntimePreflightIau.implementationPullRequest?.number, 109, "runtime settings host runtime preflight IAU implementationPullRequest number");
requireEqual(runtimeSettingsHostRuntimePreflightIau.implementationCloseout?.status, "pass", "runtime settings host runtime preflight IAU implementationCloseout status");
requireArrayEqual(runtimeSettingsHostRuntimePreflightIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime preflight IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimePreflightSliceId}/IAU-runtime-settings-cli-validation-host-runtime-preflight-v1.md`);

const runtimeSettingsHostRuntimePreflightPreflight = readJson(runtimeSettingsHostRuntimePreflightPreflightPath);
requireEqual(runtimeSettingsHostRuntimePreflightPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings host runtime preflight preflight schema");
requireEqual(runtimeSettingsHostRuntimePreflightPreflight.iauId, "IAU-runtime-settings-cli-validation-host-runtime-preflight-v1", "runtime settings host runtime preflight preflight iauId");
requireEqual(runtimeSettingsHostRuntimePreflightPreflight.status, "pass", "runtime settings host runtime preflight preflight status");
requireEqual(runtimeSettingsHostRuntimePreflightPreflight.implementationStartAllowed, true, "runtime settings host runtime preflight preflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimePreflightPreflight.parentSliceId, runtimeSettingsHostRuntimePreflightSliceId, "runtime settings host runtime preflight preflight parentSliceId");
requireEqual(runtimeSettingsHostRuntimePreflightPreflight.implementationSharing, "none", "runtime settings host runtime preflight preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsHostRuntimePreflightPreflight, "runtime settings host runtime preflight preflight");
requireArrayEqual(runtimeSettingsHostRuntimePreflightPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime preflight preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsHostRuntimePreflightPreflight.checkResults) || runtimeSettingsHostRuntimePreflightPreflight.checkResults.length !== runtimeSettingsHostRuntimePreflightPreflight.requiredChecks.length) {
  failures.push("runtime settings host runtime preflight preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsHostRuntimePreflightPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings host runtime preflight preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimePreflightSliceId}/IAU-runtime-settings-cli-validation-host-runtime-preflight-v1-preflight-v1.md`);

const runtimeSettingsHostRuntimePreflightManifest = readJson(`${runtimeSettingsHostRuntimePreflightImportDir}/manifest.json`);
requireEqual(runtimeSettingsHostRuntimePreflightManifest.schema, "vi-history/requirements-import@v1", "runtime settings host runtime preflight manifest schema");
requireEqual(runtimeSettingsHostRuntimePreflightManifest.sliceId, runtimeSettingsHostRuntimePreflightSliceId, "runtime settings host runtime preflight sliceId");
requireEqual(runtimeSettingsHostRuntimePreflightManifest.sourceBaselineTag, "v1.3.16", "runtime settings host runtime preflight sourceBaselineTag");
requireEqual(runtimeSettingsHostRuntimePreflightManifest.sourceCommit, "331b6eab04068299b85405d36bf0ba033dbd9b26", "runtime settings host runtime preflight sourceCommit");
requireEqual(runtimeSettingsHostRuntimePreflightManifest.governedAdmissionCommit, "b5ed9e5a77a096c342fc74c42e3e901d6bad041f", "runtime settings host runtime preflight governedAdmissionCommit");
requireEqual(runtimeSettingsHostRuntimePreflightManifest.targetProduct, "vi-history", "runtime settings host runtime preflight targetProduct");
requireEqual(runtimeSettingsHostRuntimePreflightManifest.targetFeature, runtimeSettingsHostRuntimePreflightSliceId, "runtime settings host runtime preflight targetFeature");
requireEqual(runtimeSettingsHostRuntimePreflightManifest.redactionStatus, "pass", "runtime settings host runtime preflight redactionStatus");
requireEqual(runtimeSettingsHostRuntimePreflightManifest.implementationSharing, "none", "runtime settings host runtime preflight implementationSharing");
requireEqual(runtimeSettingsHostRuntimePreflightManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings host runtime preflight marketplacePublication");
requireArrayEqual(runtimeSettingsHostRuntimePreflightManifest.importedRequirementIds, runtimeSettingsHostRuntimePreflightExpectedIds, "runtime settings host runtime preflight importedRequirementIds");
requireArrayEqual(runtimeSettingsHostRuntimePreflightManifest.prerequisiteRequirementIds, ["VHS-REQ-537", "VHS-REQ-543", "VHS-REQ-544", "VHS-REQ-545"], "runtime settings host runtime preflight prerequisiteRequirementIds");
requireArrayEqual(runtimeSettingsHostRuntimePreflightManifest.supportingTestIds, ["TEST-UNIT-342", "TEST-UNIT-354", "TEST-UNIT-355", "TEST-UNIT-392"], "runtime settings host runtime preflight supportingTestIds");
requireEqual(runtimeSettingsHostRuntimePreflightManifest.contractName, "createRuntimeSettingsValidationHostRuntimePreflight", "runtime settings host runtime preflight contractName");
requireEqual(runtimeSettingsHostRuntimePreflightManifest.preflightBoundary, "supplied-public-safe-host-candidate-facts-only", "runtime settings host runtime preflight preflightBoundary");
requireArrayEqual(runtimeSettingsHostRuntimePreflightManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings host runtime preflight manifest files");

for (const file of runtimeSettingsHostRuntimePreflightManifest.files ?? []) {
  requireFile(`${runtimeSettingsHostRuntimePreflightImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsHostRuntimePreflightFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsHostRuntimePreflightFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Host Runtime Preflight",
  "VHS-REQ-532",
  "VHS-REQ-546",
  "VHS-REQ-550",
  "TEST-UNIT-355",
  "IAU-runtime-settings-cli-validation-host-runtime-preflight-v1",
  "createRuntimeSettingsValidationHostRuntimePreflight",
  "Current Implementation Admission Unit is",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimePreflightFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-validation-host-runtime-preflight-v1",
  "Issue #106",
  "Marketplace publication: disabled",
  "Implementation sharing: none",
  "supplied public-safe host candidate facts only"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimePreflightFeatureDir}/tasks.md`, [
  "Issue #106",
  "Issue #108",
  "PR #109",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T016",
  "- [x] T027",
  "- [x] T032",
  "IAU-runtime-settings-cli-validation-host-runtime-preflight-v1",
  "[BLOCKED]",
  "T026"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimePreflightImportDir}/rtm.csv`, runtimeSettingsHostRuntimePreflightExpectedIds);
requireTextIncludes(`${runtimeSettingsHostRuntimePreflightImportDir}/srs.md`, [
  "VHS-REQ-532",
  "VHS-REQ-546",
  "VHS-REQ-550",
  "TEST-UNIT-355",
  "createRuntimeSettingsValidationHostRuntimePreflight",
  "canonical installed x86 LabVIEWCLI",
  "MUST NOT inspect the OS"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimePreflightImportDir}/test-plan.md`, [
  "TEST-UNIT-RSHOSTPREFLIGHT-001",
  "TEST-UNIT-RSHOSTPREFLIGHT-007",
  "canonical installed x86 LabVIEWCLI",
  "OS scan"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-host-runtime-preflight-v1",
  "docs/requirements/admissions/runtime-settings-cli-validation-host-runtime-preflight-v1.json",
  "Issue #106",
  "Issue #108",
  "PR #109",
  "IAU-runtime-settings-cli-validation-host-runtime-preflight-v1",
  "Current Implementation Admission Unit:\n`none`.",
  "createRuntimeSettingsValidationHostRuntimePreflight(input = {})",
  "supplied public-safe host candidate facts",
  "runtime locator invocation"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-host-runtime-preflight-v1",
  "Issue #106",
  "Issue #108",
  "PR #109",
  "Current Implementation Admission Unit:\n`none`.",
  "IAU-runtime-settings-cli-validation-host-runtime-preflight-v1",
  "019-runtime-settings-cli-validation-host-runtime-preflight-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-host-runtime-preflight-v1",
  "Issue #106",
  "Issue #108",
  "PR #109",
  "IAU-runtime-settings-cli-validation-host-runtime-preflight-v1",
  "createRuntimeSettingsValidationHostRuntimePreflight(input = {})",
  "supplied public-safe host candidate facts",
  "Current Implementation Admission Unit:\n`none`."
]);

const runtimeSettingsHostPreflightCommandCompositionAdmission = readJson(runtimeSettingsHostPreflightCommandCompositionAdmissionPath);
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings host preflight command composition admission schema");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.sliceId, runtimeSettingsHostPreflightCommandCompositionSliceId, "runtime settings host preflight command composition admission sliceId");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.state, "implemented", "runtime settings host preflight command composition admission state");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.targetProduct, "vi-history", "runtime settings host preflight command composition admission targetProduct");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.targetFeature, runtimeSettingsHostPreflightCommandCompositionSliceId, "runtime settings host preflight command composition admission targetFeature");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.sourceBaselineTag, "v1.3.16", "runtime settings host preflight command composition admission sourceBaselineTag");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.sourceCommit, "b5ed9e5a77a096c342fc74c42e3e901d6bad041f", "runtime settings host preflight command composition admission sourceCommit");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.governedAdmissionCommit, "e411ef2bfa74cedf6f9b53d764810f9f4c93a8b0", "runtime settings host preflight command composition admission governedAdmissionCommit");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.implementationSharing, "none", "runtime settings host preflight command composition admission implementationSharing");
requireMarketplacePosture(runtimeSettingsHostPreflightCommandCompositionAdmission, "runtime settings host preflight command composition admission");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.currentImplementationAdmissionUnit, null, "runtime settings host preflight command composition currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings host preflight command composition completedSpecScope");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host preflight command composition completedImplementationScope");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.admittedImplementationScope, [], "runtime settings host preflight command composition admittedImplementationScope");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.blockedImplementationScope, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026"], "runtime settings host preflight command composition blockedImplementationScope");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1", "runtime settings host preflight command composition preImplementationPreflight iauId");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.preImplementationPreflight?.status, "pass", "runtime settings host preflight command composition preImplementationPreflight status");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings host preflight command composition preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.preImplementationPreflight?.record, runtimeSettingsHostPreflightCommandCompositionPreflightPath, "runtime settings host preflight command composition preImplementationPreflight record");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.issue?.number, 112, "runtime settings host preflight command composition issue number");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.implementationHandoffIssue?.number, 114, "runtime settings host preflight command composition implementationHandoffIssue number");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.implementationPullRequest?.number, 115, "runtime settings host preflight command composition implementationPullRequest number");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.implementationCloseout?.status, "pass", "runtime settings host preflight command composition implementationCloseout status");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host preflight command composition implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostPreflightCommandCompositionSliceId}.md`);

const runtimeSettingsHostPreflightCommandCompositionAdmissionUnit = (runtimeSettingsHostPreflightCommandCompositionAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmissionUnit?.state, "implemented", "runtime settings host preflight command composition admission unit state");
requireEqual(runtimeSettingsHostPreflightCommandCompositionAdmissionUnit?.preflightRecord, runtimeSettingsHostPreflightCommandCompositionPreflightPath, "runtime settings host preflight command composition admission unit preflightRecord");

const runtimeSettingsHostPreflightCommandCompositionIau = readJson(runtimeSettingsHostPreflightCommandCompositionIauPath);
requireEqual(runtimeSettingsHostPreflightCommandCompositionIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings host preflight command composition IAU schema");
requireEqual(runtimeSettingsHostPreflightCommandCompositionIau.iauId, "IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1", "runtime settings host preflight command composition IAU id");
requireEqual(runtimeSettingsHostPreflightCommandCompositionIau.state, "implemented", "runtime settings host preflight command composition IAU state");
requireEqual(runtimeSettingsHostPreflightCommandCompositionIau.parentSliceId, runtimeSettingsHostPreflightCommandCompositionSliceId, "runtime settings host preflight command composition IAU parentSliceId");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host preflight command composition IAU admittedTasks");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionIau.blockedTasks, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026"], "runtime settings host preflight command composition IAU blockedTasks");
requireEqual(runtimeSettingsHostPreflightCommandCompositionIau.implementationSharing, "none", "runtime settings host preflight command composition IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsHostPreflightCommandCompositionIau, "runtime settings host preflight command composition IAU");
requireEqual(runtimeSettingsHostPreflightCommandCompositionIau.preImplementationPreflight?.status, "pass", "runtime settings host preflight command composition IAU preImplementationPreflight status");
requireEqual(runtimeSettingsHostPreflightCommandCompositionIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1-preflight-v1.json", "runtime settings host preflight command composition IAU preImplementationPreflight record");
requireEqual(runtimeSettingsHostPreflightCommandCompositionIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings host preflight command composition IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsHostPreflightCommandCompositionIau.implementationHandoffIssue?.number, 114, "runtime settings host preflight command composition IAU implementationHandoffIssue number");
requireEqual(runtimeSettingsHostPreflightCommandCompositionIau.implementationPullRequest?.number, 115, "runtime settings host preflight command composition IAU implementationPullRequest number");
requireEqual(runtimeSettingsHostPreflightCommandCompositionIau.implementationCloseout?.status, "pass", "runtime settings host preflight command composition IAU implementationCloseout status");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host preflight command composition IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostPreflightCommandCompositionSliceId}/IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1.md`);

const runtimeSettingsHostPreflightCommandCompositionPreflight = readJson(runtimeSettingsHostPreflightCommandCompositionPreflightPath);
requireEqual(runtimeSettingsHostPreflightCommandCompositionPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings host preflight command composition preflight schema");
requireEqual(runtimeSettingsHostPreflightCommandCompositionPreflight.iauId, "IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1", "runtime settings host preflight command composition preflight iauId");
requireEqual(runtimeSettingsHostPreflightCommandCompositionPreflight.status, "pass", "runtime settings host preflight command composition preflight status");
requireEqual(runtimeSettingsHostPreflightCommandCompositionPreflight.implementationStartAllowed, true, "runtime settings host preflight command composition preflight implementationStartAllowed");
requireEqual(runtimeSettingsHostPreflightCommandCompositionPreflight.parentSliceId, runtimeSettingsHostPreflightCommandCompositionSliceId, "runtime settings host preflight command composition preflight parentSliceId");
requireEqual(runtimeSettingsHostPreflightCommandCompositionPreflight.implementationSharing, "none", "runtime settings host preflight command composition preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsHostPreflightCommandCompositionPreflight, "runtime settings host preflight command composition preflight");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host preflight command composition preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsHostPreflightCommandCompositionPreflight.checkResults) || runtimeSettingsHostPreflightCommandCompositionPreflight.checkResults.length !== runtimeSettingsHostPreflightCommandCompositionPreflight.requiredChecks.length) {
  failures.push("runtime settings host preflight command composition preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsHostPreflightCommandCompositionPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings host preflight command composition preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsHostPreflightCommandCompositionSliceId}/IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1-preflight-v1.md`);

const runtimeSettingsHostPreflightCommandCompositionManifest = readJson(`${runtimeSettingsHostPreflightCommandCompositionImportDir}/manifest.json`);
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.schema, "vi-history/requirements-import@v1", "runtime settings host preflight command composition manifest schema");
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.sliceId, runtimeSettingsHostPreflightCommandCompositionSliceId, "runtime settings host preflight command composition sliceId");
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.sourceBaselineTag, "v1.3.16", "runtime settings host preflight command composition sourceBaselineTag");
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.sourceCommit, "b5ed9e5a77a096c342fc74c42e3e901d6bad041f", "runtime settings host preflight command composition sourceCommit");
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.governedAdmissionCommit, "e411ef2bfa74cedf6f9b53d764810f9f4c93a8b0", "runtime settings host preflight command composition governedAdmissionCommit");
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.targetProduct, "vi-history", "runtime settings host preflight command composition targetProduct");
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.targetFeature, runtimeSettingsHostPreflightCommandCompositionSliceId, "runtime settings host preflight command composition targetFeature");
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.redactionStatus, "pass", "runtime settings host preflight command composition redactionStatus");
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.implementationSharing, "none", "runtime settings host preflight command composition implementationSharing");
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings host preflight command composition marketplacePublication");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionManifest.importedRequirementIds, runtimeSettingsHostPreflightCommandCompositionExpectedIds, "runtime settings host preflight command composition importedRequirementIds");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionManifest.prerequisiteRequirementIds, ["VHS-REQ-532", "VHS-REQ-537", "VHS-REQ-543", "VHS-REQ-544", "VHS-REQ-545", "VHS-REQ-550"], "runtime settings host preflight command composition prerequisiteRequirementIds");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionManifest.supportingTestIds, ["TEST-UNIT-342", "TEST-UNIT-354", "TEST-UNIT-355", "TEST-UNIT-392"], "runtime settings host preflight command composition supportingTestIds");
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.contractName, "createRuntimeSettingsValidationCommandResult", "runtime settings host preflight command composition contractName");
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.composedContractName, "createRuntimeSettingsValidationHostRuntimePreflight", "runtime settings host preflight command composition composedContractName");
requireEqual(runtimeSettingsHostPreflightCommandCompositionManifest.compositionBoundary, "supplied-public-safe-host-preflight-facts-or-host-candidate-facts-only", "runtime settings host preflight command composition compositionBoundary");
requireArrayEqual(runtimeSettingsHostPreflightCommandCompositionManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings host preflight command composition manifest files");

for (const file of runtimeSettingsHostPreflightCommandCompositionManifest.files ?? []) {
  requireFile(`${runtimeSettingsHostPreflightCommandCompositionImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsHostPreflightCommandCompositionFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsHostPreflightCommandCompositionFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Host Preflight Command Composition",
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1",
  "createRuntimeSettingsValidationCommandResult",
  "createRuntimeSettingsValidationHostRuntimePreflight",
  "Current Implementation Admission Unit is",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsHostPreflightCommandCompositionFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1",
  "Issue #112",
  "Marketplace publication: disabled",
  "Implementation sharing: none",
  "e411ef2bfa74cedf6f9b53d764810f9f4c93a8b0"
]);
requireTextIncludes(`${runtimeSettingsHostPreflightCommandCompositionFeatureDir}/tasks.md`, [
  "Issue #112",
  "Issue #114",
  "PR #115",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T016",
  "- [x] T027",
  "- [x] T032",
  "IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1",
  "[BLOCKED]",
  "T026"
]);
requireTextIncludes(`${runtimeSettingsHostPreflightCommandCompositionImportDir}/rtm.csv`, runtimeSettingsHostPreflightCommandCompositionExpectedIds);
requireTextIncludes(`${runtimeSettingsHostPreflightCommandCompositionImportDir}/srs.md`, [
  "VHS-REQ-546",
  "TEST-UNIT-392",
  "createRuntimeSettingsValidationCommandResult",
  "createRuntimeSettingsValidationHostRuntimePreflight",
  "MUST NOT inspect the OS"
]);
requireTextIncludes(`${runtimeSettingsHostPreflightCommandCompositionImportDir}/test-plan.md`, [
  "TEST-UNIT-RSHOSTCMD-001",
  "TEST-UNIT-RSHOSTCMD-007",
  "host preflight",
  "OS scan"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-host-preflight-command-composition-v1",
  "docs/requirements/admissions/runtime-settings-cli-validation-host-preflight-command-composition-v1.json",
  "Issue #112",
  "Issue #114",
  "PR #115",
  "IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1",
  "Current Implementation Admission Unit:\n`none`.",
  "createRuntimeSettingsValidationCommandResult(input = {})",
  "supplied public-safe host selection/candidate facts",
  "runtime locator invocation"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-host-preflight-command-composition-v1",
  "Issue #112",
  "Issue #114",
  "PR #115",
  "Current Implementation Admission Unit:\n`none`.",
  "IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1",
  "020-runtime-settings-cli-validation-host-preflight-command-composition-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-host-preflight-command-composition-v1",
  "Issue #112",
  "Issue #114",
  "PR #115",
  "IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1",
  "createRuntimeSettingsValidationCommandResult(input = {})",
  "supplied public-safe host",
  "Current Implementation Admission Unit:\n`none`."
]);

const runtimeSettingsHostRuntimeDiscoveryAdmission = readJson(runtimeSettingsHostRuntimeDiscoveryAdmissionPath);
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings host runtime discovery admission schema");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.sliceId, runtimeSettingsHostRuntimeDiscoverySliceId, "runtime settings host runtime discovery admission sliceId");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.state, "implemented", "runtime settings host runtime discovery admission state");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.targetProduct, "vi-history", "runtime settings host runtime discovery admission targetProduct");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.targetFeature, runtimeSettingsHostRuntimeDiscoverySliceId, "runtime settings host runtime discovery admission targetFeature");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.sourceBaselineTag, "v1.3.16", "runtime settings host runtime discovery admission sourceBaselineTag");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.sourceCommit, "e411ef2bfa74cedf6f9b53d764810f9f4c93a8b0", "runtime settings host runtime discovery admission sourceCommit");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.governedAdmissionCommit, "4f4211edc824c92f3d9aa4c39cafa928d59c5ce3", "runtime settings host runtime discovery admission governedAdmissionCommit");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.implementationSharing, "none", "runtime settings host runtime discovery admission implementationSharing");
requireMarketplacePosture(runtimeSettingsHostRuntimeDiscoveryAdmission, "runtime settings host runtime discovery admission");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.currentImplementationAdmissionUnit, null, "runtime settings host runtime discovery currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings host runtime discovery completedSpecScope");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime discovery completedImplementationScope");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.admittedImplementationScope, [], "runtime settings host runtime discovery admittedImplementationScope");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.blockedImplementationScope, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028"], "runtime settings host runtime discovery blockedImplementationScope");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-host-runtime-discovery-v1", "runtime settings host runtime discovery preImplementationPreflight iauId");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.preImplementationPreflight?.status, "pass", "runtime settings host runtime discovery preImplementationPreflight status");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings host runtime discovery preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.preImplementationPreflight?.record, runtimeSettingsHostRuntimeDiscoveryPreflightPath, "runtime settings host runtime discovery preImplementationPreflight record");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.issue?.number, 118, "runtime settings host runtime discovery issue number");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.implementationHandoffIssue?.number, 120, "runtime settings host runtime discovery implementationHandoffIssue number");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.implementationPullRequest?.number, 121, "runtime settings host runtime discovery implementationPullRequest number");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.implementationCloseout?.status, "pass", "runtime settings host runtime discovery implementationCloseout status");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime discovery implementationCloseout completedTasks");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryAdmission.implementationCloseout?.blockedScopeRetained, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028"], "runtime settings host runtime discovery implementationCloseout blockedScopeRetained");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeDiscoverySliceId}.md`);

const runtimeSettingsHostRuntimeDiscoveryAdmissionUnit = (runtimeSettingsHostRuntimeDiscoveryAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-host-runtime-discovery-v1");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmissionUnit?.state, "implemented", "runtime settings host runtime discovery admission unit state");
requireEqual(runtimeSettingsHostRuntimeDiscoveryAdmissionUnit?.preflightRecord, runtimeSettingsHostRuntimeDiscoveryPreflightPath, "runtime settings host runtime discovery admission unit preflightRecord");

const runtimeSettingsHostRuntimeDiscoveryIau = readJson(runtimeSettingsHostRuntimeDiscoveryIauPath);
requireEqual(runtimeSettingsHostRuntimeDiscoveryIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings host runtime discovery IAU schema");
requireEqual(runtimeSettingsHostRuntimeDiscoveryIau.iauId, "IAU-runtime-settings-cli-validation-host-runtime-discovery-v1", "runtime settings host runtime discovery IAU id");
requireEqual(runtimeSettingsHostRuntimeDiscoveryIau.state, "implemented", "runtime settings host runtime discovery IAU state");
requireEqual(runtimeSettingsHostRuntimeDiscoveryIau.parentSliceId, runtimeSettingsHostRuntimeDiscoverySliceId, "runtime settings host runtime discovery IAU parentSliceId");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime discovery IAU admittedTasks");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryIau.blockedTasks, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028"], "runtime settings host runtime discovery IAU blockedTasks");
requireEqual(runtimeSettingsHostRuntimeDiscoveryIau.implementationSharing, "none", "runtime settings host runtime discovery IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsHostRuntimeDiscoveryIau, "runtime settings host runtime discovery IAU");
requireEqual(runtimeSettingsHostRuntimeDiscoveryIau.preImplementationPreflight?.status, "pass", "runtime settings host runtime discovery IAU preImplementationPreflight status");
requireEqual(runtimeSettingsHostRuntimeDiscoveryIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-host-runtime-discovery-v1-preflight-v1.json", "runtime settings host runtime discovery IAU preImplementationPreflight record");
requireEqual(runtimeSettingsHostRuntimeDiscoveryIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings host runtime discovery IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimeDiscoveryIau.implementationHandoffIssue?.number, 120, "runtime settings host runtime discovery IAU implementationHandoffIssue number");
requireEqual(runtimeSettingsHostRuntimeDiscoveryIau.implementationPullRequest?.number, 121, "runtime settings host runtime discovery IAU implementationPullRequest number");
requireEqual(runtimeSettingsHostRuntimeDiscoveryIau.implementationCloseout?.status, "pass", "runtime settings host runtime discovery IAU implementationCloseout status");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime discovery IAU implementationCloseout completedTasks");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryIau.implementationCloseout?.blockedScopeRetained, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028"], "runtime settings host runtime discovery IAU implementationCloseout blockedScopeRetained");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeDiscoverySliceId}/IAU-runtime-settings-cli-validation-host-runtime-discovery-v1.md`);

const runtimeSettingsHostRuntimeDiscoveryPreflight = readJson(runtimeSettingsHostRuntimeDiscoveryPreflightPath);
requireEqual(runtimeSettingsHostRuntimeDiscoveryPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings host runtime discovery preflight schema");
requireEqual(runtimeSettingsHostRuntimeDiscoveryPreflight.iauId, "IAU-runtime-settings-cli-validation-host-runtime-discovery-v1", "runtime settings host runtime discovery preflight iauId");
requireEqual(runtimeSettingsHostRuntimeDiscoveryPreflight.status, "pass", "runtime settings host runtime discovery preflight status");
requireEqual(runtimeSettingsHostRuntimeDiscoveryPreflight.implementationStartAllowed, true, "runtime settings host runtime discovery preflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimeDiscoveryPreflight.parentSliceId, runtimeSettingsHostRuntimeDiscoverySliceId, "runtime settings host runtime discovery preflight parentSliceId");
requireEqual(runtimeSettingsHostRuntimeDiscoveryPreflight.implementationSharing, "none", "runtime settings host runtime discovery preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsHostRuntimeDiscoveryPreflight, "runtime settings host runtime discovery preflight");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime discovery preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsHostRuntimeDiscoveryPreflight.checkResults) || runtimeSettingsHostRuntimeDiscoveryPreflight.checkResults.length !== runtimeSettingsHostRuntimeDiscoveryPreflight.requiredChecks.length) {
  failures.push("runtime settings host runtime discovery preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsHostRuntimeDiscoveryPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings host runtime discovery preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeDiscoverySliceId}/IAU-runtime-settings-cli-validation-host-runtime-discovery-v1-preflight-v1.md`);

const runtimeSettingsHostRuntimeDiscoveryManifest = readJson(`${runtimeSettingsHostRuntimeDiscoveryImportDir}/manifest.json`);
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.schema, "vi-history/requirements-import@v1", "runtime settings host runtime discovery manifest schema");
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.sliceId, runtimeSettingsHostRuntimeDiscoverySliceId, "runtime settings host runtime discovery sliceId");
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.sourceBaselineTag, "v1.3.16", "runtime settings host runtime discovery sourceBaselineTag");
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.sourceCommit, "e411ef2bfa74cedf6f9b53d764810f9f4c93a8b0", "runtime settings host runtime discovery sourceCommit");
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.governedAdmissionCommit, "4f4211edc824c92f3d9aa4c39cafa928d59c5ce3", "runtime settings host runtime discovery governedAdmissionCommit");
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.targetProduct, "vi-history", "runtime settings host runtime discovery targetProduct");
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.targetFeature, runtimeSettingsHostRuntimeDiscoverySliceId, "runtime settings host runtime discovery targetFeature");
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.redactionStatus, "pass", "runtime settings host runtime discovery redactionStatus");
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.implementationSharing, "none", "runtime settings host runtime discovery implementationSharing");
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings host runtime discovery marketplacePublication");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryManifest.importedRequirementIds, runtimeSettingsHostRuntimeDiscoveryExpectedIds, "runtime settings host runtime discovery importedRequirementIds");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryManifest.prerequisiteRequirementIds, ["VHS-REQ-537", "VHS-REQ-543", "VHS-REQ-544", "VHS-REQ-545"], "runtime settings host runtime discovery prerequisiteRequirementIds");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryManifest.supportingTestIds, ["TEST-UNIT-063", "TEST-UNIT-064", "TEST-UNIT-342", "TEST-UNIT-354", "TEST-UNIT-355", "TEST-UNIT-392"], "runtime settings host runtime discovery supportingTestIds");
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.contractName, "createRuntimeSettingsValidationHostRuntimeDiscovery", "runtime settings host runtime discovery contractName");
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.composedContractName, "createRuntimeSettingsValidationHostRuntimePreflight", "runtime settings host runtime discovery composedContractName");
requireEqual(runtimeSettingsHostRuntimeDiscoveryManifest.discoveryBoundary, "bounded-public-safe-discovery-facts-only", "runtime settings host runtime discovery discoveryBoundary");
requireArrayEqual(runtimeSettingsHostRuntimeDiscoveryManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings host runtime discovery manifest files");

for (const file of runtimeSettingsHostRuntimeDiscoveryManifest.files ?? []) {
  requireFile(`${runtimeSettingsHostRuntimeDiscoveryImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsHostRuntimeDiscoveryFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsHostRuntimeDiscoveryFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Host Runtime Discovery",
  "VHS-REQ-095",
  "VHS-REQ-096",
  "VHS-REQ-550",
  "TEST-UNIT-392",
  "IAU-runtime-settings-cli-validation-host-runtime-discovery-v1",
  "createRuntimeSettingsValidationHostRuntimeDiscovery",
  "createRuntimeSettingsValidationHostRuntimePreflight",
  "Current Implementation Admission Unit is",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeDiscoveryFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-validation-host-runtime-discovery-v1",
  "Issue #118",
  "Marketplace publication: disabled",
  "Implementation sharing: none",
  "4f4211edc824c92f3d9aa4c39cafa928d59c5ce3"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeDiscoveryFeatureDir}/tasks.md`, [
  "Issue #118",
  "Implementation handoff issue**: Issue #120",
  "Implementation PR**: PR #121",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T016",
  "- [x] T029",
  "- [x] T034",
  "IAU-runtime-settings-cli-validation-host-runtime-discovery-v1",
  "[BLOCKED]",
  "T028"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeDiscoveryImportDir}/rtm.csv`, runtimeSettingsHostRuntimeDiscoveryExpectedIds);
requireTextIncludes(`${runtimeSettingsHostRuntimeDiscoveryImportDir}/syrs.md`, [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "VHS-REQ-550",
  "public-safe",
  "there is no user-facing Docker"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeDiscoveryImportDir}/srs.md`, [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "TEST-UNIT-392",
  "createRuntimeSettingsValidationHostRuntimeDiscovery",
  "MUST NOT invoke the existing compare runtime"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeDiscoveryImportDir}/test-plan.md`, [
  "TEST-UNIT-RSHOSTDISCOVERY-001",
  "TEST-UNIT-RSHOSTDISCOVERY-008",
  "Windows registry-view observations",
  "runtime validation execution"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-host-runtime-discovery-v1",
  "docs/requirements/admissions/runtime-settings-cli-validation-host-runtime-discovery-v1.json",
  "Issue #118",
  "Issue #120",
  "PR #121",
  "IAU-runtime-settings-cli-validation-host-runtime-discovery-v1",
  "Current Implementation Admission Unit:\n`none`.",
  "createRuntimeSettingsValidationHostRuntimeDiscovery(input = {})",
  "bounded discovery",
  "Raw private path disclosure"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-host-runtime-discovery-v1",
  "Issue #118",
  "Issue #120",
  "PR #121",
  "IAU-runtime-settings-cli-validation-host-runtime-discovery-v1",
  "Current Implementation Admission Unit:\n`none`.",
  "createRuntimeSettingsValidationHostRuntimeDiscovery(input = {})",
  "021-runtime-settings-cli-validation-host-runtime-discovery-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-host-runtime-discovery-v1",
  "Issue #118",
  "Issue #120",
  "PR #121",
  "IAU-runtime-settings-cli-validation-host-runtime-discovery-v1",
  "createRuntimeSettingsValidationHostRuntimeDiscovery(input = {})",
  "bounded public-safe discovery facts",
  "Current Implementation Admission Unit:\n`none`."
]);

const runtimeSettingsHostRuntimeObservationAdmission = readJson(runtimeSettingsHostRuntimeObservationAdmissionPath);
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.schema, "vi-history/requirements-admission@v1", "runtime settings host runtime observation admission schema");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.sliceId, runtimeSettingsHostRuntimeObservationSliceId, "runtime settings host runtime observation admission sliceId");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.state, "implemented", "runtime settings host runtime observation admission state");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.targetProduct, "vi-history", "runtime settings host runtime observation admission targetProduct");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.targetFeature, runtimeSettingsHostRuntimeObservationSliceId, "runtime settings host runtime observation admission targetFeature");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.sourceBaselineTag, "v1.3.16", "runtime settings host runtime observation admission sourceBaselineTag");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.sourceCommit, "4f4211edc824c92f3d9aa4c39cafa928d59c5ce3", "runtime settings host runtime observation admission sourceCommit");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.governedAdmissionCommit, "bf014a64378db510119e1d6db2d0b21a8b360ba7", "runtime settings host runtime observation admission governedAdmissionCommit");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.implementationSharing, "none", "runtime settings host runtime observation admission implementationSharing");
requireMarketplacePosture(runtimeSettingsHostRuntimeObservationAdmission, "runtime settings host runtime observation admission");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.currentImplementationAdmissionUnit, null, "runtime settings host runtime observation currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsHostRuntimeObservationAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "runtime settings host runtime observation completedSpecScope");
requireArrayEqual(runtimeSettingsHostRuntimeObservationAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime observation completedImplementationScope");
requireArrayEqual(runtimeSettingsHostRuntimeObservationAdmission.admittedImplementationScope, [], "runtime settings host runtime observation admittedImplementationScope");
requireArrayEqual(runtimeSettingsHostRuntimeObservationAdmission.blockedImplementationScope, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028"], "runtime settings host runtime observation blockedImplementationScope");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1", "runtime settings host runtime observation preImplementationPreflight iauId");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.preImplementationPreflight?.status, "pass", "runtime settings host runtime observation preImplementationPreflight status");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings host runtime observation preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.preImplementationPreflight?.record, runtimeSettingsHostRuntimeObservationPreflightPath, "runtime settings host runtime observation preImplementationPreflight record");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.issue?.number, 130, "runtime settings host runtime observation issue number");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.implementationHandoffIssue?.number, 132, "runtime settings host runtime observation implementation handoff issue number");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.implementationPullRequest?.number, 133, "runtime settings host runtime observation implementation pull request number");
requireEqual(runtimeSettingsHostRuntimeObservationAdmission.implementationCloseout?.status, "pass", "runtime settings host runtime observation implementationCloseout status");
requireArrayEqual(runtimeSettingsHostRuntimeObservationAdmission.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime observation implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSliceId}.md`);

const runtimeSettingsHostRuntimeObservationAdmissionUnit = (runtimeSettingsHostRuntimeObservationAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1");
requireEqual(runtimeSettingsHostRuntimeObservationAdmissionUnit?.state, "implemented", "runtime settings host runtime observation admission unit state");
requireEqual(runtimeSettingsHostRuntimeObservationAdmissionUnit?.preflightRecord, runtimeSettingsHostRuntimeObservationPreflightPath, "runtime settings host runtime observation admission unit preflightRecord");

const runtimeSettingsHostRuntimeObservationIau = readJson(runtimeSettingsHostRuntimeObservationIauPath);
requireEqual(runtimeSettingsHostRuntimeObservationIau.schema, "vi-history/implementation-admission-unit@v1", "runtime settings host runtime observation IAU schema");
requireEqual(runtimeSettingsHostRuntimeObservationIau.iauId, "IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1", "runtime settings host runtime observation IAU id");
requireEqual(runtimeSettingsHostRuntimeObservationIau.state, "implemented", "runtime settings host runtime observation IAU state");
requireEqual(runtimeSettingsHostRuntimeObservationIau.parentSliceId, runtimeSettingsHostRuntimeObservationSliceId, "runtime settings host runtime observation IAU parentSliceId");
requireArrayEqual(runtimeSettingsHostRuntimeObservationIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime observation IAU admittedTasks");
requireArrayEqual(runtimeSettingsHostRuntimeObservationIau.blockedTasks, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028"], "runtime settings host runtime observation IAU blockedTasks");
requireEqual(runtimeSettingsHostRuntimeObservationIau.implementationSharing, "none", "runtime settings host runtime observation IAU implementationSharing");
requireMarketplacePosture(runtimeSettingsHostRuntimeObservationIau, "runtime settings host runtime observation IAU");
requireEqual(runtimeSettingsHostRuntimeObservationIau.preImplementationPreflight?.status, "pass", "runtime settings host runtime observation IAU preImplementationPreflight status");
requireEqual(runtimeSettingsHostRuntimeObservationIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1-preflight-v1.json", "runtime settings host runtime observation IAU preImplementationPreflight record");
requireEqual(runtimeSettingsHostRuntimeObservationIau.preImplementationPreflight?.implementationStartAllowed, true, "runtime settings host runtime observation IAU preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimeObservationIau.implementationHandoffIssue?.number, 132, "runtime settings host runtime observation IAU implementation handoff issue number");
requireEqual(runtimeSettingsHostRuntimeObservationIau.implementationPullRequest?.number, 133, "runtime settings host runtime observation IAU implementation pull request number");
requireEqual(runtimeSettingsHostRuntimeObservationIau.implementationCloseout?.status, "pass", "runtime settings host runtime observation IAU implementationCloseout status");
requireArrayEqual(runtimeSettingsHostRuntimeObservationIau.implementationCloseout?.completedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime observation IAU implementationCloseout completedTasks");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1.md`);

const runtimeSettingsHostRuntimeObservationPreflight = readJson(runtimeSettingsHostRuntimeObservationPreflightPath);
requireEqual(runtimeSettingsHostRuntimeObservationPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "runtime settings host runtime observation preflight schema");
requireEqual(runtimeSettingsHostRuntimeObservationPreflight.iauId, "IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1", "runtime settings host runtime observation preflight iauId");
requireEqual(runtimeSettingsHostRuntimeObservationPreflight.status, "pass", "runtime settings host runtime observation preflight status");
requireEqual(runtimeSettingsHostRuntimeObservationPreflight.implementationStartAllowed, true, "runtime settings host runtime observation preflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimeObservationPreflight.parentSliceId, runtimeSettingsHostRuntimeObservationSliceId, "runtime settings host runtime observation preflight parentSliceId");
requireEqual(runtimeSettingsHostRuntimeObservationPreflight.implementationSharing, "none", "runtime settings host runtime observation preflight implementationSharing");
requireMarketplacePosture(runtimeSettingsHostRuntimeObservationPreflight, "runtime settings host runtime observation preflight");
requireArrayEqual(runtimeSettingsHostRuntimeObservationPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "runtime settings host runtime observation preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsHostRuntimeObservationPreflight.checkResults) || runtimeSettingsHostRuntimeObservationPreflight.checkResults.length !== runtimeSettingsHostRuntimeObservationPreflight.requiredChecks.length) {
  failures.push("runtime settings host runtime observation preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsHostRuntimeObservationPreflight.checkResults) {
    requireEqual(result.status, "pass", `runtime settings host runtime observation preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1-preflight-v1.md`);

const runtimeSettingsHostRuntimeObservationManifest = readJson(`${runtimeSettingsHostRuntimeObservationImportDir}/manifest.json`);
requireEqual(runtimeSettingsHostRuntimeObservationManifest.schema, "vi-history/requirements-import@v1", "runtime settings host runtime observation manifest schema");
requireEqual(runtimeSettingsHostRuntimeObservationManifest.sliceId, runtimeSettingsHostRuntimeObservationSliceId, "runtime settings host runtime observation sliceId");
requireEqual(runtimeSettingsHostRuntimeObservationManifest.sourceBaselineTag, "v1.3.16", "runtime settings host runtime observation sourceBaselineTag");
requireEqual(runtimeSettingsHostRuntimeObservationManifest.sourceCommit, "4f4211edc824c92f3d9aa4c39cafa928d59c5ce3", "runtime settings host runtime observation sourceCommit");
requireEqual(runtimeSettingsHostRuntimeObservationManifest.governedAdmissionCommit, "bf014a64378db510119e1d6db2d0b21a8b360ba7", "runtime settings host runtime observation governedAdmissionCommit");
requireEqual(runtimeSettingsHostRuntimeObservationManifest.targetProduct, "vi-history", "runtime settings host runtime observation targetProduct");
requireEqual(runtimeSettingsHostRuntimeObservationManifest.targetFeature, runtimeSettingsHostRuntimeObservationSliceId, "runtime settings host runtime observation targetFeature");
requireEqual(runtimeSettingsHostRuntimeObservationManifest.redactionStatus, "pass", "runtime settings host runtime observation redactionStatus");
requireEqual(runtimeSettingsHostRuntimeObservationManifest.implementationSharing, "none", "runtime settings host runtime observation implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationManifest.marketplacePublication, "disabled-until-later-adr", "runtime settings host runtime observation marketplacePublication");
requireArrayEqual(runtimeSettingsHostRuntimeObservationManifest.importedRequirementIds, runtimeSettingsHostRuntimeObservationExpectedIds, "runtime settings host runtime observation importedRequirementIds");
requireArrayEqual(runtimeSettingsHostRuntimeObservationManifest.prerequisiteRequirementIds, ["VHS-REQ-537", "VHS-REQ-543", "VHS-REQ-544", "VHS-REQ-545"], "runtime settings host runtime observation prerequisiteRequirementIds");
requireArrayEqual(runtimeSettingsHostRuntimeObservationManifest.supportingTestIds, ["TEST-UNIT-063", "TEST-UNIT-064", "TEST-UNIT-342", "TEST-UNIT-354", "TEST-UNIT-355", "TEST-UNIT-392"], "runtime settings host runtime observation supportingTestIds");
requireEqual(runtimeSettingsHostRuntimeObservationManifest.contractName, "createRuntimeSettingsValidationHostRuntimeObservation", "runtime settings host runtime observation contractName");
requireEqual(runtimeSettingsHostRuntimeObservationManifest.composedContractName, "createRuntimeSettingsValidationHostRuntimeDiscovery", "runtime settings host runtime observation composedContractName");
requireEqual(runtimeSettingsHostRuntimeObservationManifest.observationBoundary, "bounded-public-safe-observation-facts-only", "runtime settings host runtime observation observationBoundary");
requireArrayEqual(runtimeSettingsHostRuntimeObservationManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "runtime settings host runtime observation manifest files");

for (const file of runtimeSettingsHostRuntimeObservationManifest.files ?? []) {
  requireFile(`${runtimeSettingsHostRuntimeObservationImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsHostRuntimeObservationFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsHostRuntimeObservationFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Host Runtime Observation Adapter",
  "VHS-REQ-095",
  "VHS-REQ-096",
  "VHS-REQ-550",
  "TEST-UNIT-392",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1",
  "createRuntimeSettingsValidationHostRuntimeObservation",
  "createRuntimeSettingsValidationHostRuntimeDiscovery",
  "Current Implementation Admission Unit is",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationFeatureDir}/plan.md`, [
  "IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1",
  "Issue #130",
  "Marketplace publication: disabled",
  "Implementation sharing: none",
  "bf014a64378db510119e1d6db2d0b21a8b360ba7"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationFeatureDir}/tasks.md`, [
  "Issue #130",
  "Implementation handoff issue**: Issue #132.",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T016",
  "- [x] T029",
  "- [x] T034",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1",
  "[BLOCKED]",
  "T028"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationImportDir}/rtm.csv`, runtimeSettingsHostRuntimeObservationExpectedIds);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationImportDir}/syrs.md`, [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "VHS-REQ-550",
  "public-safe observation",
  "there is no user-facing Docker"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationImportDir}/srs.md`, [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "TEST-UNIT-392",
  "createRuntimeSettingsValidationHostRuntimeObservation",
  "MUST NOT perform arbitrary filesystem walking"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationImportDir}/test-plan.md`, [
  "TEST-UNIT-RSHOSTOBS-001",
  "TEST-UNIT-RSHOSTOBS-008",
  "registry observations",
  "runtime validation execution"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-host-runtime-observation-adapter-v1",
  "docs/requirements/admissions/runtime-settings-cli-validation-host-runtime-observation-adapter-v1.json",
  "Issue #130",
  "Issue #132",
  "PR #133",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1",
  "Current Implementation Admission Unit:\n`none`.",
  "createRuntimeSettingsValidationHostRuntimeObservation(input = {})",
  "supplied bounded observation",
  "Raw private path disclosure"
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-host-runtime-observation-adapter-v1",
  "Issue #130",
  "Issue #132",
  "PR #133",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1",
  "Current Implementation Admission Unit:\n`none`.",
  "createRuntimeSettingsValidationHostRuntimeObservation(input = {})",
  "extension-vsix-packaging-artifact-v1",
  "022-extension-vsix-packaging-artifact-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-host-runtime-observation-adapter-v1",
  "Issue #130",
  "Issue #132",
  "PR #133",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1",
  "createRuntimeSettingsValidationHostRuntimeObservation(input = {})",
  "bounded public-safe observation facts",
  "Current Implementation Admission Unit:\n`none`."
]);

const runtimeSettingsHostRuntimeObservationSourceAdmission = readJson(runtimeSettingsHostRuntimeObservationSourceAdmissionPath);
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.schema, "vi-history/requirements-admission@v1", "host runtime observation source admission schema");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.sliceId, runtimeSettingsHostRuntimeObservationSourceSliceId, "host runtime observation source admission sliceId");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.state, "implemented", "host runtime observation source admission state");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.targetProduct, "vi-history", "host runtime observation source admission targetProduct");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.targetFeature, runtimeSettingsHostRuntimeObservationSourceSliceId, "host runtime observation source admission targetFeature");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.sourceBaselineTag, "v1.3.16", "host runtime observation source admission sourceBaselineTag");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.sourceCommit, "c87c8096c239d439c3c04865c67e02d87433e93f", "host runtime observation source admission sourceCommit");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.implementationSharing, "none", "host runtime observation source implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.marketplacePublication, "out-of-scope", "host runtime observation source marketplacePublication");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.issue?.number, 142, "host runtime observation source issue number");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.implementationHandoffIssue?.number, 144, "host runtime observation source implementation handoff issue");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.implementationPullRequest?.number, 145, "host runtime observation source implementation pull request");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.publicSequencingMarker?.number, 135, "host runtime observation source sequencing marker");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.currentImplementationAdmissionUnit, null, "host runtime observation source currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "host runtime observation source completedSpecScope");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "host runtime observation source completedImplementationScope");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.admittedImplementationScope, [], "host runtime observation source admittedImplementationScope");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.blockedImplementationScope, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028"], "host runtime observation source blockedImplementationScope");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1", "host runtime observation source preImplementationPreflight iauId");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.preImplementationPreflight?.status, "pass", "host runtime observation source preImplementationPreflight status");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.preImplementationPreflight?.implementationStartAllowed, true, "host runtime observation source preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmission.preImplementationPreflight?.record, runtimeSettingsHostRuntimeObservationSourcePreflightPath, "host runtime observation source preImplementationPreflight record");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSourceSliceId}.md`);

const runtimeSettingsHostRuntimeObservationSourceAdmissionUnit = (runtimeSettingsHostRuntimeObservationSourceAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmissionUnit?.state, "implemented", "host runtime observation source admission unit state");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAdmissionUnit?.preflightRecord, runtimeSettingsHostRuntimeObservationSourcePreflightPath, "host runtime observation source admission unit preflightRecord");

const runtimeSettingsHostRuntimeObservationSourceIau = readJson(runtimeSettingsHostRuntimeObservationSourceIauPath);
requireEqual(runtimeSettingsHostRuntimeObservationSourceIau.schema, "vi-history/implementation-admission-unit@v1", "host runtime observation source IAU schema");
requireEqual(runtimeSettingsHostRuntimeObservationSourceIau.iauId, "IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1", "host runtime observation source IAU id");
requireEqual(runtimeSettingsHostRuntimeObservationSourceIau.state, "implemented", "host runtime observation source IAU state");
requireEqual(runtimeSettingsHostRuntimeObservationSourceIau.parentSliceId, runtimeSettingsHostRuntimeObservationSourceSliceId, "host runtime observation source IAU parentSliceId");
requireEqual(runtimeSettingsHostRuntimeObservationSourceIau.issue?.number, 142, "host runtime observation source IAU issue number");
requireEqual(runtimeSettingsHostRuntimeObservationSourceIau.implementationHandoffIssue?.number, 144, "host runtime observation source IAU implementation handoff issue");
requireEqual(runtimeSettingsHostRuntimeObservationSourceIau.implementationPullRequest?.number, 145, "host runtime observation source IAU implementation pull request");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "host runtime observation source IAU admittedTasks");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceIau.blockedTasks, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028"], "host runtime observation source IAU blockedTasks");
requireEqual(runtimeSettingsHostRuntimeObservationSourceIau.implementationSharing, "none", "host runtime observation source IAU implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationSourceIau.marketplacePublication, "out-of-scope", "host runtime observation source IAU marketplacePublication");
requireEqual(runtimeSettingsHostRuntimeObservationSourceIau.preImplementationPreflight?.status, "pass", "host runtime observation source IAU preImplementationPreflight status");
requireEqual(runtimeSettingsHostRuntimeObservationSourceIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1-preflight-v1.json", "host runtime observation source IAU preImplementationPreflight record");
requireEqual(runtimeSettingsHostRuntimeObservationSourceIau.preImplementationPreflight?.implementationStartAllowed, true, "host runtime observation source IAU preImplementationPreflight implementationStartAllowed");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSourceSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1.md`);

const runtimeSettingsHostRuntimeObservationSourcePreflight = readJson(runtimeSettingsHostRuntimeObservationSourcePreflightPath);
requireEqual(runtimeSettingsHostRuntimeObservationSourcePreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "host runtime observation source preflight schema");
requireEqual(runtimeSettingsHostRuntimeObservationSourcePreflight.iauId, "IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1", "host runtime observation source preflight iauId");
requireEqual(runtimeSettingsHostRuntimeObservationSourcePreflight.status, "pass", "host runtime observation source preflight status");
requireEqual(runtimeSettingsHostRuntimeObservationSourcePreflight.implementationStartAllowed, true, "host runtime observation source preflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimeObservationSourcePreflight.parentSliceId, runtimeSettingsHostRuntimeObservationSourceSliceId, "host runtime observation source preflight parentSliceId");
requireEqual(runtimeSettingsHostRuntimeObservationSourcePreflight.implementationSharing, "none", "host runtime observation source preflight implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationSourcePreflight.marketplacePublication, "out-of-scope", "host runtime observation source preflight marketplacePublication");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourcePreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "host runtime observation source preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsHostRuntimeObservationSourcePreflight.checkResults) || runtimeSettingsHostRuntimeObservationSourcePreflight.checkResults.length !== runtimeSettingsHostRuntimeObservationSourcePreflight.requiredChecks.length) {
  failures.push("host runtime observation source preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsHostRuntimeObservationSourcePreflight.checkResults) {
    requireEqual(result.status, "pass", `host runtime observation source preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSourceSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1-preflight-v1.md`);

const runtimeSettingsHostRuntimeObservationSourceManifest = readJson(`${runtimeSettingsHostRuntimeObservationSourceImportDir}/manifest.json`);
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.schema, "vi-history/requirements-import@v1", "host runtime observation source manifest schema");
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.sliceId, runtimeSettingsHostRuntimeObservationSourceSliceId, "host runtime observation source manifest sliceId");
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.sourceBaselineTag, "v1.3.16", "host runtime observation source manifest sourceBaselineTag");
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.sourceCommit, "c87c8096c239d439c3c04865c67e02d87433e93f", "host runtime observation source manifest sourceCommit");
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.targetProduct, "vi-history", "host runtime observation source manifest targetProduct");
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.targetFeature, runtimeSettingsHostRuntimeObservationSourceSliceId, "host runtime observation source manifest targetFeature");
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.specKitPath, runtimeSettingsHostRuntimeObservationSourceFeatureDir, "host runtime observation source manifest specKitPath");
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.redactionStatus, "pass", "host runtime observation source manifest redactionStatus");
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.implementationSharing, "none", "host runtime observation source manifest implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.marketplacePublication, "out-of-scope", "host runtime observation source manifest marketplacePublication");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceManifest.importedRequirementIds, runtimeSettingsHostRuntimeObservationSourceExpectedIds, "host runtime observation source importedRequirementIds");
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.contractName, "createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter", "host runtime observation source contractName");
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.composedContractName, "createRuntimeSettingsValidationHostRuntimeObservation", "host runtime observation source composedContractName");
requireEqual(runtimeSettingsHostRuntimeObservationSourceManifest.sourceAdapterBoundary, "bounded-public-safe-observation-source-facts-only", "host runtime observation source boundary");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "host runtime observation source manifest files");

for (const file of runtimeSettingsHostRuntimeObservationSourceManifest.files ?? []) {
  requireFile(`${runtimeSettingsHostRuntimeObservationSourceImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsHostRuntimeObservationSourceFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Host Runtime Observation Source Adapter",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter",
  "Current Implementation Admission Unit is",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceFeatureDir}/plan.md`, [
  "bounded-public-safe-observation-source-facts-only",
  "Implementation sharing: none",
  "Marketplace publication: out of scope",
  "SPECIFY_FEATURE=023-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceFeatureDir}/tasks.md`, [
  "Issue #142",
  "Implementation handoff issue**: Issue #144.",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T016",
  "- [x] T029",
  "- [x] T034",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1",
  "[BLOCKED]",
  "T028"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceImportDir}/rtm.csv`, runtimeSettingsHostRuntimeObservationSourceExpectedIds);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceImportDir}/syrs.md`, [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "VHS-REQ-550",
  "public-safe observation dependency",
  "no user-facing Docker"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceImportDir}/srs.md`, [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "TEST-UNIT-RSHOSTSOURCE-005",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter",
  "MUST NOT perform arbitrary filesystem walking"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceImportDir}/test-plan.md`, [
  "TEST-UNIT-RSHOSTSOURCE-001",
  "TEST-UNIT-RSHOSTSOURCE-005",
  "registry-view source facts",
  "runtime validation execution"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1",
  "Issue #142",
  "Issue #144",
  "PR #145",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter(input =",
  "Current Implementation Admission Unit:\n`none`."
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1",
  "Issue #142",
  "Issue #144",
  "PR #145",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter(input =",
  "Current Implementation Admission Unit:\n`none`.",
  "023-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1",
  "Issue #142",
  "Issue #144",
  "PR #145",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter(input =",
  "Current Implementation Admission Unit:\n`none`."
]);
requireTextIncludes("src/runtime-settings-cli.ts", [
  "RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_REQUIREMENTS",
  "RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_BLOCKED_SIDE_EFFECTS",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter",
  "bounded-public-safe-observation-source-facts-only",
  "hasValidationCommandHostRuntimeObservationSourceFacts"
]);
requireTextIncludes("tests/runtime-settings-cli-validation-host-runtime-observation-source-adapter.test.mjs", [
  "T009 selected host facts drive public-safe source adaptation",
  "T012 Windows host 2026 x64 source facts preserve canonical installed x86 LabVIEWCLI",
  "T015 traces host observation source IDs",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter",
  "runtimeValidation"
]);

const runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission = readJson(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmissionPath);
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.schema, "vi-history/requirements-admission@v1", "host runtime observation source acquisition admission schema");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.sliceId, runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId, "host runtime observation source acquisition admission sliceId");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.state, "implemented", "host runtime observation source acquisition admission state");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.targetProduct, "vi-history", "host runtime observation source acquisition admission targetProduct");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.targetFeature, runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId, "host runtime observation source acquisition admission targetFeature");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.sourceBaselineTag, "v1.3.16", "host runtime observation source acquisition admission sourceBaselineTag");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.sourceCommit, "2e0d7bfd6bf1154aa1b3693c49d32974a59c6686", "host runtime observation source acquisition admission sourceCommit");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.implementationSharing, "none", "host runtime observation source acquisition implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.marketplacePublication, "out-of-scope", "host runtime observation source acquisition marketplacePublication");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.issue?.number, 148, "host runtime observation source acquisition issue number");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.implementationHandoffIssue?.number, 150, "host runtime observation source acquisition implementation handoff issue");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.implementationPullRequest?.number, 151, "host runtime observation source acquisition implementation pull request");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.publicSequencingMarker?.number, 147, "host runtime observation source acquisition sequencing marker");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.currentImplementationAdmissionUnit, null, "host runtime observation source acquisition currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "host runtime observation source acquisition completedSpecScope");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "host runtime observation source acquisition completedImplementationScope");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.admittedImplementationScope, [], "host runtime observation source acquisition admittedImplementationScope");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.blockedImplementationScope, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028", "T029", "T030"], "host runtime observation source acquisition blockedImplementationScope");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1", "host runtime observation source acquisition preImplementationPreflight iauId");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.preImplementationPreflight?.status, "pass", "host runtime observation source acquisition preImplementationPreflight status");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.preImplementationPreflight?.implementationStartAllowed, true, "host runtime observation source acquisition preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.preImplementationPreflight?.record, runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflightPath, "host runtime observation source acquisition preImplementationPreflight record");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId}.md`);

const runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmissionUnit = (runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmissionUnit?.state, "implemented", "host runtime observation source acquisition admission unit state");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionAdmissionUnit?.preflightRecord, runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflightPath, "host runtime observation source acquisition admission unit preflightRecord");

const runtimeSettingsHostRuntimeObservationSourceAcquisitionIau = readJson(runtimeSettingsHostRuntimeObservationSourceAcquisitionIauPath);
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.schema, "vi-history/implementation-admission-unit@v1", "host runtime observation source acquisition IAU schema");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.iauId, "IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1", "host runtime observation source acquisition IAU id");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.state, "implemented", "host runtime observation source acquisition IAU state");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.parentSliceId, runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId, "host runtime observation source acquisition IAU parentSliceId");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.issue?.number, 148, "host runtime observation source acquisition IAU issue number");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.implementationHandoffIssue?.number, 150, "host runtime observation source acquisition IAU implementation handoff issue");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.implementationPullRequest?.number, 151, "host runtime observation source acquisition IAU implementation pull request");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "host runtime observation source acquisition IAU admittedTasks");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.blockedTasks, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028", "T029", "T030"], "host runtime observation source acquisition IAU blockedTasks");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.implementationSharing, "none", "host runtime observation source acquisition IAU implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.marketplacePublication, "out-of-scope", "host runtime observation source acquisition IAU marketplacePublication");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.preImplementationPreflight?.status, "pass", "host runtime observation source acquisition IAU preImplementationPreflight status");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1-preflight-v1.json", "host runtime observation source acquisition IAU preImplementationPreflight record");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionIau.preImplementationPreflight?.implementationStartAllowed, true, "host runtime observation source acquisition IAU preImplementationPreflight implementationStartAllowed");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1.md`);

const runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight = readJson(runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflightPath);
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "host runtime observation source acquisition preflight schema");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight.iauId, "IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1", "host runtime observation source acquisition preflight iauId");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight.status, "pass", "host runtime observation source acquisition preflight status");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight.implementationStartAllowed, true, "host runtime observation source acquisition preflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight.parentSliceId, runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId, "host runtime observation source acquisition preflight parentSliceId");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight.implementationSharing, "none", "host runtime observation source acquisition preflight implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight.marketplacePublication, "out-of-scope", "host runtime observation source acquisition preflight marketplacePublication");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "host runtime observation source acquisition preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight.checkResults) || runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight.checkResults.length !== runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight.requiredChecks.length) {
  failures.push("host runtime observation source acquisition preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsHostRuntimeObservationSourceAcquisitionPreflight.checkResults) {
    requireEqual(result.status, "pass", `host runtime observation source acquisition preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1-preflight-v1.md`);

const runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest = readJson(`${runtimeSettingsHostRuntimeObservationSourceAcquisitionImportDir}/manifest.json`);
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.schema, "vi-history/requirements-import@v1", "host runtime observation source acquisition manifest schema");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.sliceId, runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId, "host runtime observation source acquisition manifest sliceId");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.sourceBaselineTag, "v1.3.16", "host runtime observation source acquisition manifest sourceBaselineTag");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.sourceCommit, "2e0d7bfd6bf1154aa1b3693c49d32974a59c6686", "host runtime observation source acquisition manifest sourceCommit");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.targetProduct, "vi-history", "host runtime observation source acquisition manifest targetProduct");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.targetFeature, runtimeSettingsHostRuntimeObservationSourceAcquisitionSliceId, "host runtime observation source acquisition manifest targetFeature");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.specKitPath, runtimeSettingsHostRuntimeObservationSourceAcquisitionFeatureDir, "host runtime observation source acquisition manifest specKitPath");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.redactionStatus, "pass", "host runtime observation source acquisition manifest redactionStatus");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.implementationSharing, "none", "host runtime observation source acquisition manifest implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.marketplacePublication, "out-of-scope", "host runtime observation source acquisition manifest marketplacePublication");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.importedRequirementIds, runtimeSettingsHostRuntimeObservationSourceAcquisitionExpectedIds, "host runtime observation source acquisition importedRequirementIds");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.contractName, "createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition", "host runtime observation source acquisition contractName");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.composedContractName, "createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter", "host runtime observation source acquisition composedContractName");
requireEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.sourceAcquisitionBoundary, "bounded-native-host-source-acquisition-dependencies-only", "host runtime observation source acquisition boundary");
requireArrayEqual(runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "host runtime observation source acquisition manifest files");

for (const file of runtimeSettingsHostRuntimeObservationSourceAcquisitionManifest.files ?? []) {
  requireFile(`${runtimeSettingsHostRuntimeObservationSourceAcquisitionImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsHostRuntimeObservationSourceAcquisitionFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceAcquisitionFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Host Runtime Observation Source Acquisition",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition",
  "Current Implementation Admission Unit is",
  "Issue #148",
  "Issue #150",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceAcquisitionFeatureDir}/plan.md`, [
  "bounded-native-host-source-acquisition-dependencies-only",
  "Implementation sharing: none",
  "Marketplace publication: out of scope",
  "SPECIFY_FEATURE=024-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceAcquisitionFeatureDir}/tasks.md`, [
  "Issue #148",
  "Implementation handoff issue**: Issue #150.",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T016",
  "- [x] T036",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1",
  "[BLOCKED]",
  "T030"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceAcquisitionImportDir}/rtm.csv`, runtimeSettingsHostRuntimeObservationSourceAcquisitionExpectedIds);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceAcquisitionImportDir}/syrs.md`, [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "VHS-REQ-550",
  "public-safe host runtime observation source facts",
  "no user-facing Docker"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceAcquisitionImportDir}/srs.md`, [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "TEST-UNIT-RSHOSTACQ-006",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition",
  "filesystem walking"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationSourceAcquisitionImportDir}/test-plan.md`, [
  "TEST-UNIT-RSHOSTACQ-001",
  "TEST-UNIT-RSHOSTACQ-006",
  "registry-view acquisition dependency facts",
  "runtime validation execution"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1",
  "Issue #148",
  "Issue #150",
  "PR #151",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition(input =",
  "Current Implementation Admission Unit:\n`none`."
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1",
  "Issue #148",
  "Issue #150",
  "PR #151",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition(input =",
  "Current Implementation Admission Unit:\n`none`.",
  "024-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1",
  "Issue #148",
  "Issue #150",
  "PR #151",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition(input =",
  "Current Implementation Admission Unit:\n`none`."
]);
requireTextIncludes("src/runtime-settings-cli.ts", [
  "RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_ACQUISITION_REQUIREMENTS",
  "RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_ACQUISITION_BLOCKED_SIDE_EFFECTS",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition",
  "bounded-native-host-source-acquisition-dependencies-only",
  "hasValidationCommandHostRuntimeObservationSourceAcquisitionFacts"
]);
requireTextIncludes("tests/runtime-settings-cli-validation-host-runtime-observation-source-acquisition.test.mjs", [
  "T009 selected host facts drive bounded public-safe source acquisition",
  "T012 Windows host 2026 x64 acquisition facts preserve canonical installed x86 LabVIEWCLI",
  "T015 traces host observation source acquisition IDs",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition",
  "runtimeValidation"
]);

const runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission = readJson(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmissionPath);
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.schema, "vi-history/requirements-admission@v1", "host runtime observation native source acquisition admission schema");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.sliceId, runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId, "host runtime observation native source acquisition admission sliceId");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.state, "implemented", "host runtime observation native source acquisition admission state");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.targetProduct, "vi-history", "host runtime observation native source acquisition admission targetProduct");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.targetFeature, runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId, "host runtime observation native source acquisition admission targetFeature");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.sourceBaselineTag, "v1.3.16", "host runtime observation native source acquisition admission sourceBaselineTag");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.sourceCommit, "2e0d7bfd6bf1154aa1b3693c49d32974a59c6686", "host runtime observation native source acquisition admission sourceCommit");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.promotedBaselineCommit, "ef311a0daa57fb619a2ea33694a413a79982c585", "host runtime observation native source acquisition promotedBaselineCommit");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.implementationSharing, "none", "host runtime observation native source acquisition implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.marketplacePublication, "out-of-scope", "host runtime observation native source acquisition marketplacePublication");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.issue?.number, 154, "host runtime observation native source acquisition issue number");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.implementationHandoffIssue?.number, 156, "host runtime observation native source acquisition implementation handoff issue");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.implementationPullRequest?.number, 157, "host runtime observation native source acquisition implementation pull request");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.publicSequencingMarker?.number, 153, "host runtime observation native source acquisition sequencing marker");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.currentImplementationAdmissionUnit, null, "host runtime observation native source acquisition currentImplementationAdmissionUnit");
requireArrayEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "host runtime observation native source acquisition completedSpecScope");
requireArrayEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "host runtime observation native source acquisition completedImplementationScope");
requireArrayEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.admittedImplementationScope, [], "host runtime observation native source acquisition admittedImplementationScope");
requireArrayEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.blockedImplementationScope, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028", "T029", "T030"], "host runtime observation native source acquisition blockedImplementationScope");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.preImplementationPreflight?.iauId, "IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1", "host runtime observation native source acquisition preImplementationPreflight iauId");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.preImplementationPreflight?.status, "pass", "host runtime observation native source acquisition preImplementationPreflight status");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.preImplementationPreflight?.implementationStartAllowed, true, "host runtime observation native source acquisition preImplementationPreflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.preImplementationPreflight?.record, runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflightPath, "host runtime observation native source acquisition preImplementationPreflight record");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId}.md`);

const runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmissionUnit = (runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmissionUnit?.state, "implemented", "host runtime observation native source acquisition admission unit state");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionAdmissionUnit?.preflightRecord, runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflightPath, "host runtime observation native source acquisition admission unit preflightRecord");

const runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau = readJson(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIauPath);
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.schema, "vi-history/implementation-admission-unit@v1", "host runtime observation native source acquisition IAU schema");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.iauId, "IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1", "host runtime observation native source acquisition IAU id");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.state, "implemented", "host runtime observation native source acquisition IAU state");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.parentSliceId, runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId, "host runtime observation native source acquisition IAU parentSliceId");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.issue?.number, 154, "host runtime observation native source acquisition IAU issue number");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.implementationHandoffIssue?.number, 156, "host runtime observation native source acquisition IAU implementation handoff issue");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.implementationPullRequest?.number, 157, "host runtime observation native source acquisition IAU implementation pull request");
requireArrayEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "host runtime observation native source acquisition IAU admittedTasks");
requireArrayEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.blockedTasks, ["T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028", "T029", "T030"], "host runtime observation native source acquisition IAU blockedTasks");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.implementationSharing, "none", "host runtime observation native source acquisition IAU implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.marketplacePublication, "out-of-scope", "host runtime observation native source acquisition IAU marketplacePublication");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.preImplementationPreflight?.status, "pass", "host runtime observation native source acquisition IAU preImplementationPreflight status");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.preImplementationPreflight?.record, "IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1-preflight-v1.json", "host runtime observation native source acquisition IAU preImplementationPreflight record");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionIau.preImplementationPreflight?.implementationStartAllowed, true, "host runtime observation native source acquisition IAU preImplementationPreflight implementationStartAllowed");
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1.md`);

const runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight = readJson(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflightPath);
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "host runtime observation native source acquisition preflight schema");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight.iauId, "IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1", "host runtime observation native source acquisition preflight iauId");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight.status, "pass", "host runtime observation native source acquisition preflight status");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight.implementationStartAllowed, true, "host runtime observation native source acquisition preflight implementationStartAllowed");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight.parentSliceId, runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId, "host runtime observation native source acquisition preflight parentSliceId");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight.implementationSharing, "none", "host runtime observation native source acquisition preflight implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight.marketplacePublication, "out-of-scope", "host runtime observation native source acquisition preflight marketplacePublication");
requireArrayEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016"], "host runtime observation native source acquisition preflight implementationStartScope");
if (!Array.isArray(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight.checkResults) || runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight.checkResults.length !== runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight.requiredChecks.length) {
  failures.push("host runtime observation native source acquisition preflight checkResults: must match requiredChecks length");
} else {
  for (const result of runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionPreflight.checkResults) {
    requireEqual(result.status, "pass", `host runtime observation native source acquisition preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId}/IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1-preflight-v1.md`);

const runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest = readJson(`${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionImportDir}/manifest.json`);
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.schema, "vi-history/requirements-import@v1", "host runtime observation native source acquisition manifest schema");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.sliceId, runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId, "host runtime observation native source acquisition manifest sliceId");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.sourceBaselineTag, "v1.3.16", "host runtime observation native source acquisition manifest sourceBaselineTag");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.sourceCommit, "2e0d7bfd6bf1154aa1b3693c49d32974a59c6686", "host runtime observation native source acquisition manifest sourceCommit");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.promotedBaselineCommit, "ef311a0daa57fb619a2ea33694a413a79982c585", "host runtime observation native source acquisition manifest promotedBaselineCommit");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.targetProduct, "vi-history", "host runtime observation native source acquisition manifest targetProduct");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.targetFeature, runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionSliceId, "host runtime observation native source acquisition manifest targetFeature");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.specKitPath, runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionFeatureDir, "host runtime observation native source acquisition manifest specKitPath");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.redactionStatus, "pass", "host runtime observation native source acquisition manifest redactionStatus");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.implementationSharing, "none", "host runtime observation native source acquisition manifest implementationSharing");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.marketplacePublication, "out-of-scope", "host runtime observation native source acquisition manifest marketplacePublication");
requireArrayEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.importedRequirementIds, runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionExpectedIds, "host runtime observation native source acquisition importedRequirementIds");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.contractName, "createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition", "host runtime observation native source acquisition contractName");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.composedContractName, "createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition", "host runtime observation native source acquisition composedContractName");
requireEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.nativeSourceAcquisitionBoundary, "bounded-native-host-source-acquisition-dependency-adapter-only", "host runtime observation native source acquisition boundary");
requireArrayEqual(runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "host runtime observation native source acquisition manifest files");

for (const file of runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionManifest.files ?? []) {
  requireFile(`${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionFeatureDir}/${file}`);
}

requireTextIncludes(`${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionFeatureDir}/spec.md`, [
  "Runtime Settings CLI Validation Host Runtime Observation Native Source Acquisition",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1",
  "createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition",
  "Current Implementation Admission Unit is",
  "Issue #154",
  "Issue #156",
  "clean-room"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionFeatureDir}/plan.md`, [
  "bounded-native-host-source-acquisition-dependency-adapter-only",
  "Implementation sharing: none",
  "Marketplace publication: out of scope",
  "SPECIFY_FEATURE=025-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionFeatureDir}/tasks.md`, [
  "Issue #154",
  "Implementation handoff issue**: Issue #156.",
  "- [x] T001",
  "- [x] T008",
  "- [x] T009",
  "- [x] T016",
  "- [x] T036",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1",
  "[BLOCKED]",
  "T030"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionImportDir}/rtm.csv`, runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionExpectedIds);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionImportDir}/syrs.md`, [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "VHS-REQ-550",
  "public-safe source facts",
  "Docker"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionImportDir}/srs.md`, [
  "VHS-REQ-095",
  "VHS-REQ-096",
  "TEST-UNIT-RSHOSTNATIVEACQ-006",
  "createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition",
  "filesystem walking"
]);
requireTextIncludes(`${runtimeSettingsHostRuntimeObservationNativeSourceAcquisitionImportDir}/test-plan.md`, [
  "TEST-UNIT-RSHOSTNATIVEACQ-001",
  "TEST-UNIT-RSHOSTNATIVEACQ-006",
  "registry-view acquisition dependency",
  "runtime validation execution"
]);
requireTextIncludes("README.md", [
  "runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1",
  "Issue #154",
  "Issue #156",
  "PR #157",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1",
  "createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition(input =",
  "Current Implementation Admission Unit:\n`none`."
]);
requireTextIncludes("AGENTS.md", [
  "runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1",
  "Issue #154",
  "Issue #156",
  "PR #157",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1",
  "createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition(input =",
  "Current Implementation Admission Unit:\n`none`.",
  "025-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1",
  "Issue #154",
  "Issue #156",
  "PR #157",
  "IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1",
  "createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition(input =",
  "Current Implementation Admission Unit:\n`none`."
]);
requireTextIncludes("src/runtime-settings-cli.ts", [
  "RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_ACQUISITION_REQUIREMENTS",
  "RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_ACQUISITION_BLOCKED_SIDE_EFFECTS",
  "createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition",
  "bounded-native-host-source-acquisition-dependency-adapter-only",
  "hasValidationCommandHostRuntimeObservationNativeSourceAcquisitionFacts"
]);
requireTextIncludes("tests/runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition.test.mjs", [
  "T009 selected host facts drive bounded native source acquisition",
  "T012 Windows host 2026 x64 native facts preserve canonical installed x86 LabVIEWCLI",
  "T015 traces host observation native source acquisition IDs",
  "createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition",
  "runtimeValidation"
]);

const extensionVsixPackagingAdmission = readJson(extensionVsixPackagingAdmissionPath);
requireEqual(extensionVsixPackagingAdmission.schema, "vi-history/requirements-admission@v1", "extension VSIX packaging admission schema");
requireEqual(extensionVsixPackagingAdmission.sliceId, extensionVsixPackagingSliceId, "extension VSIX packaging admission sliceId");
requireEqual(extensionVsixPackagingAdmission.state, "implemented", "extension VSIX packaging admission state");
requireEqual(extensionVsixPackagingAdmission.targetProduct, "vi-history", "extension VSIX packaging admission targetProduct");
requireEqual(extensionVsixPackagingAdmission.targetFeature, extensionVsixPackagingSliceId, "extension VSIX packaging admission targetFeature");
requireEqual(extensionVsixPackagingAdmission.sourceBaselineTag, "v1.3.16", "extension VSIX packaging sourceBaselineTag");
requireEqual(extensionVsixPackagingAdmission.sourceCommit, "478d80eac94722411e44ef10a1fc00e39d579fdb", "extension VSIX packaging sourceCommit");
requireEqual(extensionVsixPackagingAdmission.implementationSharing, "none", "extension VSIX packaging implementationSharing");
requireEqual(extensionVsixPackagingAdmission.vsixPackaging, "local-artifact-only", "extension VSIX packaging mode");
requireEqual(extensionVsixPackagingAdmission.marketplacePublication, "out-of-scope", "extension VSIX packaging marketplacePublication");
requireEqual(extensionVsixPackagingAdmission.issue?.number, 137, "extension VSIX packaging issue number");
requireEqual(extensionVsixPackagingAdmission.implementationHandoffIssue?.number, 136, "extension VSIX packaging implementation handoff issue number");
requireEqual(extensionVsixPackagingAdmission.implementationPullRequest?.number, 138, "extension VSIX packaging implementation pull request number");
requireEqual(extensionVsixPackagingAdmission.currentImplementationAdmissionUnit, null, "extension VSIX packaging currentImplementationAdmissionUnit");
requireArrayEqual(extensionVsixPackagingAdmission.completedSpecScope, ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008"], "extension VSIX packaging completedSpecScope");
requireArrayEqual(extensionVsixPackagingAdmission.completedImplementationScope, ["T009", "T010", "T011", "T012", "T013", "T014"], "extension VSIX packaging completedImplementationScope");
requireArrayEqual(extensionVsixPackagingAdmission.admittedImplementationScope, [], "extension VSIX packaging admittedImplementationScope");
requireArrayEqual(extensionVsixPackagingAdmission.blockedImplementationScope, ["T015", "T016"], "extension VSIX packaging blockedImplementationScope");
requireEqual(extensionVsixPackagingAdmission.preImplementationPreflight?.iauId, "IAU-extension-vsix-packaging-artifact-v1", "extension VSIX packaging preImplementationPreflight iauId");
requireEqual(extensionVsixPackagingAdmission.preImplementationPreflight?.status, "pass", "extension VSIX packaging preImplementationPreflight status");
requireEqual(extensionVsixPackagingAdmission.preImplementationPreflight?.implementationStartAllowed, true, "extension VSIX packaging preImplementationPreflight implementationStartAllowed");
requireEqual(extensionVsixPackagingAdmission.preImplementationPreflight?.record, extensionVsixPackagingPreflightPath, "extension VSIX packaging preImplementationPreflight record");
requireFile(`docs/requirements/admissions/${extensionVsixPackagingSliceId}.md`);

const extensionVsixPackagingAdmissionUnit = (extensionVsixPackagingAdmission.implementationAdmissionUnits ?? [])
  .find((unit) => unit?.iauId === "IAU-extension-vsix-packaging-artifact-v1");
requireEqual(extensionVsixPackagingAdmissionUnit?.state, "implemented", "extension VSIX packaging admission unit state");
requireEqual(extensionVsixPackagingAdmissionUnit?.preflightRecord, extensionVsixPackagingPreflightPath, "extension VSIX packaging admission unit preflightRecord");

const extensionVsixPackagingIau = readJson(extensionVsixPackagingIauPath);
requireEqual(extensionVsixPackagingIau.schema, "vi-history/implementation-admission-unit@v1", "extension VSIX packaging IAU schema");
requireEqual(extensionVsixPackagingIau.iauId, "IAU-extension-vsix-packaging-artifact-v1", "extension VSIX packaging IAU id");
requireEqual(extensionVsixPackagingIau.state, "implemented", "extension VSIX packaging IAU state");
requireEqual(extensionVsixPackagingIau.parentSliceId, extensionVsixPackagingSliceId, "extension VSIX packaging IAU parentSliceId");
requireArrayEqual(extensionVsixPackagingIau.admittedTasks, ["T009", "T010", "T011", "T012", "T013", "T014"], "extension VSIX packaging IAU admittedTasks");
requireArrayEqual(extensionVsixPackagingIau.blockedTasks, ["T015", "T016"], "extension VSIX packaging IAU blockedTasks");
requireEqual(extensionVsixPackagingIau.implementationSharing, "none", "extension VSIX packaging IAU implementationSharing");
requireEqual(extensionVsixPackagingIau.vsixPackaging, "local-artifact-only", "extension VSIX packaging IAU mode");
requireEqual(extensionVsixPackagingIau.marketplacePublication, "out-of-scope", "extension VSIX packaging IAU marketplacePublication");
requireEqual(extensionVsixPackagingIau.implementationHandoffIssue?.number, 136, "extension VSIX packaging IAU implementation handoff issue number");
requireEqual(extensionVsixPackagingIau.implementationPullRequest?.number, 138, "extension VSIX packaging IAU implementation pull request number");
requireEqual(extensionVsixPackagingIau.preImplementationPreflight?.status, "pass", "extension VSIX packaging IAU preImplementationPreflight status");
requireEqual(extensionVsixPackagingIau.preImplementationPreflight?.record, "IAU-extension-vsix-packaging-artifact-v1-preflight-v1.json", "extension VSIX packaging IAU preImplementationPreflight record");
requireEqual(extensionVsixPackagingIau.preImplementationPreflight?.implementationStartAllowed, true, "extension VSIX packaging IAU preImplementationPreflight implementationStartAllowed");
requireFile(`docs/requirements/admissions/${extensionVsixPackagingSliceId}/IAU-extension-vsix-packaging-artifact-v1.md`);

const extensionVsixPackagingPreflight = readJson(extensionVsixPackagingPreflightPath);
requireEqual(extensionVsixPackagingPreflight.schema, "vi-history/implementation-admission-unit-preflight@v1", "extension VSIX packaging preflight schema");
requireEqual(extensionVsixPackagingPreflight.iauId, "IAU-extension-vsix-packaging-artifact-v1", "extension VSIX packaging preflight iauId");
requireEqual(extensionVsixPackagingPreflight.status, "pass", "extension VSIX packaging preflight status");
requireEqual(extensionVsixPackagingPreflight.implementationStartAllowed, true, "extension VSIX packaging preflight implementationStartAllowed");
requireEqual(extensionVsixPackagingPreflight.parentSliceId, extensionVsixPackagingSliceId, "extension VSIX packaging preflight parentSliceId");
requireEqual(extensionVsixPackagingPreflight.implementationSharing, "none", "extension VSIX packaging preflight implementationSharing");
requireEqual(extensionVsixPackagingPreflight.vsixPackaging, "local-artifact-only", "extension VSIX packaging preflight mode");
requireEqual(extensionVsixPackagingPreflight.marketplacePublication, "out-of-scope", "extension VSIX packaging preflight marketplacePublication");
requireArrayEqual(extensionVsixPackagingPreflight.implementationStartScope, ["T009", "T010", "T011", "T012", "T013", "T014"], "extension VSIX packaging preflight implementationStartScope");
if (!Array.isArray(extensionVsixPackagingPreflight.checkResults) || extensionVsixPackagingPreflight.checkResults.length !== extensionVsixPackagingPreflight.requiredChecks.length) {
  failures.push("extension VSIX packaging preflight checkResults: must match requiredChecks length");
} else {
  for (const result of extensionVsixPackagingPreflight.checkResults) {
    requireEqual(result.status, "pass", `extension VSIX packaging preflight check result ${result.check}`);
  }
}
requireFile(`docs/requirements/admissions/${extensionVsixPackagingSliceId}/IAU-extension-vsix-packaging-artifact-v1-preflight-v1.md`);

const extensionVsixPackagingManifest = readJson(`${extensionVsixPackagingImportDir}/manifest.json`);
requireEqual(extensionVsixPackagingManifest.schema, "vi-history/requirements-import@v1", "extension VSIX packaging manifest schema");
requireEqual(extensionVsixPackagingManifest.sliceId, extensionVsixPackagingSliceId, "extension VSIX packaging sliceId");
requireEqual(extensionVsixPackagingManifest.sourceBaselineTag, "v1.3.16", "extension VSIX packaging sourceBaselineTag");
requireEqual(extensionVsixPackagingManifest.sourceCommit, "478d80eac94722411e44ef10a1fc00e39d579fdb", "extension VSIX packaging sourceCommit");
requireEqual(extensionVsixPackagingManifest.targetProduct, "vi-history", "extension VSIX packaging targetProduct");
requireEqual(extensionVsixPackagingManifest.targetFeature, extensionVsixPackagingSliceId, "extension VSIX packaging targetFeature");
requireEqual(extensionVsixPackagingManifest.specKitPath, extensionVsixPackagingFeatureDir, "extension VSIX packaging specKitPath");
requireEqual(extensionVsixPackagingManifest.redactionStatus, "pass", "extension VSIX packaging redactionStatus");
requireEqual(extensionVsixPackagingManifest.implementationSharing, "none", "extension VSIX packaging implementationSharing");
requireEqual(extensionVsixPackagingManifest.vsixPackaging, "local-artifact-only", "extension VSIX packaging manifest mode");
requireEqual(extensionVsixPackagingManifest.marketplacePublication, "out-of-scope", "extension VSIX packaging manifest marketplacePublication");
requireArrayEqual(extensionVsixPackagingManifest.importedRequirementIds, extensionVsixPackagingExpectedIds, "extension VSIX packaging importedRequirementIds");
requireArrayEqual(extensionVsixPackagingManifest.supportingTestIds, ["TEST-UNIT-VSIX-001", "TEST-UNIT-VSIX-002", "TEST-UNIT-VSIX-003", "TEST-UNIT-VSIX-004"], "extension VSIX packaging supportingTestIds");
requireEqual(extensionVsixPackagingManifest.contractName, "createExtensionVsixPackagingArtifact", "extension VSIX packaging contractName");
requireEqual(extensionVsixPackagingManifest.packageArtifact, "dist/vi-history-0.1.0.vsix", "extension VSIX packaging packageArtifact");
requireArrayEqual(extensionVsixPackagingManifest.files, ["syrs.md", "srs.md", "rtm.csv", "test-plan.md"], "extension VSIX packaging manifest files");

for (const file of extensionVsixPackagingManifest.files ?? []) {
  requireFile(`${extensionVsixPackagingImportDir}/${file}`);
}

for (const file of ["spec.md", "plan.md", "tasks.md"]) {
  requireFile(`${extensionVsixPackagingFeatureDir}/${file}`);
}

requireTextIncludes(`${extensionVsixPackagingFeatureDir}/spec.md`, [
  "Extension VSIX Packaging Artifact",
  "IAU-extension-vsix-packaging-artifact-v1",
  "dist/vi-history-0.1.0.vsix",
  "Marketplace publication"
]);
requireTextIncludes(`${extensionVsixPackagingFeatureDir}/plan.md`, [
  "@vscode/vsce",
  "local artifact only",
  "package-vsix.mjs",
  "inspect-vsix-package.mjs"
]);
requireTextIncludes(`${extensionVsixPackagingFeatureDir}/tasks.md`, [
  "T009",
  "T014",
  "T015 [BLOCKED]",
  "npm run inspect:vsix"
]);
requireTextIncludes(`${extensionVsixPackagingImportDir}/rtm.csv`, extensionVsixPackagingExpectedIds);
requireTextIncludes(`${extensionVsixPackagingImportDir}/syrs.md`, [
  "VHS-REQ-596",
  "VHS-REQ-600",
  "local/CI `.vsix` artifact only"
]);
requireTextIncludes(`${extensionVsixPackagingImportDir}/srs.md`, [
  "npm run package:vsix",
  "npm run inspect:vsix",
  "vsce publish"
]);
requireTextIncludes(`${extensionVsixPackagingImportDir}/test-plan.md`, [
  "TEST-UNIT-VSIX-001",
  "TEST-UNIT-VSIX-004",
  "git diff --check"
]);
requireTextIncludes("README.md", [
  "extension-vsix-packaging-artifact-v1",
  "IAU-extension-vsix-packaging-artifact-v1",
  "Issue #137",
  "Issue #136",
  "PR #138",
  "npm run package:vsix",
  "Marketplace publication: out of scope"
]);
requireTextIncludes("AGENTS.md", [
  "extension-vsix-packaging-artifact-v1",
  "IAU-extension-vsix-packaging-artifact-v1",
  "Issue #137",
  "Issue #136",
  "PR #138",
  "dist/vi-history-0.1.0.vsix",
  "Marketplace publication, release tokens"
]);
requireTextIncludes("docs/development/copilot-workflow.md", [
  "extension-vsix-packaging-artifact-v1",
  "IAU-extension-vsix-packaging-artifact-v1",
  "VSIX packaging outside"
]);
requireTextIncludes(".vscodeignore", [
  ".specify/**",
  "docs/requirements/**",
  "docs/decisions/**",
  "docs/governance/**",
  "tests/**",
  "scripts/**",
  "src/**",
  ".gitignore",
  "package-lock.json"
]);
requireTextIncludes("scripts/package-vsix.mjs", [
  "dist",
  "--no-dependencies"
]);
requireTextIncludes("scripts/inspect-vsix-package.mjs", [
  "extension/package.json",
  "extension/docs/requirements/",
  "extension/src/",
  "Marketplace"
]);
requireTextExcludes("package.json", [
  "vsce publish",
  "ovsx publish"
]);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Spec Kit import validation passed.");
