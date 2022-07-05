import { Octokit } from '@octokit/core';

export const triggerPluginTestWorkflow = async (octokit: Octokit, pluginName: string) => {
  await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
    owner: 'CTECB',
    repo: 'learn_gh',
    workflow_id: 'main.yml',
    ref: 'master',
    inputs: {
      kintonePlugin: pluginName,
    }
  });
};
