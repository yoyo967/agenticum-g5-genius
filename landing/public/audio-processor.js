class AudioPCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._bufferSize = 512; // 32ms @ 16kHz — low latency for Gemini VAD
    this._buffer = new Int16Array(this._bufferSize);
    this._bufferOffset = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const inputChannel = input[0]; // Mono
      
      for (let i = 0; i < inputChannel.length; i++) {
        // Convert Float32 (-1.0 to 1.0) to Int16 (-32768 to 32767)
        let sample = Math.max(-1, Math.min(1, inputChannel[i]));
        this._buffer[this._bufferOffset++] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;

        if (this._bufferOffset >= this._bufferSize) {
          this.port.postMessage(this._buffer);
          this._buffer = new Int16Array(this._bufferSize);
          this._bufferOffset = 0;
        }
      }
    }
    return true;
  }
}

registerProcessor('audio-pcm-processor', AudioPCMProcessor);
