import {
    useCallback
} from 'react'

import {
    ReactFlowProvider,
    ReactFlow,
    Background,
    Panel,
    BackgroundVariant,
    type NodeChange,
    type EdgeChange,
    type Connection,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type NodeTypes
} from "@xyflow/react";

import '@xyflow/react/dist/style.css';

import FPSCounter from "@/components/FPSCounter.tsx";
import Node from "@/components/Node.tsx";

import {
    useGraph
} from "@/hooks";

import {
    type NodeType,
    type EdgeType, type NodeData
} from "@/schemas";

import {
    createRandomDictionary
} from "@/utils";

const appStyles: React.CSSProperties = {
    height: '100vh',
    width: '100vw'
};

const nodeTypes: NodeTypes = {
    custom: Node
}

function App() {

    const {
        nodes,
        edges,
        setNodes,
        setEdges
    } = useGraph();

    const onConnect = useCallback((connection: Connection) => {
        const sourceNode = nodes.find(node => node.id === connection.source);
        const targetNode = nodes.find(node => node.id === connection.target);
        const newEdges = addEdge<EdgeType>(connection, edges);

        if (!sourceNode || !targetNode) {
            console.error("Source or target node not found for connection:", connection);
            return;
        }

        const sourceNodeData = sourceNode.data as NodeData;
        const targetNodeData = targetNode.data as NodeData;

        const newNode: NodeType = {
            id: connection.target,
            position: targetNode.position,
            type: "custom",
            data: {
                displayName: targetNodeData.displayName,
                values: {
                    ...sourceNodeData.values,
                    ...targetNodeData.values
                }
            }
        }

        setNodes(nodes.map(node => node.id === newNode.id ? newNode : node));
        setEdges(newEdges);
    }, [ edges, nodes ]); // НЕ передаем функции, только данные

    const onNodesChangeInternal = useCallback((changes: NodeChange<NodeType>[]) => {
        const changedNodes = applyNodeChanges(changes, nodes);
        setNodes(changedNodes);
    }, [ nodes ]); // НЕ передаем функции, только данные

    const onEdgesChangeInternal = useCallback((changes: EdgeChange<EdgeType>[]) => {
        const changedEdges = applyEdgeChanges(changes, edges);
        setEdges(changedEdges);
    }, [ edges ]); // НЕ передаем функции, только данные

    const addNode = useCallback(() => {
        const newNode: NodeType = {
            id: (nodes.length + 1).toString(),
            position: {x: Math.random() * 400, y: Math.random() * 400},
            type: "custom",
            data: {
                displayName: `Node ${nodes.length + 1}`,
                values: createRandomDictionary(2)
            }
        };
        setNodes([...nodes, newNode]);
    }, [ nodes ]); // НЕ передаем функции, только данные

    return (
        <div style={appStyles}>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChangeInternal}
                    onEdgesChange={onEdgesChangeInternal}
                    onConnect={onConnect} 
                    nodeTypes={nodeTypes} // передаем стабильный объект
                    deleteKeyCode="Delete"
                >
                    <Panel>
                        <FPSCounter/>
                        <button onClick={addNode}>Add Node</button>
                    </Panel>
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    )
}

export default App;
