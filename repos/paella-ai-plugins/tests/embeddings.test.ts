import assert from "node:assert/strict";
import { HuggingFaceTransformersEmbeddings } from "../src/ai/HuggingFaceTransformersEmbeddings.ts";

const embeddings = new HuggingFaceTransformersEmbeddings({ model: "test-model" });
const calls: { texts: string[]; options: unknown }[] = [];
const pipe = async (texts: string[], options: unknown) => {
    calls.push({ texts, options });
    return { tolist: () => texts.map(text => [text.length, 1]) };
};
// Inject a pipeline so tests exercise the LangChain contract without model downloads.
(embeddings as unknown as { pipelinePromise: Promise<typeof pipe> }).pipelinePromise = Promise.resolve(pipe);

assert.equal(embeddings.model, "test-model");
assert.deepEqual(await embeddings.embedDocuments([]), []);
assert.equal(calls.length, 0);
const texts = Array.from({ length: 513 }, (_, i) => `line\n${i}`);
const vectors = await embeddings.embedDocuments(texts);
assert.equal(vectors.length, 513);
assert.deepEqual(calls.map(call => call.texts.length), [512, 1]);
assert.equal(calls[0].texts[0], "line 0");
assert.deepEqual(vectors[512], [8, 1]);
assert.deepEqual(calls[0].options, { pooling: "mean", normalize: true });
assert.deepEqual(await embeddings.embedQuery("hello\nworld"), [11, 1]);
assert.deepEqual(calls[2].texts, ["hello world"]);

const failing = new HuggingFaceTransformersEmbeddings();
(failing as unknown as { pipelinePromise: Promise<unknown> }).pipelinePromise = Promise.reject(new Error("model load failed"));
await assert.rejects(failing.embedQuery("query"), /model load failed/);
console.log("PASS embeddings: batching, ordering, normalization, queries and errors");
