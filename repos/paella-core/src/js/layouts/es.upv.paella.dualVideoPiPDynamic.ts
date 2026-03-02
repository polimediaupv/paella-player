
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

function asDynamicDualContent(content: string[]): DynamicDualContent | null {
    return content.length === 2
        ? [{ id: content[0], size: 100 }, { id: content[1], size: 20 }]
        : null;
}

export default class DualVideoPiPDynamicLayout extends VideoLayout {
    private _currentContent: DynamicDualContent | null = null;

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
        return [];
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

        const pipPosition = "left";
        const pipClassName = pipPosition === "left" ? "pip-left" : "pip-right";

        return {
            id: "dual-pip-dynamic",
            name: { es: "Dos streams picture in picture" },
            hidden: false,
            videos: [
                {
                    content: this._currentContent[0].id,
                    rect: [] as LayoutVideoRect[],
                    visible: true,
                    size: this._currentContent[0].size,
                    className: ["main-video"]
                },
                {
                    content: this._currentContent[1].id,
                    rect: [] as LayoutVideoRect[],
                    visible: true,
                    size: this._currentContent[1].size,
                    className: ["secondary-video", pipClassName],
                    positionControl: "css"
                }
            ],
            buttons: []
        };
    }
}