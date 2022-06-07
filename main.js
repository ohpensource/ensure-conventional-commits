const git = require("./modules/git.js");
const logger = require("./modules/logger.js");
const settingsProvider = require("./modules/settings-provider.js");
const commitValidator = require("./modules/commit-validator.js");
const commitParser = require("./modules/commit-parser.js");

logger.logTitle("ENSURING CONVENTIONAL COMMITS");

const settings = settingsProvider.getSettings()
logger.logKeyValuePair('settings', settings)

let parsedCommits = git
  .getCommitsInsidePullRequest(settings.targetBranch, `origin/${settings.sourceBranch}`)
  .filter(commit => !commit.subject.includes('[skip ci]'))
  .map(commit => {
    const result = commitParser.parseCommitMessage(commit.subject)
    result.subject = commit.subject
    result.filesModified = git.getFilesModifiedInACommit(commit.hash)
    return result
  });

const wronglyParsedCommits = parsedCommits.filter(x => !x.canBeParse)

wronglyParsedCommits.forEach(x => logger.logError(`error parsing the commit: ${x.subject}`))

const invalidCommits = parsedCommits.filter(x => x.canBeParse &&
  !commitValidator.validateCommit(x, settings))

invalidCommits.forEach(x => logger.logError(`error validating the commit: ${x.subject}`))

const commitsAreValid = wronglyParsedCommits.length === 0 && invalidCommits.length === 0

if (commitsAreValid) { logger.logSucceed("commits are valid") }

process.exit(commitsAreValid ? 0 : 1)
