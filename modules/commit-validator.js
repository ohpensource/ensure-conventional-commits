const logger = require("./logger.js");


const foldersContainFile = (file, folders) => folders.some(folder => file.startsWith(folder))

validateCommit = (commit, settings) => {

    logger.logAction(`validating commit:`)
    logger.logKeyValuePair(`commit`, commit)

    let commitTypeOk = commit.type in settings.acceptedPrefixes
    if (!commitTypeOk) {
        logger.logValidationError(`commit prefix ${commit.type} is not valid.`, settings.acceptedPrefixes)
        return false
    }

    const scopesOk = commit.scopes.every(commitScope => commitScope in settings.scopes)
    if (!scopesOk) {
        logger.logValidationError(`scopes provided (${commit.scopes}) are not valid. Check expected values next.`, settings.scopes)
        return false
    }

    const folders = Object.values(settings.scopes).map(x => x.folderPattern)
    const filesContainedInFolders = commit.filesModified.filter(file => foldersContainFile(file, folders))
    const scopesRequiredForThisCommit = getScopeFromFiles(filesContainedInFolders, settings)

    if (scopesRequiredForThisCommit.length !== commit.scopes.length) {
        logScopesError("found the next error validating scopes and files modified:", commit, scopesRequiredForThisCommit);
        return false
    }

    const scopesMatch = scopesRequiredForThisCommit.every(x => commit.scopes.includes(x))
    if (!scopesMatch) {
        logScopesError("scopes provided don't match files modified:", commit, scopesRequiredForThisCommit);
        return false
    }

    return true
}

module.exports = {
    validateCommit
}

function logScopesError(msg, commit, scopesRequiredForThisCommit) {
    logger.logError(msg);
    logger.logErrorParameter(`files modified`, commit.filesModified);
    logger.logErrorParameter(`expected scopes`, scopesRequiredForThisCommit);
    logger.logErrorParameter(`scopes found`, commit.scopes);
}

function getScopeFromFiles(filesContainedInFolders, settings) {
    const result = []
    filesContainedInFolders.forEach(file => {
        for (const scope in settings.scopes) {
            const folder = settings.scopes[scope].folderPattern;
            if (file.startsWith(folder)) {
                result.push(scope)
            }
        }
    });
    return [...new Set(result)] // remove duplicates
}

