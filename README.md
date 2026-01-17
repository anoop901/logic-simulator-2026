# Logic Simulator

An interactive digital logic circuit simulator. Design and visualize digital circuits with an intuitive drag-and-drop interface.

## Usage

1. **Add Components**: Drag components from the left sidebar onto the canvas.
2. **Connect Wires**: Click on a component's output terminal and drag to another component's input terminal to connect them.
3. **Configure**: Adjust properties in the right panel for the selected component.
4. **Simulate**: Simulate the circuit to see it working.
5. **Save/Load**: Save your circuits to files and load them later.

## Features

### Available Components

- **Logic Gates**: AND, OR, NOT, NAND, NOR, XOR, XNOR
- **Constants**: Fixed value sources with configurable bit width and display format
- **Multiplexers**: Route signals based on selector inputs
- **Decoders**: Convert binary inputs to one-hot outputs
- **Adders**: Arithmetic addition with carry
- **Registers**: Store values on clock edge
- **Memory**: RAM and ROM with built-in data editor
- **Bit Splitter/Merger**: Split multi-bit signals or combine single bits
- **IO Devices**: Input switches, output LEDs, and displays

All components can be configured to work with single-bit or multi-bit values.

### Simulation

Once you build a circuit, simulate it. While simulating:
- Inspect the values output by each component.
- Interact with I/O devices.
- Step the clock signal supplied to the sequential elements (registers, memory). Or, set it to run automatically.

## Development instructions

### Prerequisites

- **Node.js**
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/anoop901/logic-simulator.git
cd logic-simulator

# Install dependencies
npm install
```

### Start development server

```bash
npm run dev
```

The app will be available at the URL in the command output.
