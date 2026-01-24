import { Button, Card } from "@heroui/react";
import type {
  SimulationModeState,
  SimulationModeActions,
} from "./hooks/useSimulationMode";

interface SimulationToolbarProps
  extends SimulationModeState, SimulationModeActions {}

export default function SimulationToolbar({
  isSimulating,
  isRunning,
  startSimulation,
  stopSimulation,
  clockStep,
  run,
  pause,
}: SimulationToolbarProps) {
  return (
    <div className="absolute w-full flex justify-center m-4 pointer-events-none">
      <Card className="flex flex-row justify-start pointer-events-auto">
        {!isSimulating ? (
          <Button variant="primary" onClick={startSimulation}>
            ▶ Start Simulation
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              isDisabled={isRunning}
              onClick={clockStep}
            >
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
          </>
        )}
      </Card>
    </div>
  );
}
