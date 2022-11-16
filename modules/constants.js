const DEFAULT_CONVENTIONAL_COMMITS = {
    "break": {
        "release": "major"
    },
    "feat": {
        "release": "minor"
    },
    "fix": {
        "release": "fix"
    },
    "build": {
        "release": "none"
    },
    "chore": {
        "release": "none"
    },
    "ci": {
        "release": "none"
    },
    "docs": {
        "release": "none"
    },
    "style": {
        "release": "none"
    },
    "refactor": {
        "release": "none"
    },
    "perf": {
        "release": "none"
    },
    "test": {
        "release": "none"
    }
}

const REGEX_CONVENTIONAL_COMMIT_FORMAT = /(?<type>^[a-z\d]+)\(?(?<scopes>[a-z_\d,\-]+)?\)?(?<breaking>!)?(?<colon>:{1})(?<space> {1})(?<body>.*)/

const COMMIT_MSG_EXAMPLES = [
    "docs: updated readme",
    "fix: fix error in the API",
    "feat: awesome new feature",
    "break: removing GET /ping endpoint",
    "feat(app1): awesome new feature in the app1",
    "feat(app1,app2): awesome new feature in the app1 and app2",
    "[skip ci] doing some ci magic"
];

const COMMIT_PATTERN_EXAMPLES = [
    "type(scope): body",
    "type:body",
    "type(scope): body",
    "type(scope)!: body",
    "type!: body"
]

module.exports = {
    DEFAULT_CONVENTIONAL_COMMITS,
    REGEX_CONVENTIONAL_COMMIT_FORMAT,
    COMMIT_PATTERN_EXAMPLES,
    COMMIT_MSG_EXAMPLES
};

