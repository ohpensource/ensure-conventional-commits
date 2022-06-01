const logger = require("./logger.js");
const CONSTANTS = require("./constants");

validateCustomCommitTypesProvided = (commitTypes) => {
    return commitTypes.every(element => {
        if (!element.commitType) {
            logger.logSettingsError('custom conventional commits provided', `no commit type defined for ${element.releaseType}`)
            return false
        }

        if (!element.releaseType) {
            logger.logSettingsError('custom conventional commits provided', `no release type defined for ${element.commitType}`)
            return false
        }

        logger.logKeyValuePair("commitType", element.commitType);
        logger.logKeyValuePair("releaseType", element.releaseType);

        if (!CONSTANTS.ALLOWED_RELEASE_TYPE.includes(element.releaseType)) {
            logger.logSettingsError('custom conventional commits provided', `${element.releaseType} is a invalid release type.`, CONSTANTS.ALLOWED_RELEASE_TYPE)
            return false
        }

        return true
    });
}

module.exports = {
    validateCustomCommitTypesProvided
};
