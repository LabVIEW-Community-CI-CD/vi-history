// @ts-nocheck
// TODO: Gradually add proper TypeScript types. This file was migrated from JavaScript.
// See ADR-003-typescript-adoption.md for the migration plan.

import fs from "node:fs/promises";
import path from "node:path";

// ============================================================================
// Type Definitions for Runtime Settings CLI
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyInput = Record<string, any>;

export const RUNTIME_SETTINGS_CLI_SETTINGS_WRITE_REQUIREMENTS = Object.freeze({
  settingsWrite: Object.freeze(["VHS-REQ-537"]),
  effectiveTarget: Object.freeze(["VHS-REQ-543"]),
  preservation: Object.freeze(["VHS-REQ-543"]),
  failClosed: Object.freeze(["VHS-REQ-543"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_READBACK_REQUIREMENTS = Object.freeze({
  effectiveTarget: Object.freeze(["VHS-REQ-543"]),
  persistedFacts: Object.freeze(["VHS-REQ-546"]),
  runtimeOutcome: Object.freeze(["VHS-REQ-546"]),
  failClosed: Object.freeze(["VHS-REQ-546"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_RUNTIME_OUTCOME_REQUIREMENTS = Object.freeze({
  suppliedSelectionFacts: Object.freeze(["VHS-REQ-546"]),
  readyMapping: Object.freeze(["VHS-REQ-546"]),
  blockedMapping: Object.freeze(["VHS-REQ-546"]),
  composition: Object.freeze(["VHS-REQ-546"]),
  failClosed: Object.freeze(["VHS-REQ-546"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_PREFLIGHT_REQUIREMENTS = Object.freeze({
  selectionFacts: Object.freeze(["VHS-REQ-532", "VHS-REQ-546"]),
  suppliedCandidates: Object.freeze(["VHS-REQ-532"]),
  mixedBitnessHostBundle: Object.freeze(["VHS-REQ-550"]),
  runtimeOutcomeComposition: Object.freeze(["VHS-REQ-546"]),
  failClosed: Object.freeze(["VHS-REQ-532", "VHS-REQ-546", "VHS-REQ-550"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_DISCOVERY_REQUIREMENTS = Object.freeze({
  selectedHostFacts: Object.freeze(["VHS-REQ-095", "VHS-REQ-096", "VHS-REQ-532"]),
  windowsRegistryViewObservations: Object.freeze(["VHS-REQ-095"]),
  linuxDocumentedRootObservations: Object.freeze(["VHS-REQ-096"]),
  hostPreflightComposition: Object.freeze(["VHS-REQ-532", "VHS-REQ-546", "VHS-REQ-550"]),
  failClosed: Object.freeze(["VHS-REQ-095", "VHS-REQ-096", "VHS-REQ-532", "VHS-REQ-546", "VHS-REQ-550"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_REQUIREMENTS = Object.freeze({
  selectedHostFacts: Object.freeze(["VHS-REQ-095", "VHS-REQ-096", "VHS-REQ-532"]),
  windowsRegistryViewObservationDependencies: Object.freeze(["VHS-REQ-095"]),
  linuxDocumentedRootObservationDependencies: Object.freeze(["VHS-REQ-096"]),
  hostDiscoveryComposition: Object.freeze(["VHS-REQ-532", "VHS-REQ-546", "VHS-REQ-550"]),
  mixedBitnessHostBundle: Object.freeze(["VHS-REQ-550"]),
  failClosed: Object.freeze(["VHS-REQ-095", "VHS-REQ-096", "VHS-REQ-532", "VHS-REQ-546", "VHS-REQ-550"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_REQUIREMENTS = Object.freeze({
  selectedHostFacts: Object.freeze(["VHS-REQ-095", "VHS-REQ-096", "VHS-REQ-532"]),
  windowsRegistryViewSourceFacts: Object.freeze(["VHS-REQ-095"]),
  linuxDocumentedRootSourceFacts: Object.freeze(["VHS-REQ-096"]),
  hostObservationComposition: Object.freeze(["VHS-REQ-532", "VHS-REQ-546", "VHS-REQ-550"]),
  mixedBitnessHostBundle: Object.freeze(["VHS-REQ-550"]),
  failClosed: Object.freeze(["VHS-REQ-095", "VHS-REQ-096", "VHS-REQ-532", "VHS-REQ-546", "VHS-REQ-550"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_ACQUISITION_REQUIREMENTS = Object.freeze({
  selectedHostFacts: Object.freeze(["VHS-REQ-095", "VHS-REQ-096", "VHS-REQ-532"]),
  windowsRegistryViewAcquisitionDependencies: Object.freeze(["VHS-REQ-095"]),
  linuxDocumentedRootAcquisitionDependencies: Object.freeze(["VHS-REQ-096"]),
  hostSourceAdapterComposition: Object.freeze(["VHS-REQ-532", "VHS-REQ-546", "VHS-REQ-550"]),
  mixedBitnessHostBundle: Object.freeze(["VHS-REQ-550"]),
  failClosed: Object.freeze(["VHS-REQ-095", "VHS-REQ-096", "VHS-REQ-532", "VHS-REQ-546", "VHS-REQ-550"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_ACQUISITION_REQUIREMENTS = Object.freeze({
  selectedHostFacts: Object.freeze(["VHS-REQ-095", "VHS-REQ-096", "VHS-REQ-532"]),
  windowsRegistryViewNativeAcquisitionDependencies: Object.freeze(["VHS-REQ-095"]),
  linuxDocumentedRootNativeAcquisitionDependencies: Object.freeze(["VHS-REQ-096"]),
  hostSourceAcquisitionComposition: Object.freeze(["VHS-REQ-532", "VHS-REQ-546", "VHS-REQ-550"]),
  mixedBitnessHostBundle: Object.freeze(["VHS-REQ-550"]),
  failClosed: Object.freeze(["VHS-REQ-095", "VHS-REQ-096", "VHS-REQ-532", "VHS-REQ-546", "VHS-REQ-550"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_PROBE_REQUIREMENTS = Object.freeze({
  selectedHostFacts: Object.freeze(["VHS-REQ-095", "VHS-REQ-096", "VHS-REQ-532"]),
  windowsRegistryViewSourceSurfaceProbe: Object.freeze(["VHS-REQ-095", "VHS-REQ-551"]),
  linuxDocumentedRootSourceSurfaceProbe: Object.freeze(["VHS-REQ-096", "VHS-REQ-551"]),
  nativeSourceAcquisitionComposition: Object.freeze(["VHS-REQ-532", "VHS-REQ-546"]),
  mixedBitnessHostBundle: Object.freeze(["VHS-REQ-550"]),
  failClosed: Object.freeze(["VHS-REQ-095", "VHS-REQ-096", "VHS-REQ-532", "VHS-REQ-546", "VHS-REQ-550", "VHS-REQ-551"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_PROOF_REQUIREMENTS = Object.freeze({
  proofArtifact: Object.freeze(["VHS-REQ-546"]),
  redaction: Object.freeze(["VHS-REQ-546"]),
  issueBody: Object.freeze(["VHS-REQ-546"]),
  failClosed: Object.freeze(["VHS-REQ-546"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_PROOF_OUT_REQUIREMENTS = Object.freeze({
  request: Object.freeze(["VHS-REQ-546"]),
  target: Object.freeze(["VHS-REQ-546"]),
  artifactFiles: Object.freeze(["VHS-REQ-546"]),
  nonInteractiveGuidance: Object.freeze(["VHS-REQ-546"]),
  failClosed: Object.freeze(["VHS-REQ-546"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_PROOF_OUT_FILE_EMISSION_REQUIREMENTS = Object.freeze({
  readyAdapter: Object.freeze(["VHS-REQ-546"]),
  directoryCreation: Object.freeze(["VHS-REQ-546"]),
  fileWrites: Object.freeze(["VHS-REQ-546"]),
  writeResults: Object.freeze(["VHS-REQ-546"]),
  failClosed: Object.freeze(["VHS-REQ-546"]),
  blockedSideEffects: Object.freeze(["VHS-REQ-546"])
});

export const RUNTIME_SETTINGS_CLI_VALIDATION_COMMAND_REQUIREMENTS = Object.freeze({
  commandContract: Object.freeze(["VHS-REQ-546"]),
  validateOnlyComposition: Object.freeze(["VHS-REQ-546"]),
  proofOutComposition: Object.freeze(["VHS-REQ-546"]),
  failClosed: Object.freeze(["VHS-REQ-546"]),
  blockedSideEffects: Object.freeze(["VHS-REQ-546"])
});

export const RUNTIME_SETTINGS_CLI_INTERACTIVE_SELECTION_REQUIREMENTS = Object.freeze({
  defaultSelection: Object.freeze(["VHS-REQ-545"]),
  currentBundle: Object.freeze(["VHS-REQ-545"]),
  guidedSelection: Object.freeze(["VHS-REQ-545"]),
  dockerBounds: Object.freeze(["VHS-REQ-545"]),
  validationHandoff: Object.freeze(["VHS-REQ-546"]),
  failClosed: Object.freeze(["VHS-REQ-545", "VHS-REQ-546"])
});

export const RUNTIME_SETTINGS_KEYS = Object.freeze({
  runtimeProvider: "viHistorySuite.runtimeProvider",
  labviewVersion: "viHistorySuite.labviewVersion",
  labviewBitness: "viHistorySuite.labviewBitness"
});

export const RUNTIME_SETTINGS_INTERACTIVE_DEFAULT_SELECTION = Object.freeze({
  runtimeProvider: "host-native",
  platform: "windows",
  labviewVersion: "2026",
  labviewBitness: "x86"
});

export const RUNTIME_SETTINGS_BLOCKED_SIDE_EFFECTS = Object.freeze({
  runtimeValidation: false,
  compareExecution: false,
  labviewCli: false,
  docker: false,
  liveSessionProof: false,
  packaging: false,
  marketplace: false
});

export const RUNTIME_SETTINGS_VALIDATION_BLOCKED_SIDE_EFFECTS = Object.freeze({
  settingsMutation: false,
  interactiveSelection: false,
  proofOut: false,
  picker: false,
  runtimeValidation: false,
  compareExecution: false,
  labviewCli: false,
  docker: false,
  liveSessionProof: false,
  packaging: false,
  marketplace: false
});

export const RUNTIME_SETTINGS_VALIDATION_RUNTIME_OUTCOME_BLOCKED_SIDE_EFFECTS = Object.freeze({
  settingsMutation: false,
  interactiveSelection: false,
  proofOut: false,
  fileSystemWrites: false,
  osInspection: false,
  runtimeLocator: false,
  runtimeValidation: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  liveTerminalProof: false,
  packageBinPublication: false,
  launcherProfileMutation: false,
  releaseAutomation: false,
  marketplace: false,
  sourceCopying: false
});

export const RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_PREFLIGHT_BLOCKED_SIDE_EFFECTS = Object.freeze({
  settingsMutation: false,
  interactiveSelection: false,
  proofOut: false,
  fileSystemReads: false,
  fileSystemWrites: false,
  osInspection: false,
  filesystemWalking: false,
  registryProbe: false,
  pathProbe: false,
  environmentProbe: false,
  privatePathDiscovery: false,
  runtimeLocator: false,
  runtimeValidation: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  rawTerminalProcessWiring: false,
  liveTerminalProof: false,
  packageBinPublication: false,
  launcherProfileMutation: false,
  releaseAutomation: false,
  marketplace: false,
  sourceCopying: false
});

export const RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_DISCOVERY_BLOCKED_SIDE_EFFECTS = Object.freeze({
  settingsMutation: false,
  interactiveSelection: false,
  proofOut: false,
  fileSystemReads: false,
  fileSystemWrites: false,
  rawPrivatePathDisclosure: false,
  arbitraryFilesystemWalking: false,
  filesystemWalking: false,
  registryProbe: false,
  pathProbe: false,
  environmentProbe: false,
  privatePathDiscovery: false,
  runtimeLocator: false,
  compareRuntimeLocator: false,
  runtimeValidation: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  rawTerminalProcessWiring: false,
  liveTerminalProof: false,
  packageBinPublication: false,
  launcherProfileMutation: false,
  releaseAutomation: false,
  marketplace: false,
  sourceCopying: false
});

export const RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_BLOCKED_SIDE_EFFECTS = Object.freeze({
  settingsMutation: false,
  interactiveSelection: false,
  proofOut: false,
  proofOutExpansion: false,
  fileSystemReads: false,
  fileSystemWrites: false,
  rawPrivatePathDisclosure: false,
  privatePathDisclosure: false,
  rawRegistryOutputRetention: false,
  arbitraryFilesystemWalking: false,
  filesystemWalking: false,
  registryProbe: false,
  pathProbe: false,
  environmentProbe: false,
  privatePathDiscovery: false,
  runtimeLocator: false,
  compareRuntimeLocator: false,
  runtimeValidation: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  rawTerminalProcessWiring: false,
  liveTerminalProof: false,
  packageBinPublication: false,
  launcherProfileMutation: false,
  releaseAutomation: false,
  marketplace: false,
  sourceCopying: false
});

export const RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_BLOCKED_SIDE_EFFECTS = Object.freeze({
  settingsMutation: false,
  interactiveSelection: false,
  proofOut: false,
  proofOutExpansion: false,
  fileSystemReads: false,
  fileSystemWrites: false,
  rawPrivatePathDisclosure: false,
  privatePathDisclosure: false,
  rawRegistryOutputRetention: false,
  arbitraryFilesystemWalking: false,
  filesystemWalking: false,
  registryProbe: false,
  pathProbe: false,
  environmentProbe: false,
  privatePathDiscovery: false,
  runtimeLocator: false,
  compareRuntimeLocator: false,
  runtimeValidation: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  rawTerminalProcessWiring: false,
  liveTerminalProof: false,
  packageBinPublication: false,
  vsixPackagingChanges: false,
  launcherProfileMutation: false,
  releaseAutomation: false,
  marketplace: false,
  sourceCopying: false
});

export const RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_ACQUISITION_BLOCKED_SIDE_EFFECTS = Object.freeze({
  settingsMutation: false,
  interactiveSelection: false,
  proofOut: false,
  proofOutExpansion: false,
  fileSystemReads: false,
  fileSystemWrites: false,
  rawPrivatePathDisclosure: false,
  privatePathDisclosure: false,
  rawRegistryOutputRetention: false,
  arbitraryFilesystemWalking: false,
  filesystemWalking: false,
  registryProbe: false,
  pathProbe: false,
  environmentProbe: false,
  privatePathDiscovery: false,
  runtimeLocator: false,
  compareRuntimeLocator: false,
  runtimeValidation: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  dockerSourceDiscovery: false,
  rawTerminalProcessWiring: false,
  liveTerminalProof: false,
  packageBinPublication: false,
  vsixPackagingChanges: false,
  launcherProfileMutation: false,
  releaseAutomation: false,
  marketplace: false,
  sourceCopying: false
});

export const RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_ACQUISITION_BLOCKED_SIDE_EFFECTS = Object.freeze({
  settingsMutation: false,
  interactiveSelection: false,
  proofOut: false,
  proofOutExpansion: false,
  fileSystemReads: false,
  fileSystemWrites: false,
  rawPrivatePathDisclosure: false,
  privatePathDisclosure: false,
  rawRegistryOutputRetention: false,
  arbitraryFilesystemWalking: false,
  filesystemWalking: false,
  registryProbe: false,
  pathProbe: false,
  environmentProbe: false,
  privatePathDiscovery: false,
  runtimeLocator: false,
  compareRuntimeLocator: false,
  runtimeValidation: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  dockerImageInspection: false,
  dockerSourceDiscovery: false,
  rawTerminalProcessWiring: false,
  liveTerminalProof: false,
  packageBinPublication: false,
  vsixPackagingChanges: false,
  launcherProfileMutation: false,
  releaseAutomation: false,
  marketplace: false,
  sourceCopying: false
});

export const RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_PROBE_BLOCKED_SIDE_EFFECTS = Object.freeze({
  settingsMutation: false,
  interactiveSelection: false,
  proofOut: false,
  proofOutExpansion: false,
  fileSystemReads: false,
  fileSystemWrites: false,
  rawPrivatePathDisclosure: false,
  privatePathDisclosure: false,
  rawRegistryOutputRetention: false,
  arbitraryFilesystemWalking: false,
  filesystemWalking: false,
  registryProbe: false,
  pathProbe: false,
  environmentProbe: false,
  privatePathDiscovery: false,
  runtimeLocator: false,
  compareRuntimeLocator: false,
  runtimeValidation: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  dockerImageInspection: false,
  dockerSourceDiscovery: false,
  rawTerminalProcessWiring: false,
  liveTerminalProof: false,
  packageBinPublication: false,
  vsixPackagingChanges: false,
  launcherProfileMutation: false,
  releaseAutomation: false,
  marketplace: false,
  sourceCopying: false
});

export const RUNTIME_SETTINGS_VALIDATION_PROOF_BLOCKED_SIDE_EFFECTS = Object.freeze({
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

export const RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_BLOCKED_SIDE_EFFECTS = Object.freeze({
  settingsMutation: false,
  interactiveSelection: false,
  runtimeValidation: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  liveTerminalProof: false,
  packageBinPublication: false,
  launcherProfileMutation: false,
  marketplace: false,
  sourceCopying: false,
  fileSystemWrites: false
});

export const RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_FILE_EMISSION_BLOCKED_SIDE_EFFECTS = Object.freeze({
  settingsMutation: false,
  interactiveSelection: false,
  runtimeValidation: false,
  validationFactGeneration: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  liveTerminalProof: false,
  packageBinPublication: false,
  launcherProfileMutation: false,
  marketplace: false,
  sourceCopying: false,
  extraFileSystemWrites: false
});

export const RUNTIME_SETTINGS_VALIDATION_COMMAND_BLOCKED_SIDE_EFFECTS = Object.freeze({
  fileSystemWrites: false,
  proofOutFileEmission: false,
  osInspection: false,
  runtimeLocator: false,
  privatePathDiscovery: false,
  runtimeValidation: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  rawTerminalProcessWiring: false,
  liveTerminalProof: false,
  packageBinPublication: false,
  launcherProfileMutation: false,
  releaseAutomation: false,
  marketplace: false,
  sourceCopying: false,
  validatePlanOnly: false
});

export const RUNTIME_SETTINGS_INTERACTIVE_SELECTION_BLOCKED_SIDE_EFFECTS = Object.freeze({
  terminalPromptLoop: false,
  stdinHandling: false,
  settingsMutation: false,
  proofOut: false,
  runtimeValidation: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  liveSessionProof: false,
  packaging: false,
  marketplace: false
});

export const RUNTIME_SETTINGS_CLI_TERMINAL_ENTRYPOINT_REQUIREMENTS = Object.freeze({
  materializationFacts: Object.freeze(["VHS-REQ-537"]),
  admissionScope: Object.freeze(["VHS-REQ-537"]),
  runtimeLookup: Object.freeze(["VHS-REQ-544"]),
  failClosed: Object.freeze(["VHS-REQ-544"]),
  discoverability: Object.freeze(["VHS-REQ-545"]),
  validationHandoff: Object.freeze(["VHS-REQ-546"])
});

export const RUNTIME_SETTINGS_CLI_TERMINAL_PROMPT_LOOP_REQUIREMENTS = Object.freeze({
  promptTranscript: Object.freeze(["VHS-REQ-545"]),
  confirmation: Object.freeze(["VHS-REQ-545", "VHS-REQ-546"]),
  guidedHostSelection: Object.freeze(["VHS-REQ-545"]),
  dockerBounds: Object.freeze(["VHS-REQ-545"]),
  validationHandoff: Object.freeze(["VHS-REQ-546"]),
  failClosed: Object.freeze(["VHS-REQ-545", "VHS-REQ-546"])
});

export const RUNTIME_SETTINGS_CLI_TERMINAL_IO_ADAPTER_REQUIREMENTS = Object.freeze({
  enterConfirmation: Object.freeze(["VHS-REQ-545", "VHS-REQ-546"]),
  guidedHostSelection: Object.freeze(["VHS-REQ-545"]),
  dockerImageFamily: Object.freeze(["VHS-REQ-545"]),
  nonInteractiveGuidance: Object.freeze(["VHS-REQ-545"]),
  failClosed: Object.freeze(["VHS-REQ-545"]),
  validationHandoff: Object.freeze(["VHS-REQ-546"])
});

export const RUNTIME_SETTINGS_TERMINAL_ENTRYPOINT_BLOCKED_SIDE_EFFECTS = Object.freeze({
  terminalPromptLoop: false,
  stdinHandling: false,
  runtimeExecution: false,
  profileEditing: false,
  adminElevation: false,
  machineWideInstall: false,
  settingsMutation: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  liveSessionProof: false,
  packaging: false,
  marketplace: false
});

export const RUNTIME_SETTINGS_TERMINAL_PROMPT_LOOP_BLOCKED_SIDE_EFFECTS = Object.freeze({
  stdinHandling: false,
  rawTerminalIo: false,
  spawnedTerminalIo: false,
  settingsMutation: false,
  runtimeValidation: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  proofOut: false,
  liveSessionProof: false,
  packaging: false,
  marketplace: false
});

export const RUNTIME_SETTINGS_TERMINAL_IO_ADAPTER_BLOCKED_SIDE_EFFECTS = Object.freeze({
  rawTerminalIo: false,
  spawnedTerminalIo: false,
  settingsMutation: false,
  runtimeValidation: false,
  runtimeExecution: false,
  compareExecution: false,
  labviewCli: false,
  dockerExecution: false,
  dockerOrchestration: false,
  proofOut: false,
  liveSessionProof: false,
  packageBinPublication: false,
  launcherProfileMutation: false,
  marketplace: false,
  sourceCopying: false
});

const RUNTIME_SETTINGS_VALIDATION_PROOF_SCHEMA = "vi-history/runtime-settings-validation-proof@v1";
const RUNTIME_SETTINGS_VALIDATION_PROOF_COMMAND = "vihs --validate --proof-out";
const RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_COMMAND = "vihs --validate --proof-out";
const RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_PROOF_FILE = "vihs-validation-proof.json";
const RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_ISSUE_FILE = "vihs-validation-issue.md";
const RUNTIME_SETTINGS_INTERACTIVE_SELECTION_COMMAND = "vihs";
const RUNTIME_SETTINGS_VALIDATION_COMMAND = "vihs --validate";
const MIT_PUBLIC_AUTHORITY = "svelderrainruiz/vi-history";
const TERMINAL_ENTRYPOINT_COMMAND = "vihs";
const TERMINAL_ENTRYPOINT_ADMISSION_SCOPE = "user";
const TERMINAL_ENTRYPOINT_RECOVERY_COMMAND = "labviewViHistory.prepareLocalRuntimeSettingsCli";
const TERMINAL_ENTRYPOINT_RECOVERY_INSTRUCTION =
  `Run the VS Code command ${TERMINAL_ENTRYPOINT_RECOVERY_COMMAND} to restore the local runtime settings CLI launcher.`;
const TERMINAL_ENTRYPOINT_RUNTIME_LOOKUP_ORDER_WINDOWS = Object.freeze(["vscode-runtime", "global-node", "explicit-override"]);
const TERMINAL_ENTRYPOINT_RUNTIME_LOOKUP_ORDER_OTHER = Object.freeze(["global-node", "explicit-override"]);

export function allRuntimeSettingsCliSettingsWriteRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_SETTINGS_WRITE_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationReadbackRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_READBACK_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationRuntimeOutcomeRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_RUNTIME_OUTCOME_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationHostRuntimePreflightRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_PREFLIGHT_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationHostRuntimeDiscoveryRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_DISCOVERY_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationHostRuntimeObservationRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationHostRuntimeObservationSourceRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationHostRuntimeObservationSourceAcquisitionRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_ACQUISITION_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationHostRuntimeObservationNativeSourceAcquisitionRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_ACQUISITION_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationHostRuntimeObservationNativeSourceProbeRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_PROBE_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationProofRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_PROOF_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationProofOutRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_PROOF_OUT_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationProofOutFileEmissionRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_PROOF_OUT_FILE_EMISSION_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliValidationCommandRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_VALIDATION_COMMAND_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliInteractiveSelectionRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_INTERACTIVE_SELECTION_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliTerminalEntrypointRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_TERMINAL_ENTRYPOINT_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliTerminalPromptLoopRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_TERMINAL_PROMPT_LOOP_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliTerminalIoAdapterRequirementIds() {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_TERMINAL_IO_ADAPTER_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function createRuntimeSettingsTerminalEntrypoint(input: AnyInput = {}) {
  const terminalSession = normalizeTerminalSession(input.terminalSession);
  if (!terminalSession.admitted) {
    return terminalEntrypointBlockedResult({
      blockedReason: "unsupported-terminal-session",
      terminalSession
    });
  }

  const launcherState = normalizeLauncherState(input.launcher?.launcherState ?? input.launcherState);

  if (launcherState === "missing" || launcherState === "stale") {
    return terminalEntrypointBlockedResult({
      blockedReason: launcherState === "missing" ? "launcher-missing" : "launcher-stale",
      terminalSession
    });
  }

  const platform = normalizePlatform(input.platform ?? "windows");
  const runtimeLookupFacts = resolveRuntimeLookupFacts(input.runtimeLookup ?? {}, platform);
  const discoverability = createDiscoverabilityFacts(input.currentBundle ?? input.bundle ?? null, platform);

  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-terminal-entrypoint-contract",
    command: TERMINAL_ENTRYPOINT_COMMAND,
    admissionScope: TERMINAL_ENTRYPOINT_ADMISSION_SCOPE,
    materializationState: "materialized",
    terminalSession,
    runtimeLookup: runtimeLookupFacts,
    recoveryInstruction: null,
    discoverability,
    validationHandoff: createTerminalValidationHandoff(),
    blockedSideEffects: RUNTIME_SETTINGS_TERMINAL_ENTRYPOINT_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliTerminalEntrypointRequirementIds()
  });
}

export function createRuntimeSettingsTerminalPromptLoop(input: AnyInput = {}) {
  const entrypoint = input.entrypoint ?? input.terminalEntrypoint ?? createRuntimeSettingsTerminalEntrypoint(input);
  if (!entrypoint || entrypoint.status !== "ready") {
    return terminalPromptLoopBlockedResult({
      blockedReason: entrypoint?.blockedReason ?? "terminal-entrypoint-not-ready",
      entrypoint: entrypoint ?? null
    });
  }

  const currentSelection = normalizePromptLoopCurrentSelection(
    input.currentSelection ?? input.currentBundle ?? entrypoint.discoverability?.currentBundle,
    entrypoint.runtimeLookup?.platform ?? input.platform ?? "windows"
  );
  const selectionContract = createRuntimeSettingsInteractiveSelection({
    settings: input.settings ?? settingsFromSelection(currentSelection) ?? {},
    platform: input.platform ?? currentSelection?.platform ?? entrypoint.runtimeLookup?.platform,
    requestedSelection: input.requestedSelection ?? input.selection,
    availableHostInstallations: input.availableHostInstallations ?? input.hostInstallations ?? [],
    confirmation: input.confirmation ?? input.confirm
  });

  if (selectionContract.status !== "ready") {
    return terminalPromptLoopBlockedResult({
      blockedReason: selectionContract.blockedReason,
      entrypoint,
      currentSelection,
      selectionContract
    });
  }

  const selectedBundle = selectionContract.selection;
  const promptMode = input.interactive === false ? "non-interactive" : "interactive";
  const validationHandoff = createPromptLoopValidationHandoff(selectionContract.validationHandoff);

  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-terminal-prompt-loop-contract",
    command: RUNTIME_SETTINGS_INTERACTIVE_SELECTION_COMMAND,
    promptMode,
    entrypoint,
    currentSelection: currentSelection ?? selectedBundle,
    selectedBundle,
    confirmation: {
      accepted: validationHandoff.requested,
      mode: validationHandoff.requested ? "enter-through" : "pending"
    },
    options: selectionContract.options,
    guidance: selectionContract.guidance,
    transcript: createPromptLoopTranscript({
      currentSelection: currentSelection ?? selectedBundle,
      promptMode
    }),
    validationHandoff,
    blockedSideEffects: RUNTIME_SETTINGS_TERMINAL_PROMPT_LOOP_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliTerminalPromptLoopRequirementIds()
  });
}

export function createRuntimeSettingsTerminalIoAdapter(input: AnyInput = {}) {
  const terminalSession = normalizeTerminalIoSession(input.terminalSession ?? input.session ?? {});
  if (!terminalSession.admitted) {
    return terminalIoAdapterBlockedResult({
      blockedReason: terminalSession.blockedReason,
      terminalSession
    });
  }

  const terminalInput = terminalSession.interactive === false
    ? {
      ok: true,
      value: freezeRecord({
        kind: "non-interactive-guidance",
        confirmation: false,
        requestedSelection: null
      })
    }
    : normalizeTerminalInput(input.terminalInput ?? input.input ?? input.promptInput);
  if (!terminalInput.ok) {
    return terminalIoAdapterBlockedResult({
      blockedReason: (terminalInput as any).blockedReason,
      terminalSession,
      terminalInput: terminalInput.value
    });
  }

  if (terminalInput.value.kind === "cancel" || terminalInput.value.kind === "eof") {
    return terminalIoAdapterBlockedResult({
      blockedReason: terminalInput.value.kind === "cancel" ? "terminal-input-cancelled" : "terminal-input-eof",
      terminalSession,
      terminalInput: terminalInput.value
    });
  }

  const promptLoop = createRuntimeSettingsTerminalPromptLoop({
    ...input,
    interactive: terminalSession.interactive,
    confirmation: terminalInput.value.confirmation,
    requestedSelection: terminalInput.value.requestedSelection ?? input.requestedSelection ?? input.selection
  });

  if (promptLoop.status !== "ready") {
    return terminalIoAdapterBlockedResult({
      blockedReason: promptLoop.blockedReason,
      terminalSession,
      terminalInput: terminalInput.value,
      promptLoop
    });
  }

  const nonInteractive = terminalSession.interactive === false;
  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-terminal-io-adapter-contract",
    command: RUNTIME_SETTINGS_INTERACTIVE_SELECTION_COMMAND,
    mode: nonInteractive ? "non-interactive-guidance" : "interactive",
    terminalSession,
    terminalInput: terminalInput.value,
    promptLoop,
    transcript: promptLoop.transcript,
    transcriptLines: promptLoop.transcript.map((step: any) => step.text),
    copyableGuidance: promptLoop.guidance?.copyableNextCommands ?? promptLoop.entrypoint?.discoverability?.copyableNextCommands ?? [],
    promptWait: !nonInteractive,
    selectedBundle: promptLoop.selectedBundle,
    validationHandoff: promptLoop.validationHandoff,
    blockedSideEffects: RUNTIME_SETTINGS_TERMINAL_IO_ADAPTER_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliTerminalIoAdapterRequirementIds()
  });
}

export function writeRuntimeSettingsFacts(input: AnyInput = {}) {
  const effectiveSettingsTarget = normalizeEffectiveSettingsTarget(
    input.effectiveSettingsTarget ?? input.target ?? "user"
  );
  if (!effectiveSettingsTarget) {
    return blockedResult({
      blockedReason: "unsupported-effective-settings-target",
      effectiveSettingsTarget: null
    });
  }

  const settings = parseSettingsContent(input.settingsContent ?? input.settings ?? {});
  if (!settings.ok) {
    return blockedResult({
      blockedReason: settings.blockedReason,
      effectiveSettingsTarget
    });
  }

  const facts = normalizeRuntimeSettingsFacts(input.runtimeFacts ?? input);
  if (!facts.ok) {
    return blockedResult({
      blockedReason: facts.blockedReason,
      effectiveSettingsTarget
    });
  }

  const nextSettings = {
    ...settings.value,
    [RUNTIME_SETTINGS_KEYS.runtimeProvider]: facts.value!.runtimeProvider,
    [RUNTIME_SETTINGS_KEYS.labviewVersion]: facts.value!.labviewVersion,
    [RUNTIME_SETTINGS_KEYS.labviewBitness]: facts.value!.labviewBitness
  };

  return Object.freeze({
    status: "updated",
    type: "runtime-settings-cli-settings-write-contract",
    effectiveSettingsTarget,
    settings: Object.freeze(nextSettings),
    content: `${JSON.stringify(nextSettings, null, 2)}\n`,
    updatedKeys: Object.freeze(Object.values(RUNTIME_SETTINGS_KEYS)),
    blockedSideEffects: RUNTIME_SETTINGS_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliSettingsWriteRequirementIds()
  });
}

export function readRuntimeSettingsValidation(input: AnyInput = {}) {
  const effectiveSettingsTarget = normalizeEffectiveSettingsTarget(
    input.effectiveSettingsTarget ?? input.target ?? "user"
  );
  if (!effectiveSettingsTarget) {
    return validationBlockedResult({
      blockedReason: "unsupported-effective-settings-target",
      runtimeErrorCode: "VIHS_E_UNSUPPORTED_EFFECTIVE_SETTINGS_TARGET",
      effectiveSettingsTarget: null
    });
  }

  const settings = parseSettingsContent(input.settingsContent ?? input.settings ?? {});
  if (!settings.ok) {
    return validationBlockedResult({
      blockedReason: settings.blockedReason,
      runtimeErrorCode: runtimeErrorCodeForSettingsFailure(settings.blockedReason),
      effectiveSettingsTarget
    });
  }

  const persistedFacts = readPersistedRuntimeSettingsFacts(settings.value);
  if (!persistedFacts.ok) {
    return validationBlockedResult({
      blockedReason: persistedFacts.blockedReason,
      runtimeErrorCode: "VIHS_E_MISSING_PERSISTED_RUNTIME_SETTINGS",
      effectiveSettingsTarget
    });
  }

  const runtimeOutcome = normalizeRuntimeOutcome(input.runtimeOutcome ?? input.runtime);
  if (!runtimeOutcome.ok) {
    return validationBlockedResult({
      blockedReason: runtimeOutcome.blockedReason,
      runtimeErrorCode: "VIHS_E_MISSING_RUNTIME_OUTCOME_FACTS",
      effectiveSettingsTarget,
      persistedSettings: persistedFacts.value
    });
  }

  return Object.freeze({
    status: runtimeOutcome.value!.runtimeValidationOutcome,
    type: "runtime-settings-cli-validation-readback-contract",
    effectiveSettingsTarget,
    persistedSettings: persistedFacts.value,
    runtime: runtimeOutcome.value,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationReadbackRequirementIds()
  });
}

export function createRuntimeSettingsValidationRuntimeOutcome(input: AnyInput = {}) {
  const selection = normalizeRuntimeSelectionFacts(
    input.runtimeSelection
      ?? input.selection
      ?? input.runtimeFacts
      ?? input.runtime
      ?? input
  );

  if (!selection.ok) {
    return runtimeOutcomeContractResult({
      status: "blocked",
      blockedReason: selection.blockedReason,
      runtimeOutcome: createBlockedRuntimeOutcome({
        blockedReason: selection.blockedReason,
        runtimeErrorCode: runtimeErrorCodeForRuntimeBlockedReason(selection.blockedReason)
      })
    });
  }

  const runtimeBlockedReason = selection.value.runtimeBlockedReason;
  const ready = selection.value.runtimeProvider !== "unavailable" && !runtimeBlockedReason;
  const runtimeOutcome = freezeRecord({
    runtimeValidationOutcome: ready ? "ready" : "blocked",
    runtimeProvider: ready ? selection.value.runtimeProvider : "unavailable",
    runtimeEngine: ready ? selection.value.runtimeEngine : null,
    runtimeBlockedReason: ready ? null : (runtimeBlockedReason ?? "runtime-validation-blocked"),
    runtimeErrorCode: ready ? "VIHS_OK" : runtimeErrorCodeForRuntimeBlockedReason(runtimeBlockedReason),
    runtimeProofStatus: ready ? "ready" : "blocked-with-actionable-error",
    runtimeImplementationStatus: ready ? "implemented" : runtimeImplementationStatusForBlockedReason(runtimeBlockedReason)
  });

  return runtimeOutcomeContractResult({
    status: runtimeOutcome.runtimeValidationOutcome,
    blockedReason: runtimeOutcome.runtimeBlockedReason,
    runtimeSelection: selection.value,
    runtimeOutcome
  });
}

export function createRuntimeSettingsValidationHostRuntimePreflight(input: AnyInput = {}) {
  const selection = normalizeHostRuntimePreflightSelection(input);
  if (!selection.ok) {
    return hostRuntimePreflightBlockedResult({
      blockedReason: selection.blockedReason,
      selection: selection.value ?? null
    });
  }

  if (selection.value.runtimeProvider !== "host-native") {
    return hostRuntimePreflightBlockedResult({
      blockedReason: "unsupported-runtime-provider",
      selection: selection.value
    });
  }

  const candidateSet = normalizeHostRuntimePreflightCandidates(input);
  if (!candidateSet.ok) {
    return hostRuntimePreflightBlockedResult({
      blockedReason: candidateSet.blockedReason,
      selection: selection.value,
      hostCandidateCount: candidateSet.count ?? 0
    });
  }

  const analyses = candidateSet.value.map((candidate: any) => analyzeHostRuntimePreflightCandidate(candidate, selection.value));
  const compatible = analyses.filter((analysis: any) => analysis.compatible);

  if (compatible.length === 0) {
    return hostRuntimePreflightBlockedResult({
      blockedReason: selectHostRuntimePreflightBlockedReason(analyses),
      selection: selection.value,
      hostCandidateCount: candidateSet.value.length,
      compatibleHostCandidateCount: 0
    });
  }

  if (compatible.length > 1) {
    return hostRuntimePreflightBlockedResult({
      blockedReason: "ambiguous-host-runtime-candidate",
      selection: selection.value,
      hostCandidateCount: candidateSet.value.length,
      compatibleHostCandidateCount: compatible.length
    });
  }

  const selectedHostCandidate = compatible[0].candidate;
  const runtimeSelection = createHostRuntimePreflightRuntimeSelection(selection.value);

  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-validation-host-runtime-preflight-contract",
    preflightBoundary: "supplied-public-safe-host-candidate-facts-only",
    selection: selection.value,
    hostCandidateCount: candidateSet.value.length,
    compatibleHostCandidateCount: compatible.length,
    selectedHostCandidate,
    mixedBitnessAccepted: selectedHostCandidate.labviewExecutable.bitness !== selectedHostCandidate.labviewCli.bitness,
    runtimeSelection,
    blockedReason: null,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_PREFLIGHT_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimePreflightRequirementIds()
  });
}

export function createRuntimeSettingsValidationHostRuntimeDiscovery(input: AnyInput = {}) {
  const selection = normalizeHostRuntimePreflightSelection(input);
  if (!selection.ok) {
    return hostRuntimeDiscoveryBlockedResult({
      blockedReason: selection.blockedReason,
      selection: selection.value ?? null
    });
  }

  if (selection.value.runtimeProvider !== "host-native") {
    return hostRuntimeDiscoveryBlockedResult({
      blockedReason: "unsupported-runtime-provider",
      selection: selection.value
    });
  }

  if (selection.value.platform === "macos") {
    return hostRuntimeDiscoveryBlockedResult({
      blockedReason: "macos-host-runtime-discovery-unavailable",
      selection: selection.value
    });
  }

  if (!["windows", "linux"].includes(selection.value.platform)) {
    return hostRuntimeDiscoveryBlockedResult({
      blockedReason: "unsupported-host-platform",
      selection: selection.value
    });
  }

  if (!isSupportedHostYear(selection.value.labviewVersion)) {
    return hostRuntimeDiscoveryBlockedResult({
      blockedReason: "unsupported-host-year",
      selection: selection.value
    });
  }

  const observations = normalizeHostRuntimeDiscoveryObservations(input, selection.value);
  if (!observations.ok) {
    return hostRuntimeDiscoveryBlockedResult({
      blockedReason: observations.blockedReason,
      selection: selection.value,
      hostCandidates: observations.hostCandidates ?? []
    });
  }

  const preflight = createRuntimeSettingsValidationHostRuntimePreflight({
    selection: selection.value,
    hostCandidates: observations.value
  });

  if (preflight.status !== "ready") {
    return hostRuntimeDiscoveryBlockedResult({
      blockedReason: preflight.blockedReason,
      selection: selection.value,
      hostCandidates: observations.value,
      preflight
    });
  }

  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-validation-host-runtime-discovery-contract",
    discoveryBoundary: "bounded-public-safe-discovery-facts-only",
    selection: selection.value,
    observationCount: observations.value.length,
    hostCandidates: observations.value,
    hostCandidateCount: observations.value.length,
    compatibleHostCandidateCount: preflight.compatibleHostCandidateCount,
    preflight,
    runtimeSelection: preflight.runtimeSelection,
    blockedReason: null,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_DISCOVERY_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimeDiscoveryRequirementIds()
  });
}

export function createRuntimeSettingsValidationHostRuntimeObservation(input: AnyInput = {}) {
  const selection = normalizeHostRuntimePreflightSelection(input);
  if (!selection.ok) {
    return hostRuntimeObservationBlockedResult({
      blockedReason: selection.blockedReason,
      selection: selection.value ?? null
    });
  }

  if (selection.value.runtimeProvider !== "host-native") {
    return hostRuntimeObservationBlockedResult({
      blockedReason: "unsupported-runtime-provider",
      selection: selection.value
    });
  }

  if (selection.value.platform === "macos") {
    return hostRuntimeObservationBlockedResult({
      blockedReason: "macos-host-runtime-observation-unavailable",
      selection: selection.value
    });
  }

  if (!["windows", "linux"].includes(selection.value.platform)) {
    return hostRuntimeObservationBlockedResult({
      blockedReason: "unsupported-host-platform",
      selection: selection.value
    });
  }

  if (!isSupportedHostYear(selection.value.labviewVersion)) {
    return hostRuntimeObservationBlockedResult({
      blockedReason: "unsupported-host-year",
      selection: selection.value
    });
  }

  const observations = normalizeHostRuntimeObservationDependencies(input, selection.value);
  if (!observations.ok) {
    return hostRuntimeObservationBlockedResult({
      blockedReason: observations.blockedReason,
      selection: selection.value,
      discoveryObservations: observations.value ?? []
    });
  }

  const discovery = createRuntimeSettingsValidationHostRuntimeDiscovery({
    selection: selection.value,
    discoveryObservations: observations.value
  });

  if (discovery.status !== "ready") {
    return hostRuntimeObservationBlockedResult({
      blockedReason: discovery.blockedReason,
      selection: selection.value,
      discoveryObservations: observations.value,
      discovery
    });
  }

  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-validation-host-runtime-observation-adapter-contract",
    observationBoundary: "bounded-public-safe-observation-facts-only",
    selection: selection.value,
    observationCount: observations.value.length,
    discoveryObservations: observations.value,
    hostDiscoveryObservations: observations.value,
    discovery,
    preflight: discovery.preflight,
    hostCandidates: discovery.hostCandidates,
    hostCandidateCount: discovery.hostCandidateCount,
    compatibleHostCandidateCount: discovery.compatibleHostCandidateCount,
    runtimeSelection: discovery.runtimeSelection,
    blockedReason: null,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimeObservationRequirementIds()
  });
}

export function createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter(input: AnyInput = {}) {
  const selection = normalizeHostRuntimePreflightSelection(input);
  if (!selection.ok) {
    return hostRuntimeObservationSourceBlockedResult({
      blockedReason: selection.blockedReason,
      selection: selection.value ?? null
    });
  }

  if (selection.value.runtimeProvider !== "host-native") {
    return hostRuntimeObservationSourceBlockedResult({
      blockedReason: "unsupported-runtime-provider",
      selection: selection.value
    });
  }

  if (selection.value.platform === "macos") {
    return hostRuntimeObservationSourceBlockedResult({
      blockedReason: "macos-host-runtime-observation-source-unavailable",
      selection: selection.value
    });
  }

  if (!["windows", "linux"].includes(selection.value.platform)) {
    return hostRuntimeObservationSourceBlockedResult({
      blockedReason: "unsupported-host-platform",
      selection: selection.value
    });
  }

  if (!isSupportedHostYear(selection.value.labviewVersion)) {
    return hostRuntimeObservationSourceBlockedResult({
      blockedReason: "unsupported-host-year",
      selection: selection.value
    });
  }

  const sourceFacts = normalizeHostRuntimeObservationSourceFacts(input, selection.value);
  if (!sourceFacts.ok) {
    return hostRuntimeObservationSourceBlockedResult({
      blockedReason: sourceFacts.blockedReason,
      selection: selection.value,
      sourceFacts: sourceFacts.value ?? [],
      observationDependencyFacts: sourceFacts.observationDependencyFacts ?? []
    });
  }

  const observationDependencies = createObservationDependenciesFromSourceFacts(sourceFacts.value);
  const observation = createRuntimeSettingsValidationHostRuntimeObservation({
    selection: selection.value,
    observationDependencies
  });

  if (observation.status !== "ready") {
    return hostRuntimeObservationSourceBlockedResult({
      blockedReason: observation.blockedReason,
      selection: selection.value,
      sourceFacts: sourceFacts.value,
      observationDependencyFacts: sourceFacts.value,
      observation
    });
  }

  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-validation-host-runtime-observation-source-adapter-contract",
    sourceAdapterBoundary: "bounded-public-safe-observation-source-facts-only",
    selection: selection.value,
    sourceCount: sourceFacts.value.length,
    sourceFacts: sourceFacts.value,
    observationDependencyFacts: sourceFacts.value,
    observationDependencies,
    observation,
    discovery: observation.discovery,
    preflight: observation.preflight,
    hostCandidates: observation.hostCandidates,
    hostCandidateCount: observation.hostCandidateCount,
    compatibleHostCandidateCount: observation.compatibleHostCandidateCount,
    runtimeSelection: observation.runtimeSelection,
    blockedReason: null,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimeObservationSourceRequirementIds()
  });
}

export function createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition(input: AnyInput = {}) {
  const selection = normalizeHostRuntimePreflightSelection(input);
  if (!selection.ok) {
    return hostRuntimeObservationSourceAcquisitionBlockedResult({
      blockedReason: selection.blockedReason,
      selection: selection.value ?? null
    });
  }

  if (selection.value.runtimeProvider !== "host-native") {
    return hostRuntimeObservationSourceAcquisitionBlockedResult({
      blockedReason: "unsupported-runtime-provider",
      selection: selection.value
    });
  }

  if (selection.value.platform === "macos") {
    return hostRuntimeObservationSourceAcquisitionBlockedResult({
      blockedReason: "macos-host-runtime-observation-source-acquisition-unavailable",
      selection: selection.value
    });
  }

  if (!["windows", "linux"].includes(selection.value.platform)) {
    return hostRuntimeObservationSourceAcquisitionBlockedResult({
      blockedReason: "unsupported-host-platform",
      selection: selection.value
    });
  }

  if (!isSupportedHostYear(selection.value.labviewVersion)) {
    return hostRuntimeObservationSourceAcquisitionBlockedResult({
      blockedReason: "unsupported-host-year",
      selection: selection.value
    });
  }

  const acquisitionDependencies = normalizeHostRuntimeObservationSourceAcquisitionDependencies(input, selection.value);
  if (!acquisitionDependencies.ok) {
    return hostRuntimeObservationSourceAcquisitionBlockedResult({
      blockedReason: acquisitionDependencies.blockedReason,
      selection: selection.value,
      acquisitionDependencyFacts: acquisitionDependencies.value ?? [],
      sourceFacts: acquisitionDependencies.sourceFacts ?? []
    });
  }

  const sourceAdapter = createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
    selection: selection.value,
    sourceFacts: acquisitionDependencies.sourceFacts
  });

  if (sourceAdapter.status !== "ready") {
    return hostRuntimeObservationSourceAcquisitionBlockedResult({
      blockedReason: sourceAdapter.blockedReason,
      selection: selection.value,
      acquisitionDependencyFacts: acquisitionDependencies.value,
      sourceFacts: acquisitionDependencies.sourceFacts,
      sourceAdapter
    });
  }

  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-validation-host-runtime-observation-source-acquisition-contract",
    sourceAcquisitionBoundary: "bounded-native-host-source-acquisition-dependencies-only",
    selection: selection.value,
    acquisitionDependencyCount: acquisitionDependencies.value.length,
    acquisitionDependencyFacts: acquisitionDependencies.value,
    sourceCount: acquisitionDependencies.sourceFacts.length,
    sourceFacts: acquisitionDependencies.sourceFacts,
    sourceAdapter,
    observation: sourceAdapter.observation,
    discovery: sourceAdapter.discovery,
    preflight: sourceAdapter.preflight,
    hostCandidates: sourceAdapter.hostCandidates,
    hostCandidateCount: sourceAdapter.hostCandidateCount,
    compatibleHostCandidateCount: sourceAdapter.compatibleHostCandidateCount,
    runtimeSelection: sourceAdapter.runtimeSelection,
    blockedReason: null,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_ACQUISITION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimeObservationSourceAcquisitionRequirementIds()
  });
}

export function createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition(input: AnyInput = {}) {
  const selection = normalizeHostRuntimePreflightSelection(input);
  if (!selection.ok) {
    return hostRuntimeObservationNativeSourceAcquisitionBlockedResult({
      blockedReason: selection.blockedReason,
      selection: selection.value ?? null
    });
  }

  if (selection.value.runtimeProvider !== "host-native") {
    return hostRuntimeObservationNativeSourceAcquisitionBlockedResult({
      blockedReason: "unsupported-runtime-provider",
      selection: selection.value
    });
  }

  if (selection.value.platform === "macos") {
    return hostRuntimeObservationNativeSourceAcquisitionBlockedResult({
      blockedReason: "macos-host-runtime-observation-native-source-acquisition-unavailable",
      selection: selection.value
    });
  }

  if (!["windows", "linux"].includes(selection.value.platform)) {
    return hostRuntimeObservationNativeSourceAcquisitionBlockedResult({
      blockedReason: "unsupported-host-platform",
      selection: selection.value
    });
  }

  if (!isSupportedHostYear(selection.value.labviewVersion)) {
    return hostRuntimeObservationNativeSourceAcquisitionBlockedResult({
      blockedReason: "unsupported-host-year",
      selection: selection.value
    });
  }

  const nativeDependencies = normalizeHostRuntimeObservationNativeSourceAcquisitionDependencies(input, selection.value);
  if (!nativeDependencies.ok) {
    return hostRuntimeObservationNativeSourceAcquisitionBlockedResult({
      blockedReason: nativeDependencies.blockedReason,
      selection: selection.value,
      nativeAcquisitionDependencyFacts: nativeDependencies.value ?? [],
      acquisitionDependencyFacts: nativeDependencies.acquisitionDependencyFacts ?? []
    });
  }

  const sourceAcquisition = createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
    selection: selection.value,
    acquisitionDependencies: {
      sourceAcquisitionFacts: nativeDependencies.acquisitionDependencyFacts
    }
  });

  if (sourceAcquisition.status !== "ready") {
    return hostRuntimeObservationNativeSourceAcquisitionBlockedResult({
      blockedReason: nativeSourceAcquisitionBlockedReasonForSourceAcquisitionBlockedReason(sourceAcquisition.blockedReason),
      selection: selection.value,
      nativeAcquisitionDependencyFacts: nativeDependencies.value,
      acquisitionDependencyFacts: nativeDependencies.acquisitionDependencyFacts,
      sourceAcquisition
    });
  }

  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-contract",
    nativeSourceAcquisitionBoundary: "bounded-native-host-source-acquisition-dependency-adapter-only",
    selection: selection.value,
    nativeAcquisitionDependencyCount: nativeDependencies.value.length,
    nativeAcquisitionDependencyFacts: nativeDependencies.value,
    acquisitionDependencyCount: nativeDependencies.acquisitionDependencyFacts.length,
    acquisitionDependencyFacts: nativeDependencies.acquisitionDependencyFacts,
    sourceAcquisition,
    sourceCount: sourceAcquisition.sourceCount,
    sourceFacts: sourceAcquisition.sourceFacts,
    sourceAdapter: sourceAcquisition.sourceAdapter,
    observation: sourceAcquisition.observation,
    discovery: sourceAcquisition.discovery,
    preflight: sourceAcquisition.preflight,
    hostCandidates: sourceAcquisition.hostCandidates,
    hostCandidateCount: sourceAcquisition.hostCandidateCount,
    compatibleHostCandidateCount: sourceAcquisition.compatibleHostCandidateCount,
    runtimeSelection: sourceAcquisition.runtimeSelection,
    blockedReason: null,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_ACQUISITION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimeObservationNativeSourceAcquisitionRequirementIds()
  });
}

export function createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe(input: AnyInput = {}) {
  const selection = normalizeHostRuntimePreflightSelection(input);
  if (!selection.ok) {
    return hostRuntimeObservationNativeSourceProbeBlockedResult({
      blockedReason: selection.blockedReason,
      selection: selection.value ?? null
    });
  }

  if (selection.value.runtimeProvider !== "host-native") {
    return hostRuntimeObservationNativeSourceProbeBlockedResult({
      blockedReason: "unsupported-runtime-provider",
      selection: selection.value
    });
  }

  if (selection.value.platform === "macos") {
    return hostRuntimeObservationNativeSourceProbeBlockedResult({
      blockedReason: "macos-host-runtime-observation-native-source-probe-unavailable",
      selection: selection.value
    });
  }

  if (!["windows", "linux"].includes(selection.value.platform)) {
    return hostRuntimeObservationNativeSourceProbeBlockedResult({
      blockedReason: "unsupported-host-platform",
      selection: selection.value
    });
  }

  if (!isSupportedHostYear(selection.value.labviewVersion)) {
    return hostRuntimeObservationNativeSourceProbeBlockedResult({
      blockedReason: "unsupported-host-year",
      selection: selection.value
    });
  }

  const probeDependencies = normalizeHostRuntimeObservationNativeSourceProbeDependencies(input, selection.value);
  if (!probeDependencies.ok) {
    return hostRuntimeObservationNativeSourceProbeBlockedResult({
      blockedReason: probeDependencies.blockedReason,
      selection: selection.value,
      nativeSourceProbeFacts: probeDependencies.value ?? [],
      nativeAcquisitionObservations: probeDependencies.nativeAcquisitionObservations ?? []
    });
  }

  const nativeSourceAcquisition = createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
    selection: selection.value,
    nativeAcquisitionDependencies: {
      windowsRegistryViewNativeAcquisitions: probeDependencies.windowsRegistryViewNativeAcquisitions,
      documentedRootNativeAcquisitions: probeDependencies.documentedRootNativeAcquisitions
    }
  });

  if (nativeSourceAcquisition.status !== "ready") {
    return hostRuntimeObservationNativeSourceProbeBlockedResult({
      blockedReason: nativeSourceProbeBlockedReasonForNativeSourceAcquisitionBlockedReason(nativeSourceAcquisition.blockedReason),
      selection: selection.value,
      nativeSourceProbeFacts: probeDependencies.value,
      nativeAcquisitionObservations: probeDependencies.nativeAcquisitionObservations,
      nativeSourceAcquisition
    });
  }

  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-validation-host-runtime-observation-native-source-probe-contract",
    nativeSourceProbeBoundary: "bounded-native-host-source-surface-probe-only",
    selection: selection.value,
    nativeSourceProbeCount: probeDependencies.value.length,
    nativeSourceProbeFacts: probeDependencies.value,
    nativeAcquisitionObservationCount: probeDependencies.nativeAcquisitionObservations.length,
    nativeAcquisitionObservations: probeDependencies.nativeAcquisitionObservations,
    nativeSourceAcquisition,
    sourceAcquisition: nativeSourceAcquisition.sourceAcquisition,
    sourceAdapter: nativeSourceAcquisition.sourceAdapter,
    observation: nativeSourceAcquisition.observation,
    discovery: nativeSourceAcquisition.discovery,
    preflight: nativeSourceAcquisition.preflight,
    hostCandidates: nativeSourceAcquisition.hostCandidates,
    hostCandidateCount: nativeSourceAcquisition.hostCandidateCount,
    compatibleHostCandidateCount: nativeSourceAcquisition.compatibleHostCandidateCount,
    runtimeSelection: nativeSourceAcquisition.runtimeSelection,
    blockedReason: null,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_PROBE_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimeObservationNativeSourceProbeRequirementIds()
  });
}

export function createRuntimeSettingsValidationProofArtifact(input: AnyInput = {}) {
  const validation = normalizeValidationProofFacts(input.validation ?? input.validationFacts ?? input);
  if (!validation.ok) {
    return validationProofBlockedResult(validation.blockedReason);
  }

  const environmentFacts = redactEnvironmentFacts(input.environment ?? input.environmentFacts ?? {});
  const proofJson = freezeRecord({
    schema: RUNTIME_SETTINGS_VALIDATION_PROOF_SCHEMA,
    targetAuthority: MIT_PUBLIC_AUTHORITY,
    command: RUNTIME_SETTINGS_VALIDATION_PROOF_COMMAND,
    validation: validation.value,
    environmentFacts,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_PROOF_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationProofRequirementIds()
  });
  const issueBody = createRuntimeSettingsValidationProofIssueBody(proofJson);

  return freezeRecord({
    status: validation.value.status,
    type: "runtime-settings-cli-validation-proof-artifact-contract",
    proofJson,
    issueBody,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_PROOF_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationProofRequirementIds()
  });
}

export function createRuntimeSettingsValidationProofIssueBody(proofJson = {}) {
  const validation = proofJson.validation ?? {};
  const runtime = validation.runtime ?? {};
  const persistedSettings = validation.persistedSettings ?? {};
  const effectiveTarget = validation.effectiveSettingsTarget ?? {};
  const environmentLines = Object.entries(proofJson.environmentFacts ?? {})
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `- Environment ${key}: ${value}`);

  return [
    "### Runtime settings CLI validation proof",
    `- Repository: ${proofJson.targetAuthority ?? MIT_PUBLIC_AUTHORITY}`,
    `- Command: ${proofJson.command ?? RUNTIME_SETTINGS_VALIDATION_PROOF_COMMAND}`,
    `- Validation outcome: ${validation.status ?? "blocked"}`,
    `- Runtime provider: ${runtime.runtimeProvider ?? "unavailable"}`,
    `- Runtime engine: ${runtime.runtimeEngine ?? "none"}`,
    `- Runtime blocked reason: ${runtime.runtimeBlockedReason ?? "none"}`,
    `- Runtime error code: ${runtime.runtimeErrorCode ?? "VIHS_E_MISSING_VALIDATION_PROOF_FACTS"}`,
    `- Runtime proof status: ${runtime.runtimeProofStatus ?? "blocked-with-actionable-error"}`,
    `- Runtime implementation status: ${runtime.runtimeImplementationStatus ?? "not-started"}`,
    `- Effective settings scope: ${effectiveTarget.scope ?? "unknown"}`,
    `- Effective settings identifier: ${effectiveTarget.identifier ?? "unknown"}`,
    `- Persisted runtime provider: ${persistedSettings.runtimeProvider ?? "unknown"}`,
    `- Persisted LabVIEW version: ${persistedSettings.labviewVersion ?? "unknown"}`,
    `- Persisted LabVIEW bitness: ${persistedSettings.labviewBitness ?? "unknown"}`,
    ...environmentLines
  ].join("\n");
}

export function createRuntimeSettingsValidationProofOutAdapter(input: AnyInput = {}) {
  const request = normalizeValidationProofOutRequest(input.request ?? input.proofOutRequest ?? input, input);
  if (!request.ok) {
    return validationProofOutBlockedResult({
      blockedReason: request.blockedReason,
      request: request.value ?? null,
      proofOutTarget: request.proofOutTarget ?? null
    });
  }

  const proofArtifact = resolveValidationProofOutArtifact(input);
  if (!proofArtifact.ok) {
    return validationProofOutBlockedResult({
      blockedReason: proofArtifact.blockedReason,
      request: request.value,
      proofOutTarget: request.value.proofOutTarget,
      proofArtifact: proofArtifact.artifact ?? null
    });
  }

  const artifactFiles = createValidationProofOutArtifactFiles(
    request.value.proofOutTarget,
    proofArtifact.value
  );
  const guidance = createValidationProofOutGuidance(request.value.proofOutTarget);

  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-validation-proof-out-adapter-contract",
    command: request.value.command,
    request: request.value,
    proofOutTarget: request.value.proofOutTarget,
    proofArtifactStatus: proofArtifact.value.status,
    artifactFiles,
    proofJson: proofArtifact.value.proofJson,
    issueMarkdown: proofArtifact.value.issueBody,
    guidance,
    copyableGuidance: guidance.copyableCommands,
    promptWait: false,
    writeBound: false,
    artifactWrites: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationProofOutRequirementIds()
  });
}

export async function writeRuntimeSettingsValidationProofOutFiles(input: AnyInput = {}) {
  const adapter = input.proofOutAdapter
    ?? input.validationProofOutAdapter
    ?? input.adapter
    ?? (input.type === "runtime-settings-cli-validation-proof-out-adapter-contract" ? input : null);
  const readyAdapter = normalizeReadyValidationProofOutAdapter(adapter);
  if (!readyAdapter.ok) {
    return validationProofOutFileEmissionBlockedResult({
      blockedReason: readyAdapter.blockedReason,
      proofOutAdapter: adapter ?? null,
      proofOutTarget: readyAdapter.proofOutTarget ?? null
    });
  }

  const payloads = resolveValidationProofOutFilePayloads(readyAdapter.value);
  if (!payloads.ok) {
    return validationProofOutFileEmissionBlockedResult({
      blockedReason: payloads.blockedReason,
      proofOutAdapter: readyAdapter.value,
      proofOutTarget: readyAdapter.value.proofOutTarget
    });
  }

  const fileSystem = input.fileSystem ?? input.fs ?? fs;
  const baseDirectory = typeof input.baseDirectory === "string" && input.baseDirectory
    ? input.baseDirectory
    : ".";
  const targetDirectory = path.resolve(baseDirectory, readyAdapter.value.proofOutTarget.identifier);
  const writePlan = createValidationProofOutFileEmissionPlan(readyAdapter.value, targetDirectory, payloads.value);
  const completedFiles = [];

  try {
    await fileSystem.mkdir(targetDirectory, { recursive: true });
    for (const file of writePlan.files) {
      await fileSystem.writeFile(file.absolutePath, file.text, "utf8");
      completedFiles.push(file.result);
    }
  } catch (error) {
    const failedFile = writePlan.files
      .find((file: any) => !completedFiles.some((completed: any) => completed.relativePath === file.result.relativePath));

    return validationProofOutFileEmissionBlockedResult({
      blockedReason: "proof-out-file-emission-failed",
      proofOutAdapter: readyAdapter.value,
      proofOutTarget: readyAdapter.value.proofOutTarget,
      attemptedFiles: writePlan.files.map((file: any) => file.result),
      completedFiles,
      failedFile: failedFile?.result ?? null,
      errorCode: normalizeFact(error?.code) ?? "VIHS_E_PROOF_OUT_FILE_EMISSION_FAILED"
    });
  }

  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-validation-proof-out-file-emission-contract",
    command: readyAdapter.value.command,
    proofOutAdapterStatus: readyAdapter.value.status,
    proofOutTarget: readyAdapter.value.proofOutTarget,
    directory: freezeRecord({
      kind: "proof-out-directory",
      identifier: readyAdapter.value.proofOutTarget.identifier,
      publicSafe: true,
      createdWhenMissing: true
    }),
    files: freezeRecord({
      proofJson: completedFiles[0],
      issueMarkdown: completedFiles[1]
    }),
    writeResults: completedFiles,
    artifactWrites: true,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_FILE_EMISSION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationProofOutFileEmissionRequirementIds()
  });
}

export async function createRuntimeSettingsValidationCommandResult(input: AnyInput = {}) {
  const request = normalizeValidationCommandRequest(input);
  if (!request.ok) {
    return validationCommandContractResult({
      status: "blocked",
      requestMode: request.requestMode ?? "validate-only",
      blockedReason: request.blockedReason
    });
  }

  const runtimeSelection = resolveValidationCommandRuntimeSelection(input);
  const runtimeOutcomeResult = createRuntimeSettingsValidationRuntimeOutcome({
    runtimeSelection
  });
  const validation = readRuntimeSettingsValidation({
    settingsContent: input.settingsContent,
    settings: input.settings,
    target: input.target,
    effectiveSettingsTarget: input.effectiveSettingsTarget,
    runtimeOutcome: runtimeOutcomeResult.runtimeOutcome
  });

  if (validation.status !== "ready") {
    return validationCommandContractResult({
      status: "blocked",
      requestMode: request.value.requestMode,
      blockedReason: validation.blockedReason ?? validation.runtime?.runtimeBlockedReason,
      validation
    });
  }

  if (!request.value.proofOut) {
    return validationCommandContractResult({
      status: "ready",
      requestMode: "validate-only",
      validation
    });
  }

  const proofOutAdapter = createRuntimeSettingsValidationProofOutAdapter({
    proofOut: request.value.proofOut,
    validation,
    environment: input.environment ?? input.environmentFacts ?? {}
  });

  if (proofOutAdapter.status !== "ready") {
    return validationCommandContractResult({
      status: "blocked",
      requestMode: request.value.requestMode === "validate-plan-only"
        ? "validate-plan-only-blocked"
        : "validate-with-proof-out-blocked",
      blockedReason: proofOutAdapter.blockedReason,
      validation,
      proofOut: proofOutAdapter
    });
  }

  if (request.value.requestMode === "validate-plan-only") {
    return validationCommandContractResult({
      status: "ready",
      requestMode: "validate-plan-only",
      validation,
      proofOut: proofOutAdapter
    });
  }

  const proofOutResult = await writeRuntimeSettingsValidationProofOutFiles({
    proofOutAdapter,
    baseDirectory: input.baseDirectory,
    fileSystem: input.fileSystem ?? input.fs
  });

  if (proofOutResult.status !== "ready") {
    return validationCommandContractResult({
      status: "blocked",
      requestMode: "validate-with-proof-out-blocked",
      blockedReason: proofOutResult.blockedReason,
      validation,
      proofOut: proofOutResult
    });
  }

  return validationCommandContractResult({
    status: "ready",
    requestMode: "validate-with-proof-out-ready",
    validation,
    proofOut: proofOutResult
  });
}

function resolveValidationCommandRuntimeSelection(input: AnyInput = {}) {
  const explicitRuntimeSelection = input.runtimeSelection
    ?? input.runtimeFacts
    ?? input.runtime;
  if (explicitRuntimeSelection !== undefined) {
    return explicitRuntimeSelection;
  }

  const providedPreflight = input.hostRuntimePreflight
    ?? input.hostPreflight
    ?? input.runtimePreflight
    ?? input.preflight;
  if (isPlainObject(providedPreflight) && providedPreflight.runtimeSelection) {
    return providedPreflight.runtimeSelection;
  }

  const providedNativeSourceProbe = input.hostRuntimeObservationNativeSourceProbe
    ?? input.runtimeObservationNativeSourceProbe
    ?? input.nativeSourceProbe;
  if (isPlainObject(providedNativeSourceProbe) && providedNativeSourceProbe.runtimeSelection) {
    return providedNativeSourceProbe.runtimeSelection;
  }
  if (isPlainObject(providedNativeSourceProbe)) {
    return createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe(providedNativeSourceProbe).runtimeSelection;
  }

  const hostObservationNativeSourceProbeRequest = input.hostRuntimeObservationNativeSourceProbeRequest
    ?? input.runtimeObservationNativeSourceProbeRequest
    ?? input.nativeSourceProbeRequest
    ?? input.hostRuntimeObservationNativeSourceProbeFactsRequest
    ?? input.runtimeObservationNativeSourceProbeFactsRequest;
  if (isPlainObject(hostObservationNativeSourceProbeRequest)) {
    return createRuntimeSettingsValidationHostRuntimeObservationNativeSourceProbe(hostObservationNativeSourceProbeRequest).runtimeSelection;
  }

  const providedNativeSourceAcquisition = input.hostRuntimeObservationNativeSourceAcquisition
    ?? input.runtimeObservationNativeSourceAcquisition
    ?? input.nativeSourceAcquisition;
  if (isPlainObject(providedNativeSourceAcquisition) && providedNativeSourceAcquisition.runtimeSelection) {
    return providedNativeSourceAcquisition.runtimeSelection;
  }
  if (isPlainObject(providedNativeSourceAcquisition)) {
    return createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition(providedNativeSourceAcquisition).runtimeSelection;
  }

  const hostObservationNativeSourceAcquisitionRequest = input.hostRuntimeObservationNativeSourceAcquisitionRequest
    ?? input.runtimeObservationNativeSourceAcquisitionRequest
    ?? input.nativeSourceAcquisitionRequest
    ?? input.hostRuntimeObservationNativeSourceAcquisitionFactsRequest
    ?? input.runtimeObservationNativeSourceAcquisitionFactsRequest;
  if (isPlainObject(hostObservationNativeSourceAcquisitionRequest)) {
    return createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition(hostObservationNativeSourceAcquisitionRequest).runtimeSelection;
  }

  const providedSourceAcquisition = input.hostRuntimeObservationSourceAcquisition
    ?? input.runtimeObservationSourceAcquisition
    ?? input.observationSourceAcquisition
    ?? input.sourceAcquisition;
  if (isPlainObject(providedSourceAcquisition) && providedSourceAcquisition.runtimeSelection) {
    return providedSourceAcquisition.runtimeSelection;
  }
  if (isPlainObject(providedSourceAcquisition)) {
    return createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition(providedSourceAcquisition).runtimeSelection;
  }

  const hostObservationSourceAcquisitionRequest = input.hostRuntimeObservationSourceAcquisitionRequest
    ?? input.runtimeObservationSourceAcquisitionRequest
    ?? input.observationSourceAcquisitionRequest
    ?? input.sourceAcquisitionRequest
    ?? input.hostRuntimeObservationSourceAcquisitionFactsRequest
    ?? input.runtimeObservationSourceAcquisitionFactsRequest;
  if (isPlainObject(hostObservationSourceAcquisitionRequest)) {
    return createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition(hostObservationSourceAcquisitionRequest).runtimeSelection;
  }

  const providedSourceAdapter = input.hostRuntimeObservationSourceAdapter
    ?? input.runtimeObservationSourceAdapter
    ?? input.observationSourceAdapter
    ?? input.sourceAdapter;
  if (isPlainObject(providedSourceAdapter) && providedSourceAdapter.runtimeSelection) {
    return providedSourceAdapter.runtimeSelection;
  }
  if (isPlainObject(providedSourceAdapter)) {
    return createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter(providedSourceAdapter).runtimeSelection;
  }

  const hostObservationSourceRequest = input.hostRuntimeObservationSourceAdapterRequest
    ?? input.runtimeObservationSourceAdapterRequest
    ?? input.observationSourceAdapterRequest
    ?? input.sourceAdapterRequest
    ?? input.hostRuntimeObservationSourceRequest
    ?? input.runtimeObservationSourceRequest;
  if (isPlainObject(hostObservationSourceRequest)) {
    return createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter(hostObservationSourceRequest).runtimeSelection;
  }

  const providedObservation = input.hostRuntimeObservation
    ?? input.runtimeObservation
    ?? input.observationAdapter
    ?? input.observation;
  if (isPlainObject(providedObservation) && providedObservation.runtimeSelection) {
    return providedObservation.runtimeSelection;
  }
  if (isPlainObject(providedObservation)) {
    return createRuntimeSettingsValidationHostRuntimeObservation(providedObservation).runtimeSelection;
  }

  const hostObservationRequest = input.hostRuntimeObservationRequest
    ?? input.runtimeObservationRequest
    ?? input.observationAdapterRequest
    ?? input.observationRequest;
  if (isPlainObject(hostObservationRequest)) {
    return createRuntimeSettingsValidationHostRuntimeObservation(hostObservationRequest).runtimeSelection;
  }

  const providedDiscovery = input.hostRuntimeDiscovery
    ?? input.runtimeDiscovery
    ?? input.discovery;
  if (isPlainObject(providedDiscovery) && providedDiscovery.runtimeSelection) {
    return providedDiscovery.runtimeSelection;
  }
  if (isPlainObject(providedDiscovery)) {
    return createRuntimeSettingsValidationHostRuntimeDiscovery(providedDiscovery).runtimeSelection;
  }

  const hostDiscoveryRequest = input.hostRuntimeDiscoveryRequest
    ?? input.runtimeDiscoveryRequest
    ?? input.discoveryRequest;
  if (isPlainObject(hostDiscoveryRequest)) {
    return createRuntimeSettingsValidationHostRuntimeDiscovery(hostDiscoveryRequest).runtimeSelection;
  }

  const hostPreflightRequest = input.hostRuntimePreflightRequest
    ?? input.hostPreflightRequest;
  if (isPlainObject(hostPreflightRequest)) {
    return createRuntimeSettingsValidationHostRuntimePreflight(hostPreflightRequest).runtimeSelection;
  }

  if (hasValidationCommandHostRuntimeObservationNativeSourceAcquisitionFacts(input)) {
    return createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition({
      selection: input.hostSelection
        ?? input.hostRuntimeSelection
        ?? input.hostRuntimeFacts
        ?? input.selection
        ?? input.persistedSettings
        ?? input.settings,
      nativeAcquisitionDependencies: input.hostRuntimeObservationNativeSourceAcquisitionDependencies
        ?? input.runtimeObservationNativeSourceAcquisitionDependencies
        ?? input.nativeSourceAcquisitionDependencies
        ?? input.nativeAcquisitionDependencies,
      nativeAcquisitionFacts: input.hostRuntimeObservationNativeSourceAcquisitionFacts
        ?? input.runtimeObservationNativeSourceAcquisitionFacts
        ?? input.nativeSourceAcquisitionFacts
        ?? input.nativeAcquisitionFacts,
      documentedRootNativeAcquisitions: input.documentedRootNativeAcquisitions
        ?? input.nativeDocumentedRootAcquisitions,
      windowsRegistryViewNativeAcquisitions: input.windowsRegistryViewNativeAcquisitions
        ?? input.nativeRegistryViewAcquisitions
    }).runtimeSelection;
  }

  if (hasValidationCommandHostRuntimeObservationSourceFacts(input)) {
    return createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter({
      selection: input.hostSelection
        ?? input.hostRuntimeSelection
        ?? input.hostRuntimeFacts
        ?? input.selection
        ?? input.persistedSettings
        ?? input.settings,
      sourceFacts: input.hostRuntimeObservationSourceFacts
        ?? input.runtimeObservationSourceFacts
        ?? input.observationSourceFacts
        ?? input.sourceFacts,
      sources: input.hostRuntimeObservationSources
        ?? input.runtimeObservationSources
        ?? input.observationSources
        ?? input.sources,
      sourceDependencies: input.hostRuntimeObservationSourceDependencies
        ?? input.runtimeObservationSourceDependencies
        ?? input.observationSourceDependencies
    }).runtimeSelection;
  }

  if (hasValidationCommandHostRuntimeObservationSourceAcquisitionFacts(input)) {
    return createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition({
      selection: input.hostSelection
        ?? input.hostRuntimeSelection
        ?? input.hostRuntimeFacts
        ?? input.selection
        ?? input.persistedSettings
        ?? input.settings,
      acquisitionDependencies: input.hostRuntimeObservationSourceAcquisitionDependencies
        ?? input.runtimeObservationSourceAcquisitionDependencies
        ?? input.observationSourceAcquisitionDependencies
        ?? input.sourceAcquisitionDependencies
        ?? input.acquisitionDependencies,
      acquisitionDependencyFacts: input.hostRuntimeObservationSourceAcquisitionFacts
        ?? input.runtimeObservationSourceAcquisitionFacts
        ?? input.observationSourceAcquisitionFacts
        ?? input.sourceAcquisitionFacts
        ?? input.acquisitionFacts,
      documentedRootAcquisitions: input.documentedRootAcquisitions
        ?? input.documentedRootAcquisitionFacts,
      windowsRegistryViewAcquisitions: input.windowsRegistryViewAcquisitions
        ?? input.registryViewAcquisitions
    }).runtimeSelection;
  }

  if (hasValidationCommandHostRuntimeObservationFacts(input)) {
    return createRuntimeSettingsValidationHostRuntimeObservation({
      selection: input.hostSelection
        ?? input.hostRuntimeSelection
        ?? input.hostRuntimeFacts
        ?? input.selection
        ?? input.persistedSettings
        ?? input.settings,
      observationDependencies: input.observationDependencies
        ?? input.hostRuntimeObservationDependencies
        ?? input.runtimeObservationDependencies,
      documentedRootObservations: input.observationDocumentedRootObservations
        ?? input.hostRuntimeObservationDocumentedRootObservations,
      windowsRegistryViewObservations: input.observationWindowsRegistryViewObservations
        ?? input.hostRuntimeObservationWindowsRegistryViewObservations,
      observations: input.hostRuntimeObservations
        ?? input.runtimeObservations
        ?? input.observationFacts
    }).runtimeSelection;
  }

  if (hasValidationCommandHostRuntimeDiscoveryFacts(input)) {
    return createRuntimeSettingsValidationHostRuntimeDiscovery({
      selection: input.hostSelection
        ?? input.hostRuntimeSelection
        ?? input.hostRuntimeFacts
        ?? input.selection
        ?? input.persistedSettings
        ?? input.settings,
      documentedRootObservations: input.documentedRootObservations
        ?? input.documentedRoots
        ?? input.rootObservations,
      windowsRegistryViewObservations: input.windowsRegistryViewObservations
        ?? input.registryViewObservations
        ?? input.registryViews,
      observations: input.discoveryObservations
        ?? input.hostDiscoveryObservations
        ?? input.observations,
      discoveryDependencies: input.discoveryDependencies
    }).runtimeSelection;
  }

  if (hasValidationCommandHostPreflightFacts(input)) {
    return createRuntimeSettingsValidationHostRuntimePreflight({
      selection: input.hostSelection
        ?? input.hostRuntimeSelection
        ?? input.hostRuntimeFacts
        ?? input.selection
        ?? input.persistedSettings
        ?? input.settings,
      hostCandidates: input.hostCandidates
        ?? input.hostRuntimeCandidates
        ?? input.availableHostInstallations
        ?? input.hostInstallations
        ?? input.candidates
    }).runtimeSelection;
  }

  return input.selection;
}

function hasValidationCommandHostPreflightFacts(input: AnyInput = {}) {
  return input.hostSelection !== undefined
    || input.hostRuntimeSelection !== undefined
    || input.hostRuntimeFacts !== undefined
    || input.hostCandidates !== undefined
    || input.hostRuntimeCandidates !== undefined
    || input.availableHostInstallations !== undefined
    || input.hostInstallations !== undefined
    || input.candidates !== undefined;
}

function hasValidationCommandHostRuntimeObservationSourceFacts(input: AnyInput = {}) {
  return input.hostRuntimeObservationSourceAdapter !== undefined
    || input.runtimeObservationSourceAdapter !== undefined
    || input.observationSourceAdapter !== undefined
    || input.sourceAdapter !== undefined
    || input.hostRuntimeObservationSourceAdapterRequest !== undefined
    || input.runtimeObservationSourceAdapterRequest !== undefined
    || input.observationSourceAdapterRequest !== undefined
    || input.sourceAdapterRequest !== undefined
    || input.hostRuntimeObservationSourceRequest !== undefined
    || input.runtimeObservationSourceRequest !== undefined
    || input.hostRuntimeObservationSourceFacts !== undefined
    || input.runtimeObservationSourceFacts !== undefined
    || input.observationSourceFacts !== undefined
    || input.sourceFacts !== undefined
    || input.hostRuntimeObservationSources !== undefined
    || input.runtimeObservationSources !== undefined
    || input.observationSources !== undefined
    || input.sources !== undefined
    || input.hostRuntimeObservationSourceDependencies !== undefined
    || input.runtimeObservationSourceDependencies !== undefined
    || input.observationSourceDependencies !== undefined;
}

function hasValidationCommandHostRuntimeObservationSourceAcquisitionFacts(input: AnyInput = {}) {
  return input.hostRuntimeObservationSourceAcquisition !== undefined
    || input.runtimeObservationSourceAcquisition !== undefined
    || input.observationSourceAcquisition !== undefined
    || input.sourceAcquisition !== undefined
    || input.hostRuntimeObservationSourceAcquisitionRequest !== undefined
    || input.runtimeObservationSourceAcquisitionRequest !== undefined
    || input.observationSourceAcquisitionRequest !== undefined
    || input.sourceAcquisitionRequest !== undefined
    || input.hostRuntimeObservationSourceAcquisitionFactsRequest !== undefined
    || input.runtimeObservationSourceAcquisitionFactsRequest !== undefined
    || input.hostRuntimeObservationSourceAcquisitionFacts !== undefined
    || input.runtimeObservationSourceAcquisitionFacts !== undefined
    || input.observationSourceAcquisitionFacts !== undefined
    || input.sourceAcquisitionFacts !== undefined
    || input.acquisitionFacts !== undefined
    || input.hostRuntimeObservationSourceAcquisitionDependencies !== undefined
    || input.runtimeObservationSourceAcquisitionDependencies !== undefined
    || input.observationSourceAcquisitionDependencies !== undefined
    || input.sourceAcquisitionDependencies !== undefined
    || input.acquisitionDependencies !== undefined
    || input.documentedRootAcquisitions !== undefined
    || input.documentedRootAcquisitionFacts !== undefined
    || input.windowsRegistryViewAcquisitions !== undefined
    || input.registryViewAcquisitions !== undefined;
}

function hasValidationCommandHostRuntimeObservationNativeSourceProbeFacts(input: AnyInput = {}) {
  return input.hostRuntimeObservationNativeSourceProbe !== undefined
    || input.runtimeObservationNativeSourceProbe !== undefined
    || input.nativeSourceProbe !== undefined
    || input.hostRuntimeObservationNativeSourceProbeRequest !== undefined
    || input.runtimeObservationNativeSourceProbeRequest !== undefined
    || input.nativeSourceProbeRequest !== undefined
    || input.hostRuntimeObservationNativeSourceProbeFactsRequest !== undefined
    || input.runtimeObservationNativeSourceProbeFactsRequest !== undefined
    || input.hostRuntimeObservationNativeSourceProbeFacts !== undefined
    || input.runtimeObservationNativeSourceProbeFacts !== undefined
    || input.nativeSourceProbeFacts !== undefined
    || input.probeFacts !== undefined
    || input.hostRuntimeObservationNativeSourceProbeDependencies !== undefined
    || input.runtimeObservationNativeSourceProbeDependencies !== undefined
    || input.nativeSourceProbeDependencies !== undefined
    || input.probeDependencies !== undefined
    || input.documentedRootProbes !== undefined
    || input.documentedRootNativeProbes !== undefined
    || input.windowsRegistryViewProbes !== undefined
    || input.windowsRegistryViewNativeProbes !== undefined;
}

function hasValidationCommandHostRuntimeObservationNativeSourceAcquisitionFacts(input: AnyInput = {}) {
  return input.hostRuntimeObservationNativeSourceAcquisition !== undefined
    || input.runtimeObservationNativeSourceAcquisition !== undefined
    || input.nativeSourceAcquisition !== undefined
    || input.hostRuntimeObservationNativeSourceAcquisitionRequest !== undefined
    || input.runtimeObservationNativeSourceAcquisitionRequest !== undefined
    || input.nativeSourceAcquisitionRequest !== undefined
    || input.hostRuntimeObservationNativeSourceAcquisitionFactsRequest !== undefined
    || input.runtimeObservationNativeSourceAcquisitionFactsRequest !== undefined
    || input.hostRuntimeObservationNativeSourceAcquisitionFacts !== undefined
    || input.runtimeObservationNativeSourceAcquisitionFacts !== undefined
    || input.nativeSourceAcquisitionFacts !== undefined
    || input.nativeAcquisitionFacts !== undefined
    || input.hostRuntimeObservationNativeSourceAcquisitionDependencies !== undefined
    || input.runtimeObservationNativeSourceAcquisitionDependencies !== undefined
    || input.nativeSourceAcquisitionDependencies !== undefined
    || input.nativeAcquisitionDependencies !== undefined
    || input.documentedRootNativeAcquisitions !== undefined
    || input.nativeDocumentedRootAcquisitions !== undefined
    || input.windowsRegistryViewNativeAcquisitions !== undefined
    || input.nativeRegistryViewAcquisitions !== undefined;
}

function hasValidationCommandHostRuntimeObservationFacts(input: AnyInput = {}) {
  return input.hostRuntimeObservation !== undefined
    || input.runtimeObservation !== undefined
    || input.observationAdapter !== undefined
    || input.hostRuntimeObservationRequest !== undefined
    || input.runtimeObservationRequest !== undefined
    || input.observationAdapterRequest !== undefined
    || input.observationRequest !== undefined
    || input.observationDependencies !== undefined
    || input.hostRuntimeObservationDependencies !== undefined
    || input.runtimeObservationDependencies !== undefined
    || input.observationDocumentedRootObservations !== undefined
    || input.hostRuntimeObservationDocumentedRootObservations !== undefined
    || input.observationWindowsRegistryViewObservations !== undefined
    || input.hostRuntimeObservationWindowsRegistryViewObservations !== undefined
    || input.hostRuntimeObservations !== undefined
    || input.runtimeObservations !== undefined
    || input.observationFacts !== undefined;
}

function hasValidationCommandHostRuntimeDiscoveryFacts(input: AnyInput = {}) {
  return input.hostRuntimeDiscovery !== undefined
    || input.runtimeDiscovery !== undefined
    || input.discovery !== undefined
    || input.hostRuntimeDiscoveryRequest !== undefined
    || input.runtimeDiscoveryRequest !== undefined
    || input.discoveryRequest !== undefined
    || input.documentedRootObservations !== undefined
    || input.documentedRoots !== undefined
    || input.rootObservations !== undefined
    || input.windowsRegistryViewObservations !== undefined
    || input.registryViewObservations !== undefined
    || input.registryViews !== undefined
    || input.discoveryObservations !== undefined
    || input.hostDiscoveryObservations !== undefined
    || input.observations !== undefined
    || input.discoveryDependencies !== undefined;
}

export function createRuntimeSettingsInteractiveSelection(input: AnyInput = {}) {
  const selectionResult = resolveInteractiveSelection(input);
  if (!selectionResult.ok) {
    return interactiveSelectionBlockedResult(selectionResult);
  }

  const selection = selectionResult.value;
  const validationRequested = isConfirmationAccepted(input.confirmation ?? input.confirm);

  return freezeRecord({
    status: "ready",
    type: "runtime-settings-cli-interactive-selection-contract",
    command: RUNTIME_SETTINGS_INTERACTIVE_SELECTION_COMMAND,
    defaultSelectionApplied: selectionResult.defaultSelectionApplied,
    selection,
    options: createInteractiveSelectionOptions(input.availableHostInstallations ?? input.hostInstallations ?? []),
    guidance: createInteractiveSelectionGuidance(selection),
    validationHandoff: createValidationHandoff(selection, validationRequested),
    blockedSideEffects: RUNTIME_SETTINGS_INTERACTIVE_SELECTION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliInteractiveSelectionRequirementIds()
  });
}

function resolveInteractiveSelection(input: AnyInput) {
  const requestedSelection = input.requestedSelection ?? input.selection;
  if (isPlainObject(requestedSelection)) {
    return validateRequestedInteractiveSelection(
      normalizeRequestedInteractiveSelection(requestedSelection),
      input.availableHostInstallations ?? input.hostInstallations ?? []
    );
  }

  const settings = parseSettingsContent(input.settingsContent ?? input.settings ?? {});
  if (!settings.ok) {
    return {
      ok: false,
      blockedReason: settings.blockedReason,
      selection: null
    };
  }

  const persisted = readPersistedRuntimeSettingsFacts(settings.value);
  if (!persisted.ok) {
    return {
      ok: true,
      value: RUNTIME_SETTINGS_INTERACTIVE_DEFAULT_SELECTION,
      defaultSelectionApplied: true
    };
  }

  return {
    ok: true,
    value: freezeRecord({
      runtimeProvider: normalizeRuntimeProvider(persisted.value!.runtimeProvider),
      platform: normalizePlatform(input.platform ?? input.currentPlatform ?? defaultPlatformForProvider(persisted.value!.runtimeProvider)),
      labviewVersion: persisted.value!.labviewVersion,
      labviewBitness: normalizeLabviewBitness(persisted.value!.labviewBitness)
    }),
    defaultSelectionApplied: false
  };
}

function validateRequestedInteractiveSelection(selection: any, availableHostInstallations: any) {
  if (!selection) {
    return {
      ok: false,
      blockedReason: "missing-selection-facts",
      selection: null
    };
  }

  if (selection.runtimeProvider === "docker") {
    if (selection.platform !== "docker") {
      return blockedSelection("host-platform-mismatch", selection);
    }
    if (selection.labviewVersion !== "2026") {
      return blockedSelection("unsupported-docker-year", selection);
    }
    if (selection.labviewBitness !== "x64") {
      return blockedSelection("docker-bitness-not-selectable", selection);
    }
    return {
      ok: true,
      value: selection,
      defaultSelectionApplied: false
    };
  }

  if (selection.runtimeProvider !== "host-native") {
    return blockedSelection("unsupported-runtime-provider", selection);
  }
  if (!["windows", "linux"].includes(selection.platform)) {
    return blockedSelection("host-platform-mismatch", selection);
  }
  if (!isSupportedHostYear(selection.labviewVersion)) {
    return blockedSelection("unsupported-host-year", selection);
  }
  if (selection.platform === "linux" && selection.labviewBitness !== "x64") {
    return blockedSelection("missing-selected-bitness", selection);
  }
  if (!hasMatchingHostInstallation(availableHostInstallations, selection)) {
    return blockedSelection("missing-selected-bitness", selection);
  }

  return {
    ok: true,
    value: selection,
    defaultSelectionApplied: false
  };
}

function interactiveSelectionBlockedResult(result) {
  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-interactive-selection-contract",
    command: RUNTIME_SETTINGS_INTERACTIVE_SELECTION_COMMAND,
    blockedReason: result.blockedReason,
    selection: result.selection,
    guidance: createBlockedInteractiveSelectionGuidance(result.blockedReason),
    validationHandoff: createValidationHandoff(result.selection, false),
    blockedSideEffects: RUNTIME_SETTINGS_INTERACTIVE_SELECTION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliInteractiveSelectionRequirementIds()
  });
}

function blockedSelection(blockedReason: any, selection: any) {
  return {
    ok: false,
    blockedReason,
    selection
  };
}

function normalizeInteractiveSelection(selection: any) {
  const runtimeProvider = normalizeRuntimeProvider(selection.runtimeProvider ?? selection.provider);
  const platform = normalizePlatform(selection.platform);
  const labviewVersion = normalizeFact(selection.labviewVersion ?? selection.version);
  const labviewBitness = normalizeLabviewBitness(selection.labviewBitness ?? selection.bitness);

  if (!runtimeProvider || !platform || !labviewVersion || !labviewBitness) {
    return null;
  }

  return freezeRecord({
    runtimeProvider,
    platform,
    labviewVersion,
    labviewBitness
  });
}

function normalizeRequestedInteractiveSelection(selection: any) {
  const runtimeProvider = normalizeRuntimeProvider(selection.runtimeProvider ?? selection.provider);
  const platform = normalizePlatform(selection.platform ?? defaultPlatformForProvider(runtimeProvider));
  const labviewVersion = normalizeFact(selection.labviewVersion ?? selection.version);
  const requestedBitness = selection.labviewBitness ?? selection.bitness;
  const labviewBitness = runtimeProvider === "docker" && requestedBitness == null
    ? "x64"
    : normalizeLabviewBitness(requestedBitness);

  if (!runtimeProvider || !platform || !labviewVersion || !labviewBitness) {
    return null;
  }

  return freezeRecord({
    runtimeProvider,
    platform,
    labviewVersion,
    labviewBitness
  });
}

function normalizeRuntimeProvider(value: any) {
  const normalized = normalizeFact(value);
  if (!normalized) {
    return null;
  }
  if (["host", "host-native", "native"].includes(normalized.toLowerCase())) {
    return "host-native";
  }
  if (normalized.toLowerCase() === "docker") {
    return "docker";
  }
  return normalized;
}

function normalizePlatform(value: any) {
  const normalized = normalizeFact(value);
  if (!normalized) {
    return null;
  }
  const lower = normalized.toLowerCase();
  if (["win32", "win64", "windows"].includes(lower)) {
    return "windows";
  }
  if (lower === "linux") {
    return "linux";
  }
  if (["macos", "darwin", "osx"].includes(lower)) {
    return "macos";
  }
  if (["docker", "container", "windows-container"].includes(lower)) {
    return "docker";
  }
  return lower;
}

function normalizeLabviewBitness(value: any) {
  const normalized = normalizeFact(value);
  if (!normalized) {
    return null;
  }
  const lower = normalized.toLowerCase();
  if (["x64", "64", "64-bit", "64bit"].includes(lower)) {
    return "x64";
  }
  if (["x86", "32", "32-bit", "32bit"].includes(lower)) {
    return "x86";
  }
  return lower;
}

function defaultPlatformForProvider(runtimeProvider) {
  return normalizeRuntimeProvider(runtimeProvider) === "docker" ? "docker" : "windows";
}

function isSupportedHostYear(labviewVersion) {
  const year = Number.parseInt(labviewVersion, 10);
  return Number.isInteger(year) && year >= 2025;
}

function hasMatchingHostInstallation(availableHostInstallations: any, selection: any) {
  if (!Array.isArray(availableHostInstallations)) {
    return false;
  }
  return availableHostInstallations.some((installation: any) => {
    if (!isPlainObject(installation) || installation.installed === false) {
      return false;
    }
    const candidate = normalizeInteractiveSelection({
      runtimeProvider: "host-native",
      platform: installation.platform,
      labviewVersion: installation.labviewVersion ?? installation.version,
      labviewBitness: installation.labviewBitness ?? installation.bitness
    });
    return candidate
      && candidate.platform === selection.platform
      && candidate.labviewVersion === selection.labviewVersion
      && candidate.labviewBitness === selection.labviewBitness;
  });
}

function createInteractiveSelectionOptions(availableHostInstallations) {
  const host = Array.isArray(availableHostInstallations)
    ? availableHostInstallations
      .map((installation: any) => normalizeInteractiveSelection({
        runtimeProvider: "host-native",
        platform: installation?.platform,
        labviewVersion: installation?.labviewVersion ?? installation?.version,
        labviewBitness: installation?.labviewBitness ?? installation?.bitness
      }))
      .filter((selection: any) => selection && isSupportedHostYear(selection.labviewVersion))
    : [];

  return freezeRecord({
    host,
    docker: [
      {
        runtimeProvider: "docker",
        platform: "docker",
        labviewVersion: "2026",
        labviewBitness: "x64"
      }
    ]
  });
}

function createInteractiveSelectionGuidance(selection: any) {
  return freezeRecord({
    copyableNextCommands: [
      createSetRuntimeCommand(selection),
      RUNTIME_SETTINGS_VALIDATION_COMMAND
    ],
    nonInteractive: true
  });
}

function createBlockedInteractiveSelectionGuidance(blockedReason: any) {
  return freezeRecord({
    blockedReason,
    copyableNextCommands: [
      "vihs --help",
      "vihs --validate"
    ],
    nonInteractive: true
  });
}

function createSetRuntimeCommand(selection: any) {
  const command = [
    "vihs",
    "--set-provider",
    selection.runtimeProvider,
    "--set-platform",
    selection.platform,
    "--set-labview-version",
    selection.labviewVersion
  ];
  if (selection.runtimeProvider !== "docker") {
    command.push("--set-labview-bitness", selection.labviewBitness);
  }
  return command.join(" ");
}

function createValidationHandoff(selection: any, requested: any) {
  return freezeRecord({
    requested,
    command: RUNTIME_SETTINGS_VALIDATION_COMMAND,
    contract: "runtime-settings-cli-validation-readback-contract",
    selection: selection ?? null
  });
}

function createPromptLoopValidationHandoff(handoff) {
  return freezeRecord({
    requested: handoff?.requested === true,
    command: handoff?.command ?? RUNTIME_SETTINGS_VALIDATION_COMMAND,
    contract: handoff?.contract ?? "runtime-settings-cli-validation-readback-contract",
    selection: handoff?.selection ?? null,
    executionBound: false,
    proofOutBound: false
  });
}

function isConfirmationAccepted(value: any) {
  if (value === true) {
    return true;
  }
  if (typeof value !== "string") {
    return false;
  }
  return ["accept", "accepted", "confirm", "confirmed", "enter"].includes(value.trim().toLowerCase());
}

function terminalPromptLoopBlockedResult({
  blockedReason,
  entrypoint = null,
  currentSelection = null,
  selectionContract = null
}) {
  const attemptedSelection = selectionContract?.selection ?? null;
  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-terminal-prompt-loop-contract",
    command: RUNTIME_SETTINGS_INTERACTIVE_SELECTION_COMMAND,
    blockedReason,
    entrypoint,
    currentSelection,
    attemptedSelection,
    selectedBundle: null,
    confirmation: {
      accepted: false,
      mode: "blocked"
    },
    transcript: createBlockedPromptLoopTranscript(blockedReason),
    validationHandoff: createPromptLoopValidationHandoff(createValidationHandoff(null, false)),
    blockedSideEffects: RUNTIME_SETTINGS_TERMINAL_PROMPT_LOOP_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliTerminalPromptLoopRequirementIds()
  });
}

function terminalIoAdapterBlockedResult({
  blockedReason,
  terminalSession = normalizeTerminalIoSession(),
  terminalInput = null,
  promptLoop = null
}) {
  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-terminal-io-adapter-contract",
    command: RUNTIME_SETTINGS_INTERACTIVE_SELECTION_COMMAND,
    blockedReason,
    terminalSession,
    terminalInput,
    promptLoop,
    transcript: promptLoop?.transcript ?? createBlockedPromptLoopTranscript(blockedReason),
    transcriptLines: (promptLoop?.transcript ?? createBlockedPromptLoopTranscript(blockedReason)).map((step: any) => step.text),
    copyableGuidance: promptLoop?.guidance?.copyableNextCommands ?? [
      "vihs --help",
      RUNTIME_SETTINGS_VALIDATION_COMMAND
    ],
    promptWait: false,
    selectedBundle: null,
    validationHandoff: createPromptLoopValidationHandoff(createValidationHandoff(null, false)),
    blockedSideEffects: RUNTIME_SETTINGS_TERMINAL_IO_ADAPTER_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliTerminalIoAdapterRequirementIds()
  });
}

function createPromptLoopTranscript({ currentSelection, promptMode }) {
  const currentSelectionText = formatRuntimeSelection(currentSelection);
  const transcript = [
    {
      kind: "heading",
      text: "VI History runtime settings"
    },
    {
      kind: "current-selection",
      text: `Current runtime: ${currentSelectionText}`
    },
    {
      kind: "next-command",
      text: `Next command: ${RUNTIME_SETTINGS_VALIDATION_COMMAND}`
    }
  ];

  if (promptMode === "interactive") {
    transcript.push({
      kind: "confirmation",
      text: "Press Enter to confirm this runtime or choose a supported runtime."
    });
  } else {
    transcript.push({
      kind: "non-interactive-guidance",
      text: "Use the copyable command guidance to update or validate runtime settings."
    });
  }

  return freezeRecord(transcript);
}

function createBlockedPromptLoopTranscript(blockedReason: any) {
  return freezeRecord([
    {
      kind: "heading",
      text: "VI History runtime settings"
    },
    {
      kind: "blocked",
      text: `Prompt loop blocked: ${blockedReason}`
    },
    {
      kind: "next-command",
      text: `Next command: ${RUNTIME_SETTINGS_VALIDATION_COMMAND}`
    }
  ]);
}

function normalizePromptLoopCurrentSelection(selection: any, platform: any) {
  if (!selection) {
    return null;
  }
  return normalizeInteractiveSelection({
    runtimeProvider: selection.runtimeProvider ?? selection.provider,
    platform: selection.platform ?? platform,
    labviewVersion: selection.labviewVersion ?? selection.version,
    labviewBitness: selection.labviewBitness ?? selection.bitness
  });
}

function settingsFromSelection(selection: any) {
  if (!selection) {
    return null;
  }
  return {
    [RUNTIME_SETTINGS_KEYS.runtimeProvider]: selection.runtimeProvider,
    [RUNTIME_SETTINGS_KEYS.labviewVersion]: selection.labviewVersion,
    [RUNTIME_SETTINGS_KEYS.labviewBitness]: selection.labviewBitness
  };
}

function formatRuntimeSelection(selection: any) {
  if (!selection) {
    return "not configured";
  }
  return [
    selection.runtimeProvider,
    selection.platform,
    selection.labviewVersion,
    selection.labviewBitness
  ].join("/");
}

function terminalEntrypointBlockedResult({ blockedReason, terminalSession = normalizeTerminalSession() }) {
  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-terminal-entrypoint-contract",
    command: TERMINAL_ENTRYPOINT_COMMAND,
    admissionScope: TERMINAL_ENTRYPOINT_ADMISSION_SCOPE,
    materializationState: "blocked",
    blockedReason,
    terminalSession,
    recoveryInstruction: TERMINAL_ENTRYPOINT_RECOVERY_INSTRUCTION,
    recoveryCommand: TERMINAL_ENTRYPOINT_RECOVERY_COMMAND,
    discoverability: null,
    validationHandoff: createTerminalValidationHandoff(),
    blockedSideEffects: RUNTIME_SETTINGS_TERMINAL_ENTRYPOINT_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliTerminalEntrypointRequirementIds()
  });
}

function normalizeLauncherState(value: any) {
  const normalized = normalizeFact(value);
  if (!normalized) {
    return "present";
  }
  const lower = normalized.toLowerCase();
  if (lower === "missing") {
    return "missing";
  }
  if (lower === "stale") {
    return "stale";
  }
  return "present";
}

function resolveRuntimeLookupFacts(lookup: any, platform: any) {
  const isWindows = platform === "windows";
  const order = isWindows ? TERMINAL_ENTRYPOINT_RUNTIME_LOOKUP_ORDER_WINDOWS : TERMINAL_ENTRYPOINT_RUNTIME_LOOKUP_ORDER_OTHER;
  const vscodeAvailable = lookup.vscodeRuntimeAvailable === true;
  const globalNodeAvailable = lookup.globalNodeAvailable === true;
  const explicitOverride = normalizeFact(lookup.explicitOverride ?? lookup.override);

  let activeRuntime = null;
  if (isWindows && vscodeAvailable) {
    activeRuntime = "vscode-runtime";
  } else if (globalNodeAvailable) {
    activeRuntime = "global-node";
  } else if (explicitOverride) {
    activeRuntime = "explicit-override";
  }

  return freezeRecord({
    platform,
    order,
    activeRuntime,
    vscodeRuntimeAvailable: vscodeAvailable,
    globalNodeAvailable,
    overrideActive: Boolean(explicitOverride),
    explicitOverride: explicitOverride ?? null
  });
}

function normalizeTerminalSession(session) {
  if (!session) {
    return freezeRecord({
      admitted: true,
      scope: "user",
      requestedScope: "user",
      blockedReason: null
    });
  }
  const requestedScope = (normalizeFact(session.scope) ?? "user").toLowerCase();
  const userScoped = requestedScope === "user";
  const admitted = session.admitted !== false && userScoped;
  return freezeRecord({
    admitted,
    scope: "user",
    requestedScope,
    blockedReason: admitted ? null : "unsupported-terminal-session"
  });
}

function normalizeTerminalIoSession(session = {}) {
  const base = normalizeTerminalSession(session);
  const interactive = session.interactive === false || session.isTTY === false || session.tty === false
    ? false
    : true;
  return freezeRecord({
    ...base,
    interactive,
    isTTY: interactive,
    rawDriverBound: false,
    spawnedProcessBound: false
  });
}

function normalizeTerminalInput(input: AnyInput) {
  if (input == null || input === "") {
    return {
      ok: true,
      value: freezeRecord({
        kind: "enter",
        confirmation: "enter",
        requestedSelection: null
      })
    };
  }

  if (typeof input === "string") {
    const normalized = input.trim().toLowerCase();
    if (["enter", "return", "confirm", "confirmed", "accept", "accepted"].includes(normalized)) {
      return {
        ok: true,
        value: freezeRecord({
          kind: "enter",
          confirmation: "enter",
          requestedSelection: null
        })
      };
    }
    if (["cancel", "escape", "esc"].includes(normalized)) {
      return {
        ok: true,
        value: freezeRecord({
          kind: "cancel",
          confirmation: false,
          requestedSelection: null
        })
      };
    }
    if (normalized === "eof") {
      return {
        ok: true,
        value: freezeRecord({
          kind: "eof",
          confirmation: false,
          requestedSelection: null
        })
      };
    }
    return {
      ok: false,
      blockedReason: "unsupported-terminal-input",
      value: freezeRecord({
        kind: "unsupported",
        raw: input
      })
    };
  }

  if (!isPlainObject(input)) {
    return {
      ok: false,
      blockedReason: "unsupported-terminal-input",
      value: null
    };
  }

  const kind = normalizeFact(input.kind ?? input.action ?? input.type)?.toLowerCase();
  if (["cancel", "escape", "esc"].includes(kind)) {
    return {
      ok: true,
      value: freezeRecord({
        kind: "cancel",
        confirmation: false,
        requestedSelection: null
      })
    };
  }
  if (kind === "eof") {
    return {
      ok: true,
      value: freezeRecord({
        kind: "eof",
        confirmation: false,
        requestedSelection: null
      })
    };
  }
  if (kind === "selection" || input.selection || input.requestedSelection) {
    return {
      ok: true,
      value: freezeRecord({
        kind: "selection",
        confirmation: input.confirmation ?? input.confirm ?? "enter",
        requestedSelection: input.selection ?? input.requestedSelection
      })
    };
  }
  if (!kind || ["enter", "return", "confirm", "accepted", "accept"].includes(kind)) {
    return {
      ok: true,
      value: freezeRecord({
        kind: "enter",
        confirmation: input.confirmation ?? input.confirm ?? "enter",
        requestedSelection: null
      })
    };
  }

  return {
    ok: false,
    blockedReason: "unsupported-terminal-input",
    value: freezeRecord({
      kind: "unsupported",
      raw: input
    })
  };
}

function createDiscoverabilityFacts(bundle: any, platform: any) {
  if (!bundle) {
    return freezeRecord({
      currentBundle: null,
      copyableNextCommands: [
        RUNTIME_SETTINGS_VALIDATION_COMMAND
      ],
      promptLoopBound: false
    });
  }

  const normalizedBundle = normalizeInteractiveSelection({
    runtimeProvider: bundle.runtimeProvider ?? bundle.provider,
    platform: bundle.platform ?? platform,
    labviewVersion: bundle.labviewVersion ?? bundle.version,
    labviewBitness: bundle.labviewBitness ?? bundle.bitness
  });

  if (!normalizedBundle) {
    return freezeRecord({
      currentBundle: null,
      copyableNextCommands: [
        RUNTIME_SETTINGS_VALIDATION_COMMAND
      ],
      promptLoopBound: false
    });
  }

  return freezeRecord({
    currentBundle: normalizedBundle,
    copyableNextCommands: [
      createSetRuntimeCommand(normalizedBundle),
      RUNTIME_SETTINGS_VALIDATION_COMMAND
    ],
    promptLoopBound: false
  });
}

function createTerminalValidationHandoff() {
  return Object.freeze({
    command: RUNTIME_SETTINGS_VALIDATION_COMMAND,
    contract: "runtime-settings-cli-validation-readback-contract",
    executionBound: false,
    proofOutBound: false
  });
}

function blockedResult({ blockedReason, effectiveSettingsTarget }) {
  return Object.freeze({
    status: "blocked",
    type: "runtime-settings-cli-settings-write-contract",
    blockedReason,
    partialWrite: false,
    effectiveSettingsTarget,
    blockedSideEffects: RUNTIME_SETTINGS_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliSettingsWriteRequirementIds()
  });
}

function validationProofBlockedResult(blockedReason: any) {
  const validation = freezeRecord({
    status: "blocked",
    blockedReason,
    effectiveSettingsTarget: null,
    persistedSettings: null,
    runtime: {
      runtimeValidationOutcome: "blocked",
      runtimeProvider: "unavailable",
      runtimeEngine: null,
      runtimeBlockedReason: blockedReason,
      runtimeErrorCode: "VIHS_E_MISSING_VALIDATION_PROOF_FACTS",
      runtimeProofStatus: "blocked-with-actionable-error",
      runtimeImplementationStatus: "not-started"
    }
  });
  const proofJson = freezeRecord({
    schema: RUNTIME_SETTINGS_VALIDATION_PROOF_SCHEMA,
    targetAuthority: MIT_PUBLIC_AUTHORITY,
    command: RUNTIME_SETTINGS_VALIDATION_PROOF_COMMAND,
    validation,
    environmentFacts: Object.freeze({}),
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_PROOF_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationProofRequirementIds()
  });

  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-validation-proof-artifact-contract",
    blockedReason,
    proofJson,
    issueBody: createRuntimeSettingsValidationProofIssueBody(proofJson),
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_PROOF_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationProofRequirementIds()
  });
}

function validationProofOutBlockedResult({
  blockedReason,
  request = null,
  proofOutTarget = null,
  proofArtifact = null
}) {
  const guidance = createValidationProofOutGuidance(proofOutTarget);
  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-validation-proof-out-adapter-contract",
    command: request?.command ?? RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_COMMAND,
    blockedReason,
    request,
    proofOutTarget,
    proofArtifactStatus: proofArtifact?.status ?? null,
    artifactFiles: {},
    proofJson: null,
    issueMarkdown: null,
    guidance,
    copyableGuidance: guidance.copyableCommands,
    promptWait: false,
    writeBound: false,
    artifactWrites: false,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationProofOutRequirementIds()
  });
}

function validationProofOutFileEmissionBlockedResult({
  blockedReason,
  proofOutAdapter = null,
  proofOutTarget = null,
  attemptedFiles = [],
  completedFiles = [],
  failedFile = null,
  errorCode = null
}) {
  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-validation-proof-out-file-emission-contract",
    command: proofOutAdapter?.command ?? RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_COMMAND,
    blockedReason,
    proofOutAdapterStatus: proofOutAdapter?.status ?? null,
    proofOutTarget,
    attemptedFiles,
    completedFiles,
    failedFile,
    errorCode,
    artifactWrites: completedFiles.length > 0,
    partialWrite: completedFiles.length > 0,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_FILE_EMISSION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationProofOutFileEmissionRequirementIds()
  });
}

function normalizeReadyValidationProofOutAdapter(adapter) {
  if (!isPlainObject(adapter)) {
    return {
      ok: false,
      blockedReason: "missing-ready-proof-out-adapter"
    };
  }

  if (adapter.type !== "runtime-settings-cli-validation-proof-out-adapter-contract") {
    return {
      ok: false,
      blockedReason: "unsupported-proof-out-adapter",
      proofOutTarget: adapter.proofOutTarget ?? null
    };
  }

  if (adapter.status !== "ready") {
    return {
      ok: false,
      blockedReason: adapter.blockedReason ?? "proof-out-adapter-not-ready",
      proofOutTarget: adapter.proofOutTarget ?? null
    };
  }

  const target = adapter.proofOutTarget;
  if (!isPlainObject(target) || target.publicSafe !== true || !isPublicSafeProofOutTarget(target.identifier)) {
    return {
      ok: false,
      blockedReason: "unsupported-proof-out-target",
      proofOutTarget: target ?? null
    };
  }

  return {
    ok: true,
    value: adapter
  };
}

function resolveValidationProofOutFilePayloads(adapter) {
  const proofJson = adapter.artifactFiles?.proofJson;
  const issueMarkdown = adapter.artifactFiles?.issueMarkdown;
  if (typeof proofJson?.text !== "string" || typeof issueMarkdown?.text !== "string") {
    return {
      ok: false,
      blockedReason: "missing-proof-out-artifact-payload"
    };
  }

  if (
    proofJson.fileName !== RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_PROOF_FILE
    || issueMarkdown.fileName !== RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_ISSUE_FILE
    || proofJson.relativePath !== `${adapter.proofOutTarget.identifier}/${RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_PROOF_FILE}`
    || issueMarkdown.relativePath !== `${adapter.proofOutTarget.identifier}/${RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_ISSUE_FILE}`
  ) {
    return {
      ok: false,
      blockedReason: "unsupported-proof-out-artifact-files"
    };
  }

  return {
    ok: true,
    value: freezeRecord({
      proofJson,
      issueMarkdown
    })
  };
}

function createValidationProofOutFileEmissionPlan(adapter, targetDirectory, payloads) {
  const proofJsonResult = createValidationProofOutFileWriteResult(payloads.proofJson, payloads.proofJson.text);
  const issueMarkdownResult = createValidationProofOutFileWriteResult(payloads.issueMarkdown, payloads.issueMarkdown.text);

  return {
    files: [
      {
        absolutePath: path.join(targetDirectory, RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_PROOF_FILE),
        text: payloads.proofJson.text,
        result: proofJsonResult
      },
      {
        absolutePath: path.join(targetDirectory, RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_ISSUE_FILE),
        text: payloads.issueMarkdown.text,
        result: issueMarkdownResult
      }
    ],
    target: adapter.proofOutTarget
  };
}

function createValidationProofOutFileWriteResult(file, text) {
  return freezeRecord({
    status: "written",
    fileName: file.fileName,
    relativePath: file.relativePath,
    contentType: file.contentType,
    bytes: Buffer.byteLength(text, "utf8")
  });
}

function normalizeValidationProofOutRequest(request = {}, fallbackInput = {}) {
  const target = normalizeValidationProofOutTarget(
    request.proofOutTarget
      ?? request.proofOut
      ?? request.outputTarget
      ?? request.outputDirectory
      ?? request.directory
      ?? request.dir
      ?? request.target
      ?? fallbackInput.proofOutTarget
      ?? fallbackInput.proofOut
      ?? fallbackInput.outputTarget
      ?? fallbackInput.outputDirectory
      ?? fallbackInput.directory
      ?? fallbackInput.dir
      ?? fallbackInput.target
  );

  if (!target.ok) {
    return {
      ok: false,
      blockedReason: target.blockedReason,
      proofOutTarget: target.value ?? null
    };
  }

  return {
    ok: true,
    value: freezeRecord({
      command: `${RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_COMMAND} ${target.value.identifier}`,
      option: "--proof-out",
      proofOut: true,
      proofOutTarget: target.value
    })
  };
}

function normalizeValidationProofOutTarget(target) {
  const identifier = typeof target === "string"
    ? normalizeFact(target)
    : isPlainObject(target)
      ? normalizeFact(target.identifier ?? target.path ?? target.directory ?? target.dir ?? target.value)
      : null;

  if (!identifier) {
    return {
      ok: false,
      blockedReason: "missing-proof-out-target"
    };
  }

  const normalized = identifier.replaceAll("\\", "/").replace(/\/+$/u, "");
  if (!isPublicSafeProofOutTarget(normalized)) {
    return {
      ok: false,
      blockedReason: "unsupported-proof-out-target",
      value: freezeRecord({
        kind: "proof-out-directory",
        identifier: normalized || identifier,
        publicSafe: false
      })
    };
  }

  return {
    ok: true,
    value: freezeRecord({
      kind: "proof-out-directory",
      identifier: normalized,
      publicSafe: true,
      artifactPaths: {
        proofJson: `${normalized}/${RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_PROOF_FILE}`,
        issueMarkdown: `${normalized}/${RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_ISSUE_FILE}`
      }
    })
  };
}

function isPublicSafeProofOutTarget(identifier) {
  if (!identifier || identifier === ".." || identifier.includes("\0")) {
    return false;
  }
  if (identifier.startsWith("/") || identifier.startsWith("~") || identifier.startsWith("\\")) {
    return false;
  }
  if (/^[a-z]:[\\/]/iu.test(identifier) || identifier.includes("://")) {
    return false;
  }
  if (/(^|\/)\.\.(\/|$)/u.test(identifier)) {
    return false;
  }
  return !/(?:\/home\/|\/users\/|\\users\\|secret|password|token|credential|authorization|bearer|private)/iu.test(identifier);
}

function resolveValidationProofOutArtifact(input: AnyInput = {}) {
  const provided = input.validationProofArtifact ?? input.proofArtifact ?? input.artifact;
  if (isPlainObject(provided)) {
    return normalizeProvidedValidationProofOutArtifact(provided);
  }

  const validation = input.validation
    ?? input.validationFacts
    ?? input.validationReadback
    ?? (input.persistedSettings || input.runtime ? input : undefined);
  const artifact = createRuntimeSettingsValidationProofArtifact({
    validation,
    environment: input.environment ?? input.environmentFacts ?? {}
  });

  if (isMissingValidationProofArtifact(artifact)) {
    return {
      ok: false,
      blockedReason: artifact.blockedReason ?? "missing-validation-proof-facts",
      artifact
    };
  }

  return normalizeProvidedValidationProofOutArtifact(artifact);
}

function normalizeValidationCommandRequest(input: AnyInput = {}) {
  const requestedMode = normalizeFact(input.requestMode ?? input.mode);
  if (
    requestedMode
    && requestedMode !== "validate-only"
    && requestedMode !== "validate-with-proof-out"
    && requestedMode !== "validate-plan-only"
  ) {
    return {
      ok: false,
      blockedReason: "unsupported-validation-command-request-mode",
      requestMode: requestedMode
    };
  }

  const proofOut = normalizeFact(
    input.proofOut
      ?? input.proofOutTarget
      ?? input.request?.proofOut
      ?? input.request?.proofOutTarget
  );

  if ((requestedMode === "validate-with-proof-out" || requestedMode === "validate-plan-only") && !proofOut) {
    return {
      ok: false,
      blockedReason: "missing-proof-out-target",
      requestMode: requestedMode
    };
  }

  return {
    ok: true,
    value: freezeRecord({
      command: RUNTIME_SETTINGS_VALIDATION_COMMAND,
      requestMode: requestedMode === "validate-plan-only"
        ? "validate-plan-only"
        : proofOut ? "validate-with-proof-out" : "validate-only",
      proofOut
    })
  };
}

function normalizeProvidedValidationProofOutArtifact(artifact) {
  const issueBody = typeof artifact.issueBody === "string"
    ? artifact.issueBody
    : typeof artifact.issueMarkdown === "string"
      ? artifact.issueMarkdown
      : null;

  if (!isPlainObject(artifact.proofJson) || !issueBody || isMissingValidationProofArtifact(artifact)) {
    return {
      ok: false,
      blockedReason: artifact.blockedReason ?? "missing-validation-proof-facts",
      artifact
    };
  }

  return {
    ok: true,
    value: freezeRecord({
      status: normalizeFact(artifact.status) ?? artifact.proofJson.validation?.status ?? "ready",
      proofJson: artifact.proofJson,
      issueBody,
      requirementIds: artifact.requirementIds ?? allRuntimeSettingsCliValidationProofRequirementIds()
    })
  };
}

function isMissingValidationProofArtifact(artifact) {
  const runtime = artifact?.proofJson?.validation?.runtime ?? {};
  return artifact?.blockedReason === "missing-validation-proof-facts"
    || runtime.runtimeErrorCode === "VIHS_E_MISSING_VALIDATION_PROOF_FACTS";
}

function createValidationProofOutArtifactFiles(target, artifact) {
  return freezeRecord({
    proofJson: {
      fileName: RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_PROOF_FILE,
      relativePath: target.artifactPaths.proofJson,
      contentType: "application/json",
      content: artifact.proofJson,
      text: `${JSON.stringify(artifact.proofJson, null, 2)}\n`,
      writeBound: false
    },
    issueMarkdown: {
      fileName: RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_ISSUE_FILE,
      relativePath: target.artifactPaths.issueMarkdown,
      contentType: "text/markdown",
      content: artifact.issueBody,
      text: artifact.issueBody.endsWith("\n") ? artifact.issueBody : `${artifact.issueBody}\n`,
      writeBound: false
    }
  });
}

function createValidationProofOutGuidance(target = null) {
  const targetIdentifier = target?.publicSafe === true ? target.identifier : "<dir>";
  return freezeRecord({
    nonInteractive: true,
    promptWait: false,
    copyableCommands: [
      `${RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_COMMAND} ${targetIdentifier}`
    ]
  });
}

function createValidationCommandGuidance({ requestMode, proofOut } = {}) {
  const copyableCommand = requestMode === "validate-with-proof-out" || requestMode === "validate-plan-only"
    ? `${RUNTIME_SETTINGS_VALIDATION_PROOF_OUT_COMMAND} ${proofOut ?? "<dir>"}`
    : RUNTIME_SETTINGS_VALIDATION_COMMAND;
  return freezeRecord({
    nonInteractive: true,
    promptWait: false,
    copyableCommands: [copyableCommand]
  });
}

function validationCommandContractResult({
  status,
  requestMode,
  blockedReason = null,
  validation = null,
  proofOut = null
}) {
  const publicSafeProofOut = proofOut?.proofOutTarget?.publicSafe === true
    ? proofOut.proofOutTarget.identifier
    : null;
  const guidance = createValidationCommandGuidance({
    requestMode: requestMode?.startsWith("validate-with-proof-out")
      ? "validate-with-proof-out"
      : requestMode?.startsWith("validate-plan-only") ? "validate-plan-only" : "validate-only",
    proofOut: publicSafeProofOut
  });
  return freezeRecord({
    status,
    type: "runtime-settings-cli-validation-command-contract",
    command: RUNTIME_SETTINGS_VALIDATION_COMMAND,
    requestMode,
    blockedReason,
    validationStatus: validation?.status ?? (status === "ready" ? "ready" : "blocked"),
    validation,
    effectiveSettingsTarget: validation?.effectiveSettingsTarget ?? null,
    persistedSettings: validation?.persistedSettings ?? null,
    runtimeOutcome: validation?.runtime ?? null,
    proofOut,
    guidance,
    copyableGuidance: guidance.copyableCommands,
    promptWait: false,
    artifactWrites: proofOut?.artifactWrites ?? false,
    partialWrite: proofOut?.partialWrite ?? false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_COMMAND_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationCommandRequirementIds()
  });
}

function validationBlockedResult({
  blockedReason,
  runtimeErrorCode,
  effectiveSettingsTarget,
  persistedSettings = null
}) {
  return Object.freeze({
    status: "blocked",
    type: "runtime-settings-cli-validation-readback-contract",
    blockedReason,
    partialWrite: false,
    effectiveSettingsTarget,
    persistedSettings,
    runtime: Object.freeze({
      runtimeValidationOutcome: "blocked",
      runtimeProvider: "unavailable",
      runtimeEngine: null,
      runtimeBlockedReason: blockedReason,
      runtimeErrorCode,
      runtimeProofStatus: "blocked-with-actionable-error",
      runtimeImplementationStatus: "not-started"
    }),
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationReadbackRequirementIds()
  });
}

function normalizeValidationProofFacts(validation = {}) {
  if (!isPlainObject(validation)) {
    return {
      ok: false,
      blockedReason: "missing-validation-proof-facts"
    };
  }

  const persistedSettings = normalizeRuntimeSettingsFacts(validation.persistedSettings ?? {});
  if (!persistedSettings.ok) {
    return {
      ok: false,
      blockedReason: "missing-validation-proof-facts"
    };
  }

  const runtime = normalizeRuntimeOutcome(validation.runtime ?? {});
  if (!runtime.ok) {
    return {
      ok: false,
      blockedReason: "missing-validation-proof-facts"
    };
  }

  return {
    ok: true,
    value: freezeRecord({
      status: normalizeFact(validation.status) ?? runtime.value.runtimeValidationOutcome,
      effectiveSettingsTarget: normalizeEffectiveSettingsTarget(validation.effectiveSettingsTarget ?? validation.target ?? "user"),
      persistedSettings: persistedSettings.value,
      runtime: runtime.value
    })
  };
}

function readPersistedRuntimeSettingsFacts(settings) {
  const runtimeProvider = normalizeFact(settings[RUNTIME_SETTINGS_KEYS.runtimeProvider]);
  const labviewVersion = normalizeFact(settings[RUNTIME_SETTINGS_KEYS.labviewVersion]);
  const labviewBitness = normalizeFact(settings[RUNTIME_SETTINGS_KEYS.labviewBitness]);

  if (!runtimeProvider || !labviewVersion || !labviewBitness) {
    return {
      ok: false,
      blockedReason: "missing-persisted-runtime-settings"
    };
  }

  return {
    ok: true,
    value: Object.freeze({
      runtimeProvider,
      labviewVersion,
      labviewBitness
    })
  };
}

function normalizeHostRuntimePreflightSelection(input: AnyInput = {}) {
  const selection = input.selection
    ?? input.runtimeSelection
    ?? input.runtimeFacts
    ?? input.persistedSettings
    ?? input.settings
    ?? input;
  const parsedSettings = isPlainObject(selection) && Object.values(RUNTIME_SETTINGS_KEYS).some((key: any) => key in selection)
    ? readPersistedRuntimeSettingsFacts(selection)
    : null;
  const source = parsedSettings?.ok === true ? parsedSettings.value : selection;

  if (!isPlainObject(source)) {
    return {
      ok: false,
      blockedReason: "missing-selection-facts"
    };
  }

  const runtimeProvider = normalizeRuntimeProvider(
    source.runtimeProvider
      ?? source.provider
      ?? source.selectedProvider
      ?? source.requestedProvider
  );
  const labviewVersion = normalizeFact(source.labviewVersion ?? source.version);
  const labviewBitness = normalizeLabviewBitness(source.labviewBitness ?? source.bitness);
  const platform = normalizePlatform(source.platform ?? input.platform ?? defaultPlatformForProvider(runtimeProvider));

  if (!runtimeProvider || !labviewVersion || !labviewBitness || !platform) {
    return {
      ok: false,
      blockedReason: "missing-selection-facts",
      value: null
    };
  }

  return {
    ok: true,
    value: freezeRecord({
      runtimeProvider,
      platform,
      labviewVersion,
      labviewBitness
    })
  };
}

function normalizeHostRuntimePreflightCandidates(input: AnyInput = {}) {
  const candidates = input.hostCandidates
    ?? input.hostRuntimeCandidates
    ?? input.availableHostInstallations
    ?? input.hostInstallations
    ?? input.candidates
    ?? input.hostRuntimeDiscovery?.hostCandidates
    ?? input.runtimeDiscovery?.hostCandidates
    ?? input.discovery?.hostCandidates;

  if (candidates == null) {
    return {
      ok: false,
      blockedReason: "missing-host-runtime-candidate",
      count: 0
    };
  }

  if (!Array.isArray(candidates)) {
    return {
      ok: false,
      blockedReason: "malformed-host-runtime-preflight-input",
      count: 0
    };
  }

  const normalized = [];
  for (const candidate of candidates) {
    const normalizedCandidate = normalizeHostRuntimePreflightCandidate(candidate);
    if (!normalizedCandidate.ok) {
      return {
        ok: false,
        blockedReason: normalizedCandidate.blockedReason,
        count: candidates.length
      };
    }
    normalized.push(normalizedCandidate.value);
  }

  if (normalized.length === 0) {
    return {
      ok: false,
      blockedReason: "missing-host-runtime-candidate",
      count: 0
    };
  }

  return {
    ok: true,
    value: freezeRecord(normalized)
  };
}

function normalizeHostRuntimePreflightCandidate(candidate) {
  if (!isPlainObject(candidate)) {
    return {
      ok: false,
      blockedReason: "malformed-host-runtime-preflight-input"
    };
  }

  const labviewExecutable = normalizeLabviewExecutableFacts(candidate);
  const labviewCli = normalizeLabviewCliFacts(candidate);

  return {
    ok: true,
    value: freezeRecord({
      kind: "host-runtime-candidate",
      publicSafe: true,
      available: candidate.available !== false && candidate.installed !== false,
      contaminated: candidate.contaminated === true || candidate.surfaceContaminated === true,
      platform: normalizePlatform(candidate.platform ?? candidate.osFamily ?? "windows"),
      labviewVersion: normalizeFact(candidate.labviewVersion ?? candidate.version ?? labviewExecutable.version),
      labviewBitness: normalizeLabviewBitness(candidate.labviewBitness ?? candidate.bitness ?? labviewExecutable.bitness),
      labviewExecutable,
      labviewCli
    })
  };
}

function normalizeLabviewExecutableFacts(candidate) {
  const executable = isPlainObject(candidate.labviewExecutable)
    ? candidate.labviewExecutable
    : isPlainObject(candidate.labview)
      ? candidate.labview
      : {};
  const available = candidate.labviewExecutable === false
    ? false
    : executable.available ?? executable.present ?? candidate.labviewExecutableAvailable ?? candidate.labviewExecutablePresent;

  return freezeRecord({
    role: "labview-executable",
    available: available === true,
    version: normalizeFact(executable.labviewVersion ?? executable.version ?? candidate.labviewExecutableVersion ?? candidate.labviewVersion ?? candidate.version),
    bitness: normalizeLabviewBitness(executable.labviewBitness ?? executable.bitness ?? candidate.labviewExecutableBitness ?? candidate.labviewBitness ?? candidate.bitness)
  });
}

function normalizeLabviewCliFacts(candidate) {
  const cli = isPlainObject(candidate.labviewCli)
    ? candidate.labviewCli
    : isPlainObject(candidate.labviewCliExecutable)
      ? candidate.labviewCliExecutable
      : {};
  const available = candidate.labviewCli === false || candidate.labviewCliExecutable === false
    ? false
    : cli.available ?? cli.present ?? candidate.labviewCliAvailable ?? candidate.labviewCliPresent;
  const role = normalizeFact(cli.role ?? candidate.labviewCliRole ?? candidate.cliRole);
  const canonical = cli.canonical === true
    || candidate.canonicalLabviewCli === true
    || candidate.labviewCliCanonical === true
    || role === "canonical-labview-cli";

  return freezeRecord({
    role: canonical ? "canonical-labview-cli" : (role ?? "labview-cli"),
    available: available === true,
    canonical,
    bitness: normalizeLabviewBitness(cli.labviewBitness ?? cli.bitness ?? candidate.labviewCliBitness ?? candidate.cliBitness)
  });
}

function analyzeHostRuntimePreflightCandidate(candidate, selection) {
  if (candidate.contaminated) {
    return hostCandidateAnalysis(candidate, "windows-host-runtime-surface-contaminated");
  }
  if (!candidate.available) {
    return hostCandidateAnalysis(candidate, "missing-host-runtime-candidate");
  }
  if (candidate.platform !== selection.platform) {
    return hostCandidateAnalysis(candidate, "host-platform-mismatch");
  }
  if (!candidate.labviewExecutable.available) {
    return hostCandidateAnalysis(candidate, "labview-exe-not-found");
  }
  if (candidate.labviewExecutable.version !== selection.labviewVersion || candidate.labviewVersion !== selection.labviewVersion) {
    return hostCandidateAnalysis(candidate, "labview-version-mismatch");
  }
  if (candidate.labviewExecutable.bitness !== selection.labviewBitness || candidate.labviewBitness !== selection.labviewBitness) {
    return hostCandidateAnalysis(candidate, "labview-bitness-mismatch");
  }
  if (!candidate.labviewCli.available || !candidate.labviewCli.canonical) {
    return hostCandidateAnalysis(candidate, "canonical-labview-cli-not-found");
  }
  if (!isHostRuntimePreflightCliBitnessCompatible(candidate, selection)) {
    return hostCandidateAnalysis(candidate, "labview-cli-not-found-for-bitness");
  }

  return freezeRecord({
    compatible: true,
    candidate,
    blockedReason: null
  });
}

function hostCandidateAnalysis(candidate, blockedReason) {
  return freezeRecord({
    compatible: false,
    candidate,
    blockedReason
  });
}

function isHostRuntimePreflightCliBitnessCompatible(candidate, selection) {
  if (!candidate.labviewCli.bitness) {
    return false;
  }
  if (candidate.labviewCli.bitness === selection.labviewBitness) {
    return true;
  }
  return selection.platform === "windows"
    && selection.labviewVersion === "2026"
    && selection.labviewBitness === "x64"
    && candidate.labviewExecutable.bitness === "x64"
    && candidate.labviewCli.bitness === "x86"
    && candidate.labviewCli.canonical;
}

function selectHostRuntimePreflightBlockedReason(analyses) {
  const reasons = analyses.map((analysis: any) => analysis.blockedReason).filter(Boolean);
  for (const reason of [
    "windows-host-runtime-surface-contaminated",
    "labview-exe-not-found",
    "canonical-labview-cli-not-found",
    "labview-version-mismatch",
    "labview-bitness-mismatch",
    "labview-cli-not-found-for-bitness",
    "host-platform-mismatch",
    "missing-host-runtime-candidate"
  ]) {
    if (reasons.includes(reason)) {
      return reason;
    }
  }
  return "missing-host-runtime-candidate";
}

function createHostRuntimePreflightRuntimeSelection(selection, blockedReason = null) {
  if (blockedReason) {
    return freezeRecord({
      provider: "unavailable",
      runtimeProvider: "unavailable",
      engine: null,
      runtimeEngine: null,
      platform: selection?.platform ?? null,
      labviewVersion: selection?.labviewVersion ?? null,
      labviewBitness: selection?.labviewBitness ?? null,
      blockedReason,
      runtimeBlockedReason: blockedReason
    });
  }

  return freezeRecord({
    provider: "host-native",
    runtimeProvider: "host-native",
    engine: "labview-cli",
    runtimeEngine: "labview-cli",
    platform: selection.platform,
    labviewVersion: selection.labviewVersion,
    labviewBitness: selection.labviewBitness,
    blockedReason: null,
    runtimeBlockedReason: null
  });
}

function hostRuntimePreflightBlockedResult({
  blockedReason,
  selection = null,
  hostCandidateCount = 0,
  compatibleHostCandidateCount = 0
}) {
  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-validation-host-runtime-preflight-contract",
    preflightBoundary: "supplied-public-safe-host-candidate-facts-only",
    selection,
    hostCandidateCount,
    compatibleHostCandidateCount,
    selectedHostCandidate: null,
    mixedBitnessAccepted: false,
    runtimeSelection: createHostRuntimePreflightRuntimeSelection(selection, blockedReason),
    blockedReason,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_PREFLIGHT_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimePreflightRequirementIds()
  });
}

function hostRuntimeDiscoveryBlockedResult({
  blockedReason,
  selection = null,
  hostCandidates = [],
  preflight = null
}) {
  const frozenCandidates = Array.isArray(hostCandidates) ? freezeRecord(hostCandidates) : freezeRecord([]);
  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-validation-host-runtime-discovery-contract",
    discoveryBoundary: "bounded-public-safe-discovery-facts-only",
    selection,
    observationCount: frozenCandidates.length,
    hostCandidates: frozenCandidates,
    hostCandidateCount: frozenCandidates.length,
    compatibleHostCandidateCount: preflight?.compatibleHostCandidateCount ?? 0,
    preflight,
    runtimeSelection: preflight?.runtimeSelection ?? createHostRuntimePreflightRuntimeSelection(selection, blockedReason),
    blockedReason,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_DISCOVERY_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimeDiscoveryRequirementIds()
  });
}

function hostRuntimeObservationBlockedResult({
  blockedReason,
  selection = null,
  discoveryObservations = [],
  discovery = null
}) {
  const frozenObservations = Array.isArray(discoveryObservations)
    ? freezeRecord(discoveryObservations)
    : freezeRecord([]);
  const hostCandidates = discovery?.hostCandidates ?? freezeRecord([]);
  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-validation-host-runtime-observation-adapter-contract",
    observationBoundary: "bounded-public-safe-observation-facts-only",
    selection,
    observationCount: frozenObservations.length,
    discoveryObservations: frozenObservations,
    hostDiscoveryObservations: frozenObservations,
    discovery,
    preflight: discovery?.preflight ?? null,
    hostCandidates,
    hostCandidateCount: discovery?.hostCandidateCount ?? hostCandidates.length,
    compatibleHostCandidateCount: discovery?.compatibleHostCandidateCount ?? 0,
    runtimeSelection: discovery?.runtimeSelection ?? createHostRuntimePreflightRuntimeSelection(selection, blockedReason),
    blockedReason,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimeObservationRequirementIds()
  });
}

