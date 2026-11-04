/**
 * Harness acotado para el adaptador local ChatWebLLM (paso 04 del plan de
 * actualización). No usa framework: assertions de node:assert sobre Node 24
 * (ejecución directa de TS). El motor WebLLM se simula asignándolo a la
 * propiedad protegida `engine`, igual que hace `getEngine()` del adaptador,
 * por lo que no se descarga ningún modelo ni se requiere WebGPU.
 *
 * Ejecución: node tests/chatwebllm.test.ts  (script "test" del paquete)
 */

import assert from "node:assert/strict";
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatGenerationChunk } from "@langchain/core/outputs";
import { ChatWebLLM } from "../src/ai/ChatWebLLM.ts";

interface FakeChunk {
	choices: { delta: { content: string | null }; logprobs: unknown; finish_reason: string | null }[];
}

interface CreateRequest {
	stream?: boolean;
	messages: { role: string; content: string }[];
	stop?: string[];
	logprobs?: boolean;
}

class FakeEngine {
	initCallback: ((p: { text: string }) => void) | undefined;
	reloadCalls: [string, unknown][] = [];
	createCalls: CreateRequest[] = [];
	failReload = false;
	failCreate: Error | null = null;
	chunks: FakeChunk[] = [
		{ choices: [{ delta: { content: "Hola" }, logprobs: { t: 1 }, finish_reason: null }] },
		{ choices: [{ delta: { content: " mundo" }, logprobs: { t: 2 }, finish_reason: null }] },
		{ choices: [{ delta: { content: "." }, logprobs: null, finish_reason: "stop" }] }
	];

	chat = {
		completions: {
			create: async (req: CreateRequest) => {
				this.createCalls.push(req);
				if (this.failCreate) throw this.failCreate;
				const chunks = this.chunks;
				return (async function* () {
					for (const c of chunks) yield c;
				})();
			}
		}
	};

	setInitProgressCallback(cb: (p: { text: string }) => void) {
		this.initCallback = cb;
	}

	async reload(modelId: string, chatOpts?: unknown) {
		if (this.failReload) throw new Error("fallo de descarga simulado");
		this.reloadCalls.push([modelId, chatOpts]);
		this.initCallback?.({ text: "Loading model 50%" });
	}
}

function newModelWithFake(): [ChatWebLLM, FakeEngine] {
	const model = new ChatWebLLM({
		model: "TestModel-MLC",
		temperature: 0.7,
		chatOptions: { temperature: 0.7 }
	});
	const fake = new FakeEngine();
	// Mismo punto de inyección que getEngine(): se evita crear MLCEngine real.
	(model as unknown as { engine: FakeEngine }).engine = fake;
	return [model, fake];
}

const tests: [string, () => Promise<void>][] = [];
function test(name: string, fn: () => Promise<void>) {
	tests.push([name, fn]);
}

test("roles: system/human/ai se convierten a system/user/assistant", async () => {
	const [model, fake] = newModelWithFake();
	const msgs = [
		new SystemMessage({ content: "sys" }),
		new HumanMessage({ content: "hola" }),
		new AIMessage({ content: "adios" })
	];
	for await (const _ of model._streamResponseChunks(msgs, {}, undefined)) { /* consumir */ }
	assert.deepEqual(fake.createCalls[0].messages, [
		{ role: "system", content: "sys" },
		{ role: "user", content: "hola" },
		{ role: "assistant", content: "adios" }
	]);
});

test("rechazo explícito de contenido no string", async () => {
	const [model] = newModelWithFake();
	const msg = new HumanMessage({ content: [{ type: "text", text: "parte" }] as never });
	await assert.rejects(
		(async () => { for await (const _ of model._streamResponseChunks([msg], {}, undefined)) void _; }),
		/does not support non-string message content/
	);
});

test("rechazo explícito de mensajes de herramienta", async () => {
	const [model] = newModelWithFake();
	const msg = new ToolMessage({ content: "x", tool_call_id: "1" });
	await assert.rejects(
		(async () => { for await (const _ of model._streamResponseChunks([msg], {}, undefined)) void _; }),
		/Function, tool, and generic messages are not supported/
	);
});

