import { Button, Card, Separator } from "@heroui/react";
import type {
  LogicComponent,
  ComponentOptions,
  GateComponentOptions,
  NotComponentOptions,
  MuxComponentOptions,
  DecoderComponentOptions,
  AdderComponentOptions,
  RegisterComponentOptions,
  MemoryComponentOptions,
} from "./types/LogicComponent";
import { TrashBin } from "@gravity-ui/icons";

import GateEditor from "./editors/GateEditor";
import NotEditor from "./editors/NotEditor";
import MuxEditor from "./editors/MuxEditor";
import DecoderEditor from "./editors/DecoderEditor";
import AdderEditor from "./editors/AdderEditor";
import RegisterEditor from "./editors/RegisterEditor";
import MemoryEditor from "./editors/MemoryEditor";

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
  const { kind, options } = selectedComponent;

  const renderEditor = () => {
    switch (kind) {
      case "gate":
        return (
          <GateEditor
            options={options as GateComponentOptions}
            onUpdate={onUpdateOptions}
          />
        );
      case "not":
        return (
          <NotEditor
            options={options as NotComponentOptions}
            onUpdate={onUpdateOptions}
          />
        );
      case "mux":
        return (
          <MuxEditor
            options={options as MuxComponentOptions}
            onUpdate={onUpdateOptions}
          />
        );
      case "decoder":
        return (
          <DecoderEditor
            options={options as DecoderComponentOptions}
            onUpdate={onUpdateOptions}
          />
        );
      case "adder":
        return (
          <AdderEditor
            options={options as AdderComponentOptions}
            onUpdate={onUpdateOptions}
          />
        );
      case "register":
        return (
          <RegisterEditor
            options={options as RegisterComponentOptions}
            onUpdate={onUpdateOptions}
          />
        );
      case "memory":
        return (
          <MemoryEditor
            options={options as MemoryComponentOptions}
            onUpdate={onUpdateOptions}
          />
        );
      default:
        return null;
    }
  };

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
