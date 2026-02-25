const Sidebar = () => {
  const onDragStart = (
    event: React.DragEvent,
    nodeType: string
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-base-200 p-4 border-r border-base-300">
      <h2 className="text-lg font-semibold mb-4">
        Workflow Nodes
      </h2>

      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'trigger')}
        className="card bg-primary text-primary-content shadow cursor-grab mb-3"
      >
        <div className="card-body p-3">
          <h3 className="font-medium text-sm">Trigger</h3>
          <p className="text-xs opacity-80">
            Starts the workflow
          </p>
        </div>
      </div>

      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'apiAction')}
        className="card bg-success text-success-content shadow cursor-grab"
      >
        <div className="card-body p-3">
          <h3 className="font-medium text-sm">API Action</h3>
          <p className="text-xs opacity-80">
            Calls an external API
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;