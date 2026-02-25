import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TriggerNode from './nodes/TriggerNode';
import ApiActionNode from './nodes/ApiActionNode';

const nodeTypes = {
  trigger: TriggerNode,
  apiAction: ApiActionNode,
};

let id = 0;
const getId = () => `node_${id++}`;

const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // connect nodes
  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge(params, eds)),
    []
  );

  // allow drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // handle drop from sidebar
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - 280, // adjust for sidebar width
        y: event.clientY - 40,
      };

      const newNode = {
        id: getId(),
        type,
        position,
        data: {},
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return (
    <div className="flex-1 h-screen bg-base-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Background gap={16} className="opacity-30" />
        <Controls className="bg-base-200 rounded-box shadow" />
        <MiniMap
          className="bg-base-200 rounded-box shadow"
          nodeColor={(node) => {
            if (node.type === 'trigger') return '#3b82f6'; // blue
            if (node.type === 'apiAction') return '#22c55e'; // green
            return '#999';
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;