
import { getPluginsOfType } from './plugin_tools';
import UserInterfacePlugin from "./UserInterfacePlugin";
import Paella from '../Paella';
import { type VideoLayaoutValidContent } from './Config';
import { Canvas } from './CanvasPlugin';
import { type Stream } from './Manifest';

export function getValidLayouts(player: Paella, streamData: any) : VideoLayout[] {
    // Find the valid layouts that matches the streamData content
    const result = getPluginsOfType(player, "layout")
        .filter(layout => layout.config &&
            layout.config.enabled &&
            layout instanceof VideoLayout &&
            layout.canApply(streamData)
        );
    return result as VideoLayout[];
}

export function getLayoutWithId(player: Paella, layoutId: string) {
    const result = getPluginsOfType(player, "layout");
    result.find(layout => {
        if (layout instanceof VideoLayout) {
            return layout.identifier === layoutId;
        }
    });
    return result;

}

export function getValidContentIds(player: Paella, streamData: any) {
    const validLayouts = getValidLayouts(player, streamData);
    const result: string[] = [];
    validLayouts.forEach(lo => {
        result.push(...lo.getValidContentIds(streamData));
    });
    return result;
}

// Return the available content ids from configuration for the provided number of streams
export function getAvailableContentIds(player: Paella, numberOfStreams: number) : string[] {
    const result: string[] = [];
    getPluginsOfType(player, "layout")
        .filter(layout => {
            if (layout.config?.enabled && layout.config?.validContent) {
                return layout.config.validContent.every((cntItem: any) => cntItem.content.length === numberOfStreams);
            }
        })
        .forEach(layout => layout.config.validContent?.forEach((c: any) => result.push(c.content)));
    return result;
}

export function getLayoutWithContentId(player: Paella, streamData: any, contentId: string) : VideoLayout | null {
    const layouts = getValidLayouts(player, streamData);
    let result = null;
    layouts.some(layout => {
        if (layout.getValidContentIds(streamData).indexOf(contentId) !== -1) {
            result = layout;
            return true;
        }
    });
    return result;
}

export type LayoutRect = {
    left: number
    top: number
    width: number
    height: number
}

export type LayoutButton = {
    label?: string | null
    icon?: string | null
    layer?: number | null
    onClick: () => void
    rect: LayoutRect
    ariaLabel?: string | null
    title?: string | null
    name?: string | null
}

export type LayoutVideoRect = LayoutRect & {
    aspectRatio: string
}

export type LayoutStructure = {
    id: string
    player?: Paella
    hidden?: boolean
    name: string | Record<string, string>
    videos: {
        content: string | null
        rect: LayoutVideoRect[]
        visible?: boolean | null
        layer?: number | null
        size?: number | null
    }[],
    buttons: LayoutButton[]
    background?: {
        content?: string
        zIndex?: number
        rect: LayoutRect
        visible?: boolean
        layer?: number
    }
    logos?: {
        content: string
        zIndex: number
        rect: LayoutRect
    }[]
    onApply?: () => void
    plugin?: VideoLayout
}

export function getValidContentSettings(player: Paella, streamData: any,) {
    const validLayouts = getValidLayouts(player, streamData);
    const validIds = getValidContentIds(player, streamData)
    let result: VideoLayaoutValidContent[] = []
    validLayouts.forEach(lo => {
        result = [
            ...result,
            ...(lo.config.validContent || [])
        ];
    });
    
    return result.filter(cfg => {
        return validIds.indexOf(cfg.id) !== -1
    });
}

export function getLayoutStructure(player: Paella, streamData: any, contentId: string, mainContent: string | null = null) : LayoutStructure | null {
    const selectedLayout = getLayoutWithContentId(player, streamData, contentId);
    if (selectedLayout) {
        const structure = selectedLayout.getLayoutStructure(streamData, contentId, mainContent);
        if (structure) {
            structure.plugin = selectedLayout;
        }
        return structure;
    }
    return null;
}

export default class VideoLayout extends UserInterfacePlugin {
    
    get type() { return "layout"; }

    get layoutType() {
        return "static";    // or "dynamic"
    }

    getTabIndexStart() {
        return 10;
    }

    get tabIndexStart() {
        return this.config?.tabIndexStart || this.getTabIndexStart();
    }

    // Return the layout identifier, for example, presenter-presentation
    get identifier() { return "default"; }

    get icon() { return "icon.png"; }

    // Return the array of valid content in the configuration of the plugin
    get validContent(): VideoLayaoutValidContent[] {
        return this.config?.validContent || [];
    }

    get validContentIds() {
        return this.validContent.map(c => c.id);
    }

    // Gets the valid content ids that matches the streamData
    getValidContentIds(streamData: Stream[]): string[] {
        const contentIds: string[] = [];
        this.validContent.forEach(validContent => {
            if (validContent.content.every(c => {
                return streamData.some((sd: Stream) => c === sd.content)
            })) {
                contentIds.push(validContent.id);
            }
        });

        return contentIds;
    }

    // Get the valid stream data combination, according to the plugin configuration
    // The result of this function must be an array of arrays with all the possible
    // combinations. For example, for a dual stream layout and three elements in
    // streamData that matches the valid content, the resulting valid streams must be:
    // [
    //      [streamA, streamB],
    //      [streamA, streamC],
    //      [streamC, streamB]   
    // ]
    getValidStreams(streamData: Stream[]) {
        const validStreams: Stream[][] = [];
        this.validContent.forEach(validContent => {
            let validStreamCombination: Stream[] = [];
            if (validContent.content.every(c => {
                return streamData.some((sd: Stream) => {
                    if (c === sd.content) {
                        validStreamCombination.push(sd);
                        return true;
                    }
                })
            })) {
                validStreams.push(validStreamCombination);
            }
        });

        return validStreams;
    }

    canApply(streamData: Stream[]) {
        return this.getValidStreams(streamData).length > 0;
    }

    getLayoutStructure(streamData: Stream[], contentId: string, mainContent: string | null = null) : LayoutStructure | null {
        return null;
    }

    // Add buttons to videos
    // [
    //      icon    (required)
    //      click   (required)
    //      tabIndex
    //      ariaLabel
    //      title
    //      className
    //      position (CanvasButtonPosition.LEFT, CanvasButtonPosition.CENTER, CanvasButtonPosition.RIGHT)
    //]
    getVideoCanvasButtons(content: string, video: any, videoCanvas: Canvas): any[] {
        return []
    }
}