function hostRuntimeObservationSourceBlockedResult({
  blockedReason,
  selection = null,
  sourceFacts = [],
  observationDependencyFacts = [],
  observation = null
}) {
  const frozenSources = Array.isArray(sourceFacts) ? freezeRecord(sourceFacts) : freezeRecord([]);
  const frozenDependencies = Array.isArray(observationDependencyFacts)
    ? freezeRecord(observationDependencyFacts)
    : freezeRecord([]);
  const observationDependencies = createObservationDependenciesFromSourceFacts(frozenDependencies);
  const hostCandidates = observation?.hostCandidates ?? freezeRecord([]);

  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-validation-host-runtime-observation-source-adapter-contract",
    sourceAdapterBoundary: "bounded-public-safe-observation-source-facts-only",
    selection,
    sourceCount: frozenSources.length,
    sourceFacts: frozenSources,
    observationDependencyFacts: frozenDependencies,
    observationDependencies,
    observation,
    discovery: observation?.discovery ?? null,
    preflight: observation?.preflight ?? null,
    hostCandidates,
    hostCandidateCount: observation?.hostCandidateCount ?? hostCandidates.length,
    compatibleHostCandidateCount: observation?.compatibleHostCandidateCount ?? 0,
    runtimeSelection: observation?.runtimeSelection ?? createHostRuntimePreflightRuntimeSelection(selection, blockedReason),
    blockedReason,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimeObservationSourceRequirementIds()
  });
}

