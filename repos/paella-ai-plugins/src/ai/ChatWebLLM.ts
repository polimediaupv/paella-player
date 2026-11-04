/**
 * Local WebLLM chat model for LangChain.
 *
 * Adapted from the `ChatWebLLM` integration of `@langchain/community`
 * (packages/langchain-community/src/chat_models/webllm.ts),
 * Copyright LangChain, Inc., MIT License
 * (https://github.com/langchain-ai/langchain-js/blob/main/LICENSE).
 *
 * Kept in-repo to drop the whole `@langchain/community` integration tree,
 * which is otherwise unused and pulls vulnerable transitive dependencies.
 *
 * Deviations from upstream (documented in plans/update/progress.md):
 * - The `MLCEngine` is created lazily on first use instead of in the
 *   constructor, so the adapter can be exercised in tests with a simulated
 *   engine and so `@mlc-ai/web-llm` stays out of the initial bundle.
 *   Product behaviour is unchanged: the engine is only required from
 *   `initialize()`/`reload()`/generation onwards.
 */

import { SimpleChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseChatModelParams } from "@langchain/core/language_models/chat_models";
import type { BaseLanguageModelCallOptions } from "@langchain/core/language_models/base";
import { AIMessageChunk, type BaseMessage } from "@langchain/core/messages";
import { ChatGenerationChunk } from "@langchain/core/outputs";
import type { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import type {
	MLCEngine as MLCEngineInterface,
	AppConfig,
	ChatOptions,
	InitProgressCallback,
} from "@mlc-ai/web-llm";

export interface WebLLMInputs extends BaseChatModelParams {
	appConfig?: AppConfig;
	chatOptions?: ChatOptions;
	temperature?: number;
	model: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface WebLLMCallOptions extends BaseLanguageModelCallOptions {}

interface WebLLMChatMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

/**
 * To use this model you need to have the `@mlc-ai/web-llm` module installed.
 * This can be installed using `npm install -S @mlc-ai/web-llm`.
 *
 * You can see a list of available model records here:
 * https://github.com/mlc-ai/web-llm/blob/main/src/config.ts
 * @example
 * ```typescript
 * // Initialize the ChatWebLLM model with the model record.
 * const model = new ChatWebLLM({
 *   model: "Phi-3-mini-4k-instruct-q4f16_1-MLC",
 *   chatOptions: {
 *     temperature: 0.5,
 *   },
 * });
 *
 * // Call the model with a message and await the response.
 * const response = await model.invoke([
 *   new HumanMessage({ content: "My name is John." }),
 * ]);
 * ```
 */
export class ChatWebLLM extends SimpleChatModel<WebLLMCallOptions> {
	static inputs: WebLLMInputs;
	protected engine?: MLCEngineInterface;
	appConfig?: AppConfig;
	chatOptions?: ChatOptions;
	temperature?: number;
	model: string;

	static lc_name(): string {
		return "ChatWebLLM";
	}

	constructor(inputs: WebLLMInputs) {
		super(inputs);
		this.appConfig = inputs.appConfig;
		this.chatOptions = inputs.chatOptions;
		this.model = inputs.model;
		this.temperature = inputs.temperature;
	}

	_llmType(): string {
		return "web-llm";
	}

	/**
	 * Lazily creates the underlying MLCEngine. Tests may assign a simulated
	 * engine to `engine` beforehand to skip both creation and model download.
	 */
	protected async getEngine(): Promise<MLCEngineInterface> {
		if (!this.engine) {
			const webllm = await import("@mlc-ai/web-llm");
			this.engine = new webllm.MLCEngine({ appConfig: this.appConfig });
		}
		return this.engine;
	}

	async initialize(progressCallback?: InitProgressCallback): Promise<void> {
		const engine = await this.getEngine();
		if (progressCallback !== undefined) engine.setInitProgressCallback(progressCallback);
		await this.reload(this.model, this.chatOptions);
	}

	async reload(modelId: string, newChatOpts?: ChatOptions): Promise<void> {
		const engine = await this.getEngine();
		await engine.reload(modelId, newChatOpts);
	}

	protected toWebLLMMessages(messages: BaseMessage[]): WebLLMChatMessage[] {
		return messages.map((message) => {
			if (typeof message.content !== "string")
				throw new Error("ChatWebLLM does not support non-string message content in sessions.");
			const langChainType = message._getType();
			let role: WebLLMChatMessage["role"];
			if (langChainType === "ai") role = "assistant";
			else if (langChainType === "human") role = "user";
			else if (langChainType === "system") role = "system";
			else throw new Error("Function, tool, and generic messages are not supported.");
			return { role, content: message.content };
		});
	}

	async *_streamResponseChunks(
		messages: BaseMessage[],
		options: this["ParsedCallOptions"],
		runManager?: CallbackManagerForLLMRun
	): AsyncGenerator<ChatGenerationChunk> {
		const messagesInput = this.toWebLLMMessages(messages);
		const engine = await this.getEngine();
		const stream = await engine.chat.completions.create({
			stream: true,
			messages: messagesInput,
			stop: options.stop,
			logprobs: true
		});
		for await (const chunk of stream) {
			const text = chunk.choices[0].delta.content ?? "";
			yield new ChatGenerationChunk({
				text,
				message: new AIMessageChunk({
					content: text,
					additional_kwargs: {
						logprobs: chunk.choices[0].logprobs,
						finish_reason: chunk.choices[0].finish_reason
					}
				})
			});
			await runManager?.handleLLMNewToken(text);
		}
	}

	async _call(
		messages: BaseMessage[],
		options: this["ParsedCallOptions"],
		runManager?: CallbackManagerForLLMRun
	): Promise<string> {
		const chunks: string[] = [];
		for await (const chunk of this._streamResponseChunks(messages, options, runManager))
			chunks.push(chunk.text);
		return chunks.join("");
	}
}
