import { Button, Card, Separator } from "@heroui/react";
import type { LogicComponent, ComponentOptions } from "./types/LogicComponent";
import { TrashBin } from "@gravity-ui/icons";

import GateEditor from "./editors/GateEditor";
import NotEditor from "./editors/NotEditor";
import MuxEditor from "./editors/MuxEditor";
import DecoderEditor from "./editors/DecoderEditor";
import AdderEditor from "./editors/AdderEditor";
import RegisterEditor from "./editors/RegisterEditor";
import MemoryEditor from "./editors/MemoryEditor";
import ConstantEditor from "./editors/ConstantEditor";
import visitComponent from "./components/visitComponent";

interface PropertiesPanelProps {
  selectedComponent: LogicComponent;
  onUpdateOptions: (options: ComponentOptions) => void;
  onDeleteComponent: () => void;
}

export default function PropertiesPanel({
  selectedComponent,
  onUpdateOptions,
  onDeleteComponent,
}: PropertiesPanelProps) {
  const { kind } = selectedComponent;

  const renderEditor = () =>
    visitComponent(selectedComponent, {
      visitGate: (options) => (
        <GateEditor options={options} onUpdate={onUpdateOptions} />
      ),
      visitNot: (options) => (
        <NotEditor options={options} onUpdate={onUpdateOptions} />
      ),
      visitMux: (options) => (
        <MuxEditor options={options} onUpdate={onUpdateOptions} />
      ),
      visitDecoder: (options) => (
        <DecoderEditor options={options} onUpdate={onUpdateOptions} />
      ),
      visitAdder: (options) => (
        <AdderEditor options={options} onUpdate={onUpdateOptions} />
      ),
      visitRegister: (options) => (
        <RegisterEditor options={options} onUpdate={onUpdateOptions} />
      ),
      visitMemory: (options) => (
        <MemoryEditor options={options} onUpdate={onUpdateOptions} />
      ),
      visitConstant: (options) => (
        <ConstantEditor options={options} onUpdate={onUpdateOptions} />
      ),
      visitSwitch: (options) => <></>,
    });

  return (
    <Card className="absolute right-4 bottom-4 w-64">
      <Card.Header>
        <Card.Title className="text-sm font-bold uppercase tracking-wider">
          {kind}
        </Card.Title>
        <Card.Description />
      </Card.Header>
      <Separator />
      <Card.Content className="flex flex-col gap-4">
        {renderEditor()}
        <Button variant="danger" onClick={onDeleteComponent}>
          <TrashBin />
          Delete
        </Button>
      </Card.Content>
      <Card.Footer />
    </Card>
  );
}
