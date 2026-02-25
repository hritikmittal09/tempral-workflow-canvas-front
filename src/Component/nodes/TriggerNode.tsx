import { Handle, Position } from 'reactflow';

const TriggerNode = () => {
  return (
    <div className="card bg-primary text-primary-content w-48 shadow-lg">
      <div className="card-body p-4">
        <h2 className="card-title text-sm">Trigger</h2>
        <p className="text-xs opacity-80">
          Starts the workflow
        </p>

        <Handle
          type="source"
          position={Position.Right}
          className="bg-white! w-3 h-3"
        />
      </div>
    </div>
  );
};

export default TriggerNode;