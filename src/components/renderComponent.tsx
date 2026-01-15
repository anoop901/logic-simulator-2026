import type {
  AdderComponentOptions,
  DecoderComponentOptions,
  GateComponentOptions,
  LogicComponent,
  MemoryComponentOptions,
  MuxComponentOptions,
  NotComponentOptions,
  RegisterComponentOptions,
} from "../types/LogicComponent";
import { AdderRenderer } from "./Adder";
import { DecoderRenderer } from "./Decoder";
import { GateRenderer } from "./Gate";
import { MemoryRenderer } from "./Memory";
import { MuxRenderer } from "./Mux";
import { NotRenderer } from "./Not";
import { RegisterRenderer } from "./Register";

// Render a component based on its kind
export default function renderComponent(component: LogicComponent) {
  const { id, kind, position, options } = component;

  switch (kind) {
    case "gate":
      return (
        <GateRenderer
          key={id}
          x={position.x}
          y={position.y}
          options={options as GateComponentOptions}
        />
      );
    case "not":
      return (
        <NotRenderer
          key={id}
          x={position.x}
          y={position.y}
          options={options as NotComponentOptions}
        />
      );
    case "mux":
      return (
        <MuxRenderer
          key={id}
          x={position.x}
          y={position.y}
          options={options as MuxComponentOptions}
        />
      );
    case "decoder":
      return (
        <DecoderRenderer
          key={id}
          x={position.x}
          y={position.y}
          options={options as DecoderComponentOptions}
        />
      );
    case "adder":
      return (
        <AdderRenderer
          key={id}
          x={position.x}
          y={position.y}
          options={options as AdderComponentOptions}
        />
      );
    case "register":
      return (
        <RegisterRenderer
          key={id}
          x={position.x}
          y={position.y}
          options={options as RegisterComponentOptions}
        />
      );
    case "memory":
      return (
        <MemoryRenderer
          key={id}
          x={position.x}
          y={position.y}
          options={options as MemoryComponentOptions}
        />
      );
    default:
      return null;
  }
}
