// VI History - MIT License
// History panel HTML rendering

import {
  ViHistoryCommit,
  ViHistoryViewModel
} from '../services/viHistoryModel.js';

export interface HistoryPanelComparePreflightState {
  status: 'ready' | 'blocked' | 'unavailable';
  provider: string;
  labviewVersion: string;
  labviewBitness: string;
  nextAction: string;
  cliHint: string;
  warningMessage?: string;
}

export function renderHistoryPanelHtml(model: ViHistoryViewModel): string {
  const historyWindowSummary = renderHistoryWindowSummary(model);
  const rows = model.commits
    .map((commit: ViHistoryCommit, index: number) => {
      const selectCheckbox = `<input data-testid="history-commit-select" type="checkbox" data-hash="${escapeHtml(commit.hash)}" />`;
      const compareBase = commit.previousHash
        ? `<div data-testid="history-compare-pair"><strong>Adjacent:</strong> <code>${escapeHtml(commit.hash.slice(0, 8))}</code> <strong>vs prior:</strong> <code>${escapeHtml(commit.previousHash.slice(0, 8))}</code></div>`
        : 'Oldest retained revision';

      return `
        <tr data-testid="history-row" data-commit-index="${index}">
          <td data-testid="history-commit-select-cell">${selectCheckbox}</td>
          <td data-testid="history-commit-hash"><code>${escapeHtml(commit.hash.slice(0, 8))}</code></td>
          <td data-testid="history-commit-date">${escapeHtml(commit.authorDate)}</td>
          <td data-testid="history-commit-author">${escapeHtml(commit.authorName)}</td>
          <td data-testid="history-commit-subject">${escapeHtml(commit.subject)}</td>
          <td data-testid="history-compare-base">${compareBase}</td>
          <td data-testid="history-commit-actions">
            <button data-testid="history-action-open" data-command="openCommit" data-hash="${escapeHtml(commit.hash)}">Open@commit</button>
            <button data-testid="history-action-copy" data-command="copyHash" data-hash="${escapeHtml(commit.hash)}">Copy hash</button>
          </td>
        </tr>
      `;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VI History</title>
    <style>
      body {
        font-family: var(--vscode-font-family);
        color: var(--vscode-foreground);
        background: var(--vscode-editor-background);
        padding: 16px;
      }
      .status {
        margin-bottom: 16px;
        padding: 12px;
        border: 1px solid var(--vscode-panel-border);
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border-bottom: 1px solid var(--vscode-panel-border);
        padding: 8px;
        text-align: left;
        vertical-align: top;
      }
      button {
        margin-right: 8px;
        margin-bottom: 6px;
      }
    </style>
  </head>
  <body>
    <div class="status" data-testid="history-status">
      <strong>Eligibility:</strong> <span data-testid="history-status-eligibility">${model.eligible ? 'Eligible' : 'Not eligible'}</span><br />
      <strong>Signature:</strong> <span data-testid="history-status-signature">${escapeHtml(model.signature)}</span><br />
      <strong>Commits:</strong> <span data-testid="history-status-commit-count">${model.commits.length}</span><br />
      <strong>History window:</strong> <span data-testid="history-status-history-window">${escapeHtml(historyWindowSummary)}</span><br />
      <button data-testid="history-action-copy-review-packet" data-command="copyReviewPacket">Copy review packet</button>
      <button data-testid="history-action-documentation" data-command="openDocumentation" data-page-id="user-workflow">Open docs</button>
    </div>
    <table data-testid="history-table">
      <thead>
        <tr>
          <th>Select</th>
          <th>Commit</th>
          <th>Date</th>
          <th>Author</th>
          <th>Subject</th>
          <th>Adjacent pair</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <details class="meta" data-testid="history-meta">
      <summary>Repository facts</summary>
      <div data-testid="history-meta-repository"><strong>Repository:</strong> ${escapeHtml(model.repositoryName)}</div>
      <div data-testid="history-meta-root"><strong>Root:</strong> ${escapeHtml(model.repositoryRoot)}</div>
      <div data-testid="history-meta-origin"><strong>Origin:</strong> ${escapeHtml(model.repositoryUrl ?? 'Unavailable')}</div>
      <div data-testid="history-meta-path"><strong>Path:</strong> ${escapeHtml(model.relativePath)}</div>
    </details>
    <script>
      const vscode = acquireVsCodeApi();
      document.body.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
          return;
        }
        const command = target.dataset.command;
        if (!command) {
          return;
        }
        vscode.postMessage({
          command,
          hash: target.dataset.hash,
          pageId: target.dataset.pageId
        });
      });
    </script>
  </body>
</html>`;
}

export function renderHistoryReviewPacketText(model: ViHistoryViewModel): string {
  const lines = [
    '# VI History Review Packet',
    '',
    `**Repository:** ${model.repositoryName}`,
    `**Path:** ${model.relativePath}`,
    `**Signature:** ${model.signature}`,
    `**Eligible:** ${model.eligible}`,
    `**Commits:** ${model.commits.length}`,
    '',
    '## Commit History',
    ''
  ];

  for (const commit of model.commits) {
    lines.push(`- ${commit.hash.slice(0, 8)} | ${commit.authorDate} | ${commit.authorName} | ${commit.subject}`);
  }

  return lines.join('\n');
}

function renderHistoryWindowSummary(model: ViHistoryViewModel): string {
  const window = model.historyWindow;
  if (!window) {
    return 'Default window';
  }

  if (window.truncated) {
    return `${window.loadedCommitCount} of ${window.totalCommitCount ?? '?'} commits (truncated)`;
  }

  return `${window.loadedCommitCount} commits (full history)`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
