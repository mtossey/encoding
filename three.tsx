// npm install node-forge@latest
import * as forge from 'node-forge';

// Graph structure (Person class)
class Person {
    name: string;
    publicKey: forge.pki.PublicKey;
    privateKey: forge.pki.PrivateKey;
    friends: Set<Person>;

    constructor(name: string) {
        this.name = name;
        // Generate RSA keys
        const keys = forge.pki.rsa.generateKeyPair(512);  // 512 bits for simplicity
        this.publicKey = keys.publicKey as forge.pki.PublicKey;
        this.privateKey = keys.privateKey as forge.pki.PrivateKey;
        this.friends = new Set();  // Using a Set to store friends (edges in the graph)
    }

    addFriend(friend: Person): void {
        this.friends.add(friend);
    }

    // Encrypt the message using the receiver's public key
    encryptMessage(receiver: Person, messageBody: string): string {
        const encryptedMessage = (receiver.publicKey as forge.pki.PublicKey).encrypt(messageBody, 'RSA-OAEP');
        return forge.util.encode64(encryptedMessage); // Base64 encode to represent binary data as string
    }

    // Decrypt the message using the person's private key
    decryptMessage(encryptedMessage: string): string {
        try {
            const decodedMessage = forge.util.decode64(encryptedMessage);
            const decryptedMessage = (this.privateKey as forge.pki.PrivateKey).decrypt(decodedMessage, 'RSA-OAEP');
            return decryptedMessage;
        } catch (error) {
            console.error('Failed to decrypt message:', error);
            return '';
        }
    }
}

// Hash table (Map) to store people by their names
const people: Map<string, Person> = new Map();

// Create people and add them to the hash table
const alice = new Person("Alice");
const bob = new Person("Bob");
const charlie = new Person("Charlie");
const dave = new Person("Dave");

people.set(alice.name, alice);
people.set(bob.name, bob);
people.set(charlie.name, charlie);
people.set(dave.name, dave);

// Adding friends (edges in the graph)
alice.addFriend(bob);
bob.addFriend(alice);
bob.addFriend(charlie);
charlie.addFriend(bob);
dave.addFriend(charlie);

// Function to simulate message passing through the graph
function sendMessage(senderName: string, receiverName: string, messageBody: string): string {
    const sender = people.get(senderName);
    const receiver = people.get(receiverName);

    if (!sender || !receiver) {
        return "Sender or Receiver not found in the network.";
    }

    // Step 1: Encrypt the message using the receiver's public key
    const encryptedMessage = sender.encryptMessage(receiver, messageBody);

    // Step 2: Forward the message through the graph (BFS to find the shortest path)
    const path = findPath(sender, receiver);
    if (path) {
        // Decrypt the message at the receiver
        const decryptedMessage = receiver.decryptMessage(encryptedMessage);
        return `Decrypted message: ${decryptedMessage}, Path: ${path.map(p => p.name).join(' -> ')}`;
    } else {
        return "Receiver not found in the network.";
    }
}

// Helper function to find a path from sender to receiver using BFS
function findPath(sender: Person, receiver: Person): Person[] | null {
    const visited: Set<Person> = new Set();
    const queue: Array<{ person: Person, path: Person[] }> = [{ person: sender, path: [sender] }];

    while (queue.length > 0) {
        const { person, path } = queue.shift()!;
        if (person === receiver) {
            return path;
        }

        visited.add(person);

        for (const friend of person.friends) {
            if (!visited.has(friend)) {
                queue.push({ person: friend, path: [...path, friend] });
            }
        }
    }
    return null;
}

// Test sending a message
const message = "Hello, this is a secret message!";
const result = sendMessage("Alice", "Dave", message);

console.log(result);
