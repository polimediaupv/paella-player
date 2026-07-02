# StreamProvider Web Audio API Reference

The `StreamProvider` class exposes a low-level audio processing pipeline built on the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). This allows plugins to tap into the video's audio stream, apply custom processing, or capture audio data in real time.

---

## Table of Contents

- [Overview](#overview)
- [AudioContext Access](#audiocontext-access)
- [Audio Source and Destination Nodes](#audio-source-and-destination-nodes)
- [Audio Processor Plugin Chain](#audio-processor-plugin-chain)
- [Building a Custom Audio Graph](#building-a-custom-audio-graph)
- [AudioWorklet: Real-Time Audio Processing](#audioworklet-real-time-audio-processing)
- [Complete Example: Audio Capture with Resampling](#complete-example-audio-capture-with-resampling)
- [Best Practices](#best-practices)

---

## Overview

`StreamProvider` manages the lifecycle of the player's audio pipeline. When a video is loaded, it creates:

1. An `AudioContext` (lazily created on first access)
2. A `MediaElementAudioSourceNode` from the video element
3. An `AudioDestinationNode` (the default speakers output)

Plugins can intercept the audio signal between the source and destination to apply effects, capture data, or route audio through custom processing graphs.

```
[Video Element]
      |
      v
[MediaElementAudioSourceNode]  ←  StreamProvider.audioSourceNode
      |
      v
[Audio Processor Plugins]      ←  Chained via AudioProcessorPlugin.getConnections()
      |
      v
[AudioDestinationNode]         ←  StreamProvider.audioDestinationNode
      |
      v
[Speakers]
```

---

## AudioContext Access

### `streamProvider.audioContext` → `AudioContext`

Lazily creates and returns the shared `AudioContext` instance. The sample rate can be configured via `player.config.audioProcessing?.sampleRate`.

```typescript
const audioContext = player.videoContainer.streamProvider.audioContext;
console.log(audioContext.sampleRate); // e.g. 48000
```

The context is created on first access and reused for the lifetime of the `StreamProvider`.

---

## Audio Source and Destination Nodes

### `streamProvider.audioSourceNode` → `MediaElementAudioSourceNode`

Returns the `MediaElementAudioSourceNode` created from the main audio player's `<video>` or `<audio>` element. Throws if the video is not yet loaded.

```typescript
const sourceNode = player.videoContainer.streamProvider.audioSourceNode;
```

### `streamProvider.audioDestinationNode` → `AudioDestinationNode`

Returns `audioContext.destination` (the default audio output, typically speakers).

```typescript
const destinationNode = player.videoContainer.streamProvider.audioDestinationNode;
```

---

## Audio Processor Plugin Chain

`StreamProvider.reloadAudioProcessors()` loads all registered `audioProcessor` plugins and chains them in series:

```
[source] → [Plugin 1] → [Plugin 2] → ... → [destination]
```

Each plugin returns `{ input, output, enabled }` from `getConnections()`. The framework connects the previous plugin's output to the next plugin's input. If `enabled` is `false`, the plugin is skipped.

The chain uses per-edge disconnect tracking (`from.disconnect(to)`) so that external consumers sharing the same source node are not affected when the chain is rebuilt.

See [Audio Processor Plugins](./audio_processor_plugins.md) for the full plugin API.

---

## Building a Custom Audio Graph

To tap into the audio stream without creating a formal plugin, connect directly to the source node. The graph supports multiple consumers.

### Minimal Example: Audio Level Monitor

```typescript
const streamProvider = player.videoContainer.streamProvider;
const audioContext = streamProvider.audioContext;
const sourceNode = streamProvider.audioSourceNode;

// Create an analyser to read audio levels
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

// Tap the source (does NOT disconnect existing consumers)
sourceNode.connect(analyser);

// Read levels on each animation frame
const dataArray = new Uint8Array(analyser.frequencyBinCount);

function readLevel() {
  analyser.getByteFrequencyData(dataArray);
  const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
  console.log(`Audio level: ${avg}`);
  requestAnimationFrame(readLevel);
}
readLevel();
```

### Routing Through a Custom Chain

```typescript
const streamProvider = player.videoContainer.streamProvider;
const audioContext = streamProvider.audioContext;
const sourceNode = streamProvider.audioSourceNode;
const destinationNode = streamProvider.audioDestinationNode;

// Build: source → compressor → gain → destination
const compressor = audioContext.createDynamicsCompressor();
const gain = audioContext.createGain();
gain.gain.value = 1.5;

sourceNode.connect(compressor);
compressor.connect(gain);
gain.connect(destinationNode);
```

> **Note:** If you connect directly to `destinationNode`, bypassing the plugin chain, your processing will run in parallel with the existing chain. To insert your processing *into* the chain, use an `AudioProcessorPlugin` instead.

---

## AudioWorklet: Real-Time Audio Processing

For CPU-intensive or sample-level processing, use an [`AudioWorkletProcessor`](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor). Worklets run on a dedicated audio rendering thread and receive raw PCM buffers in `process()`.

### Step 1: Define the Worklet Processor

The processor is written as a string (or separate file) and registered with `registerProcessor()`.

```javascript
class MyProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    // `input[c][i]` = sample `i` of channel `c`
    const channels = input.length;
    const frames = input[0].length;

    // Example: pass-through mono mix
    const output = outputs[0];
    for (let i = 0; i < frames; i++) {
      let sum = 0;
      for (let c = 0; c < channels; c++) {
        sum += input[c][i];
      }
      output[0][i] = sum / channels;
    }

    return true; // keep alive
  }
}

registerProcessor("my-processor", MyProcessor);
```

### Step 2: Load the Worklet Module

Create a `Blob` URL from the source string and register it:

```typescript
const workletSource = `...`; // your processor code
const blob = new Blob([workletSource], { type: "application/javascript" });
const url = URL.createObjectURL(blob);
await audioContext.audioWorklet.addModule(url);
URL.revokeObjectURL(url);
```

### Step 3: Create and Wire the AudioWorkletNode

```typescript
const workletNode = new AudioWorkletNode(audioContext, "my-processor");

sourceNode.connect(workletNode);
workletNode.connect(destinationNode);
```

### Step 4: Receive Data from the Worklet

Use `MessagePort` to send data from the worklet to the main thread:

```javascript
// Inside the worklet process():
this.port.postMessage(audioBuffer); // Float32Array
```

```typescript
// Main thread:
workletNode.port.onmessage = (event: MessageEvent<Float32Array>) => {
  const samples = new Float32Array(event.data);
  console.log(`Received ${samples.length} samples`);
};
```

### Step 5: Cleanup

```typescript
workletNode.port.onmessage = null;
workletNode.disconnect();
```

---

## Complete Example: Audio Capture with Resampling

This example is based on the `VoxtralRealTimeCaptions` plugin (`repos/paella-ai-plugins/src/plugins/RealTimeCaptions/VoxtralRealTimeCaptions.ts`). It demonstrates:

- Tapping the video's audio via `StreamProvider` nodes
- Down-mixing stereo to mono in an `AudioWorkletProcessor`
- Anti-alias filtering with cascaded biquad sections
- Resampling from the context rate (e.g. 48 kHz) to a target rate (16 kHz)
- Sending processed audio chunks to the main thread via `MessagePort`
- Silencing the worklet output with a zero-gain node to avoid double playback

### The Audio Graph

```
[SourceNode] → [AudioWorkletNode] → [SilentGainNode (gain=0)] → [DestinationNode]
                       |
                       | (port.postMessage)
                       v
               [Main Thread: append audio chunks]
```

The `SilentGainNode` prevents the resampled audio from playing through the speakers. The original audio still plays through the normal plugin chain.

### Worklet Source (Anti-Alias + Resample)

```typescript
const TARGET_RATE = 16000;

// Design an 8th-order Butterworth low-pass for anti-aliasing
function designLowpass(order: number, cutoff: number, fs: number) {
  const sections = [];
  const w0 = (2 * Math.PI * cutoff) / fs;
  const cw = Math.cos(w0);
  const sw = Math.sin(w0);

  for (let k = 0; k < order / 2; k++) {
    const q = 1 / (2 * Math.cos((Math.PI * (2 * k + 1)) / (2 * order)));
    const alpha = sw / (2 * q);
    const a0 = 1 + alpha;
    sections.push({
      b0: ((1 - cw) / 2) / a0,
      b1: (1 - cw) / a0,
      b2: ((1 - cw) / 2) / a0,
      a1: (-2 * cw) / a0,
      a2: (1 - alpha) / a0,
      z1: 0,
      z2: 0,
    });
  }
  return sections;
}

class ResampleCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._ratio = sampleRate / TARGET_RATE;
    this._needsResample = this._ratio > 1.0001;
    this._sections = this._needsResample
      ? designLowpass(8, Math.min(7600, TARGET_RATE * 0.475), sampleRate)
      : [];
    this._pos = 0;
    this._prev = 0;
  }

  // Apply cascaded biquad IIR filter
  _filter(value: number): number {
    let x = value;
    for (const s of this._sections) {
      const y = s.b0 * x + s.z1;
      s.z1 = s.b1 * x - s.a1 * y + s.z2;
      s.z2 = s.b2 * x - s.a2 * y;
      x = y;
    }
    return x;
  }

  process(inputs: Float32Array[][]) {
    const input = inputs[0];
    if (!input || input.length === 0 || input[0].length === 0) {
      return true;
    }

    const channels = input.length;
    const frames = input[0].length;

    // Down-mix to mono + anti-alias filter
    const mono = new Float32Array(frames);
    for (let i = 0; i < frames; i++) {
      let sum = 0;
      for (let c = 0; c < channels; c++) {
        sum += input[c][i];
      }
      mono[i] = this._filter(sum / channels);
    }

    if (!this._needsResample) {
      this.port.postMessage(mono);
      return true;
    }

    // Linear-interpolation resampling
    const ratio = this._ratio;
    const last = frames - 1;
    const out = new Float32Array(Math.ceil(frames / ratio) + 2);
    let pos = this._pos;
    let count = 0;

    while (pos < last) {
      const i = Math.floor(pos);
      const frac = pos - i;
      const s0 = i < 0 ? this._prev : mono[i];
      const s1 = mono[i + 1];
      out[count++] = s0 + (s1 - s0) * frac;
      pos += ratio;
    }

    this._pos = pos - frames;
    this._prev = mono[last];

    if (count > 0) {
      this.port.postMessage(out.slice(0, count));
    }
    return true;
  }
}

registerProcessor("my-resample-capture", ResampleCaptureProcessor);
```

### Wiring It Up

```typescript
const streamProvider = player.videoContainer.streamProvider;
const audioContext = streamProvider.audioContext;
const sourceNode = streamProvider.audioSourceNode;
const destinationNode = streamProvider.audioDestinationNode;

await audioContext.resume();

// Load the worklet
const blob = new Blob([WORKLET_SOURCE], { type: "application/javascript" });
const url = URL.createObjectURL(blob);
await audioContext.audioWorklet.addModule(url);
URL.revokeObjectURL(url);

// Create nodes
const workletNode = new AudioWorkletNode(audioContext, "my-resample-capture");
const silentGain = audioContext.createGain();
silentGain.gain.value = 0;

// Wire: source → worklet → silentGain → destination
sourceNode.connect(workletNode);
workletNode.connect(silentGain);
silentGain.connect(destinationNode);

// Receive captured audio
const audioChunks: Float32Array[] = [];
workletNode.port.onmessage = (event: MessageEvent<Float32Array>) => {
  audioChunks.push(new Float32Array(event.data));
};

// Cleanup when done
function cleanup() {
  workletNode.disconnect();
  silentGain.disconnect();
  workletNode.port.onmessage = null;
}
```

### Buffering and Trimming Audio

For long-running capture, maintain a ring buffer to avoid unbounded memory growth:

```typescript
const MAX_BUFFER_SECONDS = 30;
const TARGET_SAMPLE_RATE = 16000;
let audioChunks: Float32Array[] = [];
let audioLength = 0;

function appendAudio(samples: Float32Array) {
  audioChunks.push(samples);
  audioLength += samples.length;
}

function trimAudioBefore(sampleIndex: number) {
  if (sampleIndex <= 0 || audioChunks.length === 0) return;

  let remaining = Math.min(sampleIndex, audioLength);
  const retained: Float32Array[] = [];

  for (const chunk of audioChunks) {
    if (remaining >= chunk.length) {
      remaining -= chunk.length;
      audioLength -= chunk.length;
      continue;
    }
    if (remaining > 0) {
      retained.push(chunk.slice(remaining));
      audioLength -= remaining;
      remaining = 0;
    } else {
      retained.push(chunk);
    }
  }
  audioChunks = retained;
}

function getAudioRange(start: number, end: number): Float32Array {
  const clampedStart = Math.max(0, start);
  const clampedEnd = Math.min(audioLength, end);
  const length = Math.max(0, clampedEnd - clampedStart);
  const result = new Float32Array(length);

  let chunkStart = 0;
  let resultOffset = 0;
  for (const chunk of audioChunks) {
    const chunkEnd = chunkStart + chunk.length;
    if (chunkEnd <= clampedStart) {
      chunkStart = chunkEnd;
      continue;
    }
    if (chunkStart >= clampedEnd) break;

    const copyStart = Math.max(clampedStart, chunkStart) - chunkStart;
    const copyEnd = Math.min(clampedEnd, chunkEnd) - chunkStart;
    result.set(chunk.subarray(copyStart, copyEnd), resultOffset);
    resultOffset += copyEnd - copyStart;
    chunkStart = chunkEnd;
  }
  return result;
}

// Periodically trim old audio to stay within buffer limit
const maxKeep = MAX_BUFFER_SECONDS * TARGET_SAMPLE_RATE;
if (audioLength > maxKeep) {
  trimAudioBefore(audioLength - maxKeep);
}
```

---

## Best Practices

1. **Always call `audioContext.resume()`** before creating nodes or starting playback. Browsers require a user gesture to start audio contexts.

2. **Use per-edge disconnect** (`from.disconnect(to)`) rather than `node.disconnect()` when sharing nodes with the plugin chain. The parameterless form disconnects *all* outgoing edges, which will break other consumers.

3. **Silence worklet output with a gain node** if you are capturing audio for analysis but don't want it to play twice. Connect the worklet to a `GainNode` with `gain.value = 0`, then connect that to the destination.

4. **Resample in the worklet, not in the main thread.** The worklet runs on the audio thread and can process samples without blocking the UI. Use linear interpolation or polyphase filters for downsampling.

5. **Buffer management** is essential for long-running capture. Use a sliding window approach: trim consumed audio periodically to limit memory usage.

6. **Reconnect on `startTranscribing()`** rather than keeping connections alive permanently. This avoids stale graph state and ensures clean startup/shutdown cycles.

7. **The `AudioContext` sample rate** may vary across devices (44.1 kHz, 48 kHz, etc.). If your processing expects a fixed rate, resample in the worklet or configure `player.config.audioProcessing.sampleRate`.
