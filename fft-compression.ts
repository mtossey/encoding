import { fft, ifft } from 'fft-js';

export function lossyCompress(message: string, compressionRatio: number): string {
  if (compressionRatio <= 0 || compressionRatio > 1) {
    throw new Error("Compression ratio must be between 0 and 1 (exclusive).");
  }

  // Convert message into an array of numeric values
  const messageArray = Array.from(message).map(char => char.charCodeAt(0));

  // Perform FFT
  const transformed = fft(messageArray);

  // Apply compression by zeroing out less significant frequencies
  const cutoff = Math.floor(transformed.length * compressionRatio);
  for (let i = cutoff; i < transformed.length; i++) {
    transformed[i] = [0, 0]; // Zero out
  }

  // inverse FFT to reconstruct
  const compressedArray = ifft(transformed).map(value => Math.round(value[0]));

  // Convert back to a string (characters may be "blurry")
  return String.fromCharCode(...compressedArray);
}

// Send a lossy compressed message
export function sendLossyCompressedMessage(
  sender: string,
  receiver: string,
  message: string,
  compressionRatio: number
): {
  sender: string;
  receiver: string;
  metadata: { originalLength: number; compressionRatio: number };
  compressedMessage: string;
} {
  // Perform lossy compression
  const compressedMessage = lossyCompress(message, compressionRatio);

  // Construct the message with metadata
  return {
    sender,
    receiver,
    metadata: {
      originalLength: message.length,
      compressionRatio,
    },
    compressedMessage,
  };
}