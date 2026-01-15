import Canvas from "./Canvas";
import ComponentMenu from "./ComponentMenu";

function App() {
  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      <ComponentMenu />
      <Canvas />
    </div>
  );
}

export default App;
