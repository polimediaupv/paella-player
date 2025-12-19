

import { DomClass } from './dom';
import Plugin from './Plugin';
import { loadPluginsOfType } from './plugin_tools'
import { getFileExtension } from './utils';
import Paella from '../Paella';
import StreamProvider from './StreamProvider';

export default class VideoPlugin extends Plugin {
    get type() { return "video"; }

    get streamType() { return "mp4"; }

    async isCompatible(streamData: any): Promise<boolean> {
        return false;
    }

    async getVideoInstance(playerContainer: HTMLElement, isMainAudio: boolean) {
        return null;
    }

    getCompatibleFileExtensions() : string[] {
        return [];
    }

    getManifestData(fileUrls: string[]) {

    }
}

const g_enabledVideoPlugins: VideoPlugin[] = [];

export async function loadVideoPlugins(player: Paella) {
    await loadPluginsOfType(player, "video", async (plugin) => {
        g_enabledVideoPlugins.push(plugin as VideoPlugin);
    });
}

export async function unloadVideoPlugins(player: Paella) {
    g_enabledVideoPlugins.slice(0);
}

export function getVideoPlugins(player: Paella) {
    if (g_enabledVideoPlugins.length === 0) {
        throw Error("No video plugins loaded. Note that `loadVideoPlugins()` must to be called before using `getVideoPlugins()`.")
    }
    return g_enabledVideoPlugins;
}

export function getVideoPluginWithFileUrl(player: Paella, url: string) {
    const ext = getFileExtension(url);
    const videoPlugins = getVideoPlugins(player)
    return videoPlugins.find(p => {
            return p.getCompatibleFileExtensions().indexOf(ext) !== -1;
        });
}

export async function getVideoPlugin(player: Paella, streamData: any) {
    const videoPlugins = getVideoPlugins(player);
    let plugin: VideoPlugin | null = null;
    
    for (const p of videoPlugins) {
        if (await p.isCompatible(streamData)) {
            plugin = p;
            break;
        }
    }
    
    return plugin;
}

export async function isVolumeApiAvailable() {
    const value = await (new Promise(resolve => {
        const audio = document.createElement('audio');
        const resolveTimer = setTimeout(() => resolve(false), 100);
        audio.addEventListener('volumechange', evt => {
            clearTimeout(resolveTimer);
            resolve(true);
        });
        audio.volume = 0.5;
    }));
    return value
}

export type AudioTrack = {
    id: number | string
    language: string
    groupId: string
    selected: boolean
}


export class Video extends DomClass {
    constructor(tag: string, player: Paella, parent: HTMLElement | null = null) {
        const attributes = {
            "class": "video-player"
        };
        super(player, {tag, attributes, parent});

        (this as any)._streamProvider = null;
        (this as any)._streamDData = null;
        (this as any)._ready = false;
    }

    async isVolumeApiAvailable() {
        return await isVolumeApiAvailable()
    }

    get streamData() {
        return (this as any)._streamData;
    }

    get ready() {
        return (this as any)._ready;
    }

    async load(streamData: any, streamProvider: typeof StreamProvider) {
        (this as any)._streamProvider = streamProvider;
        (this as any)._streamData = streamData;
        const result = await this.loadStreamData(streamData);
        return result;
    }

    get isMainAudioPlayer() {
        return (this as any)._streamProvider.mainAudioPlayer === this;
    }
    
    // The player must call _videoEndedCallback when the video is ended
    onVideoEnded(fn: () => void) {
        (this as any)._videoEndedCallback = fn;
    }

    // The video instance must implement the following functions and properties
    async play() {
        return false;
    }
    
    async pause() {
        return false;
    }

    async duration() {
        return -1;
    }
    
    get currentTimeSync() {
        return -1;
    }

    async currentTime() {
        return -1;
    }

    async setCurrentTime( t: number) {
        return false;
    }

    async volume() {
        return -1;
    }

    async setVolume( v: number) {
        return false;
    }

    initVolume(v: number) {
        (this as any)._initialVolume = v;
    }

    async paused() {
        return true;
    }

    async playbackRate() {
        return -1;
    }

    async setPlaybackRate() {
        return false;
    }

    async getQualities() {
        return null;
    }

    async setQuality( q: number) {
        return false;
    }

    get currentQuality() {
        return null;
    }

    async getDimensions() {
        return null;
    }
    
    async supportsMultiaudio() {
        return false;
    }

    async getAudioTracks() : Promise<AudioTrack[] | null> {
        return null;
    }

    async setCurrentAudioTrack(track: AudioTrack) {

    }

    get currentAudioTrack() {
        return null;
    }

    async loadStreamData(streamData: any) {
        return false;
    }

    get isEnabled() {
        return (this as any)._enabled;
    }

    async enable() {
        (this as any)._enabled = true;
    }

    async disable() {
        (this as any)._enabled = false;
    }
}
