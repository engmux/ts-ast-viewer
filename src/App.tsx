import React from "react";
import SplitPane from "react-split-pane";
import * as components from "./components";
import {Node, compilerPackageNames} from "./compiler";
import {StoreState, OptionsState} from "./types";
import "./App.css";

export interface Props extends StoreState {
    onCodeChange: (compilerPackageName: compilerPackageNames, code: string) => void;
    onPosChange: (pos: number) => void;
    onNodeChange: (node: Node) => void;
    onOptionsChange: (compilerPackageName: compilerPackageNames, options: Partial<OptionsState>) => void;
}

export default function App(props: Props) {
    const compiler = props.compiler;

    return (
        <div className="App">
            <SplitPane split="horizontal" defaultSize={50} allowResize={false}>
                <div className="App-header clearfix">
                    <h2 id="title">TypeScript AST Viewer</h2>
                    <components.Options
                        api={compiler == null ? undefined : compiler.api}
                        options={props.options}
                        onChange={options => props.onOptionsChange(options.compilerPackageName || props.options.compilerPackageName, options)}/>
                </div>
                <SplitPane split="vertical" minSize={50} defaultSize="33%">
                    <components.CodeEditor
                        onChange={code => props.onCodeChange(props.options.compilerPackageName, code)}
                        onClick={pos => props.onPosChange(pos)}
                        text={props.code} />
                    {getCompilerDependentPanes()}
                </SplitPane>
            </SplitPane>
        </div>
    );

    function getCompilerDependentPanes() {
        if (compiler == null)
            return <div>Loading...</div>;

        return <SplitPane split="vertical" minSize={50} defaultSize="50%">
            <components.TreeViewer
                api={compiler.api}
                selectedNode={compiler.selectedNode}
                sourceFile={compiler.sourceFile}
                onSelectNode={node => props.onNodeChange(node)}
                mode={props.options.treeMode} />
            <components.PropertiesViewer
                api={compiler.api}
                selectedNode={compiler.selectedNode}
                sourceFile={compiler.sourceFile}
                typeChecker={compiler.typeChecker} />
        </SplitPane>;
    }
}
