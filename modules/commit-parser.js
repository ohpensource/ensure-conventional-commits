const CONSTANTS = require("./constants.js");
const logger = require("./logger.js");

const parseCommitSubject = (commit) => {

    const msgRegex = CONSTANTS.REGEX_CONVENTIONAL_COMMIT_FORMAT;
    const matchResult = commit.subject.match(msgRegex);

    if (!matchResult) {
        logger.logValidationError(commit, "Commit does not follow basic pattern, check expected values next.", CONSTANTS.COMMIT_PATTERN_EXAMPLES)
        process.exit(1);
    }

    let { type, scopes, breaking, body } = matchResult.groups

    scopes = scopes ? scopes.split(",") : []
    scopesProvided = scopes.length !== 0
    isBreaking = breaking === "!"

    return {
        type,
        scopes,
        scopesProvided,
        isBreaking,
        body
    };
}

module.exports = {
    parseCommitSubject
};
