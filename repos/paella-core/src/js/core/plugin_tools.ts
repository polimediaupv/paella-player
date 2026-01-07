import paellaPlugins from '../paella_plugins';
import { isSvgString, joinPath, mergeObjects } from './utils';
import ButtonGroupPlugin from './ButtonGroupPlugin';
import Paella from '../Paella';
import Plugin from "./Plugin"
import PluginModule from './PluginModule';
import { type PluginConfig, type ButtonGroupConfig } from './Config'

export const createPluginInstance = (PluginClass: typeof Plugin, player: Paella, name: string | null, staticConfig: PluginConfig = {}) => {
    const instance = new PluginClass(player, name);
    // The name defined by the instance has a higher priority than the name obtained through the file name
    name = instance.name || name;
    if (!name) {
        player.log.warn(`The instance of the ${PluginClass.name} plugin cannot be created because it is being loaded explicitly and does not have the name property implemented.`)
        return null;
    }
    else {
        if (player.config.plugins && player.config.plugins[name]) {
            mergeObjects(staticConfig, player.config.plugins[name], false);
        }
        instance._config = staticConfig;
        instance.preload();
        return instance;
    }
}

function importPlugin(player: Paella, pluginClass: string, pluginInstance: Plugin, PluginClass: typeof Plugin | string, overwrite = false) {
    const type = pluginInstance.type;
    let currentInstance = -1;
    if ((player as any).__pluginData__.pluginInstances[type] &&
        (player as any).__pluginData__.pluginInstances[type].find((registeredPlugin: Plugin, i: number) => {
            if (registeredPlugin.name === pluginInstance.name) {
                currentInstance = i;
                return true;
            }
        }) &&
        !overwrite)
    {
        player.log.info(`Plugin ${pluginInstance.name} of type ${type} already registered.`);
        return;        
    }
    (player as any).__pluginData__.pluginClasses[pluginClass] = PluginClass;
    (player as any).__pluginData__.pluginInstances[type] = (player as any).__pluginData__.pluginInstances[type] || [];
    if (currentInstance !== -1) {
        (player as any).__pluginData__.pluginInstances[type].splice(currentInstance, 1);    
    }
    (player as any).__pluginData__.pluginInstances[type].push(pluginInstance);

    (player as any).__pluginModules = (player as any).__pluginModules || [];
    const pluginModule = pluginInstance.getPluginModuleInstance() ;
    if (pluginModule) {
        (pluginModule as any)._player = (pluginModule as any)._player || player;
        if (!(player as any).__pluginModules.find((module: PluginModule) => {
            return module.moduleName === pluginModule.moduleName
        })) {
            const name = pluginModule.moduleName;
            const version = pluginModule.moduleVersion;
            player.log.debug(`Plugin module imported: ${ name }: v${ version }`);
            (player as any).__pluginModules.push(pluginModule);
        }
    }
}

export function importSinglePlugin(player: Paella, pluginData: typeof Plugin | { plugin: typeof Plugin, config: PluginConfig }) {
    let PluginClass = null;
    let config: Partial<PluginConfig> = { enabled: true };
    if (typeof(pluginData) === "function") {
        PluginClass = pluginData;
    }
    else if (typeof(pluginData) === "object"
       && typeof(pluginData.plugin) === "function"
    ) {
        PluginClass = pluginData.plugin;
        config = pluginData.config;
    }

    if (!PluginClass) {
        player.log.warn("Error importing plugin with explicit import API. Check the 'plugins' array at init params");
    }
    else {
        const pluginInstance = createPluginInstance(PluginClass, player, null, config);
        if (!pluginInstance) {
            player.log.warn(`Unable to create an instance of the plugin ${PluginClass.name}`);
        }
        else {
            const className = pluginInstance.constructor.name;
            importPlugin(player, className, pluginInstance, PluginClass, true);
        }
    }
}

