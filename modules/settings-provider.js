const fs = require('fs');
const CONSTANTS = require("./constants.js");

getSettings = () => {

    const settingsFile = process.env.SETTINGS_FILE

    if (!fs.existsSync(settingsFile)) {
        throw new Error('file provided does not exists')
    }

    const rawData = fs.readFileSync(settingsFile)
    const jsonData = JSON.parse(rawData)

    return {
        targetBranch: process.env.GITHUB_BASE_REF,
        sourceBranch: process.env.GITHUB_HEAD_REF,
        acceptedPrefixes: jsonData?.conventionalCommits || CONSTANTS.DEFAULT_CONVENTIONAL_COMMITS,
        scopes: jsonData?.scopes || {}
    }
}

module.exports = {
    getSettings
};
