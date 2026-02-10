import { useState, useCallback } from "react";
import { Modal, Button, useOverlayState } from "@heroui/react";
import type {
  MemoryComponentOptions,
  DisplayFormat,
} from "../types/LogicComponent";
import { SelectField } from "./controls";

interface RomDataEditorProps {
  options: MemoryComponentOptions;
  onUpdate: (options: MemoryComponentOptions) => void;
  state: ReturnType<typeof useOverlayState>;
}

const FORMAT_OPTIONS = [
  { value: "hex", label: "Hex" },
  { value: "dec", label: "Decimal" },
  { value: "bin", label: "Binary" },
];

function formatValue(
  value: number,
  format: DisplayFormat,
  bits: number,
): string {
  switch (format) {
    case "hex":
      return value
        .toString(16)
        .toUpperCase()
        .padStart(Math.ceil(bits / 4), "0");
    case "bin":
      return value.toString(2).padStart(bits, "0");
    case "dec":
    default:
      return value.toString(10);
  }
}

function parseValue(text: string, format: DisplayFormat): number | null {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  let parsed: number;
  switch (format) {
    case "hex":
      parsed = parseInt(trimmed, 16);
      break;
    case "bin":
      parsed = parseInt(trimmed, 2);
      break;
    case "dec":
    default:
      parsed = parseInt(trimmed, 10);
      break;
  }
  return isNaN(parsed) ? null : parsed;
}

export default function RomDataEditor({
  options,
  onUpdate,
  state,
}: RomDataEditorProps) {
  const [format, setFormat] = useState<DisplayFormat>("hex");
  const addressCount = Math.pow(2, options.addressSize);
  const wordBits = options.wordSize * 8;
  const maxValue = Math.pow(2, wordBits) - 1;

  // Get the current value at an address from initialData
  const getValue = useCallback(
    (addr: number): number => {
      return options.initialData?.[addr] ?? 0;
    },
    [options.initialData],
  );

  // Update a single address value
  const setValue = useCallback(
    (addr: number, value: number) => {
      const data = [
        ...(options.initialData ?? new Array(addressCount).fill(0)),
      ];
      // Ensure array is large enough
      while (data.length <= addr) {
        data.push(0);
      }
      data[addr] = Math.max(0, Math.min(value, maxValue));
      onUpdate({ ...options, initialData: data });
    },
    [options, onUpdate, addressCount, maxValue],
  );

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container size="lg" scroll="inside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>ROM Data Editor</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-3">
                <SelectField
                  label="Display Format"
                  value={format}
                  options={FORMAT_OPTIONS}
                  onChange={(v) => setFormat(v as DisplayFormat)}
                />
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-muted">
                      <th className="text-left p-1 w-24">Address</th>
                      <th className="text-left p-1">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: addressCount }, (_, addr) => (
                      <tr key={addr} className="border-b border-default">
                        <td className="p-1 font-mono">
                          {formatValue(addr, "hex", options.addressSize)}
                        </td>
                        <td className="p-1">
                          <input
                            className="w-full bg-default rounded px-2 py-1 font-mono text-sm outline-none focus:ring-1 focus:ring-accent"
                            value={formatValue(
                              getValue(addr),
                              format,
                              wordBits,
                            )}
                            onChange={(e) => {
                              const parsed = parseValue(e.target.value, format);
                              if (parsed !== null) {
                                setValue(addr, parsed);
                              }
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close">Close</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
