const ALLOWED_RELEASE_TYPE = [
    "major",
    "minor",
    "patch"
];

const DEFAULT_CONVENTIONAL_COMMITS = [
    "break",
    "feat",
    "fix",
    "build",
    "chore",
    "ci",
    "docs",
    "style",
    "refactor",
    "perf",
    "test"
]

const REGEX_CONVENTIONAL_COMMIT_FORMAT = /(?<type>^[a-z\d]+)\(?(?<scopes>[a-z\d,\-]+)?\)?(?<breaking>!)?(?<colon>:{1})(?<space> {1})(?<body>.*)/

const COMMIT_MSG_EXAMPLES = [
    "docs: updated readme",
    "fix: fix error in the API",
    "feat: awesome new feature",
    "break: removing GET /ping endpoint",
    "feat(app1): awesome new feature in the app1",
    "[skip ci] doing some ci magic"
];

const COMMIT_PATTERN_EXAMPLES = [
    "type(scope):body",
    "type:body",
    "type(scope):body",
    "type(scope)!:body",
    "type!:body"
]

module.exports = {
    ALLOWED_RELEASE_TYPE,
    DEFAULT_CONVENTIONAL_COMMITS,
    REGEX_CONVENTIONAL_COMMIT_FORMAT,
    COMMIT_PATTERN_EXAMPLES,
    COMMIT_MSG_EXAMPLES
};

