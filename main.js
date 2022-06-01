const git = require("./modules/git.js");
const logger = require("./modules/logger.js");
const settingsParser = require("./modules/settings-parser.js");
const commitValidator = require("./modules/commit-validator.js");


logger.logTitle("ENSURING CONVENTIONAL COMMITS");

// -----------------------------//
// ----- INPUT PARAMETERS ----- //
// -----------------------------//

const settingsPath = process.env.SETTINGS_FILE || 'not provided';
const targetBranch = process.env.GITHUB_BASE_REF;
const sourceBranch = process.env.GITHUB_HEAD_REF;

logger.logTitle("input GH action");
logger.logKeyValuePair("settings-file", settingsPath);

// ------------------ //
// ----- SCRIPT ----- //
// ------------------ //

let settings = {}
if (settingsPath !== 'not provided') {
  settings = settingsParser.parseSettings(settingsPath)
}

logger.logAction("Evaluating Commit Messages");

let commitsAreValid = git
  .getCommitsInsidePullRequest(targetBranch, `origin/${sourceBranch}`)
  .every((commit) =>
    commitValidator.validateCommit(commit.subject, commit.hash, settings)
  );


if (!commitsAreValid) {
  process.exit(1)
}

logger.logSucceed('commits are valid')
