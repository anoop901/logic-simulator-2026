import type { LogicComponent } from "../types/LogicComponent";
import AdderRenderer from "./AdderRenderer";
import ConstantRenderer from "./ConstantRenderer";
import DecoderRenderer from "./DecoderRenderer";
import GateRenderer from "./GateRenderer";
import LEDRenderer from "./LEDRenderer";
import MemoryRenderer from "./MemoryRenderer";
import MuxRenderer from "./MuxRenderer";
import NotRenderer from "./NotRenderer";
import RegisterRenderer from "./RegisterRenderer";
import SwitchRenderer from "./SwitchRenderer";
import InputRenderer from "./InputRenderer";
import visitComponent from "./visitComponent";
import OutputRenderer from "./OutputRenderer";
import SplitterMergerRenderer from "./SplitterMergerRenderer";

interface RenderComponentOptions {
  onSwitchToggle?: () => void;
  onInputValueChange?: (newValue: bigint) => void;
  ledInputValue?: bigint;
  outputInputValue?: bigint;
}

// Render a component based on its kind
export default function renderComponent(
  component: LogicComponent,
  options?: RenderComponentOptions,
) {
  const { id, position } = component;

  return visitComponent(component, {
    visitGate: (gateOptions) => (
      <GateRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={gateOptions}
      />
    ),
    visitNot: (notOptions) => (
      <NotRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={notOptions}
      />
    ),
    visitMux: (muxOptions) => (
      <MuxRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={muxOptions}
      />
    ),
    visitDecoder: (decoderOptions) => (
      <DecoderRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={decoderOptions}
      />
    ),
    visitAdder: (adderOptions) => (
      <AdderRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={adderOptions}
      />
    ),
    visitRegister: (registerOptions) => (
      <RegisterRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={registerOptions}
      />
    ),
    visitMemory: (memoryOptions) => (
      <MemoryRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={memoryOptions}
      />
    ),
    visitConstant: (constantOptions) => (
      <ConstantRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={constantOptions}
      />
    ),
    visitSwitch: (switchOptions) => (
      <SwitchRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={switchOptions}
        onToggle={options?.onSwitchToggle}
      />
    ),
    visitLED: (ledOptions) => (
      <LEDRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={ledOptions}
        inputValue={options?.ledInputValue}
      />
    ),
    visitInput: (inputOptions) => (
      <InputRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={inputOptions}
        onValueChange={options?.onInputValueChange ?? (() => {})}
      />
    ),
    visitOutput: (outputOptions) => (
      <OutputRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={outputOptions}
        inputValue={options?.outputInputValue}
      />
    ),
    visitSplitterMerger: (splitterMergerOptions) => (
      <SplitterMergerRenderer
        key={id}
        x={position.x}
        y={position.y}
        options={splitterMergerOptions}
      />
    ),
  });
}
