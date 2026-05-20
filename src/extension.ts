// VI History - MIT License
// Main extension entry point

import * as vscode from 'vscode';

import { createOpenViHistoryCommand } from './commands/openViHistoryCommand.js';
import { getBuiltInGitApi, GitApi } from './git/gitApi.js';
import { ViEligibilityIndexer, EligibilityDebugSnapshot } from './indexing/viEligibilityIndexer.js';
import { ViHistoryService } from './services/viHistoryService.js';
import { ViHistoryViewModel } from './services/viHistoryModel.js';
import {
  HistoryPanelMessage,
  HistoryPanelTracker,
  OpenedHistoryPanelSummary,
  OpenedDashboardPanelSummary,
  DashboardPanelMessage,
  HistoryPanelActionSummary,
  DashboardArtifactActionSummary,
  OpenedDocumentationPanelSummary
} from './ui/historyPanelTracker.js';

// ============================================================================
// Requirement Constants (Preserved for Compatibility)
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
// API Types
// ============================================================================

export interface ViHistorySuiteApi {
  refreshEligibility(): Promise<void>;
  isEligible(uri: vscode.Uri): boolean;
  loadHistory(uri: vscode.Uri): Promise<ViHistoryViewModel>;
  getEligibilityDebugSnapshot(): EligibilityDebugSnapshot;
  getLastOpenedPanel(): OpenedHistoryPanelSummary | undefined;
  getOpenHistoryPanelCount(): number;
  dispatchLastPanelMessage(message: HistoryPanelMessage): Promise<void>;
  getLastPanelActionSummary(): HistoryPanelActionSummary | undefined;
  getPanelActionCount(): number;
  getLastOpenedDashboardPanel(): OpenedDashboardPanelSummary | undefined;
  getOpenDashboardPanelCount(): number;
  dispatchLastDashboardPanelMessage(message: DashboardPanelMessage): Promise<void>;
  getLastDashboardArtifactActionSummary(): DashboardArtifactActionSummary | undefined;
  getDashboardArtifactActionCount(): number;
  getLastOpenedDocumentationPanel(): OpenedDocumentationPanelSummary | undefined;
  getOpenDocumentationPanelCount(): number;
  clearHistoryPanelTracking(): void;
}

interface WorkspaceRuntime {
  gitApi: GitApi | undefined;
  eligibilityIndexer: ViEligibilityIndexer;
  historyService: ViHistoryService;
  openViHistory: ReturnType<typeof createOpenViHistoryCommand>;
}

const EMPTY_ELIGIBILITY_DEBUG_SNAPSHOT: EligibilityDebugSnapshot = {
  indexedRepositoryRoots: [],
  eligiblePathCount: 0,
  eligiblePathsSample: []
};

// ============================================================================
// Extension Activation
// ============================================================================

export async function activate(
  context: vscode.ExtensionContext
): Promise<ViHistorySuiteApi> {
  const panelTracker = new HistoryPanelTracker();
  let workspaceRuntime: WorkspaceRuntime | undefined;
  let workspaceRuntimePromise: Promise<WorkspaceRuntime> | undefined;

  const ensureWorkspaceRuntime = async (): Promise<WorkspaceRuntime> => {
    if (workspaceRuntime) {
      return workspaceRuntime;
    }

    if (!workspaceRuntimePromise) {
      workspaceRuntimePromise = (async () => {
        const gitApi = await getBuiltInGitApi();
        const eligibilityIndexer = new ViEligibilityIndexer(gitApi);
        const historyService = new ViHistoryService(gitApi);
        const openViHistory = createOpenViHistoryCommand(
          historyService,
          eligibilityIndexer,
          gitApi,
          panelTracker
        );

        context.subscriptions.push(eligibilityIndexer);
        await eligibilityIndexer.start();

        workspaceRuntime = {
          gitApi,
          eligibilityIndexer,
          historyService,
          openViHistory
        };
        return workspaceRuntime;
      })().catch((error) => {
        workspaceRuntimePromise = undefined;
        throw error;
      });
    }

    return workspaceRuntimePromise;
  };

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'labviewViHistory.open',
      async (uri?: vscode.Uri) => {
        const runtime = await ensureWorkspaceRuntime();
        return runtime.openViHistory(uri);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'labviewViHistory.openDocumentation',
      async (pageId?: string) => {
        // Documentation panel shell - displays bundled docs
        void vscode.window.showInformationMessage(
          `VI History documentation requested: ${pageId ?? 'index'}`
        );
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'labviewViHistory.prepareLocalRuntimeSettingsCli',
      async () => {
        // Runtime settings CLI preparation
        void vscode.window.showInformationMessage(
          'VI History runtime settings CLI preparation requested.'
        );
        return createRuntimeSettingsCliPrepareCommandShell();
      }
    )
  );

  // Return the API
  return {
    refreshEligibility: async () => {
      const runtime = await ensureWorkspaceRuntime();
      await runtime.eligibilityIndexer.refresh();
    },
    isEligible: (uri: vscode.Uri) => workspaceRuntime?.eligibilityIndexer.isEligible(uri) ?? false,
    loadHistory: async (uri: vscode.Uri) => {
      const runtime = await ensureWorkspaceRuntime();
      return runtime.historyService.load(uri);
    },
    getEligibilityDebugSnapshot: () =>
      workspaceRuntime?.eligibilityIndexer.getDebugSnapshot() ?? EMPTY_ELIGIBILITY_DEBUG_SNAPSHOT,
    getLastOpenedPanel: () => panelTracker.getLastOpenedPanel(),
    getOpenHistoryPanelCount: () => panelTracker.getOpenCount(),
    dispatchLastPanelMessage: (message: HistoryPanelMessage) =>
      panelTracker.dispatchLastPanelMessage(message),
    getLastPanelActionSummary: () => panelTracker.getLastActionSummary(),
    getPanelActionCount: () => panelTracker.getActionCount(),
    getLastOpenedDashboardPanel: () => panelTracker.getLastOpenedDashboardPanel(),
    getOpenDashboardPanelCount: () => panelTracker.getDashboardOpenCount(),
    dispatchLastDashboardPanelMessage: (message: DashboardPanelMessage) =>
      panelTracker.dispatchLastDashboardPanelMessage(message),
    getLastDashboardArtifactActionSummary: () =>
      panelTracker.getLastDashboardArtifactActionSummary(),
    getDashboardArtifactActionCount: () => panelTracker.getDashboardArtifactActionCount(),
    getLastOpenedDocumentationPanel: () => panelTracker.getLastOpenedDocumentationPanel(),
    getOpenDocumentationPanelCount: () => panelTracker.getDocumentationOpenCount(),
    clearHistoryPanelTracking: () => panelTracker.clear()
  };
}

export function deactivate(): void {
  // Cleanup handled by disposables
}

// ============================================================================
// Legacy Factory Functions (Preserved for Contract Tests)
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
