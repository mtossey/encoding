import crypto from "crypto";

type User = {
  id: string;
  publicKey: string;
  privateKey: string;
};

type Message = {
  sender: string;
  receiver: string;
  metadata: {
    originalHash: string;
    signature: string;
  };
  body: string;
};

type ResponseMessage = {
  sender: string;
  receiver: string;
  metadata: {
    originalSignature: string;
    originalHash: string;
    responseHash: string;
    encryptedResponseHash: string;
  };
  body: string;
};

// Function to hash a message body
function hashMessage(message: string): string {
  return crypto.createHash("sha256").update(message).digest("hex");
}

// Function to sign a message hash
function signHash(hash: string, privateKey: string): string {
  const signer = crypto.createSign("sha256");
  signer.update(hash);
  return signer.sign(privateKey, "base64");
}

// Function to verify a signed hash
function verifySignature(hash: string, signature: string, publicKey: string): boolean {
  const verifier = crypto.createVerify("sha256");
  verifier.update(hash);
  return verifier.verify(publicKey, signature, "base64");
}

// Function to respond to a signed message
function respondToSignedMessage(message: Message, responder: User): ResponseMessage {
  const { sender, metadata } = message;
  const { signature, originalHash } = metadata;

  // Verify the original message's signature
  const isValidSignature = verifySignature(originalHash, signature, responder.publicKey);
  if (!isValidSignature) {
    throw new Error("Invalid message signature.");
  }

  // Create a response body
  const responseBody = `Message received and validated by ${responder.id}.`;

  // Hash the response body
  const responseHash = hashMessage(responseBody);

  // Sign the response hash
  const encryptedResponseHash = signHash(responseHash, responder.privateKey);

  // Construct the response message
  return {
    sender: responder.id,
    receiver: sender,
    metadata: {
      originalSignature: signature,
      originalHash,
      responseHash,
      encryptedResponseHash,
    },
    body: responseBody,
  };
}

// Example usage
const alice: User = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const bob: User = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });

const originalMessage: Message = {
  sender: alice.id,
  receiver: bob.id,
  metadata: {
    originalHash: hashMessage("Hello Bob!"),
    signature: signHash(hashMessage("Hello Bob!"), alice.privateKey),
  },
  body: "Hello Bob!",
};

const response = respondToSignedMessage(originalMessage, bob);
console.log(response);
