// Wire represents a connection between two component terminals
export interface WireEndpoint {
  componentId: string;
  terminalName: string;
}

export interface Wire {
  id: string;
  from: WireEndpoint; // Must be an output terminal
  to: WireEndpoint; // Must be an input terminal
}