test("streaming: chunks ChatGenerationChunk con texto, message y additional_kwargs", async () => {
	const [model] = newModelWithFake();
	const collected: ChatGenerationChunk[] = [];
	for await (const chunk of model._streamResponseChunks([new HumanMessage({ content: "p" })], {}, undefined))
		collected.push(chunk);
	assert.equal(collected.length, 3);
	assert.equal(collected[0].text, "Hola");
	assert.equal((collected[0].message as AIMessage).content, "Hola");
	assert.equal(collected[2].text, ".");
	assert.equal((collected[2].message as AIMessage).additional_kwargs.finish_reason, "stop");
	assert.deepEqual((collected[1].message as AIMessage).additional_kwargs.logprobs, { t: 2 });
});

test("no-streaming: _call acumula los tokens en una cadena", async () => {
	const [model] = newModelWithFake();
	const text = await model._call([new HumanMessage({ content: "p" })], {}, undefined);
	assert.equal(text, "Hola mundo.");
});

test("opciones: stream:true, logprobs:true y stop se propagan al motor", async () => {
	const [model, fake] = newModelWithFake();
	await model._call([new HumanMessage({ content: "p" })], { stop: ["\nUser:"] }, undefined);
	const req = fake.createCalls[0];
	assert.equal(req.stream, true);
	assert.equal(req.logprobs, true);
	assert.deepEqual(req.stop, ["\nUser:"]);
});

test("initialize: registra progreso y recarga con model y chatOptions", async () => {
	const [model, fake] = newModelWithFake();
	const progress: string[] = [];
	await model.initialize((p) => progress.push(p.text));
	assert.deepEqual(fake.reloadCalls, [["TestModel-MLC", { temperature: 0.7 }]]);
	assert.deepEqual(progress, ["Loading model 50%"]);
});

test("progreso antes de generar: initialize propaga el callback real del motor", async () => {
	const [model, fake] = newModelWithFake();
	await model.initialize(undefined);
	assert.equal(fake.initCallback, undefined);
	await model.initialize((p) => void p);
	assert.equal(typeof fake.initCallback, "function");
});

test("errores: fallo de recarga propaga desde initialize", async () => {
	const [model, fake] = newModelWithFake();
	fake.failReload = true;
	await assert.rejects(model.initialize(() => {}), /fallo de descarga simulado/);
});

test("errores: fallo del motor propaga durante la generación", async () => {
	const [model, fake] = newModelWithFake();
	fake.failCreate = new Error("engine boom");
	await assert.rejects(model._call([new HumanMessage({ content: "p" })], {}, undefined), /engine boom/);
});

test("contrato Runnable: promptTemplate.pipe(model).stream compatible con Chat.tsx", async () => {
	const [model] = newModelWithFake();
	const promptTemplate = ChatPromptTemplate.fromMessages([
		new SystemMessage({ content: "sys" }),
		new MessagesPlaceholder("input")
	]);
	const runnable = promptTemplate.pipe(model);
	const stream = await runnable.stream({ input: new HumanMessage("pregunta") });
	let text = "";
	for await (const chunk of stream) text += (chunk as AIMessage).content as string;
	assert.equal(text, "Hola mundo.");
});

test("runManager: handleLLMNewToken recibe cada token", async () => {
	const [model] = newModelWithFake();
	const tokens: string[] = [];
	const runManager = { handleLLMNewToken: async (t: string) => { tokens.push(t); } } as never;
	await model._call([new HumanMessage({ content: "p" })], {}, runManager);
	assert.deepEqual(tokens, ["Hola", " mundo", "."]);
});

let failures = 0;
for (const [name, fn] of tests) {
	try {
		await fn();
		console.log(`PASS ${name}`);
	} catch (e) {
		failures++;
		console.error(`FAIL ${name}\n  ${e instanceof Error ? e.message : e}`);
	}
}
console.log(`${tests.length - failures}/${tests.length} pruebas OK`);
process.exit(failures ? 1 : 0);
