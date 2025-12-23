import Plugin from './Plugin';
import { loadPluginsOfType } from './plugin_tools'
import PlayerResource from './PlayerResource';
import Paella from '../Paella';

export class DataPlugin extends Plugin {
    get type() { return "data"; }

    get context() { return this.config.context || []; }

    async read(context: string, key: string) : Promise<any> {
        throw Error(`DataPlugin.read() not implemented in data plugin '${this.name}'`);
    }

    async write(context: string, key: string, data: any) {
        throw Error(`DataPlugin.write() not implemented in data plugin '${this.name}'`);
    }

    async remove(context: string, key: string) {
        throw Error(`DataPlugin.remove() not implemented in data plugin '${this.name}'`);
    }
}

export default class Data extends PlayerResource {
    private _dataPlugins: {[context: string]: DataPlugin[]};

    constructor(player: Paella) {
        super(player);

        this._dataPlugins = {}

        loadPluginsOfType(this.player, "data", async (plugin) => {
            if (plugin instanceof DataPlugin) {
                plugin.context?.forEach((ctx: string) => {
                    this._dataPlugins[ctx] = this._dataPlugins[ctx] || [];
                    this._dataPlugins[ctx].push(plugin);
                });
            }
        })
    }

    getDataPlugin(context: string): DataPlugin {
        let plugin =  this._dataPlugins[context] &&
                      this._dataPlugins[context].length > 0 &&
                      this._dataPlugins[context][0];
        if (!plugin) {
            plugin = this._dataPlugins["default"] &&
                     this._dataPlugins["default"].length > 0 &&
                     this._dataPlugins["default"][0];
        }
        if (!plugin) {
            throw Error(`No data plugin found for context '${context}'`);
        }
        return plugin;
    }

    getDataPlugins(context: string): DataPlugin[] {
        let plugin =  this._dataPlugins[context] &&
                      this._dataPlugins[context].length > 0 &&
                      this._dataPlugins[context];
        if (!plugin) {
            plugin = this._dataPlugins["default"] &&
                     this._dataPlugins["default"].length > 0 &&
                     this._dataPlugins["default"];
        }
        if (!plugin) {
            throw Error(`No data plugin found for context '${context}'`);
        }
        return plugin;
    }

    async read(context: string, key: string) : Promise<any> {
        const p = this.getDataPlugin(context);
        const result = await p.read(context, key);
        return result;
    }

    async write(context: string, key: string, data: any) : Promise<any> {
        const p = this.getDataPlugins(context);
        if (Array.isArray(p)) {
            let result = null;
            for (let i = 0; i < p.length; ++i) {
                result = await p[i].write(context, key, data);
            }
            return result;
        }
        else {
            this.player.log.warn(`No such data plugin found for context '${context}'`);
        }
    }

    async remove(context: string, key: string) : Promise<any> {
        const p = this.getDataPlugins(context);
        if (p) {
            let result = null;
            for (let i = 0; i < p.length; ++i) {
                result = await p[i].remove(context, key);
            }
            return result;
        }
        this.player.log.warn(`No such data plugin found for context '${context}'`);
    }
}

