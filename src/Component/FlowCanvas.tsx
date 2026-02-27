import { useCallback, useEffect, useState } from 'react';
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

import TriggerNode from '../Component/nodes/TriggerNode';
import ApiActionNode from '../Component/nodes/ApiActionNode';
import {
  startWorkflow,
  getWorkflowStatus,
} from '../service/workflowService';

const nodeTypes = {
  trigger: TriggerNode,
  apiAction: ApiActionNode,
};

let id = 0;
const getId = () => `node_${id++}`;

const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [status, setStatus] = useState<
    'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  >('IDLE');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔗 CONNECT NODES
  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge(params, eds)),
    []
  );

  // 📥 DRAG OVER
  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  // 📦 DROP NODE
  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    setNodes((nds) =>
      nds.concat({
        id: getId(),
        type,
        position: {
          x: event.clientX - 280,
          y: event.clientY - 40,
        },
        data: {},
      })
    );
  };

  // ▶️ RUN WORKFLOW
  const handleRun = async () => {
    setLoading(true);
    setStatus('RUNNING');
    setResult(null);

    try {
      const data = await startWorkflow();
      setWorkflowId(data.workflowId);
    } catch (error) {
      setStatus('FAILED');
      setLoading(false);
    }
  };

  // 🔄 RESET WORKFLOW & CANVAS
  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    setWorkflowId(null);
    setStatus('IDLE');
    setResult(null);
    setLoading(false);
  };

  // 🔁 POLL WORKFLOW STATUS
  useEffect(() => {
    if (!workflowId) return;

    const interval = setInterval(async () => {
      try {
        const data = await getWorkflowStatus(workflowId);

        setStatus(data.status);

        if (data.status === 'COMPLETED') {
          setResult(data.result);
          setLoading(false);
          clearInterval(interval);
        }

        if (data.status === 'FAILED') {
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        setStatus('FAILED');
        setLoading(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [workflowId]);

  return (
    <div className="flex-1 h-screen bg-base-100 relative">
      {/* RUN BAR */}
      <div className="absolute top-4 right-4 z-10 flex gap-3 items-center">
        <button
          className="btn btn-primary"
          onClick={handleRun}
          disabled={loading}
        >
          {loading ? 'Running...' : 'Run'}
        </button>

        <button
          className="btn btn-outline btn-error"
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </button>

        <span
          className={`badge ${
            status === 'RUNNING'
              ? 'badge-info'
              : status === 'COMPLETED'
              ? 'badge-success'
              : status === 'FAILED'
              ? 'badge-error'
              : 'badge-ghost'
          }`}
        >
          {status}
        </span>
      </div>

      {/* WORKFLOW RESULT */}
      {result && (
        <div className="absolute bottom-4 right-4 w-96 z-10">
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title text-sm">
                Workflow Result
              </h2>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

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
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;