export function registerPlugins(player: Paella) {
    const config = player.config;
    (player as any).__pluginData__ = (player as any).__pluginData__ || {
        pluginClasses: [],
        pluginInstances: {}
    };

    // If the s_pluginClasses array is not empty, the plugins have already been registered
    if ((player as any).__pluginData__.pluginClasses.length !== 0) return;

    // Single plugin import. The single plugin import API has higher priority than 
    // the pluginContext API. Plugins that have been loaded with this API will not be loaded
    // with the pluginContext API.
    [
        ...paellaPlugins,
        ...player.initParams.plugins
    ].forEach(pluginData => {
            importSinglePlugin(player, pluginData);
        });

    // Button Groups
    const buttonGroups: ButtonGroupConfig[] = config.buttonGroups;
    if (buttonGroups) {
        buttonGroups.forEach((btnData,i) => {
            // Create a instance of ButtonPlugin
            const name = `button_group_${i}`;
            const instance = createPluginInstance(ButtonGroupPlugin, player, name, btnData);
            if (!instance) {
                return;
            }

            if (btnData.icon && isSvgString(btnData.icon)) {
                (instance as any)._iconPath = btnData.icon;
            }
            else if (btnData.icon && !btnData.icon.startsWith("/")) {
                (instance as any)._iconPath = joinPath([player.configResourcesUrl, btnData.icon]);
            }
            else  {
                (instance as any)._iconPath = btnData.icon;
            }
            importPlugin(player, instance.type, instance, `ButtonGroupPlugin${i}`, false);
        }) 
    }

    player.log.debug("Plugins have been registered:")
}

export function unregisterPlugins(player: Paella) {
    delete (player as any).__pluginData__;
}

export function getPluginsOfType<T extends Plugin = Plugin>(player: Paella, type: string): T[] {
    return ((player as any).__pluginData__?.pluginInstances[type] || []) as T[];
}

export async function loadPluginsOfType(
    player: Paella,
    type: string,
    onLoad?: ((plugin: Plugin) => Promise<void>) | null,
    onPreload?: ((plugin: Plugin) => Promise<boolean>) | null
): Promise<void>;

export async function loadPluginsOfType<T extends Plugin = Plugin>(
    player: Paella,
    type: string,
    onLoad?: ((plugin: T) => Promise<void>) | null,
    onPreload?: ((plugin: T) => Promise<boolean>) | null
): Promise<void>;

export async function loadPluginsOfType<T extends Plugin = Plugin>(
    player: Paella,
    type: string,
    onLoad: ((plugin: T) => Promise<void>) | null = null,
    onPreload: ((plugin: T) => Promise<boolean>) | null = null
) {
    if (!(player as any).__pluginData__.pluginInstances[type]) {
        player.log.info(`There are no defined plugins of type '${type}'`);
        return;
    }

    // Sort plugins
    (player as any).__pluginData__.pluginInstances[type].sort((a: Plugin, b: Plugin) => (a.order ?? 0) - (b.order ?? 0));
    (player as any).__pluginData__.pluginInstances[type].forEach((p: Plugin) => player.log.debug(`type: ${type}, name: ${p.name}`));

    if (typeof onPreload !== "function") {
        onPreload = async (plugin: T) => {
            return await plugin.isEnabled();
        };
    }

    for (const i in (player as any).__pluginData__.pluginInstances[type]) {
        const plugin = (player as any).__pluginData__.pluginInstances[type][i] as T;
        const enabled = await onPreload(plugin);
        if (enabled) {
            if ((plugin as any).__uiPlugin) {
                const dictionaries = await plugin.getDictionaries();
                if (typeof dictionaries === "object") {
                    for (const lang in dictionaries) {
                        const dict = (dictionaries as any)[lang];
                        player.addDictionary(lang, dict);
                    }
                }
            }

            if (typeof onLoad === "function") {
                await onLoad(plugin);
            }
            await plugin.load();
        }
    }
}

export async function unloadPluginsOfType(player: Paella, type: string) {
    for (const plugin of (player as any).__pluginData__.pluginInstances[type]) {
        await plugin.unload();
    }
}
