import type { LogicComponent } from "../types/LogicComponent";
import visitComponent from "./visitComponent";
import { getGateGeometry } from "./gate";
import { getNotGeometry } from "./not";
import { getMuxGeometry } from "./mux";
import { getDecoderGeometry } from "./decoder";
import { getAdderGeometry } from "./adder";
import { getRegisterGeometry } from "./register";
import { getMemoryGeometry } from "./memory";
import { getConstantGeometry } from "./constant";
import { getSwitchGeometry } from "./switch";

/**
 * Standard component geometry interface.
 * All component geometry functions return objects conforming to this interface.
 */
export interface ComponentGeometry {
  leftX: number;
  rightX: number;
  topY: number;
  bottomY: number;
  width: number;
  height: number;
}

/**
 * Get the geometry for any component type.
 * Returns the standard bounding box fields (leftX, rightX, topY, bottomY, width, height).
 */
export default function getComponentGeometry(
  component: LogicComponent,
): ComponentGeometry {
  return visitComponent(component, {
    visitGate(options) {
      return getGateGeometry(options.type, options.numberOfInputs);
    },
    visitNot() {
      return getNotGeometry();
    },
    visitMux(options) {
      return getMuxGeometry(options.selectBits);
    },
    visitDecoder(options) {
      return getDecoderGeometry(options.inputBits);
    },
    visitAdder() {
      return getAdderGeometry();
    },
    visitRegister(options) {
      return getRegisterGeometry(options.bitWidth);
    },
    visitMemory() {
      return getMemoryGeometry();
    },
    visitConstant(options) {
      return getConstantGeometry(options.bitWidth, options.displayFormat);
    },
    visitSwitch() {
      return getSwitchGeometry();
    },
  });
}
