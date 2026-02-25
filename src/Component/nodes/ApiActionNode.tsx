import { Handle, Position } from 'reactflow';

const ApiActionNode = () => {
  return (
    <div className="card bg-success text-success-content w-52 shadow-lg">
      <div className="card-body p-4">
        <h2 className="card-title text-sm">API Action</h2>
        <p className="text-xs opacity-80">
          Call an external API
        </p>

        <Handle
          type="target"
          position={Position.Left}
          className="bg-white! w-3 h-3"
        />
      </div>
    </div>
  );
};

export default ApiActionNode;