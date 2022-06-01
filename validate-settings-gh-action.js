const logger = require("./modules/logger.js");
const settingsValidator = require("./modules/settings-validator.js");
const settingsParser = require("./modules/settings-parser.js");
const fs = require('fs');

logger.logTitle("VALIDATING GH ACTION SETTINGS");

const settingsPath = process.env.SETTINGS_FILE;
logger.logKeyValuePair("settings-file", settingsPath);

if (fs.existsSync(settingsPath)) {
    const settings = settingsParser.parseSettings(settingsPath)

    if (settings.commitTypes) {
        const commitTypesAreValid = settingsValidator.validateCustomCommitTypesProvided(settings.commitTypes)
        if (!commitTypesAreValid) {
            process.exit(1)
        }
    }

    // todo: validate scopes provided

} else {
    throw new Error('ERROR: custom-conventional-commits-file path does not exist!');
}
