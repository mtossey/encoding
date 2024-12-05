import * as forge from 'node-forge';

// Generate RSA keys
const keys = forge.pki.rsa.generateKeyPair(512);  // 512 bits for simplicity
const publicKey = keys.publicKey;
const privateKey = keys.privateKey;

// Message to encrypt
const message = 'Hello, world!';

// Encrypt the message using the public key
const encryptedMessage = publicKey.encrypt(message, 'RSA-OAEP');
const encodedMessage = forge.util.encode64(encryptedMessage);
console.log('Encrypted Message:', encodedMessage);

// Decrypt the message using the private key
const decodedMessage = forge.util.decode64(encodedMessage);
const decryptedMessage = privateKey.decrypt(decodedMessage, 'RSA-OAEP');
console.log('Decrypted Message:', decryptedMessage);