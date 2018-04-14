import {CompilerApi, SyntaxKind} from "../compiler";

export function getSyntaxKindName(api: CompilerApi, kind: SyntaxKind) {
    return getKindCacheForApi(api)[kind];
}

const kindCache: { [version: string]: { [kind: number]: string; } } = {};

function getKindCacheForApi(api: CompilerApi) {
    if (kindCache[api.tsAstViewerCompilerVersion] == null)
        kindCache[api.tsAstViewerCompilerVersion] = getKindNamesForApi(api);
    return kindCache[api.tsAstViewerCompilerVersion];
}

function getKindNamesForApi(api: CompilerApi) {
    // some SyntaxKinds are repeated, so only use the first one
    const kindNames: { [kind: number]: string; } = {};
    for (const name of Object.keys(api.SyntaxKind).filter(k => isNaN(parseInt(k, 10)))) {
        const value = (api.SyntaxKind as any)[name] as number;
        if (kindNames[value] == null)
            kindNames[value] = name;
    }
    return kindNames;
}
