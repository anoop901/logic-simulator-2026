import type { DisplayFormat } from "../types/LogicComponent";

function numberOptionsToNumCharacters(
  bitWidth: number,
  displayFormat: DisplayFormat,
) {
  switch (displayFormat) {
    case "bin":
      return bitWidth;
    case "dec":
      return Math.ceil(bitWidth * Math.log10(2));
    case "hex":
      return Math.ceil(bitWidth / 4) + 2;
  }
}

function numCharactersToWidth(numCharacters: number) {
  // linearly maps the interval [a1, a2] onto [b1, b2]
  const [a1, a2] = [1, 64];
  const [b1, b2] = [30, 480];
  const t = (numCharacters - a1) / (a2 - a1);
  return t * (b2 - b1) + b1;
}

export default function numberOptionsToComponentWidth(
  bitWidth: number,
  displayFormat: DisplayFormat,
) {
  return numCharactersToWidth(
    numberOptionsToNumCharacters(bitWidth, displayFormat),
  );
}
