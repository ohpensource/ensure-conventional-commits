const fs = require('fs');
const CONSTANTS = require("./constants.js");

getSettings = () => {

    let acceptedPrefixes, scopes;
    const defaultPrefixes = CONSTANTS.DEFAULT_CONVENTIONAL_COMMITS
    const settingsFile = process.env.SETTINGS_FILE

    if (settingsFile && !fs.existsSync(settingsFile)) {
        throw new Error('file provided does not exists')
    } else if (settingsFile) {
        const rawData = fs.readFileSync(settingsFile)
        const jsonData = JSON.parse(rawData)
        acceptedPrefixes = jsonData?.conventionalCommits
        scopes = jsonData?.scopes
    }

    return {
        targetBranch: process.env.GITHUB_BASE_REF,
        sourceBranch: process.env.GITHUB_HEAD_REF,
        acceptedPrefixes: acceptedPrefixes ?? defaultPrefixes,
        scopes: scopes ?? {}
    }
}

module.exports = {
    getSettings
};
