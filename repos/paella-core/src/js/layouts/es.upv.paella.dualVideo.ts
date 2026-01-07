import VideoLayout from '../core/VideoLayout';
import { getCookie, setCookie } from '../core/utils';
import { CanvasButtonPosition } from '../core/CanvasPlugin';
import type { Canvas } from '../core/CanvasPlugin';
import type { LayoutStructure, LayoutVideoRect } from '../core/VideoLayout';
import type { Stream } from '../core/Manifest';

import defaultIconRotate from '../../icons/icon_rotate';
import defaultIconMinimize from '../../icons/minimize-3';
import defaultIconSwitchSide from '../../icons/icon_switch_side';
import defaultIconMaximize from '../../icons/maximize';
import defaultIconClose from '../../icons/close';
import defaultIconSideBySide from '../../icons/icon_side_by_side';
import PaellaCoreLayouts from './PaellaCoreLayouts';

type DualContent = [string, string];

type DualVideoLayoutId = "side-by-side" | "pip-left" | "pip-right";

type DualVideoVideoDefinition = {
    content: string | null;
    rect: LayoutVideoRect[];
    visible: boolean;
    layer: number;
};

type DualVideoLayoutDefinition = {
    id: DualVideoLayoutId;
    videos: [DualVideoVideoDefinition, DualVideoVideoDefinition];
    buttons: [];
};

type CanvasButtonDefinition = {
    icon: string;
    tabIndex?: number;
    ariaLabel?: string;
    title?: string;
    className?: string;
    position?: 'left' | 'center' | 'right';
    click: (content?: unknown) => Promise<void> | void;
    content?: unknown;
    name?: string;
};

let layout = 0;
/**
 * in pip mode, the minimized video is de second one
 */
const layouts: DualVideoLayoutDefinition[] = [
    // First layout: side by side
    {
        id: "side-by-side",
        videos: [
            {
                content:null,
                rect:[
                    {aspectRatio:"16/9",width:560,height:315,top:218,left:712},
                    {aspectRatio:"16/10",width:560,height:350,top:206,left:712},
                    {aspectRatio:"4/3",width:560,height:420,top:173,left:712},
                    {aspectRatio:"5/3",width:560,height:336,top:206,left:712},
                    {aspectRatio:"5/4",width:560,height:448,top:160,left:712}
                ],
                visible:true,
                layer:1
            },
            {
                content:null,
                rect:[
                    {aspectRatio:"16/9",width:688,height:387,top:166,left:10},
                    {aspectRatio:"16/10",width:688,height:430,top:148,left:10},
                    {aspectRatio:"4/3",width:688,height:516,top:111,left:10},
                    {aspectRatio:"5/3",width:690,height:414,top:154,left:10},
                    {aspectRatio:"5/4",width:690,height:552,top:96,left:10}
                ],
                visible:true,
                layer:1
            }
        ],
        buttons: []
    },

    // Second layout: PIP left
    {
        id: "pip-left",
        videos:[
            {
                content:null,
                rect:[
                    {aspectRatio:"16/9",left:0,top:0,width:1280,height:720},
                    {aspectRatio:"16/10",left:64,top:0,width:1152,height:720},
                    {aspectRatio:"5/3",left:40,top:0,width:1200,height:720},
                    {aspectRatio:"5/4",left:190,top:0,width:900,height:720},
                    {aspectRatio:"4/3",left:160,top:0,width:960,height:720}
                ],
                visible:true,
                layer:1
            },
            {
                content:null,
                rect:[
                    {aspectRatio:"16/9",left:50,top:470,width:350,height:197},
                    {aspectRatio:"16/10",left:50,top:448,width:350,height:219},
                    {aspectRatio:"5/3",left:50,top:457,width:350,height:210},
                    {aspectRatio:"5/4",left:50,top:387,width:350,height:280},
                    {aspectRatio:"4/3",left:50,top:404,width:350,height:262}
                ],
                visible:true,
                layer:2
            }
        ],
        buttons: []
    },

    // Third layout: PIP right
    {
        id: "pip-right",
        videos: [
            {
                content:null,
                rect:[
                    {aspectRatio:"16/9",left:0,top:0,width:1280,height:720},
                    {aspectRatio:"16/10",left:64,top:0,width:1152,height:720},
                    {aspectRatio:"5/3",left:40,top:0,width:1200,height:720},
                    {aspectRatio:"5/4",left:190,top:0,width:900,height:720},
                    {aspectRatio:"4/3",left:160,top:0,width:960,height:720}
                ],
                visible:true,
                layer:1
            },
            {
                content:null,
                rect:[
                    {aspectRatio:"16/9",left:880,top:470,width:350,height:197},
                    {aspectRatio:"16/10",left:880,top:448,width:350,height:219},
                    {aspectRatio:"5/3",left:880,top:457,width:350,height:210},
                    {aspectRatio:"5/4",left:880,top:387,width:350,height:280},
                    {aspectRatio:"4/3",left:880,top:404,width:350,height:262}
                ],
                visible:true,
                layer:2
            }
        ],
        buttons: []
    }
];