function hostRuntimeObservationSourceAcquisitionBlockedResult({
  blockedReason,
  selection = null,
  acquisitionDependencyFacts = [],
  sourceFacts = [],
  sourceAdapter = null
}) {
  const frozenDependencies = Array.isArray(acquisitionDependencyFacts)
    ? freezeRecord(acquisitionDependencyFacts)
    : freezeRecord([]);
  const frozenSources = Array.isArray(sourceFacts) ? freezeRecord(sourceFacts) : freezeRecord([]);
  const hostCandidates = sourceAdapter?.hostCandidates ?? freezeRecord([]);

  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-validation-host-runtime-observation-source-acquisition-contract",
    sourceAcquisitionBoundary: "bounded-native-host-source-acquisition-dependencies-only",
    selection,
    acquisitionDependencyCount: frozenDependencies.length,
    acquisitionDependencyFacts: frozenDependencies,
    sourceCount: frozenSources.length,
    sourceFacts: frozenSources,
    sourceAdapter,
    observation: sourceAdapter?.observation ?? null,
    discovery: sourceAdapter?.discovery ?? null,
    preflight: sourceAdapter?.preflight ?? null,
    hostCandidates,
    hostCandidateCount: sourceAdapter?.hostCandidateCount ?? hostCandidates.length,
    compatibleHostCandidateCount: sourceAdapter?.compatibleHostCandidateCount ?? 0,
    runtimeSelection: sourceAdapter?.runtimeSelection ?? createHostRuntimePreflightRuntimeSelection(selection, blockedReason),
    blockedReason,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_SOURCE_ACQUISITION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimeObservationSourceAcquisitionRequirementIds()
  });
}

