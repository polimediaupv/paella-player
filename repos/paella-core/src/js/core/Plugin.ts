import PlayerResource from './PlayerResource';
import type Paella from '../Paella';
import type { PluginConfig } from './Config';

export default class Plugin extends PlayerResource {
    #name: string

    // _config must be accessible from external utility functions
    _config: PluginConfig

    __uiPlugin: boolean = false;

    constructor(player: Paella, name: string) {
        super(player);
        this.#name = name;
        this._config = {}
    }

    getPluginModuleInstance() {
        return null;
    }

    get config(): PluginConfig { return this._config; }

    get type(): string { return "none"; }

    get order(): number | null { return this._config?.order || 0; }
    
    get description(): string | null { return this._config?.description || ""; }

    get name(): string | null { return this.#name; }

    preload() {

    }
    
    async isEnabled(): Promise<boolean> {
        return this._config?.enabled || false;
    }

    async load(): Promise<void> {

    }

    async unload(): Promise<void> {

    }
}