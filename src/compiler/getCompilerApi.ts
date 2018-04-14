/* Automatically maintained from package.json. Do not edit! */
import { CompilerApi } from "./CompilerApi";
import { compilerPackageNames, importCompilerApi, immportLibFiles } from "./compilerVersions";

const compilerTypes: { [name: string]: Promise<CompilerApi>; } = {};

export function getCompilerApi(packageName: compilerPackageNames): Promise<CompilerApi> {
    if (compilerTypes[packageName] == null) {
        compilerTypes[packageName] = loadCompilerApi(packageName);
        compilerTypes[packageName].catch(() => delete compilerTypes[packageName]);
    }
    return compilerTypes[packageName];
}

async function loadCompilerApi(packageName: compilerPackageNames) {
    const libFilesPromise = immportLibFiles(packageName);
    const compilerApiPromise = importCompilerApi(packageName);
    const api = await compilerApiPromise as any as CompilerApi;
    api.tsAstViewer = {
        packageName,
        cachedSourceFiles: {}
    };
    const libFiles = await libFilesPromise;
    for (const sourceFile of getLibSourceFiles())
        api.tsAstViewer.cachedSourceFiles[sourceFile.fileName] = sourceFile;
    return api;

    function getLibSourceFiles() {
        return Object.keys(libFiles)
            .map(key => libFiles[key] as { fileName: string; text: string; })
            .map(libFile => api.createSourceFile(libFile.fileName, libFile.text, api.ScriptTarget.Latest, false, api.ScriptKind.TS));
    }
}
