
import VideoLayout from '../core/VideoLayout';

import { CanvasButtonPosition } from '../core/CanvasPlugin';
import type { Canvas } from '../core/CanvasPlugin';
import PaellaCoreLayouts from './PaellaCoreLayouts';
import type { LayoutStructure, LayoutVideoRect } from '../core/VideoLayout';
import type { Stream } from '../core/Manifest';

import defaultIconRotate from '../../icons/icon_switch_side';
import defaultIconMaximize from '../../icons/maximize';
import defaultIconClose from '../../icons/close';
import defaultIconSideBySide from '../../icons/icon_side_by_side';
import defaultIconPiP from '../../icons/icon_pip';

import "../../css/pip-layout.css";

type DynamicVideoState = {
    id: string;
    size: number;
};

type DynamicDualContent = [DynamicVideoState, DynamicVideoState];

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

const mainSize = 100;
const pipSize = 30;
function asDynamicDualContent(content: string[]): DynamicDualContent | null {
    console.log(content);
    return content.length === 2
        ? [{ id: content[0], size: mainSize }, { id: content[1], size: pipSize }]
        : null;
}

export default class DualVideoPiPDynamicLayout extends VideoLayout {
    private _currentContent: DynamicDualContent | null = null;
    private _pipPosition: 'left' | 'right' = 'left';

    getPluginModuleInstance() {
        return PaellaCoreLayouts.Get();
    }

    get name() {
        return super.name || "es.upv.paella.dualVideoPiPDynamic";
    }

    get layoutType() {
        return "dynamic";
    }

    async load() {
        
    }

    getVideoCanvasButtons(content: string, video: unknown, videoCanvas: Canvas): CanvasButtonDefinition[];
    getVideoCanvasButtons(layoutStructure: LayoutStructure, content: string, video: unknown, videoCanvas: Canvas): CanvasButtonDefinition[];
    getVideoCanvasButtons(
        layoutStructureOrContent: LayoutStructure | string,
        contentOrVideo: string | unknown,
        videoOrCanvas: unknown,
        videoCanvasMaybe?: Canvas
    ): CanvasButtonDefinition[] {
        const result: CanvasButtonDefinition[] = [];
        if (!this._currentContent) {
            return result;
        }

        const iconMaximize = this.player.getCustomPluginIcon(this.name,"iconMaximize") || defaultIconMaximize;
        const iconSideBySide = this.player.getCustomPluginIcon(this.name,"iconSideBySide") || defaultIconSideBySide;
        const iconSwitchSide = this.player.getCustomPluginIcon(this.name,"iconSwitchSide") || defaultIconRotate;
        const iconClose = this.player.getCustomPluginIcon(this.name,"iconClose") || defaultIconClose;
        const iconPiP = this.player.getCustomPluginIcon(this.name,"iconPiP") || defaultIconPiP;

        if (this._currentContent[0]?.id === contentOrVideo) {
            // Main video
            result.push({
                icon: iconPiP,
                position: CanvasButtonPosition.LEFT,
                title: this.player.translate("Minimize to PiP"),
                ariaLabel: this.player.translate("Minimize to PiP"),
                name: this.name + ":iconPiP",
                click: async () => {
                    const main = this._currentContent![0];
                    const pip = this._currentContent![1];
                    this._currentContent![0] = pip;
                    this._currentContent![1] = main;
                    await this.player.videoContainer?.updateLayout();
                }
            })
        }
        else {
            // PIP video
            result.push({
                icon: iconSwitchSide,
                position: CanvasButtonPosition.LEFT,
                title: this.player.translate("Switch side"),
                ariaLabel: this.player.translate("Switch side"),
                name: this.name + ":iconSwitchSide",
                click: async () => {
                    this._pipPosition = this._pipPosition === 'left' ? 'right' : 'left';
                    await this.player.videoContainer?.updateLayout();
                }
            })
        }
        return result;
    }

    getValidStreams(streamData: Stream[]) {
        return super.getValidStreams(streamData)
            .filter(stream => stream.length === 2);
    }

    getLayoutStructure(streamData: Stream[], contentId: string, mainContent: string | null = null): LayoutStructure | null {
        if (!this._currentContent) {
            const valid = this.validContent.find(vc => vc.id === contentId);
            const parsed = valid ? asDynamicDualContent(valid.content) : null;
            if (!parsed) {
                return null;
            }
            this._currentContent = parsed;
        }

        const pipClassName = `pip-${this._pipPosition}`;
        return {
            type: "legacy",
            id: "dual-pip-dynamic",
            name: { es: "Dos streams picture in picture" },
            hidden: false,
            videos: [
                {
                    content: this._currentContent[0].id,
                    rect: [] as LayoutVideoRect[],
                    visible: true,
                    size: mainSize,
                    className: ["main-video"]
                },
                {
                    content: this._currentContent[1].id,
                    rect: [] as LayoutVideoRect[],
                    visible: true,
                    size: pipSize,
                    className: ["secondary-video", pipClassName],
                    positionControl: "css"
                }
            ],
            buttons: []
        };
    }
}