# ensure-conventional-commitscheck-conventional-commits

This action checks that ALL commits present in a pull request follow [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/). Here you have an example of a complete workflow:

```yaml
name: CI
on:
  pull_request:
    branches: ["main"]
jobs:
  check-conventional-commits:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - uses: ohpensource/platform-cicd/actions/git/ensure-conventional-commits@0.6.0.0
        name: Ensure conventional commits
        with:
          base-branch: $GITHUB_BASE_REF
          pr-branch: $GITHUB_HEAD_REF
```

The action currently accepts the following prefixes:

- **break:** --> updates the MAJOR semver number. Used when a breaking changes are introduced in your code. A commit message example could be "_break: deprecate endpoint GET /parties V1_".
- **feat:** --> updates the MINOR semver number. Used when changes that add new functionality are introduced in your code. A commit message example could be "_feat: endpoint GET /parties V2 is now available_".
- **fix:** --> updates the PATCH semver number. Used when changes that solve bugs are introduced in your code. A commit message example could be "_fix: properly manage contact-id parameter in endpoint GET /parties V2_".
- **build:**, **chore:**, **ci:**, **docs:**, **style:**, **refactor:**, **perf:**, **test:** --> There are scenarios where you are not affecting any of the previous semver numbers. Those could be: refactoring your code, reducing building time of your code, adding unit tests, improving documentation, ... For these cases, conventional-commits allows for more granular prefixes. A commit message example could be "docs: improve readme with examples".

:warning: Attention! If you set your action to work with 3 numbers, these prefixes will update the PATCH number.