import FlowCanvas from './Component/FlowCanvas';
import Sidebar from './Component/Sidebar';

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <FlowCanvas />
    </div>
  );
}

export default App;