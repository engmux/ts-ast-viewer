/* barrel:ignore */
import {CompilerApi, Program, TypeChecker, SourceFile, Node, ScriptTarget, ScriptKind} from "../compiler";

export interface StoreState {
    code: string;
    options: OptionsState;
    compiler: CompilerState | undefined;
}

export interface CompilerState {
    api: CompilerApi;
    program: Program;
    typeChecker: TypeChecker;
    sourceFile: SourceFile;
    selectedNode: Node;
}

export interface OptionsState {
    treeMode: TreeMode;
    scriptTarget: ScriptTarget;
    scriptKind: ScriptKind;
}

export enum TreeMode {
    getChildren,
    forEachChild
}
