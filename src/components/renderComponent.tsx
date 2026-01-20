import type { LogicComponent } from "../types/LogicComponent";
import AdderRenderer from "./AdderRenderer";
import ConstantRenderer from "./ConstantRenderer";
import DecoderRenderer from "./DecoderRenderer";
import GateRenderer from "./GateRenderer";
import MemoryRenderer from "./MemoryRenderer";
import MuxRenderer from "./MuxRenderer";
import NotRenderer from "./NotRenderer";
import RegisterRenderer from "./RegisterRenderer";
import visitComponent from "./visitComponent";

// Render a component based on its kind
export default function renderComponent(component: LogicComponent) {
  const { id, position } = component;

  return visitComponent(component, {
    visitGate: (options) => (
      <GateRenderer key={id} x={position.x} y={position.y} options={options} />
    ),
    visitNot: (options) => (
      <NotRenderer key={id} x={position.x} y={position.y} options={options} />
    ),
    visitMux: (options) => (
      <MuxRenderer key={id} x={position.x} y={position.y} options={options} />
    ),
    visitDecoder: (options) => (
      <DecoderRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={options}
      />
    ),
    visitAdder: (options) => (
      <AdderRenderer key={id} x={position.x} y={position.y} options={options} />
    ),
    visitRegister: (options) => (
      <RegisterRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={options}
      />
    ),
    visitMemory: (options) => (
      <MemoryRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={options}
      />
    ),
    visitConstant: (options) => (
      <ConstantRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={options}
      />
    ),
  });
}
