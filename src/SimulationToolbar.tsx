import { Button, Card } from "@heroui/react";
import type { SimulationMode } from "./hooks/useSimulationMode";

export default function SimulationToolbar({
  isRunning,
  onClockStep,
  run,
  pause,
}: SimulationMode) {
  return (
    <div className="absolute w-full flex justify-center m-4 pointer-events-none">
      <Card className="flex flex-row justify-start pointer-events-auto">
        <Button
          variant="secondary"
          isDisabled={isRunning}
          onClick={onClockStep}
        >
          ⏭ Step Clock
        </Button>

        {isRunning ? (
          <Button variant="secondary" onClick={pause}>
            ⏸ Pause Clock
          </Button>
        ) : (
          <Button variant="primary" onClick={run}>
            ▶ Run Clock
          </Button>
        )}
      </Card>
    </div>
  );
}
