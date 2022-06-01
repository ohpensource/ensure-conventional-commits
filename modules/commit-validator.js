const git = require("./git.js");
const scopesValidator = require("./scopes-validator.js")
const commitParser = require("./commit-parser.js")
const CONSTANTS = require("./constants.js")
const logger = require("./logger.js");


validateCommit = (commitMsg, hash, settings) => {
    logger.logAction(`commit message: ${commitMsg}`)

    if (commitMsg.includes('[skip ci]')) {
        logger.logWarning('skipping commit validation because contains [skip ci].');
        return true;
    }

    let { type, scopes, scopesProvided, isBreaking, body } = commitParser.parseCommitMessage(commitMsg)
    if (!type) {
        logger.logValidationError(commitMsg, "Commit does not follow basic pattern, check expected values next.", CONSTANTS.COMMIT_PATTERN_EXAMPLES)
        return false
    }

    logger.logKeyValuePair('isBreaking', isBreaking)
    logger.logKeyValuePair('type', type)
    logger.logKeyValuePair('body', body)

    if (scopesProvided) {
        logger.logKeyValuePair('scopes', scopes)
    } else {
        logger.logKeyValuePair('scopesProvided', scopesProvided)
    }

    if (type === 'break' || isBreaking) {
        logger.logWarning(`this commit is a breaking change`)
    }

    let commitTypeOk = settings.commitTypes.acceptedTypes.includes(type)
    if (!commitTypeOk) {
        logger.logValidationError(commitMsg, `Commit type ${type} is not valid. Check expected values next.`, settings.commitTypes)
        return false
    }

    if (scopesProvided && settings.scopes) {

        const acceptedScopes = settings.scopes.map(x => x.name)
        const scopesOk = scopesValidator.validateScopes(scopes, acceptedScopes)
        if (!scopesOk) {
            logger.logValidationError(commitMsg, `Scopes provided (${scopes}) are not valid. Check expected values next.`, acceptedScopes)
            return false
        }

        return scopesOk

        // let filesModified = git.getFilesModifiedInACommit(hash)
        // logger.logKeyValuePair(`filesModified`, filesModified)

        // // filter scopes with pattern
        // const scopesWithFolderPattern = settings.scope.filter(x => x.folderPattern)
        // const scopesFromFiles = // todo
        //   // interception, if there are files from one scope that is not mention, throw error and ask for that scope
        //   let filesMatchScope = scopesValidator.validateFilesModifiedPerScope(filesModified, appsFolder, scopes)

        // if (!filesMatchScope) {
        //   logger.logValidationError(commit, `files modified are not in the scope provided`)
        //   return false
        // }

        // return scopesOk && filesMatchScope
    } else {
        return commitTypeOk
    }

}


module.exports = {
    validateCommit
};