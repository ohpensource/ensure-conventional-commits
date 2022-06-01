const logger = require("./logger.js")

const validateScopes = (scopes, scopesAccepted) => {
    return scopes.every(scope =>
        scopesAccepted.includes(scope)
    )
}

const validateFilesModifiedPerScope = (filesModified, appsFolder, scopes) => {
    return scopes.every(scope => {
        const expectedPartialPath = appsFolder + scope  // example src/app1
        const filePathMatchScope = (filePath) => filePath.includes(expectedPartialPath)
        return filesModified.some(filePathMatchScope);
    })
}

module.exports = {
    validateScopes,
    validateFilesModifiedPerScope
};