function hostRuntimeObservationNativeSourceAcquisitionBlockedResult({
  blockedReason,
  selection = null,
  nativeAcquisitionDependencyFacts = [],
  acquisitionDependencyFacts = [],
  sourceAcquisition = null
}) {
  const frozenNativeDependencies = Array.isArray(nativeAcquisitionDependencyFacts)
    ? freezeRecord(nativeAcquisitionDependencyFacts)
    : freezeRecord([]);
  const frozenAcquisitionDependencies = Array.isArray(acquisitionDependencyFacts)
    ? freezeRecord(acquisitionDependencyFacts)
    : freezeRecord([]);
  const hostCandidates = sourceAcquisition?.hostCandidates ?? freezeRecord([]);

  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-contract",
    nativeSourceAcquisitionBoundary: "bounded-native-host-source-acquisition-dependency-adapter-only",
    selection,
    nativeAcquisitionDependencyCount: frozenNativeDependencies.length,
    nativeAcquisitionDependencyFacts: frozenNativeDependencies,
    acquisitionDependencyCount: frozenAcquisitionDependencies.length,
    acquisitionDependencyFacts: frozenAcquisitionDependencies,
    sourceAcquisition,
    sourceCount: sourceAcquisition?.sourceCount ?? 0,
    sourceFacts: sourceAcquisition?.sourceFacts ?? freezeRecord([]),
    sourceAdapter: sourceAcquisition?.sourceAdapter ?? null,
    observation: sourceAcquisition?.observation ?? null,
    discovery: sourceAcquisition?.discovery ?? null,
    preflight: sourceAcquisition?.preflight ?? null,
    hostCandidates,
    hostCandidateCount: sourceAcquisition?.hostCandidateCount ?? hostCandidates.length,
    compatibleHostCandidateCount: sourceAcquisition?.compatibleHostCandidateCount ?? 0,
    runtimeSelection: sourceAcquisition?.runtimeSelection ?? createHostRuntimePreflightRuntimeSelection(selection, blockedReason),
    blockedReason,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_ACQUISITION_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimeObservationNativeSourceAcquisitionRequirementIds()
  });
}

