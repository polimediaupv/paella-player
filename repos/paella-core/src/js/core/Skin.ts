import { mergeObjects, unloadStyle } from "./utils";
import PlayerState from "./PlayerState";
import { removeFileName } from "./utils";
import { joinPath } from "./utils";
import { loadStyle } from "./utils";
import type { Config } from "./Config";
import Plugin from "./Plugin";
import Paella from "../Paella";

// The following functions should be called only by a paella-core instance
export function overrideSkinConfig(this: Skin, config: Config) {
    if ((this as any)._skinData?.configOverrides) {
        mergeObjects(config, (this as any)._skinData.configOverrides);
    }
}

async function checkLoadSkinStyleSheets(this: Skin) {
    if ((this as any)._skinData?.styleSheets) {
        const p: Promise<void>[] = [];
        (this as any)._skinData?.styleSheets.forEach((css: string) => {
            if (/\{.*/.test(css)) {
            }
            else if ((this as any)._externalResourcesAllowed) {
                const cssPath = joinPath([(this as any)._skinUrl, css]);

                p.push(new Promise(async (resolve,reject) => {
                    try {
                        await loadStyle(cssPath, { addToHeader: false });
                        resolve();
                    }
                    catch (err) {
                        reject(err);
                    }
                }));
            }
            else {
                throw new Error("No external resources allowed loading skin object");
            }
        });
        await Promise.allSettled(p);
    }
}

export async function loadSkinStyleSheets(this: Skin) {
    (this.player as any).__skinStyleSheets__ = (this.player as any).__skinStyleSheets__ || [];
    if ((this as any)._skinData?.styleSheets) {
        const p: Promise<void>[] = [];
        (this as any)._skinData?.styleSheets?.forEach((css: string) => {
            if (/\{.*/.test(css)) {
                p.push(new Promise(resolve => {
                    const style = document.createElement('style');
                    style.innerHTML = css;
                    (this.player as any).__skinStyleSheets__.push(style);
                    document.head.appendChild(style);
                    resolve();
                }))
            }
            else {
                const cssPath = joinPath([(this as any)._skinUrl, css]);
                p.push(new Promise(async (resolve, reject) => {
                    try {
                        const link = await loadStyle(cssPath);
                        (this.player as any).__skinStyleSheets__.push(link);
                        resolve();
                    }
                    catch (err) {
                        reject(err);
                    }
                }))
            }
        });
        await Promise.allSettled(p);
    }
}

export function unloadSkinStyleSheets(this: Skin) {
    (this.player as any).__skinStyleSheets__ = (this.player as any).__skinStyleSheets__ || [];
    (this.player as any).__skinStyleSheets__.forEach((link: HTMLLinkElement) => {
        unloadStyle(link);
    });
    (this.player as any).__skinStyleSheets__ = [];
}

export async function checkLoadSkinIcons(this: Skin) {
    if (Array.isArray((this as any)._skinData?.icons)) {
        await Promise.all((this as any)._skinData.icons.map(({
            plugin, identifier, icon
        } : {
            plugin: string, identifier: string, icon: string
        }) => {
            return new Promise(async (resolve: Function, reject: Function) => {
                const div = document.createElement('div');
                div.innerHTML = icon;
                if (div.children[0] && div.children[0].tagName === 'svg') {
                    // Embedded icon
                    resolve();   
                }
                else if ((this as any)._externalResourcesAllowed) {
                    const iconFullUrl = joinPath([(this as any)._skinUrl, icon]);
                    const req = await fetch(iconFullUrl);
                    if (req.ok) {
                        resolve();
                    }
                    else {
                        reject(new Error(`Skin icon not found at URL '${ iconFullUrl }'`));
                    }
                }
                else {
                    throw new Error("No external resources allowed loading skin object");
                }
            })
        }))
    }
}

export async function loadSkinIcons(this: Skin) {
    if (Array.isArray((this as any)._skinData?.icons)) {
        await Promise.all((this as any)._skinData.icons.map(({
            plugin, identifier, icon
        } : {
            plugin: string, identifier: string, icon: string
        }) => {
            return new Promise(async (resolve: Function, reject: Function) => {
                const div = document.createElement('div');
                div.innerHTML = icon;
                if (div.children[0] && div.children[0].tagName === 'svg') {
                    this.player.addCustomPluginIcon(plugin, identifier, icon);
                    resolve();
                }
                else {
                    const iconFullUrl = joinPath([(this as any)._skinUrl, icon]);
                    const req = await fetch(iconFullUrl);
                    if (req.ok) {
                        const iconData = await req.text();
                        this.player.addCustomPluginIcon(plugin, identifier, iconData);
                        resolve();
                    }
                    else {
                        reject(new Error(`Skin icon not found at URL '${ iconFullUrl }'`));
                    }
                }
            })
        }));
    }
}


export default class Skin {
    protected _player: Paella;
    protected _skinUrl: string | null = null;
    protected _externalResourcesAllowed = true;
    
    constructor(player: Paella) {
        this._player = player;
    }

    get player() {
        return this._player;
    }

    async loadSkin(skinParam: string | object) {
        const playing = this._player.state === PlayerState.LOADED && !(await this._player.paused());
        const currentTime = this._player.state === PlayerState.LOADED ? await this._player.currentTime() : 0;

        if (typeof(skinParam) === "string") {
            // load skin data from url to this._skinData
            this._skinUrl = removeFileName(skinParam);
            this._externalResourcesAllowed = true;
            const req = await fetch(skinParam);
            if (!req.ok) {
                throw new Error(`Error loading skin from URL ${skinParam}`);
            }
            (this as any)._skinData = await req.json();
        }
        else if (typeof(skinParam) === "object") {
            this._skinUrl = "";
            this._externalResourcesAllowed = false;
            (this as any)._skinData = skinParam;
        }

        try {
            // check skinData object
            await checkLoadSkinStyleSheets.apply(this);
            await checkLoadSkinIcons.apply(this);
            
            // If the player status is loaded, reload the player
            if (this._player.state === PlayerState.LOADED ||
                this._player.state === PlayerState.MANIFEST)
            {
                await this._player.reload();
                await this._player.play();
                await this._player.setCurrentTime(currentTime);
                if (!playing) {
                    await this._player.pause();
                }
            }
        }
        catch (err) {
            this._skinUrl = "";
            this._externalResourcesAllowed = true;
            (this as any)._skinData = {};
            throw err;
        }
    }

    unloadSkin() {
        // Unload custom icons
        if (Array.isArray((this as any)._skinData?.icons)) {
            (this as any)._skinData?.icons.forEach(({ plugin, identifier } : { plugin: string, identifier: string }) => {
                this.player.removeCustomPluginIcon(plugin, identifier);
            });
        }

        this._skinUrl = null;
        (this as any)._skinData = {};

        if (this._player.state === PlayerState.LOADED ||
            this._player.state === PlayerState.MANIFEST)
        {
            this._player.reload();
        }
    }
}