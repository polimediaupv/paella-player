import VideoLayout from "../core/VideoLayout";
import type { LayoutStructure, LayoutVideoRect } from "../core/VideoLayout";
import type { Stream } from "../core/Manifest";

import defaultIconSwitchSide from '../../icons/icon_switch_side';
import defaultIconMaximize from '../../icons/maximize';
import defaultIconClose from '../../icons/close';
import defaultIconSideBySide from '../../icons/icon_side_by_side';
import { CanvasButtonPosition } from "../core/CanvasPlugin";
import type { Canvas } from "../core/CanvasPlugin";

import PaellaCoreLayouts from "./PaellaCoreLayouts";

type DualContent = [string, string];

type PipLayoutId = 'pip-left' | 'pip-right';

type PipLayoutDefinition = Omit<LayoutStructure, 'id' | 'videos' | 'buttons'> & {
    id: PipLayoutId;
    videos: [
        {
            content: string | null;
            rect: LayoutVideoRect[];
            visible: boolean;
            layer: number;
        },
        {
            content: string | null;
            rect: LayoutVideoRect[];
            visible: boolean;
            layer: number;
        }
    ];
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

function asDualContent(content: string[]): DualContent | null {
    return content.length === 2 ? [content[0], content[1]] : null;
}

const pipLeft: PipLayoutDefinition = {
    id: 'pip-left',
    name: {es: "Dos streams imagen dentro de imagen"},
    hidden: false,
    videos: [
        {
            content: null,
            rect:[
                {aspectRatio:"16/9",left:0,top:0,width:1280,height:720},
                {aspectRatio:"16/10",left:64,top:0,width:1152,height:720},
                {aspectRatio:"5/3",left:40,top:0,width:1200,height:720},
                {aspectRatio:"5/4",left:190,top:0,width:900,height:720},
                {aspectRatio:"4/3",left:160,top:0,width:960,height:720},
                {aspectRatio:"9/16",left:617,top:17,width:386,height:687}
            ],
            visible:true,
            layer:1
        },
        {
            content: null,
            rect:[
                {aspectRatio:"16/9",left:50,top:470,width:350,height:197},
                {aspectRatio:"16/10",left:50,top:448,width:350,height:219},
                {aspectRatio:"5/3",left:50,top:457,width:350,height:210},
                {aspectRatio:"5/4",left:50,top:387,width:350,height:280},
                {aspectRatio:"4/3",left:50,top:404,width:350,height:262},
                {aspectRatio:"9/16",left:224,top:301,width:224,height:400}
            ],
            visible:true,
            layer:2
        }
    ],
    buttons: []
};

const pipRight: PipLayoutDefinition = {
    id: "pip-right",
    name: {es: "Dos streams imagen dentro de imagen a la derecha"},
    hidden: false,
    videos: [
        {
            content:null,
            rect:[
                {aspectRatio:"16/9",left:0,top:0,width:1280,height:720},
                {aspectRatio:"16/10",left:64,top:0,width:1152,height:720},
                {aspectRatio:"5/3",left:40,top:0,width:1200,height:720},
                {aspectRatio:"5/4",left:190,top:0,width:900,height:720},
                {aspectRatio:"4/3",left:160,top:0,width:960,height:720},
                {aspectRatio:"9/16",left:242,top:17,width:386,height:687}
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
                {aspectRatio:"4/3",left:880,top:404,width:350,height:262},
                {aspectRatio:"9/16",left:887,top:304,width:224,height:400}
            ],
            visible:true,
            layer:2
        }
    ],
    buttons: []
};

export default class DualVideoPiPLayout extends VideoLayout {
    private _currentLayout: PipLayoutDefinition = pipLeft;
    private dualVideoContentIds: string[] = [];
    private _pipVideo: string | null = null;
    private _fullVideo: string | null = null;

    getPluginModuleInstance() {
        return PaellaCoreLayouts.Get();
    }
    
    get name() {
		return super.name || "es.upv.paella.dualVideoPiP";
	}

    get identifier() { return "dual-video-pip"; }

    async load() {
        this._currentLayout = pipLeft;
        const cfg = (this.config as any) ?? {};
        this.dualVideoContentIds = cfg.dualVideoContentIds || [];
    }

    getValidStreams(streamData: Stream[]) {
        return super.getValidStreams(streamData)
            .filter(stream => stream.length === 2);
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

        const iconClose = this.player.getCustomPluginIcon(this.name, "iconClose") || defaultIconClose;
        const iconSwitchSide = this.player.getCustomPluginIcon(this.name, "iconSwitchSide") || defaultIconSwitchSide;
        const iconMaximize = this.player.getCustomPluginIcon(this.name, "iconMaximize") || defaultIconMaximize;
        const iconSideBySide = this.player.getCustomPluginIcon(this.name, "iconSideBySide") || defaultIconSideBySide;
        const result: CanvasButtonDefinition[] = [
            {
                icon: iconClose,
                position: CanvasButtonPosition.RIGHT,
                title: this.player.translate("Close video"),
                ariaLabel: this.player.translate("Close video"),
                name: this.name + ':iconClose',
                click: async () => {
                    const singleStreamContentIds = this.player.videoContainer.validContentIds.filter(cid => cid.indexOf("-") === -1);
                    const contentId = singleStreamContentIds.find(cid => cid !== content);
                    if (contentId) {
                        await this.player.videoContainer.setLayout(contentId);
                    }
                }
            }
        ];
        if (content === this._pipVideo) {
            result.push({
                icon: iconSwitchSide,
                position: CanvasButtonPosition.LEFT,
                title: this.player.translate("Switch side"),
                ariaLabel: this.player.translate("Switch side"),
                name: this.name + ':iconSwitchSide',
                click: async () => {
                    this.switchSide();
                    await this.player.videoContainer.updateLayout(this._fullVideo || undefined);
                }
            });

            result.push({
                icon: iconMaximize,
                position: CanvasButtonPosition.LEFT,
                title: this.player.translate("Maximize video"),
                ariaLabel: this.player.translate("Maximize video"),
                name: this.name + ':iconMaximize',
                click: async () => {
                    this.switchSources();
                    await this.player.videoContainer.updateLayout(this._fullVideo || undefined);
                }
            })
        }
        else if (this.dualVideoContentIds.length > 0) {
            result.push({
                icon: iconSideBySide,
                position: CanvasButtonPosition.LEFT,
                title: this.player.translate("Set side by side"),
                ariaLabel: this.player.translate("Set side by side"),
                name: this.name + ':iconSideBySide',
                click: async () => {
                    const availableContentIds = this.player.videoContainer.validContentIds;
                    const dualVideoContentId = this.dualVideoContentIds.find(id => {
                        return availableContentIds.indexOf(id) !== -1;
                    });
                    if (dualVideoContentId) {
                        this.player.videoContainer.setLayout(dualVideoContentId);
                    }
                }
            })
        }
        return result;
    }

    switchSide() {
        if (this._currentLayout.id === 'pip-left') {
            this._currentLayout = pipRight;
        }
        else {
            this._currentLayout = pipLeft;
        }
    }

    switchSources() {
        const tmp = this._pipVideo;
        this._pipVideo = this._fullVideo;
        this._fullVideo = tmp;
    }

    getLayoutStructure(streamData: Stream[], contentId: string, mainContent: string | null = null) {
        const valid = this.validContent.find(vc => vc.id === contentId);
        const parsed = valid ? asDualContent(valid.content) : null;
        if (!parsed) {
            return null;
        }

        const content: DualContent = parsed;

        if (mainContent && content.find(c => c === mainContent)) {
            this._fullVideo = mainContent;
            this._pipVideo = content.find(c => c !== mainContent) || null;
        }
        else if (!this._pipVideo || !this._fullVideo) {
            this._pipVideo = content[0];
            this._fullVideo = content[1];
        }

        const result: PipLayoutDefinition & { player?: unknown } = JSON.parse(JSON.stringify(this._currentLayout));

        result.player = this.player;
        result.videos[0].content = this._fullVideo;
        result.videos[1].content = this._pipVideo;

        return result;
    }
}

