import PlayerResource from './PlayerResource';
import type Paella from '../Paella';
import type { PluginConfig } from './Config';
import PluginModule from './PluginModule';

export default class Plugin<ConfigT extends PluginConfig = PluginConfig> extends PlayerResource {
    #name: string | null

    // _config must be accessible from external utility functions
    _config: ConfigT = {} as ConfigT;
    
    __uiPlugin: boolean = false;

    constructor(player: Paella, name: string | null) {
        super(player);
        this.#name = name;
        this._config = {} as ConfigT;
    }

    getPluginModuleInstance() : PluginModule | null {
        return null;
    }

    get config(): ConfigT { return this._config; }

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