function asDualContent(content: string[]): DualContent | null {
    return content.length === 2 ? [content[0], content[1]] : null;
}

function nextLayout(validContent: DualContent) {
    layout = (layout + 1) % layouts.length;
    return currentLayout(validContent);
}

function setLayout(validContent: DualContent, index: number) {
    layout = index < layouts.length ? index : layout;
    return currentLayout(validContent);
}

function currentLayout(validContent: DualContent): DualVideoLayoutDefinition {
    const selectedLayout: DualVideoLayoutDefinition = JSON.parse(JSON.stringify(layouts[layout]));
    selectedLayout.videos[0].content = validContent[0];
    selectedLayout.videos[1].content = validContent[1];
    return selectedLayout;
}

export default class DualVideoLayout extends VideoLayout {
    private _currentContent: DualContent | null = null;
    private _currentContentId: string | null = null;

    getPluginModuleInstance() {
        return PaellaCoreLayouts.Get();
    }

    get name() {
		return super.name || "es.upv.paella.dualVideo";
	}

    get identifier() { return "dual-video"; }

    async load() {
        let layoutIndex = getCookie('dualVideoLayoutIndex');
        if (layoutIndex !== "") {
            layout = Number(layoutIndex);
        }
        this.player.log.debug("Dual video layout loaded");
    }

    getValidStreams(streamData: Stream[]) {
        // As this is a dual stream layout plugin, we make sure that the valid streams containis
        // two streams. This prevents a bad configuration of the plugin
        return super.getValidStreams(streamData)
            .filter(stream => stream.length === 2);
    }
    
    switchContent() {
        if (!this._currentContent) {
            return;
        }
        const v0 = this._currentContent[0];
        const v1 = this._currentContent[1];
        this._currentContent[0] = v1;
        this._currentContent[1] = v0;
        
        this.player.videoContainer.updateLayout();
    }
    
    async switchMinimized() {
        if (!this._currentContent) {
            return;
        }
        nextLayout(this._currentContent);
        await this.player.videoContainer.updateLayout();
    }

    async minimizeVideo(content: string) {
        if (!this._currentContent) {
            return;
        }
        let switchLayout = true;
        if (content === this._currentContent[0]) {
            const v0 = this._currentContent[0];
            const v1 = this._currentContent[1];
            this._currentContent[0] = v1;
            this._currentContent[1] = v0;
            switchLayout = false;
        }
        if (layout === 1 && switchLayout) {
            setLayout(this._currentContent, 2);
        }
        else {
            setLayout(this._currentContent, 1);
        }
        await this.player.videoContainer.updateLayout();
    }

    async maximizeVideo(content: string) {
        if (!this._currentContent) {
            return;
        }
        let switchLayout = true;
        if (content === this._currentContent[1]) {
            const v0 = this._currentContent[0];
            const v1 = this._currentContent[1];
            this._currentContent[0] = v1;
            this._currentContent[1] = v0;
            switchLayout = false;
        }
        if (layout === 1 && switchLayout) {
            setLayout(this._currentContent, 2);
        }
        else {
            setLayout(this._currentContent, 1);
        }
        await this.player.videoContainer.updateLayout();
    }

    async setSideBySide() {
        if (!this._currentContent) {
            return;
        }
        setLayout(this._currentContent, 0);
        await this.player.videoContainer.updateLayout();
    }

    get minimizedContent() {
        // See layout structure
        if (layout === 0 || !this._currentContent) {
            return "";
        }
        else {
            return this._currentContent[1];
        }
    }

    async closeVideo(content: string) {
        const singleStreamContentIds = this.player.videoContainer.validContentIds.filter(cid => cid.indexOf("-") === -1);
        const contentId = singleStreamContentIds.find(cid => cid != content);
        if (contentId) {
            await this.player.videoContainer.setLayout(contentId);
        }
    }

