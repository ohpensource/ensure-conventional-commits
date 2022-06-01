const CONSTANTS = require("./constants.js");
const logger = require("./logger.js");

const parseCommitMessage = (commitMsg) => {

    const msgRegex = CONSTANTS.REGEX_CONVENTIONAL_COMMIT_FORMAT;
    const matchResult = commitMsg.match(msgRegex);

    if (!matchResult) {
        return {}
    }

    let { type, scopes, breaking, body } = matchResult.groups

    scopes = scopes ? scopes.split(",") : []
    const scopesProvided = scopes.length !== 0
    const isBreaking = breaking === "!"

    return {
        type,
        scopes,
        scopesProvided,
        isBreaking,
        body
    };
}

module.exports = {
    parseCommitMessage
};
