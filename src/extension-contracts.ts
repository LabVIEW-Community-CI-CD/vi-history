// VI History - MIT License
// Extension contracts - testable without VS Code

// ============================================================================
// Requirement Constants
// ============================================================================

export const ENTRYPOINT_SHELL_REQUIREMENTS = {
  commandRegistration: ["VHS-REQ-082", "VHS-REQ-083", "VHS-REQ-594"] as const
} as const;

export const DOCUMENTATION_COMMAND_REQUIREMENTS = {
  bundledDocs: ["VHS-REQ-368"] as const,
  commandSurface: ["VHS-REQ-369", "VHS-REQ-594"] as const,
  publicSafety: ["VHS-REQ-489"] as const
} as const;

export const RUNTIME_SETTINGS_CLI_BOOTSTRAP_REQUIREMENTS = {
  terminalEntrypoint: ["VHS-REQ-537", "VHS-REQ-594"] as const,
  recoveryFacts: ["VHS-REQ-544"] as const,
  blockedMutation: ["VHS-REQ-537", "VHS-REQ-544"] as const
} as const;

export const BUNDLED_DOCUMENTATION_MANIFEST_PATH = "docs/installed-user/bundled-docs-manifest.json";

export const BUNDLED_DOCUMENTATION_MANIFEST = {
  schema: "vi-history/bundled-documentation-manifest@v1",
  manifestVersion: 1,
  pages: [
    {
      id: "getting-started",
      title: "Getting Started",
      path: "docs/installed-user/getting-started.md"
    }
  ] as const
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

export interface DocumentationPage {
  readonly id: string;
  readonly title: string;
  readonly path: string;
}

export interface BlockedSideEffects {
  readonly git: boolean;
  readonly labviewCli: boolean;
  readonly docker: boolean;
  readonly compareExecution: boolean;
  readonly runtimeSettingsCli: boolean;
  readonly packaging: boolean;
  readonly marketplace: boolean;
}

export interface DocumentationCommandPanelShell {
  readonly type: "documentation-panel-shell";
  readonly commandId: string;
  readonly manifestPath: string;
  readonly pages: readonly DocumentationPage[];
  readonly blockedSideEffects: BlockedSideEffects;
  readonly requirementIds: readonly string[];
}

export interface LauncherInfo {
  readonly entrypoint: string;
  readonly materialization: string;
  readonly status: string;
  readonly prebuiltExternalCliPayload: boolean;
}

export interface RecoveryInfo {
  readonly missingLauncher: string;
  readonly staleLauncher: string;
  readonly hiddenPathReconstructionRequired: boolean;
  readonly profileEditingRequired: boolean;
  readonly adminElevationRequired: boolean;
  readonly machineWideInstallRequired: boolean;
}

export interface RuntimeSettingsCliBlockedSideEffects {
  readonly settingsMutation: boolean;
  readonly jsoncSettingsRewrite: boolean;
  readonly runtimeValidation: boolean;
  readonly compareExecution: boolean;
  readonly labviewCli: boolean;
  readonly docker: boolean;
  readonly packaging: boolean;
  readonly marketplace: boolean;
}

export interface RuntimeSettingsCliPrepareCommandShell {
  readonly type: "runtime-settings-cli-prepare-command-shell";
  readonly commandId: string;
  readonly launcher: LauncherInfo;
  readonly recovery: RecoveryInfo;
  readonly blockedSideEffects: RuntimeSettingsCliBlockedSideEffects;
  readonly requirementIds: readonly string[];
}

// Context interface for dependency injection (allows testing without vscode)
export interface Disposable {
  dispose(): void;
}

export interface CommandsAPI {
  registerCommand(id: string, handler: () => void | unknown): Disposable;
}

export interface ExtensionContext {
  commands: CommandsAPI;
  subscriptions: Disposable[];
}

// ============================================================================
// Contract Activation (Testable without VS Code)
// ============================================================================

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(
    context.commands.registerCommand("labviewViHistory.open", openHandler)
  );
  context.subscriptions.push(
    context.commands.registerCommand("labviewViHistory.openDocumentation", openDocumentationHandler)
  );
  context.subscriptions.push(
    context.commands.registerCommand(
      "labviewViHistory.prepareLocalRuntimeSettingsCli",
      prepareLocalRuntimeSettingsCliHandler
    )
  );
}

// ============================================================================
// Command Handlers
// ============================================================================

function openHandler(): void {
  // Entrypoint shell: blocked scope not started here.
  // Runtime settings CLI materialization, compare execution, Docker
  // orchestration, and Marketplace publication remain blocked here. Local VSIX
  // artifact packaging is governed separately from runtime command handlers.
}

function openDocumentationHandler(): DocumentationCommandPanelShell {
  return createDocumentationCommandPanelShell();
}

function prepareLocalRuntimeSettingsCliHandler(): RuntimeSettingsCliPrepareCommandShell {
  return createRuntimeSettingsCliPrepareCommandShell();
}

// ============================================================================
// Factory Functions
// ============================================================================

export function createDocumentationCommandPanelShell(): DocumentationCommandPanelShell {
  return {
    type: "documentation-panel-shell",
    commandId: "labviewViHistory.openDocumentation",
    manifestPath: BUNDLED_DOCUMENTATION_MANIFEST_PATH,
    pages: BUNDLED_DOCUMENTATION_MANIFEST.pages,
    blockedSideEffects: Object.freeze({
      git: false,
      labviewCli: false,
      docker: false,
      compareExecution: false,
      runtimeSettingsCli: false,
      packaging: false,
      marketplace: false
    }),
    requirementIds: allDocumentationCommandRequirementIds()
  };
}

export function createRuntimeSettingsCliPrepareCommandShell(): RuntimeSettingsCliPrepareCommandShell {
  return {
    type: "runtime-settings-cli-prepare-command-shell",
    commandId: "labviewViHistory.prepareLocalRuntimeSettingsCli",
    launcher: Object.freeze({
      entrypoint: "vihs",
      materialization: "extension-managed-terminal-bootstrap",
      status: "prepared",
      prebuiltExternalCliPayload: false
    }),
    recovery: Object.freeze({
      missingLauncher: "rerun labviewViHistory.prepareLocalRuntimeSettingsCli",
      staleLauncher: "rerun labviewViHistory.prepareLocalRuntimeSettingsCli",
      hiddenPathReconstructionRequired: false,
      profileEditingRequired: false,
      adminElevationRequired: false,
      machineWideInstallRequired: false
    }),
    blockedSideEffects: Object.freeze({
      settingsMutation: false,
      jsoncSettingsRewrite: false,
      runtimeValidation: false,
      compareExecution: false,
      labviewCli: false,
      docker: false,
      packaging: false,
      marketplace: false
    }),
    requirementIds: allRuntimeSettingsCliBootstrapRequirementIds()
  };
}

// ============================================================================
// Requirement ID Helpers
// ============================================================================

export function allEntrypointShellRequirementIds(): readonly string[] {
  return Object.freeze(
    Object.values(ENTRYPOINT_SHELL_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allDocumentationCommandRequirementIds(): readonly string[] {
  return Object.freeze(
    Object.values(DOCUMENTATION_COMMAND_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}

export function allRuntimeSettingsCliBootstrapRequirementIds(): readonly string[] {
  return Object.freeze(
    Object.values(RUNTIME_SETTINGS_CLI_BOOTSTRAP_REQUIREMENTS)
      .flat()
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort()
  );
}
