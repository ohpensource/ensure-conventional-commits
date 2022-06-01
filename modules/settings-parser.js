const fs = require('fs');
const path = require('path');
const logger = require('./logger.js')
const CONSTANTS = require("./constants.js");

const parseSettings = (settingsPath) => {
    const rawData = fs.readFileSync(settingsPath)
    const jsonData = JSON.parse(rawData)

    let commitTypes = {
        acceptedTypes: CONSTANTS.DEFAULT_CONVENTIONAL_COMMITS
    }
    if (jsonData['commitTypes']) {
        const typesSettings = jsonData['commitTypes']
        const acceptedList = []
        ExtractAllCommitPrefixes(typesSettings, acceptedList);
        commitTypes = {
            acceptedTypes: acceptedList,
            noRelease: typesSettings["noRelease"],
            fixes: typesSettings["fixes"],
            newFeatures: typesSettings["newFeatures"],
            breakingChanges: typesSettings["breakingChanges"],
        }
    }

    let scopes = []
    if (jsonData['scopeValidation']) {
        const scopeSettings = jsonData['scopeValidation']
        const scopeApproach = scopeSettings.scopesSource

        if (scopeApproach == 'list') {
            scopes = scopeSettings.scopesList
        } else {
            const directoriesPath = path.join(process.cwd(), scopeSettings.scopesSubfolder)
            const subdirectories = fs.readdirSync(directoriesPath)

            subdirectories.forEach(folder => {
                scopes.push({
                    name: folder,
                    folderPattern: scopeSettings.scopesSubfolder + folder + "/"
                })
            });
        }
    }

    const result = {
        commitTypes,
        scopes
    }

    logger.logKeyValuePair(`settings`, result)
    return result

    function ExtractAllCommitPrefixes(typesSettings, acceptedList) {
        Object.values(typesSettings)
            .map(array => array.map(prefix => acceptedList.push(prefix)));
    }
};

module.exports = {
    parseSettings
};
