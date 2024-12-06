// Helper functions for modular arithmetic
function modExp(base: number, exp: number, mod: number): number {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) result = (result * base) % mod;
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  }
  
  // Simplistic hash function (for demonstration purposes)
  function simpleHash(message: string): number {
    return message.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }
  
  // RSA keys (hardcoded for simplicity)
  const p = 61, q = 53;
  const n = p * q; // Modulus
  const phi = (p - 1) * (q - 1);
  const e = 17; 
  let d = 0;
  
  // Find modular inverse of e mod phi
  for (let k = 1; (e * k) % phi !== 1; k++) d = k;
  
  // RSA keys
  const publicKey = [n, e];
  const privateKey = [n, d];
  
  // Message type
  type Message = {
    body: string;
    hash: number;
    signature: number;
  };
  
  // Function to sign a message
  function signMessage(message: string): Message {
    const hash = simpleHash(message);
    const signature = modExp(hash, privateKey[1], privateKey[0]); // Sign with private key
    return { body: message, hash, signature };
  }
  
  // Function to verify a message
  function verifyMessage(message: Message): boolean {
    const recoveredHash = modExp(message.signature, publicKey[1], publicKey[0]); // Decrypt with public key
    return recoveredHash === message.hash; // Check if hashes match
  }
  
  // Example Usage
  const messageBody = "Hello, Bob!";
  const signedMessage = signMessage(messageBody);
  
  console.log("Signed Message:", signedMessage);
  
  const isVerified = verifyMessage(signedMessage);
  console.log("Is the message verified?", isVerified);
  