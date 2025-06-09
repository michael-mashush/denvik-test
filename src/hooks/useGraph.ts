import {useAppDispatch} from "./useAppDispatch";
import {useAppSelector} from "./useAppSelector";

import {
    setNodes as setNodesAction,
    setEdges as setEdgesAction,
} from "@/store/slices/graphSlice.ts";

import {
    type NodeType,
    type EdgeType
} from "@/schemas";

import {
    useCallback
} from "react";

export const useGraph = () => {

    const dispatch = useAppDispatch();

    const nodes = useAppSelector((state) => state.graph.nodes);
    const edges = useAppSelector((state) => state.graph.edges);

    // оборачиваем функцию в useCallback, поскольку они могут использоваться
    // где угодно в коде и мы не хотим каждый раз задумываться об оптимизации
    const setNodes = useCallback((newNodes: NodeType[]) => {
        dispatch(setNodesAction(newNodes));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // оборачиваем функцию в useCallback, поскольку они могут использоваться
    // где угодно в коде и мы не хотим каждый раз задумываться об оптимизации
    const setEdges = useCallback((newEdges: EdgeType[]) => {
        dispatch(setEdgesAction(newEdges));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        nodes,
        edges,
        setNodes,
        setEdges,
    };
    
}