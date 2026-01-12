import UserInterfacePlugin from "./UserInterfacePlugin";
import { Canvas, CanvasButtonPosition } from "./CanvasPlugin";
import { loadPluginsOfType } from "./plugin_tools";
import Paella from "../Paella";

export function getNextTabIndex(player: Paella) {
	(player as any).__tabIndex = (player as any).__tabIndex || 0;
	++(player as any).__tabIndex;
	return (player as any).__tabIndex;
}

export function getCurrentTabIndex(player: Paella) {
	return (player as any).__tabIndex || 0;
}

export function getCanvasButtonPlugin(plugin: CanvasButtonPlugin) {
    return {
        icon: plugin.icon,
        position: plugin.position,
        title: plugin.description,
        ariaLabel: plugin.ariaLabel,
        name: plugin.buttonName,
        click: async (content: any) => {
            const streams = plugin.player.videoContainer?.streamProvider.streams;
            if (!streams) return;
            const stream = plugin.player.videoContainer?.streamProvider.streams[content];
            await plugin.action(content, stream?.player, stream?.canvas, stream?.canvasPlugin);
        }
    }
}

export async function getCanvasButtons(player: Paella, video: any) : Promise<any[]> {
    const result: CanvasButtonPlugin[] = [];
    await loadPluginsOfType<CanvasButtonPlugin>(player, "canvasButton",
        async (plugin) => {
            player.log.debug(` Canvas button plugin: ${ plugin.name }`);
            result.push(plugin);
        });

    return result.filter(plugin => {
            // TODO: check if this is working
            return plugin.content.indexOf(video.content) !== -1;
        })
        .map(plugin => {
            return getCanvasButtonPlugin(plugin);
        })
}

export type CanvasButtonSide = "left" | "center" | "right";

export default class CanvasButtonPlugin extends UserInterfacePlugin {
    get type() { return "canvasButton" }

    get content() {
        return (this as any)._config.content || ["presenter"];
    }

    get ariaLabel() {
        return (this as any)._config.ariaLabel || this.getAriaLabel();
    }

    getAriaLabel() {
        return "";
    }

    isCompatible(stream: string) {
        return false;
    }

    get tabIndex() {
        return this.config.tabIndex;
    }
    
    get description() {
        return this.config.description || this.getDescription();
    }

    getDescription() {
        return "";
    }

    get icon() {
        return (this as any)._icon;
    }

    set icon(icon) {
        (this as any)._icon = icon;
    }

    get side() : CanvasButtonSide {
        return this.config?.side || "left";
    }

    get buttonName() {
        return this.name;   // By default, the button "name" property is the plugin identifier name
    }

    get position() {
        switch (this.side) {
        case 'left':
            return CanvasButtonPosition.LEFT;
        case 'center':
            return CanvasButtonPosition.CENTER;
        case 'right':
            return CanvasButtonPosition.RIGHT;
        default:
            throw new Error(`Invalid CanvasButtonPlugin side set: ${ this.side }`);
        }
    }

    get targetContent() : string | null {
        // This property is set by the VideoContainer when video layout is loaded
        return (this as any)._targetContent;
    }

    get button() : HTMLElement | null {
        // This property is set by the VideoContainer when video layout is loaded
        return (this as any)._button;
    }

    async action(content: any, player: Paella, canvas: Canvas, canvasPlugin: Plugin) {
        this.player.log.warn(`Action not implemented in canvas button plugin ${ this.name }`);
    }
}