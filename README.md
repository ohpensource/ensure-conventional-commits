# ensure-conventional-commits-gh-action

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
      - uses: ohpensource/ensure-conventional-commits-gh-action@main
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

## remarks

:warning: commits that contain `[skip ci]` are skipped from the validation.

# You want to use custom commit types ?

1. Create a JSON file providing there the custom commit type and the release associated (`major,minor,patch`) as next:

```json
[
    {
        "commitType": "break",
        "releaseType": "major"
    },
    {
        "commitType": "feat",
        "releaseType": "minor"
    },
    {
        "commitType": "fix",
        "releaseType": "minor"
    }
]
```

2. Provide its path in the parameter `custom-conventional-commits-file`

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
      - uses: ohpensource/ensure-conventional-commits-gh-action@main
        name: Ensure conventional commits
        with:
          base-branch: $GITHUB_BASE_REF
          pr-branch: $GITHUB_HEAD_REF
          custom-conventional-commits-file: custom-conventional-commits.json
```

example fie: [custom-conventional-commits-accepted.json](custom-conventional-commits-accepted.json)

# Test this in Windows using WSL Ubuntu

```bash
CUSTOM_CC_FILE="custom-conventional-commits-accepted.json";
node validate-custom-cc-types.js $CUSTOM_CC_FILE ;

export GITHUB_BASE_REF="main";
export GITHUB_HEAD_REF="LANZ-2248";
export CUSTOM_CC="custom-conventional-commits-accepted.json";
export DEFAULT_CC="default-conventional-commits-accepted.json";
node ensure-conventional-commits.js $GITHUB_BASE_REF $GITHUB_HEAD_REF $CUSTOM_CC;
```

# License Summary

This code is made available under the MIT license. Details [here](LICENSE).
