import { DataPlugin, type DataPluginConfig } from '@asicupv/paella-core';
import PackagePluginModule from './PackagePluginModule';




export type RelatedVideosDataTestPluginConfig = DataPluginConfig & {
    videos?: string[];
};


export type RelatedVideo = {
    id: string;
    title: string;
    previewUrl?: string;
    presenter?: string;
    startDate?: Date;
    duration?: number;
    url: string;
}

export type RelatedVideosDataResponse = {
    total: number;
    skip: number;
    limit: number;
    items: RelatedVideo[]
}

export default class RelatedVideosDataTestPlugin extends DataPlugin<RelatedVideosDataTestPluginConfig, RelatedVideosDataResponse> {
    getPluginModuleInstance() {
        return PackagePluginModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.relatedVideos.dataTest";
    }    

    async read(_context: string, _key: string): Promise<RelatedVideosDataResponse> {      
        // Define the folders where the video data is stored
        const videoFolders = this.config.videos ?? [
            'ai-tool',
            'belmar-single',
            'belmar-multiresolution-single',
            'belmar-multiresolution-remote',
            'audio-and-images',
            'hls-single',
            'hls-multiquality',
            'video-360',
            'portrait',
            'dual-video-audio',
            'webvtt-captions'
        ];
        
        try {
            const videos: RelatedVideo[] = [];
            
            for (const folder of videoFolders) {
                try {
                    const response = await fetch(`${this.player.repositoryUrl}/${folder}/data.json`);
                    const data = await response.json();
                    
                    if (data.metadata) {
                        const video: RelatedVideo = {
                            id: folder,
                            title: data.metadata.title || folder,
                            url: `index.html?id=${folder}`,
                            previewUrl: data.metadata.preview,
                            duration: data.metadata.duration
                        };
                        videos.push(video);
                    }
                }
                catch (e) {
                    this.player.log.warn(`Error loading data for video ${folder}: ${e}`, `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
                }
            }
            
            return {
                total: videos.length,
                skip: 0,
                limit: videos.length,
                items: videos
            };
        }
        catch (e) {
            this.player.log.error(`Error fetching related videos: ${e}`, `${this.getPluginModuleInstance().moduleName} [${this.name}]`);            
            return {
                total: 0,
                skip: 0,
                limit: 0,
                items: []
            };
        }
    }
}
