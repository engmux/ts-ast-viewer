/* Automatically maintained from package.json. Do not edit! */
import {CompilerApi} from "./CompilerApi";

export type compilerVersions = "2.8.1" | "2.6.2" | "2.7.2";

const compilerTypes: { [name: string]: CompilerApi; } = {};

export async function getCompilerApi(version: compilerVersions) {
    if (compilerTypes[version] == null)
        await fillCompilerVersion(version);
    return compilerTypes[version];
}

async function fillCompilerVersion(version: compilerVersions) {
    switch (version) {
        case "2.8.1":
            compilerTypes[version] = await import("typescript") as any;
            break;
        case "2.6.2":
            compilerTypes[version] = await import("typescript-2.6.2") as any;
            break;
        case "2.7.2":
            compilerTypes[version] = await import("typescript-2.7.2") as any;
            break;
        default:
            const assertNever: never = version;
            throw new Error("Not implemented version: " + version);
    }
    compilerTypes[version].tsAstViewerCompilerVersion = version;
}
