/* barrel:ignore */
import ts from "typescript";
import {AllActions} from "../actions";
import {StoreState, OptionsState} from "../types";
import {createSourceFile} from "../compiler";
import {SET_SELECTED_NODE, SET_CODE, SET_POS, SET_OPTIONS, REFRESH_SOURCEFILE} from "./../constants";

export function appReducer(state: StoreState, action: AllActions): StoreState {
    switch (action.type) {
        case SET_SELECTED_NODE: {
            if (state.compiler == null)
                return state;

            return {
                ...state,
                compiler: {
                    ...state.compiler,
                    selectedNode: action.node
                }
            };
        }
        case REFRESH_SOURCEFILE: {
            const newState = {...state};
            fillNewSourceFileState(newState, state.code, state.options);
            return newState;
        }
        case SET_CODE: {
            return { ...state, code: action.code };
        }
        case SET_POS: {
            if (state.compiler == null)
                return state;

            const pos = action.pos;
            const sourceFile = state.compiler.sourceFile;
            let selectedNode: ts.Node = sourceFile;
            while (true) {
                // todo: should use correct function here (ex. ts.forEachChild based on the options)
                const children = selectedNode.getChildren(sourceFile);
                let found = false;
                for (const child of children) {
                    if (child.getStart(sourceFile) <= pos && child.end > pos) {
                        selectedNode = child;
                        found = true;
                        break;
                    }
                }

                if (!found)
                    break;
            }

            //const node = state.sourceFile.
            return {
                ...state,
                compiler: {
                    ...state.compiler,
                    selectedNode
                }
            };
        }
        case SET_OPTIONS: {
            const newState = {...state, options: action.options};
            const fileNeedsChanging = action.options.scriptKind !== state.options.scriptKind
                || action.options.scriptTarget !== state.options.scriptTarget;

            if (fileNeedsChanging && newState.compiler != null)
                fillNewSourceFileState(newState, newState.compiler.sourceFile.getFullText(), action.options);

            return newState;
        }
    }
    return state;
}

function fillNewSourceFileState(state: StoreState, code: string, options: OptionsState) {
    const api = ts as any;
    const {sourceFile, program, typeChecker} = createSourceFile(code, options.scriptTarget, options.scriptKind, api);
    state.compiler = {
        api,
        sourceFile,
        program,
        typeChecker,
        selectedNode: sourceFile
    };
}
