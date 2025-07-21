import { DataPlugin, type DataPluginConfig } from '@asicupv/paella-core';
import PackagePluginModule from './PackagePluginModule';
import type { FileContentData } from './es.upv.paella.fileContent';




export type FileContentDataTestPluginConfig = DataPluginConfig & {
    files?: {
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


export default class FileContentDataTestPlugin extends DataPlugin<FileContentDataTestPluginConfig, FileContentData | null> {
    getPluginModuleInstance() {
        return PackagePluginModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.fileContent.dataTest";
    }    

    async read(_context: string, _key: string): Promise<FileContentData | null> {      
        if (!this.config.files) {
            this.player.log.error("Plugin not configured correctly: No files section configured", `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
            return null;
        }
        else if (this.config.files.length === 0) {
            this.player.log.error("Plugin not configured correctly: No files defined in files section", `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
            return null;
        }
        else if (this.config.files.length > 0) {
            // Return the configured files
            const filesData = await Promise.all(
                this.config.files.map(async (file) => {
                    const contentUrl = file.content?.url?.startsWith('http') 
                        ? file.content.url 
                        : `${this.player.repositoryUrl}/${this.player.videoId}/${file.content?.url}`;
                    const mediaUrl = file.media?.url?.startsWith('http') 
                        ? file.media.url 
                        : `${this.player.repositoryUrl}/${this.player.videoId}/${file.media?.url}`;

                        const contentData = await fetch(contentUrl)
                        .then(async (response) => {
                            if (!response.ok) {
                                return null;
                            }
                            return await response.text();
                        });

                    
                    return {
                        title: file.title,
                        content: file.content ? {
                            data: contentData ?? '',
                            url: contentUrl,
                            mimeType: file.content.mimeType
                        } : undefined,
                        media: file.media ? {
                            url: mediaUrl,
                            mimeType: file.media.mimeType
                        } : undefined
                    };
                })
            );

            return filesData;
        }

        return null;
    }
}
