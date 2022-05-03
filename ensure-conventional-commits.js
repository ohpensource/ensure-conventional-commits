const git = require("./git.js");
const logger = require("./logging.js");
const fs = require('fs');

logger.logTitle("ENSURING CONVENTIONAL COMMITS");


// -----------------------------//
// ----- INPUT PARAMETERS ----- //
// -----------------------------//

const baseBranch = process.argv[2];
const prBranch = process.argv[3];
const customCCFilePath = process.argv[4] || 'not provided';
const defaultCCFilePath = process.env.DEFAULT_CC
const defaultCCTypes = getDefaultConventionalCommits(defaultCCFilePath)

logger.logKeyValuePair("base-branch", baseBranch);
logger.logKeyValuePair("pr-branch", prBranch);
logger.logKeyValuePair("custom-conventional-commits-file", customCCFilePath);
logger.logKeyValuePair("default-cc-types", defaultCCTypes);

// ------------------ //
// ----- SCRIPT ----- //
// ------------------ //

let useCustomCC = false
let customCCTypes = []
if (customCCFilePath !== 'not provided') {
  useCustomCC = true;
  customCCTypes = getCustomConventionalCommits(customCCFilePath);
  logger.logKeyValuePair("custom-cc-types", customCCTypes);
}

logger.logKeyValuePair("using-custom-conventional-commits", useCustomCC);

let ok = git
  .getCommitsInsidePullRequest(baseBranch, `origin/${prBranch}`)
  .every((commit) => {
    logger.logAction("EVALUATING COMMIT");

    let commitTypes = useCustomCC ? customCCTypes : defaultCCTypes
    let commitMessageOk = validateCommitFormat(commit.subject, commitTypes)
    let result = {
      message: commitMessageOk ? "OK" : "WRONG",
      documentation: "https://www.conventionalcommits.org/en/v1.0.0/",
      supportedPrefixes: commitTypes,
      examples: [
        "feat: awesome new feature",
        "break: removing GET /ping endpoint",
        "feat (app1): awesome new feature in the app1",
        "[skip ci] doing some ci magic"
      ],
    };

    const commitDetails = {
      shortHash: commit.shortHash,
      subject: commit.subject,
      author: commit.author
    };

    if (commitMessageOk) {
      logger.logSucceed(`commit is valid`);
    } else {
      logger.logError("commit is invalid")
      logger.logKeyValuePair("result", result);
    }

    logger.logKeyValuePair("commit", commitDetails);

    return commitMessageOk;
  });

if (!ok) {
  process.exit(1);
}

// --------------------- //
// ----- FUNCTIONS ----- //
// --------------------- //
function validateCommitFormat(commitMsg, commitTypesAccepted) {
  if (commitMsg.includes('[skip ci]')) {
    logger.logWarning('skipping commit validation because contains [skip ci].');
    return true;
  }

  // release notes
  const convRegex = /(?<type>^[a-z]+)(?<scope>\([a-z\d,\-]+\))?(?<breaking>!)?(?<colon>:{1})(?<space> {1})(?<subject>.*)/;
  const matchResult = commitMsg.match(convRegex);

  if (!matchResult) {
    return false;
  }

  let { breaking, type } = matchResult.groups;
  const validCommitType = commitTypesAccepted.includes(type);
  if (!validCommitType) {
    return false;
  }

  if (breaking || type === 'break') {
    logger.logWarning(`this commit is a breaking change`);
  }

  return true;
}

function getDefaultConventionalCommits(filePath) {
  const rawdata = fs.readFileSync(filePath);
  const DefaultCCTypevsReleaseType = JSON.parse(rawdata);
  return DefaultCCTypevsReleaseType
    .map(x => x.commitType)
    .filter((v, i, a) => a.indexOf(v) === i); // get unique values
}

function getCustomConventionalCommits(customCCFilePath) {
  const rawdata = fs.readFileSync(customCCFilePath);
  const CCTypevsReleaseType = JSON.parse(rawdata);
  return CCTypevsReleaseType.map(x => x.commitType);
}