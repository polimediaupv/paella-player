import { DataPlugin, type PluginConfig } from '@asicupv/paella-core';
import PackagePluginModule from './PackagePluginModule';
import { type AIContentData } from './es.upv.paella.ai.content';




export type AIContentDataTestPluginConfig = PluginConfig & {
    files?: {
        [key: string]: {
            file: string
            media?: string;
        }
    };
};


export default class AIContentDataTestPlugin extends DataPlugin {
    getPluginModuleInstance() {
        return PackagePluginModule.Get();
    }

    get config(): AIContentDataTestPluginConfig {
        return super.config as AIContentDataTestPluginConfig;
    }

    get name() {
        return super.name || "es.upv.paella.ai.content.data-test";
    }    

    async read(_context: string, key: string): Promise<AIContentData | null> {        
        if (!this.config.files) {
            this.player.log.error("Plugin not configured correctly: No files section configured", this.name);
        }
        else if (!(key in this.config.files)) {
            this.player.log.error(`Plugin not configured correctly: Scope ${key} not configured in files section`, this.name);
        }
        else {
            const fileInfo = this.config.files[key];
            const url = `${this.player.repositoryUrl}/${this.player.videoId}/${fileInfo.file}`;
            const mediaUrl = fileInfo.media 
                ? `${this.player.repositoryUrl}/${this.player.videoId}/${fileInfo.media}`
                : undefined;

            // Read the file content            
            let content = await fetch(url)
                .then(async (response) => {
                    if (!response.ok) {                        
                        return null;
                    }
                    else {
                        return await response.text();
                    }
                });
            
            return {                
                mediaUrl,
                content
            };
        }

        return null;
    }
}