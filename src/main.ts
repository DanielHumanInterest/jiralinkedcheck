import * as core from '@actions/core';
const { GitHub, context } = require('@actions/github')

export async function run() {
  try {
    const token = core.getInput('github-token', { required: true })
    const github = new GitHub(token, {})

    const wordToCheck = core.getInput('wordToCheck')
    const wordToExclude = core.getInput('wordToExclude')

    // If no string exists, do not check.
    if (!wordToCheck && !wordToExclude) {
      core.info("No word was passed to verify it's existence in or exclusion from the body of the PR. The check passes by default.")
      return;
    }

    let authorIsInListToCheck = false;

    const authorsToCheckCsv = core.getInput('authorsToCheck');

    // If there are authors we need to specifically block, only block those.
    if (authorsToCheckCsv) {
      const author = context.payload.pull_request?.user?.login;

      if (!author) {
        core.info("There is no author, we assume this check is not running on a PR and should pass this check by default")
        // If there is no author, there is no PR, and we can accept by default.
        return;
      }

      const authorArray = authorsToCheckCsv.split(',');

      const lowerTrimmedArray = authorArray.map((author: string) => {
        return author?.trim().toLowerCase();
      });

      const lowerTrimmedAuthorToCheck = author.trim().toLowerCase();

      authorIsInListToCheck = lowerTrimmedArray.includes(lowerTrimmedAuthorToCheck)
    }

    // If the authors should be blocked or there are none. The default is to block everyone.
    if (authorIsInListToCheck || !authorsToCheckCsv) {

      // Ensure the PR contains the required string
      if (context.payload.pull_request.body.indexOf(wordToCheck) < 0) {
        core.setFailed("The body of the PR does not contain " + wordToCheck)
      }

      // Ensure the PR body does not contain a denylisted string
      if (context.payload.pull_request.body.indexOf(wordToExclude) >= 0) {
        core.setFailed("The body of the PR contains a denylisted word " + wordToExclude)
      }
    }

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
