import { expect } from "chai";
import settingsParser from "../../modules/settings-parser.js";

describe("parsing settings file with only scope list", () => {
    it("should return valid scope list based on json file", () => {
        // arrange
        const filePath = "./parse-settings/valid-scope-list.json"
        const expectedResult = [
            {
                name: "scope1",
                folderPattern: "folder/scope1"
            },
            {
                name: "scope2",
                folderPattern: "folder/scope2"
            }
        ]

        // act
        const result = settingsParser.parseSettings(filePath)

        // assert
        expect(result.scopes).to.deep.equal(expectedResult);
    });
});

describe("parsing settings file with only scopes by subfolder", () => {
    it("should return valid scope list based on subfolder", () => {
        // arrange
        const filePath = "./parse-settings/valid-scope-subfolder.json"
        const expectedResult = [
            {
                name: "app1",
                folderPattern: "parse-settings/src/app1/"
            },
            {
                name: "app2",
                folderPattern: "parse-settings/src/app2/"
            }
        ]

        // act
        const result = settingsParser.parseSettings(filePath)

        // assert
        expect(result.scopes).to.deep.equal(expectedResult);
    });
});

describe("parsing settings file with only commit types", () => {
    it("should return commit types", () => {
        // arrange
        const filePath = "./parse-settings/valid-commit-types.json"
        const expectedResult = {
            acceptedTypes: ["docs", "fix", "feat", "break"],
            noRelease: ["docs"],
            fixes: ["fix"],
            newFeatures: ["feat"],
            breakingChanges: ["break"]
        }

        // act
        const result = settingsParser.parseSettings(filePath)

        // assert
        expect(result.commitTypes).to.deep.equal(expectedResult);
    });
});