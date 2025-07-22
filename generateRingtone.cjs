// Node.js version: Generates a bell-like ringtone and saves as ringtone.wav in the same folder.
const fs = require('fs');

function generateRingtone() {
  const duration = 1.5; // seconds
  const sampleRate = 44100;
  const frameCount = sampleRate * duration;
  const data = new Float32Array(frameCount);

  // Bell-like sound: sine wave + exponential decay
  for (let i = 0; i < frameCount; i++) {
    const t = i / sampleRate;
    data[i] = Math.sin(2 * Math.PI * 880 * t) * Math.exp(-3 * t);
  }

  function encodeWAV(samples, sampleRate) {
    const numChannels = 1;
    const format = 1; // PCM
    const bitDepth = 16;
    const buffer = Buffer.alloc(44 + samples.length * 2);

    function writeString(buf, offset, string) {
      buf.write(string, offset);
    }

    writeString(buffer, 0, 'RIFF');
    buffer.writeUInt32LE(36 + samples.length * 2, 4);
    writeString(buffer, 8, 'WAVE');
    writeString(buffer, 12, 'fmt ');
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(format, 20);
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * numChannels * bitDepth / 8, 28);
    buffer.writeUInt16LE(numChannels * bitDepth / 8, 32);
    buffer.writeUInt16LE(bitDepth, 34);
    writeString(buffer, 36, 'data');
    buffer.writeUInt32LE(samples.length * 2, 40);

    // PCM samples
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, samples[i]));
      buffer.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7FFF, offset);
    }
    return buffer;
  }

  const wavBuffer = encodeWAV(data, sampleRate);
  fs.writeFileSync('ringtone.wav', wavBuffer);
  console.log('Ringtone saved as ringtone.wav');
}

generateRingtone();
