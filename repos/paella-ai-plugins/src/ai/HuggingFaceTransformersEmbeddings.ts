import { Embeddings } from "@langchain/core/embeddings";
import type { FeatureExtractionPipeline } from "@huggingface/transformers";

/** LangChain embeddings backed by Transformers.js, loaded on first use. */
export class HuggingFaceTransformersEmbeddings extends Embeddings {
    readonly model: string;
    private pipelinePromise: Promise<FeatureExtractionPipeline> | null = null;

    constructor({ model = "Xenova/all-MiniLM-L6-v2" }: { model?: string } = {}) {
        super({});
        this.model = model;
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        const embeddings: number[][] = [];
        for (let start = 0; start < texts.length; start += 512) {
            embeddings.push(...await this.runEmbedding(texts.slice(start, start + 512)));
        }
        return embeddings;
    }

    async embedQuery(text: string): Promise<number[]> {
        return (await this.runEmbedding([text]))[0];
    }

    private async runEmbedding(texts: string[]): Promise<number[][]> {
        if (!this.pipelinePromise) {
            this.pipelinePromise = import("@huggingface/transformers").then(({ pipeline }) =>
                pipeline("feature-extraction", this.model)
            );
        }
        const pipe = await this.pipelinePromise;
        return this.caller.call(async () => {
            const output = await pipe(texts.map(text => text.replace(/\n/g, " ")), {
                pooling: "mean",
                normalize: true
            });
            return output.tolist();
        });
    }
}
