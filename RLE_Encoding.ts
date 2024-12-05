// Run-Length Encoding (RLE) Compression Function
function runLengthEncode(input: string): string {
  let encoded = "";
  let count = 1;

  for (let i = 1; i <= input.length; i++) {
    if (input[i] === input[i - 1]) {
      count++;
    } else {
      encoded += input[i - 1] + count;
      count = 1;
    }
  }

  return encoded;
}

// Graph Node (Person) Structure
type Person = {
  id: string;            // Unique identifier
  connections: string[]; // List of connected node IDs
};

// Graph Representation (Adjacency List)
const graph: Record<string, Person> = {
  "Alice": { id: "Alice", connections: ["Bob", "Charlie"] },
  "Bob": { id: "Bob", connections: ["Alice"] },
  "Charlie": { id: "Charlie", connections: ["Alice"] },
};

// Message Structure
type Message = {
  sender: string;        // Node ID of the sender
  receiver: string;      // Node ID of the receiver
  metadata: string;      // Description of the message (e.g., "RLE_ENCODED")
  messageBody: string;   // Actual message content (compressed)
};

// Function to Send a Compressed Message
function sendCompressedMessage(graph: Record<string, Person>, sender: string, receiver: string, message: string): Message {
  if (!graph[sender]) {
    throw new Error(`Sender '${sender}' does not exist in the graph.`);
  }
  if (!graph[receiver]) {
    throw new Error(`Receiver '${receiver}' does not exist in the graph.`);
  }

  const compressedMessage = runLengthEncode(message);
  return {
    sender,
    receiver,
    metadata: "RLE_ENCODED",
    messageBody: compressedMessage,
  };
}

// Example Usage
try {
  const message = sendCompressedMessage(graph, "Alice", "Bob", "aaaabbbcccd");
  console.log("Compressed Message:", message);
  // Expected Output:
  // {
  //   sender: "Alice",
  //   receiver: "Bob",
  //   metadata: "RLE_ENCODED",
  //   messageBody: "a4b3c3d1"
  // }
} catch (error) {
  console.error("Error:", error.message);
}

// Test Cases for Run-Length Encoding
console.log(runLengthEncode("aaaabbcc")); // Expected: "a4b2c2"
console.log(runLengthEncode("abcdef"));   // Expected: "a1b1c1d1e1f1"
console.log(runLengthEncode(""));         // Expected: ""
