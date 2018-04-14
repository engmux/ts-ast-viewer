﻿import {connect, Dispatch} from 'react-redux';
import {Node} from "./compiler";
import App from "./App";
import * as actions from "./actions";
import {StoreState, OptionsState} from "./types";
import {debounce} from "./utils";

export function mapStateToProps(state: StoreState) {
    return {
        ...state
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.AllActions>) {
    const debouncedSourceFileRefresh = debounce(() => dispatch(actions.refreshSourceFile()), 150);
    return {
        onCodeChange: (code: string) => {
            dispatch(actions.setCode(code))
            debouncedSourceFileRefresh();
        },
        onPosChange: (pos: number) => dispatch(actions.setPos(pos)),
        onNodeChange: (node: Node) => dispatch(actions.setSelectedNode(node)),
        onOptionsChange: (options: OptionsState) => dispatch(actions.setOptions(options))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
