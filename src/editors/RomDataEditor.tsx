import { useState, useCallback } from "react";
import { Modal, Button, useOverlayState } from "@heroui/react";
import type {
  MemoryComponentOptions,
  DisplayFormat,
} from "../types/LogicComponent";
import { SelectField } from "./controls";
import {
  DISPLAY_FORMAT_OPTIONS,
  formatValue,
  parseValue,
} from "../utils/displayFormat";

interface RomDataEditorProps {
  options: MemoryComponentOptions;
  onUpdate: (options: MemoryComponentOptions) => void;
  state: ReturnType<typeof useOverlayState>;
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
                  options={DISPLAY_FORMAT_OPTIONS}
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
                          {formatValue(
                            BigInt(addr),
                            options.addressSize,
                            "hex",
                          )}
                        </td>
                        <td className="p-1">
                          <input
                            className="w-full bg-default rounded px-2 py-1 font-mono text-sm outline-none focus:ring-1 focus:ring-accent"
                            value={formatValue(
                              BigInt(getValue(addr)),
                              wordBits,
                              format,
                            )}
                            onChange={(e) => {
                              const parsed = parseValue(
                                e.target.value,
                                format,
                                wordBits,
                              );
                              if (parsed !== null) {
                                setValue(addr, Number(parsed));
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