function hostRuntimeObservationNativeSourceProbeBlockedResult({
  blockedReason,
  selection = null,
  nativeSourceProbeFacts = [],
  nativeAcquisitionObservations = [],
  nativeSourceAcquisition = null
}) {
  const frozenProbeFacts = Array.isArray(nativeSourceProbeFacts)
    ? freezeRecord(nativeSourceProbeFacts)
    : freezeRecord([]);
  const frozenAcquisitionObservations = Array.isArray(nativeAcquisitionObservations)
    ? freezeRecord(nativeAcquisitionObservations)
    : freezeRecord([]);
  const hostCandidates = nativeSourceAcquisition?.hostCandidates ?? freezeRecord([]);

  return freezeRecord({
    status: "blocked",
    type: "runtime-settings-cli-validation-host-runtime-observation-native-source-probe-contract",
    nativeSourceProbeBoundary: "bounded-native-host-source-surface-probe-only",
    selection,
    nativeSourceProbeCount: frozenProbeFacts.length,
    nativeSourceProbeFacts: frozenProbeFacts,
    nativeAcquisitionObservationCount: frozenAcquisitionObservations.length,
    nativeAcquisitionObservations: frozenAcquisitionObservations,
    nativeSourceAcquisition,
    sourceAcquisition: nativeSourceAcquisition?.sourceAcquisition ?? null,
    sourceAdapter: nativeSourceAcquisition?.sourceAdapter ?? null,
    observation: nativeSourceAcquisition?.observation ?? null,
    discovery: nativeSourceAcquisition?.discovery ?? null,
    preflight: nativeSourceAcquisition?.preflight ?? null,
    hostCandidates,
    hostCandidateCount: nativeSourceAcquisition?.hostCandidateCount ?? hostCandidates.length,
    compatibleHostCandidateCount: nativeSourceAcquisition?.compatibleHostCandidateCount ?? 0,
    runtimeSelection: nativeSourceAcquisition?.runtimeSelection ?? createHostRuntimePreflightRuntimeSelection(selection, blockedReason),
    blockedReason,
    partialWrite: false,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_HOST_RUNTIME_OBSERVATION_NATIVE_SOURCE_PROBE_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationHostRuntimeObservationNativeSourceProbeRequirementIds()
  });
}

