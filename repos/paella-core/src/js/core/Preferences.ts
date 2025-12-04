
import PlayerResource from "./PlayerResource";
import { setCookieIfAllowed, getCookie } from "./utils";
import Paella from "../Paella";

const g_defaultPreferences = '{ "global": {}, "videos": {} }';

async function load(this: Preferences) {
    switch (this.sourceName) {
    case "cookie":
        try {
            return JSON.parse(getCookie("preferences"));
        }
        catch (err) {
            return JSON.parse(g_defaultPreferences);
        }
    case "dataPlugin":
        try {
            const data = await this.player.data.read(this.source.context, JSON.stringify({}));
            return data || JSON.parse(g_defaultPreferences);
        }
        catch (err) {
            return JSON.parse(g_defaultPreferences);
        }
    }
}

async function save(this: Preferences, data: any) {
    switch (this.source.name) {
    case "cookie":
        setCookieIfAllowed(this.player, this.source.consentType, "preferences", JSON.stringify(data));
        break;
    case "dataPlugin":
        await this.player.data.write(this.source.context, JSON.stringify({}), data);
        break;
    }
}

export default class Preferences extends PlayerResource {
    public source: any;
    public sourceName: string;
    private _loaded: boolean;

    constructor(player: Paella) {
        super(player);
        const { currentSource, sources } = player.config.preferences || {
            currentSource: "cookie",
            sources: {
                cookie: {
                    consentType: "necessary"
                }
            }
        };
        this.source = sources[currentSource];
        this.sourceName = currentSource;
        this._loaded = false;

        if (!this.source) {
            throw Error("Invalid configuration in preferences. Check the configuration file.");
        }
    }

    async set(key: string, value: any, { global = false } = {}) : Promise<void> {
        const data = await load.apply(this);
        if (global) {
            data.global[key] = value; 
        }
        else {
            data.videos[this.player.videoId] = data.videos[this.player.videoId] || {};
            data.videos[this.player.videoId][key] = value;
        }
        await save.apply(this, [data]);
    }

    async get(key: string, { global = false } = {}) : Promise<any> {
        const data = await load.apply(this);
        if (global) {
            return data.global[key];
        }
        else {
            return data.videos[this.player.videoId] && data.videos[this.player.videoId][key] || undefined;
        }
    }
}