function GetScopesFromFilesModified(filesModified, scopeVsFolderPatterns) {
    let result = []
    const folderPatterns = Object.entries(scopeVsFolderPatterns).map(x => x[1].folderPattern)
    filesModified.forEach(file => {
        const fileHasScopeAssociated = folderPatterns.some(x => file.includes(x))
        if (fileHasScopeAssociated) {
            const missingScope = Object.entries(scopeVsFolderPatterns).find(x => file.includes(x[1].folderPattern))[0]
            result.push(missingScope)
        }
    })

    return [...new Set(result)] // return unique values
}

module.exports = {
    GetScopesFromFilesModified
};
