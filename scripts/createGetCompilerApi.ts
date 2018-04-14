import * as fs from "fs";
import * as path from "path";

const fileData = JSON.parse(fs.readFileSync("./package.json"));
const dependencies = fileData["dependencies"];

// get versions
const keyRegEx = /^typescript(-[0-9]+\.[0-9]+\.[0-9]+)?$/;
const versionRegEx = /[0-9]+\.[0-9]+\.[0-9]+/;
const versions: { version: string; name: string; }[] = [];
for (const key of Object.keys(dependencies)) {
    if (!keyRegEx.test(key))
        continue;
    const matches = versionRegEx.exec(dependencies[key]);
    versions.push({ version: matches[0], name: key });
}

// create file text
let text = "/* Automatically maintained from package.json. Do not edit! */\n";
text += `import {CompilerApi} from "./CompilerApi";\n\n`;
text += "export type compilerVersions =";
for (let i = 0; i < versions.length; i++) {
    const version = versions[i];
    if (i > 0)
        text += " |";
    text += ` "${version.version}"`;
}
text += ";\n\n";

text += `const compilerTypes: { [name: string]: CompilerApi; } = {};\n
export async function getCompilerApi(version: compilerVersions) {
    if (compilerTypes[version] == null)
        await fillCompilerVersion(version);
    return compilerTypes[version];
}

async function fillCompilerVersion(version: compilerVersions) {
    switch (version) {
`;
for (let i = 0; i < versions.length; i++) {
    const version = versions[i];
    text += `        case "${version.version}":\n`;
    text += `            compilerTypes[version] = await import("${version.name}") as any;\n`;
    text += `            break;\n`;
}
text += `        default:\n`;
text += `            const assertNever: never = version;\n`
text += `            throw new Error("Not implemented version: " + version);\n`;
text += `    }\n`;
text += `    compilerTypes[version].tsAstViewerCompilerVersion = version;\n`;
text += `}\n`;

// output
fs.writeFileSync("./src/compiler/getCompilerApi.ts", text.replace(/\r?\n/g, "\n"));
