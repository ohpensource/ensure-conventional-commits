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
      - uses: ohpensource/ensure-conventional-commits-gh-action@v0.1.5
        name: Ensure conventional commits
```

The action currently accepts the following prefixes:

- **break:** --> updates the MAJOR semver number. Used when a breaking changes are introduced in your code. A commit message example could be "_break: deprecate endpoint GET /parties V1_".
- **feat:** --> updates the MINOR semver number. Used when changes that add new functionality are introduced in your code. A commit message example could be "_feat: endpoint GET /parties V2 is now available_".
- **fix:** --> updates the PATCH semver number. Used when changes that solve bugs are introduced in your code. A commit message example could be "_fix: properly manage contact-id parameter in endpoint GET /parties V2_".
- **build:**, **chore:**, **ci:**, **docs:**, **style:**, **refactor:**, **perf:**, **test:** --> There are scenarios where you are not affecting any of the previous semver numbers. Those could be: refactoring your code, reducing building time of your code, adding unit tests, improving documentation, ... For these cases, conventional-commits allows for more granular prefixes. A commit message example could be "docs: improve readme with examples".

## remarks

* :warning: commits that contain `[skip ci]` are skipped from the validation.
* :warning: for the `actions/checkout@v2` the `fetch-depth: 0` parameter is **MANDATORY**

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
          custom-conventional-commits-file: custom-conventional-commits.json
```

example fie: [custom-conventional-commits-accepted.json](custom-conventional-commits-accepted.json)

# Do you want to validate commit scopes?

Simply provide them as a coma-separated list in the GH action:

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
      - uses: ohpensource/ensure-conventional-commits-gh-action@v0.1.5
        name: Ensure conventional commits
        with:
          scopes: "app1,app2"
```

examples:

| Commit Message                                   | Pass                                   |
| ------------------------------------------------ | -------------------------------------- |
| fix(app1): fixed error in the API                | ✅                                      |
| feat(app2): added new feature for authentication | ✅                                      |
| major(app3): updated endpoints paths             | ❌  app3 not provided in the scope list |

# Do you want to make sure files modified match the commit scopes?

Let's say you have the next file structure:

```bash
├── CHANGELOG.md
├── README.md
├── apps-changed.json
├── src
│   ├── app1
│   │   ├── CHANGELOG.md
│   │   └── version.json
│   ├── app2
│   │   ├── CHANGELOG.md
│   │   └── version.json
│   └── app3
│       ├── CHANGELOG.md
│       └── version.json
└── version.json
```
Where you have apps under the `src` folder. Then, you want to make sure all commits refer to the app modified through the scope. Next are some examples:

* fix(app1): fixed error in the API                   -> must contain files modified under the app1/
* feat(app2): added new feature for authentication    -> must contain files modified under the app2/
* major(app3): updated endpoints paths                -> must contain files modified under the app3/

## remarks
:warning: In case a commit doesn't have a scope, only the commit type and format will be validated

Then you can validate the commits by setting the GH action as next:

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
      - uses: ohpensource/ensure-conventional-commits-gh-action@v0.1.5
        name: Ensure conventional commits
        with:
          scopes: "app1,app2"
          validate-scopes-against-apps: true
          apps-folder: "src/"
```
Notes, in case the apps are listed in the root directory, the `app-folder` doesn't have to be provided.

examples:

| Commit Message                                   | filles modified              | Pass                                          |
| ------------------------------------------------ | ---------------------------- | --------------------------------------------- |
| fix(app1): fixed error in the API                | include files in app1/       | ✅                                             |
| fix(app1): fixed error in app2                   | only includes files in app2/ | ❌ because it must include files in app1       |
| feat(app2): added new feature for authentication | include files in app2/       | ✅                                             |
| major(app3): updated endpoints paths             | include files in app3/       | ❌ because app3 not provided in the scope list |

# License Summary

This code is made available under the MIT license. Details [here](LICENSE).
