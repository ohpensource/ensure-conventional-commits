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

const REGEX_CONVENTIONAL_COMMIT_FORMAT = /(?<type>^[a-z]+)\(?(?<scopes>[a-z\d,\-]+)?\)?(?<breaking>!)?(?<colon>:{1})(?<space> {1})(?<body>.*)/

const COMMIT_EXAMPLES = [
    "feat: awesome new feature",
    "break: removing GET /ping endpoint",
    "feat (app1): awesome new feature in the app1",
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
    DEFAULT_CONVENTIONAL_COMMITS,
    REGEX_CONVENTIONAL_COMMIT_FORMAT,
    COMMIT_PATTERN_EXAMPLES,
    COMMIT_EXAMPLES
};

