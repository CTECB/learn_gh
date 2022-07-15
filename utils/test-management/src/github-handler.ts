import { Octokit } from '@octokit/core';

export const triggerPluginTestWorkflow = async (octokit: Octokit, pluginName: string) => {
  await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
    owner: 'kintone-labs',
    repo: 'kintone-plugin-tests',
    workflow_id: 'main.yml',
    ref: 'ci-check',
    inputs: {
      kintonePlugin: pluginName,
    }
  });
};
