import { Button, Card } from "@heroui/react";
import type {
  SimulationModeState,
  SimulationModeActions,
} from "./hooks/useSimulationMode";

interface SimulationToolbarProps
  extends SimulationModeState,
    SimulationModeActions {}

export default function SimulationToolbar({
  isSimulating,
  isRunning,
  startSimulation,
  stopSimulation,
  clockStep,
  run,
  pause,
}: SimulationToolbarProps) {
  const buttonStyle = {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold" as const,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const primaryButton = {
    ...buttonStyle,
    backgroundColor: "#00FFAA",
    color: "#000",
  };

  const secondaryButton = {
    ...buttonStyle,
    backgroundColor: "#444",
    color: "#fff",
  };

  const dangerButton = {
    ...buttonStyle,
    backgroundColor: "#ff4444",
    color: "#fff",
  };

  if (!isSimulating) {
    return (
      <div className="flex justify-center m-4">
        <Card className="flex flex-row justify-center">
          <Button variant="primary" onClick={startSimulation}>
            ▶ Start Simulation
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center m-4">
      <Card className="flex flex-row justify-center">
        {/* style={{
      //   position: "absolute",
      //   top: "16px",
      //   left: "50%",
      //   transform: "translateX(-50%)",
      //   zIndex: 100,
      //   display: "flex",
      //   gap: "8px",
      //   backgroundColor: "rgba(0, 0, 0, 0.8)",
      //   padding: "8px 16px",
      //   borderRadius: "8px",
      //   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      // }*/}
        <Button variant="secondary" onClick={clockStep}>
          ⏭ Step
        </Button>

        {isRunning ? (
          <Button variant="secondary" onClick={pause}>
            ⏸ Pause
          </Button>
        ) : (
          <Button variant="primary" onClick={run}>
            ▶ Run
          </Button>
        )}

        <Button variant="danger" onClick={stopSimulation}>
          ⏹ Stop
        </Button>
      </Card>
    </div>
  );
}
