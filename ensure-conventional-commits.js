const git = require("./git.js");
const logger = require("./logging.js");
const fs = require('fs');

logger.logTitle("ENSURING CONVENTIONAL COMMITS");


// -----------------------------//
// ----- INPUT PARAMETERS ----- //
// -----------------------------//

const baseBranch = process.argv[2];
const prBranch = process.argv[3];
const customCCFilePath = process.argv[4] ?? 'not provided';
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
    let commitMessageOk = commitTypes.some((prefix) =>
      commit.subject.startsWith(`${prefix}:`)
    );
    let result = {
      message: commitMessageOk ? "OK" : "WRONG",
      documentation: "https://www.conventionalcommits.org/en/v1.0.0/",
      supportedPrefixes: commitTypes,
      examples: [
        "feat: awesome new feature",
        "break: removing GET /ping endpoint",
      ],
    };

    const commitDetails = {
      shortHash: commit.shortHash,
      subject: commit.subject,
      author: commit.author
    };

    commitMessageOk ? logger.logSucceed(`valid commit`) : logger.logError("invalid commit");
    logger.logKeyValuePair("result", result);
    logger.logKeyValuePair("commit", commitDetails);

    return commitMessageOk;
  });

if (!ok) {
  process.exit(1);
}

// --------------------- //
// ----- FUNCTIONS ----- //
// --------------------- //
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