function normalizeHostRuntimeObservationNativeSourceProbeDependencies(input = {}, selection) {
  const collected = collectHostRuntimeObservationNativeSourceProbeDependencies(input);
  if (!collected.ok) {
    return collected;
  }

  if (collected.value.length === 0) {
    return {
      ok: false,
      blockedReason: "missing-native-source-probe-dependency"
    };
  }

  const nativeSourceProbeFacts = [];
  const nativeAcquisitionObservations = [];
  const windowsRegistryViewNativeAcquisitions = [];
  const documentedRootNativeAcquisitions = [];

  for (const dependency of collected.value) {
    const normalized = normalizeHostRuntimeObservationNativeSourceProbeDependency(dependency, selection);
    if (!normalized.ok) {
      return {
        ok: false,
        blockedReason: normalized.blockedReason,
        value: nativeSourceProbeFacts,
        nativeAcquisitionObservations,
        windowsRegistryViewNativeAcquisitions,
        documentedRootNativeAcquisitions
      };
    }
    nativeSourceProbeFacts.push(normalized.nativeSourceProbeFact);
    nativeAcquisitionObservations.push(normalized.nativeAcquisitionObservation);
    if (normalized.nativeAcquisitionObservation.kind === "windows-registry-view-native-acquisition") {
      windowsRegistryViewNativeAcquisitions.push(normalized.nativeAcquisitionObservation);
    } else if (normalized.nativeAcquisitionObservation.kind === "documented-root-native-acquisition") {
      documentedRootNativeAcquisitions.push(normalized.nativeAcquisitionObservation);
    }
  }

  return {
    ok: true,
    value: freezeRecord(nativeSourceProbeFacts),
    nativeAcquisitionObservations: freezeRecord(nativeAcquisitionObservations),
    windowsRegistryViewNativeAcquisitions: freezeRecord(windowsRegistryViewNativeAcquisitions),
    documentedRootNativeAcquisitions: freezeRecord(documentedRootNativeAcquisitions)
  };
}

function collectHostRuntimeObservationNativeSourceProbeDependencies(input: AnyInput = {}) {
  const dependencyContainers = [];
  for (const dependencyContainer of [
    input.probeDependencies,
    input.nativeSourceProbeDependencies,
    input.hostRuntimeObservationNativeSourceProbeDependencies,
    input.runtimeObservationNativeSourceProbeDependencies,
    input.dependencies
  ]) {
    if (dependencyContainer === undefined || dependencyContainer === null) {
      continue;
    }
    if (!isPlainObject(dependencyContainer)) {
      return {
        ok: false,
        blockedReason: "malformed-native-source-probe-input"
      };
    }
    dependencyContainers.push(dependencyContainer);
  }

  const collected = [];
  for (const container of dependencyContainers) {
    for (const [key, value] of Object.entries(container)) {
      if (key === "windowsRegistryViewProbes" || key === "windowsRegistryViewNativeProbes") {
        if (!Array.isArray(value)) {
          return {
            ok: false,
            blockedReason: "malformed-native-source-probe-input"
          };
        }
        for (const probe of value) {
          collected.push({ ...probe, probeSourceClass: "windows-registry-view" });
        }
      } else if (key === "documentedRootProbes" || key === "documentedRootNativeProbes") {
        if (!Array.isArray(value)) {
          return {
            ok: false,
            blockedReason: "malformed-native-source-probe-input"
          };
        }
        for (const probe of value) {
          collected.push({ ...probe, probeSourceClass: "documented-root" });
        }
      } else if (key === "nativeSourceProbeFacts" || key === "probeFacts") {
        if (!Array.isArray(value)) {
          return {
            ok: false,
            blockedReason: "malformed-native-source-probe-input"
          };
        }
        for (const probe of value) {
          collected.push(probe);
        }
      }
    }
  }

  return {
    ok: true,
    value: collected
  };
}

function normalizeHostRuntimeObservationNativeSourceProbeDependency(dependency, selection) {
  if (!isPlainObject(dependency)) {
    return {
      ok: false,
      blockedReason: "malformed-native-source-probe-input"
    };
  }

  const probeSourceClass = dependency.probeSourceClass ?? dependency.kind ?? dependency.sourceClass;
  if (!probeSourceClass) {
    return {
      ok: false,
      blockedReason: "unsupported-native-source-probe-class"
    };
  }

  if (dependency.rawRegistryOutput || dependency.rawRegistry) {
    return {
      ok: false,
      blockedReason: "malformed-native-registry-probe"
    };
  }

  if (dependency.installPath || dependency.privatePath || dependency.rawPath) {
    return {
      ok: false,
      blockedReason: "private-path-disclosure-attempt"
    };
  }

  if (dependency.contaminated) {
    return {
      ok: false,
      blockedReason: selection?.platform === "windows"
        ? "windows-host-runtime-surface-contaminated"
        : "linux-host-runtime-surface-contaminated"
    };
  }

  if (dependency.probeError || dependency.dependencyError) {
    return {
      ok: false,
      blockedReason: "native-source-probe-error"
    };
  }

  if (dependency.probeUnavailable || dependency.unavailable) {
    return {
      ok: false,
      blockedReason: "native-source-probe-unavailable"
    };
  }

  if (dependency.ambiguous) {
    return {
      ok: false,
      blockedReason: "ambiguous-native-source-probe"
    };
  }

  if (probeSourceClass === "windows-registry-view") {
    return normalizeWindowsRegistryViewNativeSourceProbe(dependency, selection);
  }

  if (probeSourceClass === "documented-root") {
    return normalizeDocumentedRootNativeSourceProbe(dependency, selection);
  }

  return {
    ok: false,
    blockedReason: "unsupported-native-source-probe-class"
  };
}

function normalizeWindowsRegistryViewNativeSourceProbe(dependency, selection) {
  if (selection?.platform !== "windows") {
    return {
      ok: false,
      blockedReason: "host-platform-mismatch"
    };
  }

  const labviewVersion = dependency.labviewVersion ?? selection?.labviewVersion ?? "2026";
  const labviewBitness = dependency.labviewBitness ?? selection?.labviewBitness ?? "x64";
  const registryView = dependency.registryView ?? (labviewBitness === "x64" ? "64-bit" : "32-bit");

  const labviewExecutable = dependency.labviewExecutable ?? {
    available: true,
    version: labviewVersion,
    bitness: labviewBitness
  };

  const labviewCli = dependency.labviewCli ?? {
    available: true,
    canonical: true,
    bitness: "x86"
  };

  const nativeSourceProbeFact = freezeRecord({
    kind: "host-runtime-observation-native-source-probe",
    probeSourceClass: "windows-registry-view",
    probeId: `labview-${labviewVersion}-windows-${labviewBitness}-native-registry-probe`,
    platform: "windows",
    labviewVersion,
    labviewBitness,
    registryView,
    labviewExecutable: freezeRecord({
      role: "labview-executable",
      available: labviewExecutable.available,
      version: labviewExecutable.version,
      bitness: labviewExecutable.bitness
    }),
    labviewCli: freezeRecord({
      role: "canonical-labview-cli",
      available: labviewCli.available,
      canonical: labviewCli.canonical,
      bitness: labviewCli.bitness
    })
  });

  const nativeAcquisitionObservation = freezeRecord({
    kind: "windows-registry-view-native-acquisition",
    registryView,
    nativeAcquisitionId: `labview-${labviewVersion}-windows-${labviewBitness}-native-registry-acquisition`,
    platform: "windows",
    labviewVersion,
    labviewBitness,
    labviewExecutable: freezeRecord({
      available: labviewExecutable.available,
      version: labviewExecutable.version,
      bitness: labviewExecutable.bitness
    }),
    labviewCli: freezeRecord({
      available: labviewCli.available,
      canonical: labviewCli.canonical,
      bitness: labviewCli.bitness
    })
  });

  return {
    ok: true,
    nativeSourceProbeFact,
    nativeAcquisitionObservation
  };
}

function normalizeDocumentedRootNativeSourceProbe(dependency, selection) {
  if (selection?.platform !== "linux") {
    return {
      ok: false,
      blockedReason: "host-platform-mismatch"
    };
  }

  const labviewVersion = dependency.labviewVersion ?? selection?.labviewVersion ?? "2026";
  const labviewBitness = dependency.labviewBitness ?? selection?.labviewBitness ?? "x64";
  const documentedRoot = dependency.documentedRoot ?? `ni-labview-${labviewVersion}-linux-root`;

  const labviewExecutable = dependency.labviewExecutable ?? {
    available: true,
    version: labviewVersion,
    bitness: labviewBitness
  };

  const labviewCli = dependency.labviewCli ?? {
    available: true,
    canonical: true,
    bitness: labviewBitness
  };

  const nativeSourceProbeFact = freezeRecord({
    kind: "host-runtime-observation-native-source-probe",
    probeSourceClass: "documented-root",
    probeId: `labview-${labviewVersion}-linux-${labviewBitness}-native-documented-root-probe`,
    platform: "linux",
    labviewVersion,
    labviewBitness,
    documentedRoot,
    labviewExecutable: freezeRecord({
      role: "labview-executable",
      available: labviewExecutable.available,
      version: labviewExecutable.version,
      bitness: labviewExecutable.bitness
    }),
    labviewCli: freezeRecord({
      role: "canonical-labview-cli",
      available: labviewCli.available,
      canonical: labviewCli.canonical,
      bitness: labviewCli.bitness
    })
  });

  const nativeAcquisitionObservation = freezeRecord({
    kind: "documented-root-native-acquisition",
    documentedRoot,
    nativeAcquisitionId: `labview-${labviewVersion}-linux-${labviewBitness}-native-documented-root-acquisition`,
    platform: "linux",
    labviewVersion,
    labviewBitness,
    labviewExecutable: freezeRecord({
      available: labviewExecutable.available,
      version: labviewExecutable.version,
      bitness: labviewExecutable.bitness
    }),
    labviewCli: freezeRecord({
      available: labviewCli.available,
      canonical: labviewCli.canonical,
      bitness: labviewCli.bitness
    })
  });

  return {
    ok: true,
    nativeSourceProbeFact,
    nativeAcquisitionObservation
  };
}

