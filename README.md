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
      - uses: ohpensource/ensure-conventional-commits-gh-action@v1.1.2
        name: Ensure conventional commits
        with:
          settings-file: cicd/settings.json
```

The main parameter is the `settings-file`, it is OPTIONAL and it is the path to a JSON file where you can provide the next settings:

* Custom conventional commits settings (key: `conventionalCommits`).
  * List of prefixes that commits must start with. Examples: `break,feat,fix`
  * A prefix must contain only letters and numbers.
  * For every prefix, the release type based on the semantic versioner must be provided. Valid values are: `major,minor,patch,none`. key: `release`
* Scopes list (key: `scopes`):
  * Scopes provided in the commits will be validated against the list provided.
  * Scope keys must only contain letters, numbers, dashes and underscores.
  * Folder patterns for every scope to ensure commits modify the right files. key: `folderPattern`

Here is an example of a `settings-file`:

```json
{
    "conventionalCommits": {
        "break": {
            "release": "major"
        },
        "feat": {
            "release": "minor"
        },
        "fix": {
            "release": "patch"
        },
        "refactor": {
            "release": "none"
        },
        "docs":{
            "release": "none"
        }
    },
    "scopes": {
        "app1": {
            "folderPattern": "app1"
        },
        "app2": {
            "folderPattern": "app2"
        },
        "app3": {
            "folderPattern": "app3"
        }
    }
}
```

Commit Examples:

| Commit Message                                   | filles modified                        | Pass                                                          |
| ------------------------------------------------ | -------------------------------------- | ------------------------------------------------------------- |
| fix(app1): fixed error in the API                | only files in app1/                    | ✅ right files modified                                        |
| fix(app1): fixed error in app2                   | files in app2/                         | ❌ because it must ONLY include files in app1/                 |
| feat(app2): added new feature for authentication | include files in app2/ and the readme/ | ❌ because it must ONLY include files in app2/                 |
| major(app4): updated endpoints paths             | include files in app4/                 | ❌ because app4 is not provided in the scope list              |
| fix: fixed error in app3                         | only modified app3/ files              | ❌ missing app3 scope                                          |
| docs: updated readme                             | only readme/ modified                  | ✅ no scope provided and file does not match any folderPattern |

## Default Conventional Commits accepted

If you don't provide a `settings-file` or you don't define any conventional commits inside it, the following prefixes will be used:

- **break:** --> updates the MAJOR semver number. Used when a breaking changes are introduced in your code. A commit message example could be "_break: deprecate endpoint GET /parties V1_".
- **feat:** --> updates the MINOR semver number. Used when changes that add new functionality are introduced in your code. A commit message example could be "_feat: endpoint GET /parties V2 is now available_".
- **fix:** --> updates the PATCH semver number. Used when changes that solve bugs are introduced in your code. A commit message example could be "_fix: properly manage contact-id parameter in endpoint GET /parties V2_".
- **build:**, **chore:**, **ci:**, **docs:**, **style:**, **refactor:**, **perf:**, **test:** --> There are scenarios where you are not affecting any of the previous semver numbers. Those could be: refactoring your code, reducing building time of your code, adding unit tests, improving documentation, ... For these cases, conventional-commits allows for more granular prefixes. A commit message example could be "docs: improve readme with examples".

## remarks

* :warning: commits that contain `[skip ci]` are skipped from the validation.
* :warning: for the `actions/checkout@v2` the `fetch-depth: 0` parameter is **MANDATORY**

# License Summary

This code is made available under the MIT license. Details [here](LICENSE).
