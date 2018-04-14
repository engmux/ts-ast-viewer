import {CompilerApi, SourceFile, CompilerOptions, ScriptTarget, ScriptKind, CompilerHost} from "./CompilerApi";

export function createSourceFile(api: CompilerApi, code: string, scriptTarget: ScriptTarget, scriptKind: ScriptKind) {
    const name = `/ts-ast-viewer${getExtension(api, scriptKind)}`;
    const sourceFile = api.createSourceFile(name, code, scriptTarget, false, scriptKind);
    const options: CompilerOptions = { strict: true, target: scriptTarget, allowJs: true, module: api.ModuleKind.ES2015 };
    const files: { [name: string]: SourceFile | undefined; } = { [name]: sourceFile, ...api.tsAstViewerCachedSourceFiles };

    const compilerHost: CompilerHost = {
        getSourceFile: (fileName: string, languageVersion: ScriptTarget, onError?: (message: string) => void) => {
            return files[fileName];
        },
        // getSourceFileByPath: (...) => {}, // not providing these will force it to use the file name as the file path
        // getDefaultLibLocation: (...) => {},
        getDefaultLibFileName: (options: CompilerOptions) => "/" + api.getDefaultLibFileName(options),
        writeFile: (filePath, data, writeByteOrderMark, onError, sourceFiles) => {
            // do nothing
        },
        getCurrentDirectory: () => "/",
        getDirectories: (path: string) => [],
        fileExists: (fileName: string) => files[fileName] != null,
        readFile: (fileName: string) => files[fileName] != null ? files[fileName]!.getFullText() : undefined,
        getCanonicalFileName: (fileName: string) => fileName,
        useCaseSensitiveFileNames: () => true,
        getNewLine: () => "\n",
        getEnvironmentVariable: (name: string) => ""
    };
    const program = api.createProgram([...Object.keys(files)], options, compilerHost);
    const typeChecker = program.getTypeChecker();

    return {program, typeChecker, sourceFile};
}

function getExtension(api: CompilerApi, scriptKind: ScriptKind) {
    switch (scriptKind) {
        case api.ScriptKind.TS:
            return ".ts";
        case api.ScriptKind.TSX:
            return ".tsx";
        case api.ScriptKind.JS:
            return ".js";
        case api.ScriptKind.JSX:
            return ".jsx";
        case api.ScriptKind.JSON:
            return ".json";
        case api.ScriptKind.External:
        case api.ScriptKind.Unknown:
            return "";
    }
}
