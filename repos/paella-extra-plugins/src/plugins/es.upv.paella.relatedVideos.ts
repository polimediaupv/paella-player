import { createElementWithHtmlText, PopUpButtonPlugin, type PopUpButtonPluginConfig } from '@asicupv/paella-core';
import PackagePluginModule from './PackagePluginModule';
import ListVideoIcon from '../icons/list-video.svg?raw';
import type { RelatedVideo, RelatedVideosDataResponse } from './es.upv.paella.relatedVideos.dataTest';
import '../css/RelatedVideos.css';


function secondsToTime(timestamp: number): string {
    const hours = Math.floor(timestamp / 60 / 60);
    const minutes = Math.floor(timestamp / 60) - hours * 60;
    const seconds = Math.floor(timestamp % 60);
    return  (hours>0 ? hours.toString().padStart(2,'0') + ":" : "") +
            minutes.toString().padStart(2,'0') + ":" +
            seconds.toString().padStart(2,'0');
}


export type RelatedVideosPluginConfig = PopUpButtonPluginConfig & {
}

export default class RelatedVideosPlugin extends PopUpButtonPlugin<RelatedVideosPluginConfig> {
    relatedVideosRes: RelatedVideosDataResponse | null = null;
    
    getPluginModuleInstance() {
        return PackagePluginModule.Get();
    }

    get name() {
        return super.name || 'es.upv.paella.relatedVideos';
    }

    getAriaLabel() {
        return this.player.translate('Related videos');
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async getHelp() {
        return {
            title: this.player.translate('Related videos'),
            description: this.player.translate('Displays a list of videos related to the current video.')
        };
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, 'buttonIcon') || ListVideoIcon;
    }


    async isEnabled() {        
        try {           
            if (!(await super.isEnabled())) {
                return false;
            }

            this.relatedVideosRes = await this.player.data?.read("relatedVideos", "relatedVideos");

            return (0 < (this.relatedVideosRes?.items.length || 0)) || false;
        
        }
        catch (_e) {
            return false;
        }
    }

    async getContent() {
        const currentVideoId = this.player.videoId;

        const container = createElementWithHtmlText(`
            <div class="related-videos-container">                
                <div class="relatedvideos-list">
                    ${this.relatedVideosRes?.items.map(relatedVideo => this.createVideoItem(relatedVideo, currentVideoId || "")).join('')}
                </div>
            </div>
        `);
        
        const relatedVideoItems = container.querySelectorAll('.relatedvideo-item');
        relatedVideoItems.forEach((item, index) => {
            const event = this.relatedVideosRes?.items[index];
            if (event && (event.id !== currentVideoId)) {
                item.addEventListener('click', () => {
                    this.navigateToVideo(event.url);
                });
            }
        });

        return container;
    }

    private createVideoItem(relatedVideo: RelatedVideo, currentVideoIdId: string): string {
        const previewUrl = relatedVideo.previewUrl;
        const title = relatedVideo.title ?? 'Sin título';
        const presenter = relatedVideo.presenter ?? 'Autor desconocido';
        const startDate = relatedVideo.startDate
            ? relatedVideo.startDate.toLocaleDateString()
            : '';
        const duration = relatedVideo.duration
            ? secondsToTime(relatedVideo.duration)
            : '';

        const isCurrentVideo = relatedVideo.id === currentVideoIdId;
        const currentClass = isCurrentVideo ? ' current-video' : '';
        const clickableClass = isCurrentVideo ? '' : ' clickable';

        return `
            <div class="relatedvideo-item${currentClass}${clickableClass}">
                <div class="relatedvideo-preview">
                    ${previewUrl ? `<img src="${previewUrl}" alt="${title}" />` : '<div class="no-preview"></div>'}
                    ${duration ? `<span class="relatedvideo-duration">${duration}</span>` : ''}
                    ${isCurrentVideo ? '<span class="current-indicator">Reproduciendo</span>' : ''}
                </div>
                <div class="relatedvideo-info">
                    <h5 class="relatedvideo-title">${title}</h5>
                    <div class="relatedvideo-metadata">
                        <div class="relatedvideo-presenters">${presenter}</div>
                        ${startDate ? `<div class="relatedvideo-date">${startDate}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    private navigateToVideo(videoUrl: string): void {
        window.location.href = videoUrl;
    }
}
