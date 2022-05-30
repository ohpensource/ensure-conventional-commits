const git = require("./modules/git.js");
const logger = require("./modules/logger.js");
const commitParser = require("./modules/commit-parser.js");
const scopesValidator = require("./modules/scopes-validator.js");
const CONSTANTS = require("./modules/constants.js");
const fs = require('fs');

logger.logTitle("ENSURING CONVENTIONAL COMMITS");

// -----------------------------//
// ----- INPUT PARAMETERS ----- //
// -----------------------------//

const customCCFilePath = process.env.CUSTOM_CONVENTIONAL_COMMITS_FILE || 'not provided';
const scopesAccepted = process.env.SCOPES || [];
const validateScopesAgainstApps = !!process.env.VALIDATE_SCOPES_AGAINST_APPS || false;
const appsFolder = process.env.APPS_FOLDER || "";
const targetBranch = process.env.GITHUB_BASE_REF;
const sourceBranch = process.env.GITHUB_HEAD_REF;
const defaultCCTypes = CONSTANTS.DEFAULT_CONVENTIONAL_COMMITS;

logger.logTitle("input GH action");
logger.logKeyValuePair("custom-conventional-commits-file", customCCFilePath);
logger.logKeyValuePair("scopes-accepted", scopesAccepted);
logger.logKeyValuePair("validate-scopes-against-apps", validateScopesAgainstApps);
logger.logKeyValuePair("apps-folder", appsFolder);

logger.logTitle("context parameters");
logger.logKeyValuePair("target-branch", targetBranch);
logger.logKeyValuePair("source-branch", sourceBranch);
logger.logKeyValuePair("default-cc-types", defaultCCTypes);


// ------------------ //
// ----- SCRIPT ----- //
// ------------------ //

let useCustomCC = false
let customCCTypes = []
if (customCCFilePath !== 'not provided') {
  useCustomCC = true;
  const rawData = fs.readFileSync(customCCFilePath);
  customCCTypes = JSON.parse(rawData).map(x => x.commitType)
  logger.logKeyValuePair("custom-cc-types", customCCTypes);
}

logger.logKeyValuePair("using-custom-conventional-commits", useCustomCC);
const commitTypesAccepted = useCustomCC ? customCCTypes : defaultCCTypes

logger.logAction("Evaluating Commit Messages");

let commitsAreValid = git
  .getCommitsInsidePullRequest(targetBranch, `origin/${sourceBranch}`)
  .every((commit) => {

    logger.logAction(`commit message: ${commit.subject}`)

    if (commit.subject.includes('[skip ci]')) {
      logger.logWarning('skipping commit validation because contains [skip ci].');
      return true;
    }

    let { type, scopes, scopesProvided, isBreaking, body } = commitParser.parseCommitSubject(commit)

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

    commitTypeOk = commitTypesAccepted.includes(type)
    if (!commitTypeOk) {
      logger.logValidationError(commit, `Commit type ${type} is not valid. Check expected values next.`, commitTypesAccepted)
      return false
    }

    if (scopesProvided) {
      let scopesOk = scopesAccepted.length ? scopesValidator.validateScopes(scopes, scopesAccepted) : true
      if (!scopesOk) {
        logger.logValidationError(commit, `Scopes provided (${scopes}) are not valid. Check expected values next.`, scopesAccepted)
        return false
      }

      let filesModified = git.getFilesModifiedInACommit(commit.hash)
      logger.logKeyValuePair(`filesModified`, filesModified)
      let filesMatchScope = validateScopesAgainstApps ? scopesValidator.validateFilesModifiedPerScope(filesModified, appsFolder, scopes) : true

      if (!filesMatchScope) {
        logger.logValidationError(commit, `files modified are not in the scope provided`)
        return false
      }

      return scopesOk && filesMatchScope
    } else {
      return commitTypeOk
    }
  });


if (!commitsAreValid) {
  process.exit(1)
}

logger.logSucceed('commits are valid')
