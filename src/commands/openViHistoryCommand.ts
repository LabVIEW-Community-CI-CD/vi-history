// VI History - MIT License
// Open VI History command handler

import * as vscode from 'vscode';

import { GitApi } from '../git/gitApi.js';
import { ViEligibilityIndexer } from '../indexing/viEligibilityIndexer.js';
import { ViHistoryService } from '../services/viHistoryService.js';
import { ViHistoryViewModel } from '../services/viHistoryModel.js';
import {
  renderHistoryPanelHtml,
  renderHistoryReviewPacketText
} from '../ui/historyPanel.js';
import {
  HistoryPanelMessage,
  HistoryPanelTracker
} from '../ui/historyPanelTracker.js';

export function createOpenViHistoryCommand(
  historyService: ViHistoryService,
  _eligibilityIndexer: ViEligibilityIndexer,
  gitApi: GitApi | undefined,
  panelTracker?: HistoryPanelTracker
): (uri?: vscode.Uri) => Promise<void> {
  return async (uri?: vscode.Uri): Promise<void> => {
    const targetUri = uri ?? vscode.window.activeTextEditor?.document.uri;
    if (!targetUri) {
      void vscode.window.showWarningMessage(
        'VI History requires a file to be selected or open.'
      );
      return;
    }

    const model = await historyService.load(targetUri);
    const panel = createHistoryPanel(targetUri, model, gitApi, panelTracker);

    const html = renderHistoryPanelHtml(model);
    panel.webview.html = html;

    if (panelTracker) {
      const dispatchMessage = async (message: HistoryPanelMessage): Promise<void> => {
        await handlePanelMessage(panel, message, model, gitApi, panelTracker);
      };
      panelTracker.record(panel, targetUri, model, html, dispatchMessage);
    }
  };
}

function createHistoryPanel(
  _targetUri: vscode.Uri,
  model: ViHistoryViewModel,
  gitApi: GitApi | undefined,
  panelTracker?: HistoryPanelTracker
): vscode.WebviewPanel {
  const panel = vscode.window.createWebviewPanel(
    'viHistory',
    `VI History: ${model.relativePath}`,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  panel.webview.onDidReceiveMessage(async (message: HistoryPanelMessage) => {
    await handlePanelMessage(panel, message, model, gitApi, panelTracker);
  });

  return panel;
}

async function handlePanelMessage(
  _panel: vscode.WebviewPanel,
  message: HistoryPanelMessage,
  model: ViHistoryViewModel,
  gitApi: GitApi | undefined,
  panelTracker?: HistoryPanelTracker
): Promise<void> {
  const command = message.command;
  if (!command) {
    return;
  }

  switch (command) {
    case 'copyHash': {
      const hash = message.hash;
      if (!hash) {
        panelTracker?.recordAction({
          command,
          outcome: 'ignored-missing-hash'
        });
        return;
      }
      await vscode.env.clipboard.writeText(hash);
      panelTracker?.recordAction({
        command,
        outcome: 'copied-hash',
        copiedHash: hash
      });
      void vscode.window.showInformationMessage(`Copied: ${hash.slice(0, 8)}`);
      break;
    }

    case 'copyReviewPacket': {
      const packetText = renderHistoryReviewPacketText(model);
      await vscode.env.clipboard.writeText(packetText);
      panelTracker?.recordAction({
        command,
        outcome: 'copied-review-packet',
        copiedTextLength: packetText.length
      });
      void vscode.window.showInformationMessage('Copied VI History review packet to clipboard.');
      break;
    }

    case 'openCommit': {
      const hash = message.hash;
      if (!hash) {
        panelTracker?.recordAction({
          command,
          outcome: 'ignored-missing-hash'
        });
        return;
      }

      if (!gitApi) {
        panelTracker?.recordAction({
          command,
          hash,
          outcome: 'missing-git-uri'
        });
        void vscode.window.showWarningMessage('Git API not available.');
        return;
      }

      const targetUri = vscode.Uri.file(`${model.repositoryRoot}/${model.relativePath}`);
      const gitUri = gitApi.toGitUri(targetUri, hash);
      await vscode.commands.executeCommand('vscode.open', gitUri);
      panelTracker?.recordAction({
        command,
        hash,
        outcome: 'opened-commit',
        openedUri: gitUri.toString()
      });
      break;
    }

    case 'openDocumentation': {
      await vscode.commands.executeCommand('labviewViHistory.openDocumentation', message.pageId);
      panelTracker?.recordAction({
        command,
        outcome: 'opened-documentation',
        documentationPageId: message.pageId
      });
      break;
    }

    default: {
      panelTracker?.recordAction({
        command,
        outcome: 'unsupported-command'
      });
    }
  }
}
