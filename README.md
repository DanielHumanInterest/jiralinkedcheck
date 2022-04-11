# Checking PRs for words

Based on the [actions template](https://github.com/actions/javascript-template), we created a new action.
This action checks for the presence of a specific string in the body of a PR.

The string is case sensitive.

The authors are case insensitive.
# Using this action

You would need to add this in a file in `.github/workflows`

```
name: "Check PR for string"
on: [pull_request]
    types: [ opened, reopened, edited ]

jobs:
  check_pr:
    runs-on: ubuntu-latest
    steps:
    - name: Check PR
      uses: DanielHumanInterest/jiralinkedcheck@main
      with:
        authorsToCheck: 'danielhumaninterest, potato, anotherNameHERE'
        wordToCheck: 'captain401.atlassian'
        github-token: ${{github.token}}
```

The `wordToCheck` variable will include the string that we want the body of the PR to include.

They can be left empty if no check wants to be done.

The `authorsToCheck` variable should include all authors that this check should apply to. If no authors are passed, it will apply the check to all users/authors.

## License

This is a modification of the original template, and is released under
the MIT license.

## To change

If you're on a branch, make a change.

npm run ncc

Merge, including the change in dist/index.js.

Done.