    getVideoCanvasButtons(content: string, video: unknown, videoCanvas: Canvas): CanvasButtonDefinition[];
    getVideoCanvasButtons(layoutStructure: LayoutStructure, content: string, video: unknown, videoCanvas: Canvas): CanvasButtonDefinition[];
    getVideoCanvasButtons(
        layoutStructureOrContent: LayoutStructure | string,
        contentOrVideo: string | unknown,
        videoOrCanvas: unknown,
        videoCanvasMaybe?: Canvas
    ): CanvasButtonDefinition[] {
        const layoutStructure = (typeof layoutStructureOrContent === 'string') ? null : layoutStructureOrContent;
        const content = (typeof layoutStructureOrContent === 'string') ? layoutStructureOrContent : (contentOrVideo as string);
        const videoCanvas = (typeof layoutStructureOrContent === 'string') ? (videoOrCanvas as Canvas) : videoCanvasMaybe;

        if (!layoutStructure || !videoCanvas) {
            return [];
        }

        if (layoutStructure.id === "side-by-side") {
            // Buttons: swap videos and minimize
            return [
                // Swap
                {
                    icon: this.player.getCustomPluginIcon(this.name,"iconRotate") || defaultIconRotate,
                    position: CanvasButtonPosition.LEFT,
                    title: this.player.translate('Swap position of the videos'),
                    ariaLabel: this.player.translate('Swap position of the videos'),
                    name: this.name + ':iconRotate',
                    click: async () => {
                        await this.switchContent();
                    }
                },

                // Minimize
                {
                    icon: this.player.getCustomPluginIcon(this.name,"iconMaximize") || defaultIconMaximize,
                    position: CanvasButtonPosition.LEFT,
                    title: this.player.translate('Maximize video'),
                    ariaLabel: this.player.translate('Maximize video'),
                    name: this.name + ':iconMaximize',
                    click: async () => {
                        await this.maximizeVideo(content);
                    }
                },

                // Close
                {
                    icon: this.player.getCustomPluginIcon(this.name,"iconClose") || defaultIconClose,
                    position: CanvasButtonPosition.RIGHT,
                    title: this.player.translate('Close video'),
                    ariaLabel: this.player.translate('Close video'),
                    name: this.name + ':iconClose',
                    click: async () => {
                        await this.closeVideo(content);
                    }
                }
            ]
        }
        else {
            const result: CanvasButtonDefinition[] = [];

            if (content === this.minimizedContent) {
                result.push({
                    icon: this.player.getCustomPluginIcon(this.name,"iconMaximize") || defaultIconMaximize,
                    position: CanvasButtonPosition.LEFT,
                    title: this.player.translate('Maximize video'),
                    ariaLabel: this.player.translate('Maximize video'),
                    name: this.name + ':iconMaximize',
                    click: async () => {
                        await this.switchContent();
                    }
                });

                result.push({
                    icon: this.player.getCustomPluginIcon(this.name,"iconSwitchSide") || defaultIconSwitchSide,
                    position: CanvasButtonPosition.LEFT,
                    title: this.player.translate('Place the video on the other side of the screen'),
                    ariaLabel: this.player.translate('Place the video on the other side of the screen'),
                    name: this.name + ':iconSwitchSide',
                    click: async () => {
                        await this.minimizeVideo(content);
                    }
                });

                result.push({
                    icon: this.player.getCustomPluginIcon(this.name,"iconClose") || defaultIconClose,
                    position: CanvasButtonPosition.RIGHT,
                    title: this.player.translate('Close video'),
                    ariaLabel: this.player.translate('Close video'),
                    name: this.name + ':iconClose',
                    click: async () => {
                        await this.closeVideo(content);
                    }
                });
            }
            else {
                result.push({
                    icon: this.player.getCustomPluginIcon(this.name,"iconMinimize") || defaultIconMinimize,
                    position: CanvasButtonPosition.LEFT,
                    title: this.player.translate('Minimize video'),
                    ariaLabel: this.player.translate('Minimize video'),
                    name: this.name + ':iconMinimize',
                    click: async () => {
                        await this.switchContent();
                    }
                });

                result.push({
                    icon: this.player.getCustomPluginIcon(this.name,"iconSideBySide") || defaultIconSideBySide,
                    position: CanvasButtonPosition.LEFT,
                    title: this.player.translate('Put the videos side by side'),
                    ariaLabel: this.player.translate('Put the videos side by side'),
                    name: this.name + ':iconSideBySide',
                    click: async () => {
                        await this.setSideBySide();
                    }
                });

                result.push({
                    icon: this.player.getCustomPluginIcon(this.name,"iconClose") || defaultIconClose,
                    position: CanvasButtonPosition.RIGHT,
                    title: this.player.translate('Close video'),
                    ariaLabel: this.player.translate('Close video'),
                    name: this.name + ':iconClose',
                    click: async () => {
                        await this.closeVideo(content);
                    }
                });
            }
            return result;
        }
    }

    getLayoutStructure(streamData: Stream[], contentId: string) : LayoutStructure | null {
        if (!this._currentContent || this._currentContentId!==contentId) {
            const valid = this.validContent.find(vc => vc.id === contentId);
            const parsed = valid ? asDualContent(valid.content) : null;
            if (!parsed) {
                return null;
            }

            this._currentContent = parsed;
            this._currentContentId = contentId;

            const content0 = getCookie('dualVideoLayoutContent0');
            const content1 = getCookie('dualVideoLayoutContent1');
            if (content0 !== "" && content1 !== "" && 
                this._currentContent.indexOf(content0) !== -1 && 
                this._currentContent.indexOf(content1) !== -1)
            {
                this._currentContent[0] = content0;
                this._currentContent[1] = content1;
            }
        }
        if (!this._currentContent) {
            return null;
        }

        const selectedLayout = currentLayout(this._currentContent);

        const result: LayoutStructure & { player: unknown } = {
            id: selectedLayout.id,
            player: this.player,
            name:{es:"Dos streams con posición dinámica"},
            hidden:false,
            videos: selectedLayout.videos,
            buttons: []
        };

        // Save layout settings
        setCookie("dualVideoLayoutIndex", String(layout));
        setCookie("dualVideoLayoutContent0", this._currentContent[0]);
        setCookie("dualVideoLayoutContent1", this._currentContent[1]);
        
        return result;
    }
}
