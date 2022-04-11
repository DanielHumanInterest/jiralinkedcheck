import * as core from '@actions/core';
const { GitHub, context } = require('@actions/github')

export async function run() {
  try {
    const token = core.getInput('github-token', { required: true })
    const github = new GitHub(token, {})

    let authorIsInListToCheck = false;

    const authorsToCheckCsv = core.getInput('authorsToCheck');

    // If there are authors we need to specifically block, only block those.
    if (authorsToCheckCsv) {
      const author = context.payload.pull_request?.user?.login;

      if (!author) {
        // If there is no author, there is no PR, and we can accept by default.
        return;
      }

      const authorArray = authorsToCheckCsv.split(',');

      const lowerTrimmedArray = authorArray.map((author: string) => {
        return author.trim().toLowerCase();
      });

      const lowerTrimmedAuthorToCheck = author.trim().toLowerCase();

      authorIsInListToCheck = lowerTrimmedArray.includes(lowerTrimmedAuthorToCheck)
    }

    // If the authors should be blocked or there are none. The default is to block everyone.
    if (authorIsInListToCheck || !authorsToCheckCsv) {
      // Check if we should ensure a JIRA/REQ/Other is linked
      // If no string exists, do not check.
      const jiraString = core.getInput('jiraString')

      if (jiraString && context.payload.pull_request.body.indexOf(jiraString) < 0) {
        core.setFailed("The body of the PR does not contain " + jiraString)
      }
    }

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
