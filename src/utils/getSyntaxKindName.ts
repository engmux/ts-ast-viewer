import {CompilerApi, SyntaxKind} from "../compiler";

export function getSyntaxKindName(api: CompilerApi, kind: SyntaxKind) {
    return getKindCacheForApi(api)[kind];
}

const kindCache: { [packageName: string]: { [kind: number]: string; } } = {};

function getKindCacheForApi(api: CompilerApi) {
    if (kindCache[api.tsAstViewerPackageName] == null)
        kindCache[api.tsAstViewerPackageName] = getKindNamesForApi(api);
    return kindCache[api.tsAstViewerPackageName];
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