function nativeSourceProbeBlockedReasonForNativeSourceAcquisitionBlockedReason(blockedReason: any) {
  const mapping = {
    "missing-selection-facts": "missing-selection-facts",
    "unsupported-runtime-provider": "unsupported-runtime-provider",
    "unsupported-host-platform": "unsupported-host-platform",
    "unsupported-host-year": "unsupported-host-year",
    "missing-native-source-acquisition-dependency": "missing-native-source-probe-dependency",
    "malformed-native-source-acquisition-input": "malformed-native-source-probe-input",
    "unsupported-native-source-acquisition-class": "unsupported-native-source-probe-class",
    "missing-host-runtime-candidate": "missing-host-runtime-candidate",
    "ambiguous-host-runtime-candidate": "ambiguous-host-runtime-candidate",
    "host-platform-mismatch": "host-platform-mismatch",
    "windows-host-runtime-surface-contaminated": "windows-host-runtime-surface-contaminated",
    "linux-host-runtime-surface-contaminated": "linux-host-runtime-surface-contaminated",
    "native-source-acquisition-dependency-error": "native-source-probe-error",
    "malformed-native-registry-acquisition": "malformed-native-registry-probe",
    "private-path-disclosure-attempt": "private-path-disclosure-attempt",
    "macos-host-runtime-observation-native-source-acquisition-unavailable": "macos-host-runtime-observation-native-source-probe-unavailable"
  };
  return mapping[blockedReason] ?? blockedReason;
}

function normalizeHostRuntimeObservationNativeSourceAcquisitionDependencies(input = {}, selection) {
  const collected = collectHostRuntimeObservationNativeSourceAcquisitionDependencies(input);
  if (!collected.ok) {
    return collected;
  }

  if (collected.value.length === 0) {
    return {
      ok: false,
      blockedReason: "missing-native-source-acquisition-dependency"
    };
  }

  const nativeAcquisitionDependencyFacts = [];
  const acquisitionDependencyFacts = [];
  for (const dependency of collected.value) {
    const normalized = normalizeHostRuntimeObservationNativeSourceAcquisitionDependency(dependency, selection);
    if (!normalized.ok) {
      return {
        ok: false,
        blockedReason: normalized.blockedReason,
        value: nativeAcquisitionDependencyFacts,
        acquisitionDependencyFacts
      };
    }
    nativeAcquisitionDependencyFacts.push(normalized.nativeAcquisitionDependencyFact);
    acquisitionDependencyFacts.push(normalized.acquisitionDependencyFact);
  }

  return {
    ok: true,
    value: freezeRecord(nativeAcquisitionDependencyFacts),
    acquisitionDependencyFacts: freezeRecord(acquisitionDependencyFacts)
  };
}

function collectHostRuntimeObservationNativeSourceAcquisitionDependencies(input: AnyInput = {}) {
  const dependencyContainers = [];
  for (const dependencyContainer of [
    input.nativeAcquisitionDependencies,
    input.nativeSourceAcquisitionDependencies,
    input.hostRuntimeObservationNativeSourceAcquisitionDependencies,
    input.runtimeObservationNativeSourceAcquisitionDependencies,
    input.dependencies
  ]) {
    if (dependencyContainer === undefined || dependencyContainer === null) {
      continue;
    }
    if (!isPlainObject(dependencyContainer)) {
      return {
        ok: false,
        blockedReason: "malformed-native-source-acquisition-input"
      };
    }
    dependencyContainers.push(dependencyContainer);
  }

  const dependencyGroups = [
    input.nativeAcquisitionFacts ?? input.nativeSourceAcquisitionFacts,
    input.hostRuntimeObservationNativeSourceAcquisitionFacts ?? input.runtimeObservationNativeSourceAcquisitionFacts,
    input.documentedRootNativeAcquisitions ?? input.nativeDocumentedRootAcquisitions,
    input.windowsRegistryViewNativeAcquisitions ?? input.nativeRegistryViewAcquisitions
  ];
  for (const dependencyContainer of dependencyContainers) {
    dependencyGroups.push(
      dependencyContainer.nativeAcquisitionFacts ?? dependencyContainer.nativeSourceAcquisitionFacts,
      dependencyContainer.hostRuntimeObservationNativeSourceAcquisitionFacts ?? dependencyContainer.runtimeObservationNativeSourceAcquisitionFacts,
      dependencyContainer.documentedRootNativeAcquisitions ?? dependencyContainer.nativeDocumentedRootAcquisitions,
      dependencyContainer.windowsRegistryViewNativeAcquisitions ?? dependencyContainer.nativeRegistryViewAcquisitions
    );
  }

  const dependencies = [];
  for (const group of dependencyGroups) {
    if (group === undefined || group === null) {
      continue;
    }
    if (!Array.isArray(group)) {
      return {
        ok: false,
        blockedReason: "malformed-native-source-acquisition-input"
      };
    }
    dependencies.push(...group);
  }

  return {
    ok: true,
    value: dependencies
  };
}

function normalizeHostRuntimeObservationNativeSourceAcquisitionDependency(dependency, selection) {
  if (!isPlainObject(dependency)) {
    return {
      ok: false,
      blockedReason: "malformed-native-source-acquisition-input"
    };
  }

  if (
    dependency.dependencyError !== undefined
    || dependency.acquisitionError !== undefined
    || dependency.error !== undefined
    || dependency.threw === true
  ) {
    return {
      ok: false,
      blockedReason: "native-source-acquisition-dependency-error"
    };
  }

  const sourceClass = normalizeHostRuntimeNativeSourceAcquisitionClass(dependency);
  if (!sourceClass) {
    return {
      ok: false,
      blockedReason: "unsupported-native-source-acquisition-class"
    };
  }

  if (sourceClass === "windows-registry-view" && hasRawRegistryOutput(dependency)) {
    return {
      ok: false,
      blockedReason: "malformed-native-registry-acquisition"
    };
  }

  if (hasPrivatePathDisclosure(dependency)) {
    return {
      ok: false,
      blockedReason: "private-path-disclosure-attempt"
    };
  }

  const sourceAcquisitionDependency = normalizeHostRuntimeObservationSourceAcquisitionDependency({
    ...dependency,
    sourceAcquisitionClass: sourceClass,
    sourceClass,
    acquisitionId: dependency.acquisitionId
      ?? dependency.nativeAcquisitionId
      ?? dependency.sourceAcquisitionId
      ?? dependency.identifier
      ?? dependency.id
      ?? dependency.documentedRoot
      ?? dependency.root
      ?? dependency.registryView
      ?? dependency.view
  }, selection);

  if (!sourceAcquisitionDependency.ok) {
    return {
      ok: false,
      blockedReason: nativeSourceAcquisitionBlockedReasonForSourceAcquisitionBlockedReason(sourceAcquisitionDependency.blockedReason)
    };
  }

  const nativeAcquisitionDependencyFact = freezeRecord({
    ...sourceAcquisitionDependency.acquisitionDependencyFact,
    kind: "host-runtime-observation-native-source-acquisition-dependency",
    nativeSourceAcquisitionBoundary: "bounded-native-host-source-acquisition-dependency-adapter-only",
    sourceAcquisitionDependencyKind: sourceAcquisitionDependency.acquisitionDependencyFact.kind,
    nativeAcquisitionId: sourceAcquisitionDependency.acquisitionDependencyFact.acquisitionId
  });

  return {
    ok: true,
    nativeAcquisitionDependencyFact,
    acquisitionDependencyFact: sourceAcquisitionDependency.acquisitionDependencyFact
  };
}

function normalizeHostRuntimeNativeSourceAcquisitionClass(dependency) {
  const acquisitionClass = normalizeFact(
    dependency.nativeAcquisitionClass
      ?? dependency.nativeSourceAcquisitionClass
      ?? dependency.acquisitionClass
      ?? dependency.sourceAcquisitionClass
      ?? dependency.sourceClass
      ?? dependency.kind
      ?? dependency.type
      ?? dependency.source
  )?.toLowerCase();
  if ([
    "documented-root",
    "documented-root-native-acquisition",
    "native-documented-root-acquisition",
    "documented-root-acquisition",
    "documented-root-dependency",
    "root"
  ].includes(acquisitionClass)) {
    return "documented-root";
  }
  if ([
    "windows-registry-view",
    "windows-registry-view-native-acquisition",
    "native-windows-registry-view-acquisition",
    "registry-view-native-acquisition",
    "windows-registry-view-acquisition",
    "registry-view-acquisition",
    "windows-registry"
  ].includes(acquisitionClass)) {
    return "windows-registry-view";
  }
  if (acquisitionClass) {
    return null;
  }
  if (dependency.documentedRoot || dependency.root) {
    return "documented-root";
  }
  if (dependency.registryView || dependency.view) {
    return "windows-registry-view";
  }
  return null;
}

function nativeSourceAcquisitionBlockedReasonForSourceAcquisitionBlockedReason(blockedReason: any) {
  if (blockedReason === "malformed-registry-acquisition") {
    return "malformed-native-registry-acquisition";
  }
  if (blockedReason === "malformed-documented-root-acquisition") {
    return "malformed-native-documented-root-acquisition";
  }
  if (blockedReason === "malformed-source-acquisition-input") {
    return "malformed-native-source-acquisition-input";
  }
  if (blockedReason === "unsupported-source-acquisition-class") {
    return "unsupported-native-source-acquisition-class";
  }
  if (blockedReason === "source-acquisition-dependency-error") {
    return "native-source-acquisition-dependency-error";
  }
  return blockedReason;
}

function normalizeHostRuntimeObservationSourceAcquisitionDependencies(input = {}, selection) {
  const collected = collectHostRuntimeObservationSourceAcquisitionDependencies(input);
  if (!collected.ok) {
    return collected;
  }

  if (collected.value.length === 0) {
    return {
      ok: false,
      blockedReason: "missing-source-acquisition-dependency"
    };
  }

  const acquisitionDependencyFacts = [];
  const sourceFacts = [];
  for (const dependency of collected.value) {
    const normalized = normalizeHostRuntimeObservationSourceAcquisitionDependency(dependency, selection);
    if (!normalized.ok) {
      return {
        ok: false,
        blockedReason: normalized.blockedReason,
        value: acquisitionDependencyFacts,
        sourceFacts
      };
    }
    acquisitionDependencyFacts.push(normalized.acquisitionDependencyFact);
    sourceFacts.push(normalized.sourceFact);
  }

  return {
    ok: true,
    value: freezeRecord(acquisitionDependencyFacts),
    sourceFacts: freezeRecord(sourceFacts)
  };
}

function collectHostRuntimeObservationSourceAcquisitionDependencies(input: AnyInput = {}) {
  const dependencyContainers = [];
  for (const dependencyContainer of [
    input.acquisitionDependencies,
    input.sourceAcquisitionDependencies,
    input.hostRuntimeObservationSourceAcquisitionDependencies,
    input.runtimeObservationSourceAcquisitionDependencies,
    input.nativeHostSourceAcquisitionDependencies,
    input.dependencies
  ]) {
    if (dependencyContainer === undefined || dependencyContainer === null) {
      continue;
    }
    if (!isPlainObject(dependencyContainer)) {
      return {
        ok: false,
        blockedReason: "malformed-source-acquisition-input"
      };
    }
    dependencyContainers.push(dependencyContainer);
  }

  const dependencyGroups = [
    input.acquisitionDependencyFacts ?? input.sourceAcquisitionFacts ?? input.acquisitionFacts,
    input.hostRuntimeObservationSourceAcquisitions ?? input.runtimeObservationSourceAcquisitions,
    input.hostRuntimeObservationSourceAcquisitionFacts ?? input.runtimeObservationSourceAcquisitionFacts,
    input.documentedRootAcquisitions ?? input.documentedRootAcquisitionFacts,
    input.windowsRegistryViewAcquisitions ?? input.registryViewAcquisitions
  ];
  for (const dependencyContainer of dependencyContainers) {
    dependencyGroups.push(
      dependencyContainer.acquisitionDependencyFacts ?? dependencyContainer.sourceAcquisitionFacts ?? dependencyContainer.acquisitionFacts,
      dependencyContainer.hostRuntimeObservationSourceAcquisitions ?? dependencyContainer.runtimeObservationSourceAcquisitions,
      dependencyContainer.hostRuntimeObservationSourceAcquisitionFacts ?? dependencyContainer.runtimeObservationSourceAcquisitionFacts,
      dependencyContainer.documentedRootAcquisitions ?? dependencyContainer.documentedRootAcquisitionFacts,
      dependencyContainer.windowsRegistryViewAcquisitions ?? dependencyContainer.registryViewAcquisitions,
      dependencyContainer.sourceFacts ?? dependencyContainer.sources
    );
  }

  const dependencies = [];
  for (const group of dependencyGroups) {
    if (group === undefined || group === null) {
      continue;
    }
    if (!Array.isArray(group)) {
      return {
        ok: false,
        blockedReason: "malformed-source-acquisition-input"
      };
    }
    dependencies.push(...group);
  }

  return {
    ok: true,
    value: dependencies
  };
}

function normalizeHostRuntimeObservationSourceAcquisitionDependency(dependency, selection) {
  if (!isPlainObject(dependency)) {
    return {
      ok: false,
      blockedReason: "malformed-source-acquisition-input"
    };
  }

  if (
    dependency.dependencyError !== undefined
    || dependency.acquisitionError !== undefined
    || dependency.error !== undefined
    || dependency.threw === true
  ) {
    return {
      ok: false,
      blockedReason: "source-acquisition-dependency-error"
    };
  }

  const sourceClass = normalizeHostRuntimeSourceAcquisitionClass(dependency);
  if (!sourceClass) {
    return {
      ok: false,
      blockedReason: "unsupported-source-acquisition-class"
    };
  }

  if (sourceClass === "windows-registry-view" && hasRawRegistryOutput(dependency)) {
    return {
      ok: false,
      blockedReason: "malformed-registry-acquisition"
    };
  }

  if (hasPrivatePathDisclosure(dependency)) {
    return {
      ok: false,
      blockedReason: "private-path-disclosure-attempt"
    };
  }

  const sourceLike = {
    ...dependency,
    sourceClass,
    sourceId: dependency.sourceId
      ?? dependency.acquisitionId
      ?? dependency.identifier
      ?? dependency.id
      ?? dependency.documentedRoot
      ?? dependency.root
      ?? dependency.registryView
      ?? dependency.view
  };
  const normalizedSource = normalizeHostRuntimeObservationSourceFact(sourceLike, selection);
  if (!normalizedSource.ok) {
    return {
      ok: false,
      blockedReason: sourceAcquisitionBlockedReasonForSourceBlockedReason(normalizedSource.blockedReason, sourceClass)
    };
  }

  return {
    ok: true,
    acquisitionDependencyFact: freezeRecord({
      ...normalizedSource.value,
      kind: "host-runtime-observation-source-acquisition-dependency",
      sourceAcquisitionBoundary: "bounded-native-host-source-acquisition-dependencies-only",
      acquisitionId: normalizedSource.value.sourceId
    }),
    sourceFact: normalizedSource.value
  };
}

function normalizeHostRuntimeSourceAcquisitionClass(dependency) {
  const acquisitionClass = normalizeFact(
    dependency.acquisitionClass
      ?? dependency.sourceAcquisitionClass
      ?? dependency.sourceClass
      ?? dependency.kind
      ?? dependency.type
      ?? dependency.source
  )?.toLowerCase();
  if ([
    "documented-root",
    "documented-root-acquisition",
    "documented-root-dependency",
    "documented-root-source",
    "root"
  ].includes(acquisitionClass)) {
    return "documented-root";
  }
  if ([
    "windows-registry-view",
    "windows-registry-view-acquisition",
    "registry-view-acquisition",
    "registry-view-dependency",
    "registry-view-source",
    "windows-registry"
  ].includes(acquisitionClass)) {
    return "windows-registry-view";
  }
  if (acquisitionClass) {
    return null;
  }
  if (dependency.documentedRoot || dependency.root) {
    return "documented-root";
  }
  if (dependency.registryView || dependency.view) {
    return "windows-registry-view";
  }
  return null;
}

function sourceAcquisitionBlockedReasonForSourceBlockedReason(blockedReason, sourceClass) {
  if (blockedReason === "malformed-registry-source") {
    return "malformed-registry-acquisition";
  }
  if (blockedReason === "malformed-documented-root-source") {
    return "malformed-documented-root-acquisition";
  }
  if (blockedReason === "malformed-host-runtime-observation-source-input") {
    return "malformed-source-acquisition-input";
  }
  if (blockedReason === "unsupported-observation-source-class") {
    return "unsupported-source-acquisition-class";
  }
  if (!blockedReason && sourceClass === "windows-registry-view") {
    return "malformed-registry-acquisition";
  }
  if (!blockedReason && sourceClass === "documented-root") {
    return "malformed-documented-root-acquisition";
  }
  return blockedReason;
}

function normalizeHostRuntimeObservationSourceFacts(input = {}, selection) {
  const collected = collectHostRuntimeObservationSourceFacts(input);
  if (!collected.ok) {
    return collected;
  }

  if (collected.value.length === 0) {
    return {
      ok: false,
      blockedReason: "missing-observation-source"
    };
  }

  const sourceFacts = [];
  for (const sourceFact of collected.value) {
    const normalized = normalizeHostRuntimeObservationSourceFact(sourceFact, selection);
    if (!normalized.ok) {
      return {
        ok: false,
        blockedReason: normalized.blockedReason,
        value: sourceFacts,
        observationDependencyFacts: sourceFacts
      };
    }
    sourceFacts.push(normalized.value);
  }

  return {
    ok: true,
    value: freezeRecord(sourceFacts)
  };
}

function collectHostRuntimeObservationSourceFacts(input: AnyInput = {}) {
  const sourceContainers = [];
  for (const sourceContainer of [
    input.sourceDependencies,
    input.hostRuntimeObservationSourceDependencies,
    input.runtimeObservationSourceDependencies,
    input.observationSourceDependencies,
    input.dependencies
  ]) {
    if (sourceContainer === undefined || sourceContainer === null) {
      continue;
    }
    if (!isPlainObject(sourceContainer)) {
      return {
        ok: false,
        blockedReason: "malformed-host-runtime-observation-source-input"
      };
    }
    sourceContainers.push(sourceContainer);
  }

  const sourceGroups = [
    input.sourceFacts ?? input.sources ?? input.observationSources,
    input.hostRuntimeObservationSources ?? input.runtimeObservationSources,
    input.hostRuntimeObservationSourceFacts ?? input.runtimeObservationSourceFacts,
    input.documentedRootSources ?? input.documentedRootSourceFacts,
    input.windowsRegistryViewSources ?? input.registryViewSources,
    input.observationFacts
  ];
  for (const sourceContainer of sourceContainers) {
    sourceGroups.push(
      sourceContainer.sourceFacts ?? sourceContainer.sources ?? sourceContainer.observationSources,
      sourceContainer.hostRuntimeObservationSources ?? sourceContainer.runtimeObservationSources,
      sourceContainer.hostRuntimeObservationSourceFacts ?? sourceContainer.runtimeObservationSourceFacts,
      sourceContainer.documentedRootSources ?? sourceContainer.documentedRootSourceFacts,
      sourceContainer.windowsRegistryViewSources ?? sourceContainer.registryViewSources,
      sourceContainer.observationFacts
    );
  }

  const sourceFacts = [];
  for (const group of sourceGroups) {
    if (group === undefined || group === null) {
      continue;
    }
    if (!Array.isArray(group)) {
      return {
        ok: false,
        blockedReason: "malformed-host-runtime-observation-source-input"
      };
    }
    sourceFacts.push(...group);
  }

  return {
    ok: true,
    value: sourceFacts
  };
}

function normalizeHostRuntimeObservationSourceFact(sourceFact, selection) {
  if (!isPlainObject(sourceFact)) {
    return {
      ok: false,
      blockedReason: "malformed-host-runtime-observation-source-input"
    };
  }

  const explicitSourceClass = normalizeFact(sourceFact.sourceClass ?? sourceFact.kind ?? sourceFact.type ?? sourceFact.source);
  const sourceClass = explicitSourceClass
    ? normalizeHostRuntimeDiscoverySourceClass({ sourceClass: explicitSourceClass })
    : normalizeHostRuntimeDiscoverySourceClass(sourceFact);
  if (!sourceClass) {
    return {
      ok: false,
      blockedReason: explicitSourceClass ? "unsupported-observation-source-class" : "malformed-host-runtime-observation-source-input"
    };
  }

  if (sourceClass === "windows-registry-view" && hasRawRegistryOutput(sourceFact)) {
    return {
      ok: false,
      blockedReason: "malformed-registry-source"
    };
  }

  if (hasPrivatePathDisclosure(sourceFact)) {
    return {
      ok: false,
      blockedReason: "private-path-disclosure-attempt"
    };
  }

  const labviewExecutable = normalizeHostRuntimeDiscoveryLabviewExecutable(sourceFact);
  const labviewCli = normalizeHostRuntimeDiscoveryLabviewCli(sourceFact);
  const platform = normalizePlatform(sourceFact.platform ?? sourceFact.osFamily ?? selection?.platform);
  const labviewVersion = normalizeFact(
    sourceFact.labviewVersion
      ?? sourceFact.version
      ?? labviewExecutable.version
      ?? selection?.labviewVersion
  );
  const labviewBitness = normalizeLabviewBitness(
    sourceFact.labviewBitness
      ?? sourceFact.bitness
      ?? labviewExecutable.bitness
      ?? selection?.labviewBitness
  );

  if (!platform || !labviewVersion || !labviewBitness) {
    return {
      ok: false,
      blockedReason: sourceClass === "windows-registry-view"
        ? "malformed-registry-source"
        : "malformed-documented-root-source"
    };
  }

  const sourceId = normalizePublicDiscoveryIdentifier(
    sourceFact.sourceId
      ?? sourceFact.identifier
      ?? sourceFact.id
      ?? sourceFact.documentedRoot
      ?? sourceFact.root
      ?? sourceFact.registryView
      ?? `${sourceClass}-${platform}-${labviewVersion}-${labviewBitness}`
  );
  if (!sourceId) {
    return {
      ok: false,
      blockedReason: "private-path-disclosure-attempt"
    };
  }

  const documentedRoot = sourceClass === "documented-root"
    ? normalizePublicDiscoveryIdentifier(sourceFact.documentedRoot ?? sourceFact.root)
    : null;
  const registryView = sourceClass === "windows-registry-view"
    ? normalizeRegistryView(sourceFact.registryView ?? sourceFact.view)
    : null;

  if (sourceClass === "documented-root" && !documentedRoot) {
    return {
      ok: false,
      blockedReason: "malformed-documented-root-source"
    };
  }

  if (sourceClass === "windows-registry-view" && !registryView) {
    return {
      ok: false,
      blockedReason: "malformed-registry-source"
    };
  }

  return {
    ok: true,
    value: freezeRecord({
      kind: "host-runtime-observation-source",
      publicSafe: true,
      sourceAdapterBoundary: "bounded-public-safe-observation-source-facts-only",
      sourceClass,
      sourceId,
      documentedRoot,
      registryView,
      available: sourceFact.available !== false && sourceFact.installed !== false && sourceFact.present !== false,
      contaminated: sourceFact.contaminated === true || sourceFact.surfaceContaminated === true,
      platform,
      labviewVersion,
      labviewBitness,
      labviewExecutable,
      labviewCli
    })
  };
}

function createObservationDependenciesFromSourceFacts(sourceFacts = []) {
  const facts = Array.isArray(sourceFacts) ? sourceFacts : [];
  const windowsRegistryViewObservations = facts.filter((fact: any) => fact?.sourceClass === "windows-registry-view");
  const documentedRootObservations = facts.filter((fact: any) => fact?.sourceClass === "documented-root");

  return freezeRecord({
    windowsRegistryViewObservations: freezeRecord(windowsRegistryViewObservations),
    documentedRootObservations: freezeRecord(documentedRootObservations)
  });
}

function normalizeHostRuntimeObservationDependencies(input = {}, selection) {
  const collected = collectHostRuntimeObservationDependencies(input);
  if (!collected.ok) {
    return collected;
  }

  if (collected.value.length === 0) {
    return {
      ok: false,
      blockedReason: "missing-observation-dependency"
    };
  }

  const observations = [];
  for (const observation of collected.value) {
    const normalized = normalizeHostRuntimeObservationDependency(observation, selection);
    if (!normalized.ok) {
      return {
        ok: false,
        blockedReason: normalized.blockedReason,
        value: observations
      };
    }
    observations.push(normalized.value);
  }

  return {
    ok: true,
    value: freezeRecord(observations)
  };
}

function collectHostRuntimeObservationDependencies(input: AnyInput = {}) {
  const dependencyContainers = [];
  for (const dependency of [
    input.observationDependencies,
    input.hostRuntimeObservationDependencies,
    input.runtimeObservationDependencies,
    input.dependencies
  ]) {
    if (dependency === undefined || dependency === null) {
      continue;
    }
    if (!isPlainObject(dependency)) {
      return {
        ok: false,
        blockedReason: "malformed-host-runtime-observation-input"
      };
    }
    dependencyContainers.push(dependency);
  }

  const observationGroups = [
    input.documentedRootObservations ?? input.documentedRoots ?? input.rootObservations,
    input.windowsRegistryViewObservations ?? input.registryViewObservations ?? input.registryViews,
    input.hostRuntimeObservations ?? input.runtimeObservations ?? input.observationFacts,
    input.discoveryObservations ?? input.hostDiscoveryObservations ?? input.observations
  ];
  for (const dependency of dependencyContainers) {
    observationGroups.push(
      dependency.documentedRootObservations ?? dependency.documentedRoots ?? dependency.rootObservations,
      dependency.windowsRegistryViewObservations ?? dependency.registryViewObservations ?? dependency.registryViews,
      dependency.hostRuntimeObservations ?? dependency.runtimeObservations ?? dependency.observationFacts,
      dependency.discoveryObservations ?? dependency.hostDiscoveryObservations ?? dependency.observations
    );
  }

  const observations = [];
  for (const group of observationGroups) {
    if (group === undefined || group === null) {
      continue;
    }
    if (!Array.isArray(group)) {
      return {
        ok: false,
        blockedReason: "malformed-host-runtime-observation-input"
      };
    }
    observations.push(...group);
  }

  return {
    ok: true,
    value: observations
  };
}

