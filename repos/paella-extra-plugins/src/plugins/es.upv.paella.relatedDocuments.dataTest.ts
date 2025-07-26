import { DataPlugin, type DataPluginConfig } from '@asicupv/paella-core';
import PackagePluginModule from './PackagePluginModule';
import type { RelatedDocuments } from './es.upv.paella.relatedDocuments';




export type RelatedDocumentsDataTestPluginConfig = DataPluginConfig & {
    docs?: {
        title: string;
        content?: {
            url: string;
            mimeType: string;
        },
        media?: {
            url: string;
            mimeType: string;
        }
    }[];
};


export default class RelatedDocumentsDataTestPlugin extends DataPlugin<RelatedDocumentsDataTestPluginConfig, RelatedDocuments | null> {
    getPluginModuleInstance() {
        return PackagePluginModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.relatedDocuments.dataTest";
    }    

    async read(_context: string, _key: string): Promise<RelatedDocuments | null> {      
        if (!this.config.docs) {
            this.player.log.error("Plugin not configured correctly: No docs property configured", `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
            return null;
        }
        else if (this.config.docs.length === 0) {
            this.player.log.error("Plugin not configured correctly: 0 docs defined in docs property", `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
            return null;
        }
        else if (this.config.docs.length > 0) {
            // Return the configured docs
            const docsData = await Promise.all(
                this.config.docs.map(async (doc) => {
                    const contentUrl = doc.content?.url?.startsWith('http') 
                        ? doc.content.url 
                        : `${this.player.repositoryUrl}/${this.player.videoId}/${doc.content?.url}`;
                    const mediaUrl = doc.media?.url?.startsWith('http') 
                        ? doc.media.url 
                        : `${this.player.repositoryUrl}/${this.player.videoId}/${doc.media?.url}`;

                        const contentData = await fetch(contentUrl)
                        .then(async (response) => {
                            if (!response.ok) {
                                return null;
                            }
                            return await response.text();
                        });

                    
                    return {
                        title: doc.title,
                        content: doc.content ? {
                            data: contentData ?? '',
                            url: contentUrl,
                            mimeType: doc.content.mimeType
                        } : undefined,
                        media: doc.media ? {
                            url: mediaUrl,
                            mimeType: doc.media.mimeType
                        } : undefined
                    };
                })
            );

            return docsData;
        }

        return null;
    }
}
