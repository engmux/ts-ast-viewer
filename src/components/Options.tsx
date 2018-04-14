import React from "react";
import {CompilerApi, ScriptKind, ScriptTarget} from "../compiler";
import {OptionsState, TreeMode} from "../types";

export interface OptionsProps {
    api: CompilerApi | undefined;
    options: OptionsState;
    onChange: (options: OptionsState) => void;
}

export class Options extends React.Component<OptionsProps, { showOptionsMenu: boolean; }> {
    constructor(props: OptionsProps) {
        super(props);

        this.state = { showOptionsMenu: false };
    }

    render() {
        return (
            <div className="options">
                <div className="optionsButton" onClick={() => this.setState({ showOptionsMenu: !this.state.showOptionsMenu })}>
                    Options
                </div>
                <div className="menuLine" hidden={!this.state.showOptionsMenu}></div>
                <div className="menu" hidden={!this.state.showOptionsMenu}>
                    {this.getTreeMode()}
                    {this.getScriptKind()}
                    {this.getScriptTarget()}
                </div>
            </div>
        );
    }

    private getTreeMode() {
        const selection = (
            <select value={this.props.options.treeMode} onChange={(event) =>
                this.props.onChange({ ...this.props.options, treeMode: parseInt(event.target.value, 10) as TreeMode })}>
                <option value={TreeMode.getChildren}>node.getChildren()</option>
                <option value={TreeMode.forEachChild}>ts.forEachKind(node, child => ...)</option>
            </select>
        );
        return (<Option name="Tree mode" value={selection} />)
    }

    private getScriptKind() {
        const { api } = this.props;
        if (api == null)
            return undefined;
        return this.getEnumOption("Script kind", "ts.ScriptKind", api.ScriptKind, this.props.options.scriptKind,
            value => this.props.onChange({ ...this.props.options, scriptKind: value as ScriptKind }));
    }

    private getScriptTarget() {
        const { api } = this.props;
        if (api == null)
            return undefined;
        return this.getEnumOption("Script target", "ts.ScriptTarget", api.ScriptTarget, this.props.options.scriptTarget,
            value => this.props.onChange({ ...this.props.options, scriptTarget: value as ScriptTarget }));
    }

    private getEnumOption(name: string, prefix: string, e: any, currentValue: number, onChange: (value: number) => void) {
        const selection = (
            <select value={currentValue} onChange={(event) => onChange(parseInt(event.target.value, 10))}>
                {Object.keys(e)
                    .filter(key => !isNaN(parseInt(key, 10)))
                    .map(kind => getOption(parseInt(kind, 10)))}
            </select>
        );
        return (<Option name={name} value={selection} />)

        function getOption(value: any) {
            return (<option value={value} key={value}>{prefix}.{e[value]}</option>);
        }
    }
}

class Option extends React.Component<{ name: string; value: JSX.Element; }> {
    render() {
        return (
            <div className="option">
                <div className="optionName">{this.props.name}:</div>
                <div className="optionValue">
                    {this.props.value}
                </div>
            </div>
        );
    }
}