function normalizeHostRuntimeObservationDependency(observation, selection) {
  if (!isPlainObject(observation)) {
    return {
      ok: false,
      blockedReason: "malformed-host-runtime-observation-input"
    };
  }

  const sourceClass = normalizeHostRuntimeDiscoverySourceClass(observation);
  if (!sourceClass) {
    return {
      ok: false,
      blockedReason: "malformed-host-runtime-observation-input"
    };
  }

  if (sourceClass === "windows-registry-view" && hasRawRegistryOutput(observation)) {
    return {
      ok: false,
      blockedReason: "malformed-registry-observation"
    };
  }

  if (hasPrivatePathDisclosure(observation)) {
    return {
      ok: false,
      blockedReason: "private-path-disclosure-attempt"
    };
  }

  const labviewExecutable = normalizeHostRuntimeDiscoveryLabviewExecutable(observation);
  const labviewCli = normalizeHostRuntimeDiscoveryLabviewCli(observation);
  const platform = normalizePlatform(observation.platform ?? observation.osFamily ?? selection?.platform);
  const labviewVersion = normalizeFact(
    observation.labviewVersion
      ?? observation.version
      ?? labviewExecutable.version
      ?? selection?.labviewVersion
  );
  const labviewBitness = normalizeLabviewBitness(
    observation.labviewBitness
      ?? observation.bitness
      ?? labviewExecutable.bitness
      ?? selection?.labviewBitness
  );

  if (!platform || !labviewVersion || !labviewBitness) {
    return {
      ok: false,
      blockedReason: sourceClass === "windows-registry-view"
        ? "malformed-registry-observation"
        : "malformed-documented-root-observation"
    };
  }

  const sourceIdInput = observation.sourceId
    ?? observation.identifier
    ?? observation.id
    ?? observation.documentedRoot
    ?? observation.root
    ?? observation.registryView
    ?? `${sourceClass}-${platform}-${labviewVersion}-${labviewBitness}`;
  const sourceId = normalizePublicDiscoveryIdentifier(sourceIdInput);
  if (!sourceId) {
    return {
      ok: false,
      blockedReason: "private-path-disclosure-attempt"
    };
  }

  const documentedRoot = sourceClass === "documented-root"
    ? normalizePublicDiscoveryIdentifier(observation.documentedRoot ?? observation.root)
    : null;
  const registryView = sourceClass === "windows-registry-view"
    ? normalizeRegistryView(observation.registryView ?? observation.view)
    : null;

  if (sourceClass === "documented-root" && !documentedRoot) {
    return {
      ok: false,
      blockedReason: "malformed-documented-root-observation"
    };
  }

  if (sourceClass === "windows-registry-view" && !registryView) {
    return {
      ok: false,
      blockedReason: "malformed-registry-observation"
    };
  }

  return {
    ok: true,
    value: freezeRecord({
      kind: "host-runtime-observation",
      publicSafe: true,
      sourceClass,
      sourceId,
      documentedRoot,
      registryView,
      available: observation.available !== false && observation.installed !== false && observation.present !== false,
      contaminated: observation.contaminated === true || observation.surfaceContaminated === true,
      platform,
      labviewVersion,
      labviewBitness,
      labviewExecutable,
      labviewCli
    })
  };
}

function normalizeHostRuntimeDiscoveryObservations(input = {}, selection) {
  const collected = collectHostRuntimeDiscoveryObservations(input);
  if (!collected.ok) {
    return collected;
  }

  if (collected.value.length === 0) {
    return {
      ok: false,
      blockedReason: "missing-discovery-observation"
    };
  }

  const hostCandidates = [];
  for (const observation of collected.value) {
    const normalized = normalizeHostRuntimeDiscoveryObservation(observation, selection);
    if (!normalized.ok) {
      return {
        ok: false,
        blockedReason: normalized.blockedReason,
        hostCandidates
      };
    }
    hostCandidates.push(normalized.value);
  }

  return {
    ok: true,
    value: freezeRecord(hostCandidates)
  };
}

function collectHostRuntimeDiscoveryObservations(input: AnyInput = {}) {
  const dependencies = isPlainObject(input.discoveryDependencies) ? input.discoveryDependencies : {};
  const observationGroups = [
    input.documentedRootObservations ?? input.documentedRoots ?? input.rootObservations,
    input.windowsRegistryViewObservations ?? input.registryViewObservations ?? input.registryViews,
    input.discoveryObservations ?? input.hostDiscoveryObservations ?? input.observations,
    dependencies.documentedRootObservations ?? dependencies.documentedRoots ?? dependencies.rootObservations,
    dependencies.windowsRegistryViewObservations ?? dependencies.registryViewObservations ?? dependencies.registryViews,
    dependencies.discoveryObservations ?? dependencies.hostDiscoveryObservations ?? dependencies.observations
  ];

  const observations = [];
  for (const group of observationGroups) {
    if (group === undefined || group === null) {
      continue;
    }
    if (!Array.isArray(group)) {
      return {
        ok: false,
        blockedReason: "malformed-host-runtime-discovery-input"
      };
    }
    observations.push(...group);
  }

  return {
    ok: true,
    value: observations
  };
}

function normalizeHostRuntimeDiscoveryObservation(observation, selection) {
  if (!isPlainObject(observation)) {
    return {
      ok: false,
      blockedReason: "malformed-host-runtime-discovery-input"
    };
  }

  const sourceClass = normalizeHostRuntimeDiscoverySourceClass(observation);
  if (!sourceClass) {
    return {
      ok: false,
      blockedReason: "malformed-host-runtime-discovery-input"
    };
  }

  if (sourceClass === "windows-registry-view" && hasRawRegistryOutput(observation)) {
    return {
      ok: false,
      blockedReason: "malformed-registry-observation"
    };
  }

  if (hasPrivatePathDisclosure(observation)) {
    return {
      ok: false,
      blockedReason: "private-path-disclosure-attempt"
    };
  }

  const labviewExecutable = normalizeHostRuntimeDiscoveryLabviewExecutable(observation);
  const labviewCli = normalizeHostRuntimeDiscoveryLabviewCli(observation);
  const platform = normalizePlatform(observation.platform ?? observation.osFamily ?? selection?.platform);
  const labviewVersion = normalizeFact(
    observation.labviewVersion
      ?? observation.version
      ?? labviewExecutable.version
      ?? selection?.labviewVersion
  );
  const labviewBitness = normalizeLabviewBitness(
    observation.labviewBitness
      ?? observation.bitness
      ?? labviewExecutable.bitness
      ?? selection?.labviewBitness
  );

  if (!platform || !labviewVersion || !labviewBitness) {
    return {
      ok: false,
      blockedReason: sourceClass === "windows-registry-view"
        ? "malformed-registry-observation"
        : "malformed-host-runtime-discovery-input"
    };
  }

  const sourceId = normalizePublicDiscoveryIdentifier(
    observation.sourceId
      ?? observation.identifier
      ?? observation.id
      ?? observation.documentedRoot
      ?? observation.root
      ?? observation.registryView
      ?? `${sourceClass}-${platform}-${labviewVersion}-${labviewBitness}`
  );
  const documentedRoot = sourceClass === "documented-root"
    ? normalizePublicDiscoveryIdentifier(observation.documentedRoot ?? observation.root ?? sourceId)
    : null;
  const registryView = sourceClass === "windows-registry-view"
    ? normalizeRegistryView(observation.registryView ?? observation.view)
    : null;

  if ((sourceClass === "documented-root" && !documentedRoot) || (sourceClass === "windows-registry-view" && !registryView)) {
    return {
      ok: false,
      blockedReason: sourceClass === "windows-registry-view"
        ? "malformed-registry-observation"
        : "malformed-host-runtime-discovery-input"
    };
  }

  return {
    ok: true,
    value: freezeRecord({
      kind: "host-runtime-candidate",
      publicSafe: true,
      sourceClass,
      sourceId,
      documentedRoot,
      registryView,
      available: observation.available !== false && observation.installed !== false && observation.present !== false,
      contaminated: observation.contaminated === true || observation.surfaceContaminated === true,
      platform,
      labviewVersion,
      labviewBitness,
      labviewExecutable,
      labviewCli
    })
  };
}

function normalizeHostRuntimeDiscoverySourceClass(observation) {
  const sourceClass = normalizeFact(observation.sourceClass ?? observation.kind ?? observation.type ?? observation.source)?.toLowerCase();
  if (["documented-root", "documented-root-observation", "documented-root-facts", "documented-root-source", "root"].includes(sourceClass)) {
    return "documented-root";
  }
  if (["windows-registry-view", "registry-view", "registry-view-observation", "windows-registry-view-source", "registry-view-source", "windows-registry"].includes(sourceClass)) {
    return "windows-registry-view";
  }
  if (observation.documentedRoot || observation.root) {
    return "documented-root";
  }
  if (observation.registryView || observation.view) {
    return "windows-registry-view";
  }
  return null;
}

function normalizeHostRuntimeDiscoveryLabviewExecutable(observation) {
  const executable = isPlainObject(observation.labviewExecutable)
    ? observation.labviewExecutable
    : isPlainObject(observation.labview)
      ? observation.labview
      : {};
  const available = observation.labviewExecutable === false
    ? false
    : executable.available ?? executable.present ?? observation.labviewExecutableAvailable ?? observation.labviewExecutablePresent;

  return freezeRecord({
    role: "labview-executable",
    available: available === true,
    version: normalizeFact(executable.labviewVersion ?? executable.version ?? observation.labviewExecutableVersion ?? observation.labviewVersion ?? observation.version),
    bitness: normalizeLabviewBitness(executable.labviewBitness ?? executable.bitness ?? observation.labviewExecutableBitness ?? observation.labviewBitness ?? observation.bitness)
  });
}

function normalizeHostRuntimeDiscoveryLabviewCli(observation) {
  const cli = isPlainObject(observation.labviewCli)
    ? observation.labviewCli
    : isPlainObject(observation.labviewCliExecutable)
      ? observation.labviewCliExecutable
      : {};
  const available = observation.labviewCli === false || observation.labviewCliExecutable === false
    ? false
    : cli.available ?? cli.present ?? observation.labviewCliAvailable ?? observation.labviewCliPresent;
  const role = normalizeFact(cli.role ?? observation.labviewCliRole ?? observation.cliRole);
  const canonical = cli.canonical === true
    || observation.canonicalLabviewCli === true
    || observation.labviewCliCanonical === true
    || role === "canonical-labview-cli";

  return freezeRecord({
    role: canonical ? "canonical-labview-cli" : (role ?? "labview-cli"),
    available: available === true,
    canonical,
    bitness: normalizeLabviewBitness(cli.labviewBitness ?? cli.bitness ?? observation.labviewCliBitness ?? observation.cliBitness)
  });
}

function hasRawRegistryOutput(observation) {
  return observation.rawRegistryOutput !== undefined
    || observation.rawRegistry !== undefined
    || observation.registryKey !== undefined
    || observation.registryValue !== undefined;
}

function hasPrivatePathDisclosure(value: any) {
  if (Array.isArray(value)) {
    return value.some((item: any) => hasPrivatePathDisclosure(item));
  }
  if (!isPlainObject(value)) {
    return typeof value === "string" && isPrivatePathLike(value);
  }
  for (const [key, nested] of Object.entries(value)) {
    if (["path", "installPath", "absolutePath", "privatePath", "rawPath"].includes(key)) {
      return true;
    }
    if (hasPrivatePathDisclosure(nested)) {
      return true;
    }
  }
  return false;
}

function isPrivatePathLike(value: any) {
  return /^[a-z]:[\\/]/iu.test(value)
    || value.startsWith("/")
    || value.startsWith("~")
    || value.includes("\\Users\\")
    || value.includes("/Users/")
    || value.includes("/home/");
}

function normalizePublicDiscoveryIdentifier(value: any) {
  const identifier = normalizeFact(value);
  if (!identifier || isPrivatePathLike(identifier) || /secret|password|token|credential|authorization|bearer|private/iu.test(identifier)) {
    return null;
  }
  return identifier.replaceAll("\\", "/").replace(/\/+$/u, "");
}

function normalizeRegistryView(value: any) {
  const normalized = normalizeFact(value)?.toLowerCase();
  if (!normalized) {
    return null;
  }
  if (["64", "64-bit", "64bit", "x64", "wow64-64"].includes(normalized)) {
    return "64-bit";
  }
  if (["32", "32-bit", "32bit", "x86", "wow6432node"].includes(normalized)) {
    return "32-bit";
  }
  return null;
}

function normalizeRuntimeSelectionFacts(selection = {}) {
  if (!isPlainObject(selection)) {
    return {
      ok: false,
      blockedReason: "missing-runtime-selection-facts"
    };
  }

  const provider = normalizeFact(
    selection.runtimeProvider
      ?? selection.provider
      ?? selection.selectedProvider
      ?? selection.requestedProvider
  );
  if (!provider) {
    return {
      ok: false,
      blockedReason: "missing-runtime-selection-facts"
    };
  }

  const runtimeProvider = normalizeRuntimeOutcomeProvider(provider);
  if (!runtimeProvider) {
    return {
      ok: false,
      blockedReason: "installed-provider-invalid"
    };
  }

  const runtimeBlockedReason = normalizeFact(
    selection.runtimeBlockedReason
      ?? selection.blockedReason
      ?? selection.reason
  );
  const runtimeEngine = normalizeFact(selection.runtimeEngine ?? selection.engine);

  if (runtimeProvider === "unavailable" && !runtimeBlockedReason) {
    return {
      ok: false,
      blockedReason: "labview-runtime-selection-required"
    };
  }

  return {
    ok: true,
    value: freezeRecord({
      runtimeProvider,
      runtimeEngine,
      runtimeBlockedReason
    })
  };
}

function normalizeRuntimeOutcomeProvider(provider) {
  if (["host", "host-native", "docker", "linux-container", "windows-container", "unavailable"].includes(provider)) {
    return provider;
  }
  return null;
}

function runtimeOutcomeContractResult({
  status,
  runtimeOutcome,
  blockedReason = null,
  runtimeSelection = null
}) {
  return freezeRecord({
    status,
    type: "runtime-settings-cli-validation-runtime-outcome-contract",
    blockedReason,
    runtimeSelection,
    runtimeOutcome,
    blockedSideEffects: RUNTIME_SETTINGS_VALIDATION_RUNTIME_OUTCOME_BLOCKED_SIDE_EFFECTS,
    requirementIds: allRuntimeSettingsCliValidationRuntimeOutcomeRequirementIds()
  });
}

function createBlockedRuntimeOutcome({ blockedReason, runtimeErrorCode }) {
  return freezeRecord({
    runtimeValidationOutcome: "blocked",
    runtimeProvider: "unavailable",
    runtimeEngine: null,
    runtimeBlockedReason: blockedReason,
    runtimeErrorCode,
    runtimeProofStatus: "blocked-with-actionable-error",
    runtimeImplementationStatus: runtimeImplementationStatusForBlockedReason(blockedReason)
  });
}

function normalizeRuntimeOutcome(outcome = {}) {
  const runtimeValidationOutcome = normalizeFact(outcome.runtimeValidationOutcome);
  const runtimeProvider = normalizeFact(outcome.runtimeProvider);
  const runtimeErrorCode = normalizeFact(outcome.runtimeErrorCode);
  const runtimeProofStatus = normalizeFact(outcome.runtimeProofStatus);
  const runtimeImplementationStatus = normalizeFact(outcome.runtimeImplementationStatus);

  if (!runtimeValidationOutcome || !runtimeProvider || !runtimeErrorCode || !runtimeProofStatus || !runtimeImplementationStatus) {
    return {
      ok: false,
      blockedReason: "missing-runtime-outcome-facts"
    };
  }

  return {
    ok: true,
    value: Object.freeze({
      runtimeValidationOutcome,
      runtimeProvider,
      runtimeEngine: normalizeFact(outcome.runtimeEngine),
      runtimeBlockedReason: normalizeFact(outcome.runtimeBlockedReason),
      runtimeErrorCode,
      runtimeProofStatus,
      runtimeImplementationStatus
    })
  };
}

function runtimeErrorCodeForSettingsFailure(blockedReason: any) {
  if (blockedReason === "unsupported-settings-target-shape") {
    return "VIHS_E_UNSUPPORTED_SETTINGS_TARGET_SHAPE";
  }
  if (blockedReason === "invalid-settings-content") {
    return "VIHS_E_INVALID_SETTINGS_CONTENT";
  }
  return "VIHS_E_RUNTIME_SETTINGS_READBACK_FAILED";
}

function runtimeErrorCodeForRuntimeBlockedReason(blockedReason: any) {
  if (blockedReason === "installed-provider-invalid" || blockedReason === "unsupported-runtime-provider") {
    return "VIHS_E_PROVIDER_INVALID";
  }
  if (
    blockedReason === "missing-runtime-selection-facts"
    || blockedReason === "missing-selection-facts"
    || blockedReason === "labview-runtime-selection-required"
  ) {
    return "VIHS_E_RUNTIME_SELECTION_REQUIRED";
  }
  if (blockedReason === "labview-version-required") {
    return "VIHS_E_LABVIEW_VERSION_REQUIRED";
  }
  if (blockedReason === "labview-version-unsupported-for-comparison-report" || blockedReason === "unsupported-host-year") {
    return "VIHS_E_LABVIEW_VERSION_UNSUPPORTED";
  }
  if (blockedReason === "labview-bitness-required") {
    return "VIHS_E_LABVIEW_BITNESS_REQUIRED";
  }
  if (
    blockedReason === "labview-2026q1-unsupported-on-macos"
    || blockedReason === "macos-host-runtime-discovery-unavailable"
    || blockedReason === "macos-host-runtime-observation-source-unavailable"
    || blockedReason === "macos-host-runtime-observation-native-source-acquisition-unavailable"
    || blockedReason === "unsupported-host-platform"
    || blockedReason?.endsWith("provider-not-supported-on-platform")
  ) {
    return "VIHS_E_PLATFORM_UNSUPPORTED";
  }
  if (blockedReason?.startsWith("configured-") && blockedReason.endsWith("-path-missing")) {
    return "VIHS_E_CONFIGURED_PATH_MISSING";
  }
  if (blockedReason === "docker-provider-labview-version-not-implemented") {
    return "VIHS_E_DOCKER_PROVIDER_VERSION_NOT_IMPLEMENTED";
  }
  if (
    blockedReason === "docker-provider-unavailable"
    || blockedReason === "docker-only-provider-unavailable"
    || blockedReason === "auto-docker-installed-provider-unavailable"
  ) {
    return "VIHS_E_DOCKER_UNAVAILABLE";
  }
  if (blockedReason === "labview-exe-not-found" || blockedReason === "missing-host-runtime-candidate" || blockedReason === "missing-discovery-observation" || blockedReason === "missing-observation-source" || blockedReason === "missing-source-acquisition-dependency" || blockedReason === "missing-native-source-acquisition-dependency") {
    return "VIHS_E_LABVIEW_NOT_FOUND";
  }
  if (blockedReason === "labview-exe-ambiguous" || blockedReason === "ambiguous-host-runtime-candidate") {
    return "VIHS_E_LABVIEW_AMBIGUOUS";
  }
  if (blockedReason === "labview-version-mismatch") {
    return "VIHS_E_LABVIEW_VERSION_UNSUPPORTED";
  }
  if (blockedReason === "labview-bitness-mismatch") {
    return "VIHS_E_LABVIEW_BITNESS_MISMATCH";
  }
  if (blockedReason === "labview-cli-not-found-for-bitness") {
    return "VIHS_E_LABVIEW_CLI_BITNESS_NOT_FOUND";
  }
  if (blockedReason === "canonical-labview-cli-not-found" || blockedReason === "comparison-tool-not-found") {
    return "VIHS_E_COMPARISON_TOOL_NOT_FOUND";
  }
  if (
    blockedReason === "windows-host-runtime-surface-contaminated"
    || blockedReason === "malformed-registry-observation"
    || blockedReason === "malformed-registry-source"
    || blockedReason === "malformed-registry-acquisition"
    || blockedReason === "malformed-native-registry-acquisition"
    || blockedReason === "malformed-documented-root-source"
    || blockedReason === "malformed-documented-root-acquisition"
    || blockedReason === "malformed-native-documented-root-acquisition"
    || blockedReason === "malformed-host-runtime-observation-source-input"
    || blockedReason === "malformed-source-acquisition-input"
    || blockedReason === "malformed-native-source-acquisition-input"
    || blockedReason === "unsupported-observation-source-class"
    || blockedReason === "unsupported-source-acquisition-class"
    || blockedReason === "unsupported-native-source-acquisition-class"
    || blockedReason === "source-acquisition-dependency-error"
    || blockedReason === "native-source-acquisition-dependency-error"
    || blockedReason === "private-path-disclosure-attempt"
  ) {
    return "VIHS_E_RUNTIME_SURFACE_CONTAMINATED";
  }
  return "VIHS_E_RUNTIME_VALIDATION_BLOCKED";
}

function runtimeImplementationStatusForBlockedReason(blockedReason: any) {
  if (
    blockedReason === "docker-provider-labview-version-not-implemented"
    || blockedReason === "labview-2026q1-unsupported-on-macos"
    || blockedReason?.endsWith("provider-not-supported-on-platform")
  ) {
    return "not-implemented";
  }
  return "blocked-or-missing-prerequisite";
}

function normalizeRuntimeSettingsFacts(facts) {
  const runtimeProvider = normalizeFact(facts.runtimeProvider);
  const labviewVersion = normalizeFact(facts.labviewVersion);
  const labviewBitness = normalizeFact(facts.labviewBitness);

  if (!runtimeProvider || !labviewVersion || !labviewBitness) {
    return {
      ok: false,
      blockedReason: "missing-runtime-settings-fact"
    };
  }

  return {
    ok: true,
    value: Object.freeze({
      runtimeProvider,
      labviewVersion,
      labviewBitness
    })
  };
}

function normalizeFact(value: any) {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return null;
}

function normalizeEffectiveSettingsTarget(target) {
  if (typeof target === "string" && target.trim().length > 0) {
    const identifier = target.trim();
    return Object.freeze({
      scope: identifier,
      identifier
    });
  }

  if (!isPlainObject(target)) {
    return null;
  }

  const scope = normalizeFact(target.scope);
  if (!scope) {
    return null;
  }

  return Object.freeze({
    scope,
    identifier: normalizeFact(target.identifier) ?? normalizeFact(target.path) ?? scope
  });
}

function parseSettingsContent(content) {
  if (typeof content === "string") {
    try {
      return validateSettingsObject(
        JSON.parse(removeTrailingCommas(stripJsonComments(content)))
      );
    } catch {
      return {
        ok: false,
        blockedReason: "invalid-settings-content"
      };
    }
  }

  if (isPlainObject(content)) {
    try {
      return validateSettingsObject(JSON.parse(JSON.stringify(content)));
    } catch {
      return {
        ok: false,
        blockedReason: "invalid-settings-content"
      };
    }
  }

  return {
    ok: false,
    blockedReason: "unsupported-settings-target-shape"
  };
}

function validateSettingsObject(value: any) {
  if (!isPlainObject(value)) {
    return {
      ok: false,
      blockedReason: "unsupported-settings-target-shape"
    };
  }

  return {
    ok: true,
    value
  };
}

function isPlainObject(value: any) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function freezeRecord(record) {
  for (const value of Object.values(record)) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      freezeRecord(value);
    }
  }
  return Object.freeze(record);
}

function redactEnvironmentFacts(environment) {
  if (!isPlainObject(environment)) {
    return Object.freeze({});
  }

  const redacted = {};
  for (const [key, value] of Object.entries(environment).sort(([left], [right]) => left.localeCompare(right))) {
    const normalizedKey = String(key);
    redacted[normalizedKey] = shouldRedactEnvironmentFact(normalizedKey, value)
      ? "[REDACTED]"
      : String(value);
  }
  return freezeRecord(redacted);
}

function shouldRedactEnvironmentFact(key, value) {
  const haystack = `${key}=${String(value)}`;
  return /secret|password|token|credential|authorization|bearer|private/i.test(haystack)
    || /(?:gho_|ghp_|ghs_|ghr_|github_pat_|\/home\/|\\Users\\)/i.test(haystack);
}

function stripJsonComments(source) {
  let result = "";
  let inString = false;
  let quote = "";
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (inLineComment) {
      if (char === "\n" || char === "\r") {
        inLineComment = false;
        result += char;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && next === "/") {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (inString) {
      result += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }

    if (char === "\"" || char === "'") {
      inString = true;
      quote = char;
      result += char;
      continue;
    }

    if (char === "/" && next === "/") {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      inBlockComment = true;
      index += 1;
      continue;
    }

    result += char;
  }

  return result;
}

function removeTrailingCommas(source) {
  let result = "";
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      result += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }

    if (char === "\"" || char === "'") {
      inString = true;
      quote = char;
      result += char;
      continue;
    }

    if (char === ",") {
      const nextNonWhitespace = source.slice(index + 1).match(/\S/u)?.[0];
      if (nextNonWhitespace === "}" || nextNonWhitespace === "]") {
        continue;
      }
    }

    result += char;
  }

  return result;
}
