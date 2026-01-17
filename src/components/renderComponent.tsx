import type {
  AdderComponentOptions,
  ConstantComponentOptions,
  DecoderComponentOptions,
  GateComponentOptions,
  LogicComponent,
  MemoryComponentOptions,
  MuxComponentOptions,
  NotComponentOptions,
  RegisterComponentOptions,
} from "../types/LogicComponent";
import AdderRenderer from "./AdderRenderer";
import ConstantRenderer from "./ConstantRenderer";
import DecoderRenderer from "./DecoderRenderer";
import GateRenderer from "./GateRenderer";
import MemoryRenderer from "./MemoryRenderer";
import MuxRenderer from "./MuxRenderer";
import NotRenderer from "./NotRenderer";
import RegisterRenderer from "./RegisterRenderer";

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
    case "constant":
      return (
        <ConstantRenderer
          key={id}
          x={position.x}
          y={position.y}
          options={options as ConstantComponentOptions}
        />
      );
    default:
      return null;
  }
}
