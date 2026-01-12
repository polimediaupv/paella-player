
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
        ? [{ id: content[0], size: 50 }, { id: content[1], size: 50 }]
        : null;
}

export default class DualVideoDynamicLayout extends VideoLayout {
    private pipContentIds: string[] = [];
    private allowSwitchSide: boolean = true;
    private _currentContent: DynamicDualContent | null = null;

    getPluginModuleInstance() {
        return PaellaCoreLayouts.Get();
    }

    get name() {
		return super.name || "es.upv.paella.dualVideoDynamic";
	}

    get layoutType() {
        return "dynamic";
    }

    async load() {
        const cfg = (this.config as any) ?? {};
        this.pipContentIds = cfg.pipContentIds || [];
        this.allowSwitchSide = cfg.allowSwitchSide !== undefined ? cfg.allowSwitchSide : true;
    }

    getVideoCanvasButtons(content: string, video: unknown, videoCanvas: Canvas): CanvasButtonDefinition[];
    getVideoCanvasButtons(layoutStructure: LayoutStructure, content: string, video: unknown, videoCanvas: Canvas): CanvasButtonDefinition[];
    getVideoCanvasButtons(
        layoutStructureOrContent: LayoutStructure | string,
        contentOrVideo: string | unknown,
        videoOrCanvas: unknown,
        videoCanvasMaybe?: Canvas
    ): CanvasButtonDefinition[] {
        const content = (typeof layoutStructureOrContent === 'string')
            ? layoutStructureOrContent
            : (contentOrVideo as string);
        const videoCanvas = (typeof layoutStructureOrContent === 'string')
            ? (videoOrCanvas as Canvas)
            : videoCanvasMaybe;

        if (!videoCanvas) {
            return [];
        }

        const iconMaximize = this.player.getCustomPluginIcon(this.name,"iconMaximize") || defaultIconMaximize;
        const iconSideBySide = this.player.getCustomPluginIcon(this.name,"iconSideBySide") || defaultIconSideBySide;
        const iconSwitchSide = this.player.getCustomPluginIcon(this.name,"iconSwitchSide") || defaultIconRotate;
        const iconClose = this.player.getCustomPluginIcon(this.name,"iconClose") || defaultIconClose;
        const iconPiP = this.player.getCustomPluginIcon(this.name,"iconPiP") || defaultIconPiP;

        if (!this._currentContent) {
            return [];
        }

        const layoutData = () => this._currentContent?.find(lo => lo.id === content);
        const isMinimized = () => (layoutData()?.size ?? 50) === 25;
        const isMaximized = () => (layoutData()?.size ?? 50) > 50;
        const result: CanvasButtonDefinition[] = [];

        if (isMinimized() || isMaximized()) {
            result.push({
                icon: iconSideBySide,
                position: CanvasButtonPosition.LEFT,
                title: this.player.translate('Dual stream 50%'),
                ariaLabel: this.player.translate('Dual stream 50%'),
                name: this.name + ':iconSideBySide',
                click: async () => {
                    this._currentContent?.forEach(lo => {
                        lo.size = 50;
                    });
                    await this.player.videoContainer?.updateLayout();
                }
            });
        }
        else {
            result.push({
                icon: iconMaximize,
                position: CanvasButtonPosition.LEFT,
                title: this.player.translate('Maximize video'),
                ariaLabel: this.player.translate('Maximize video'),
                name: this.name + ':iconMaximize',
                click: async () => {
                    this._currentContent?.forEach(lo => {
                        lo.size = lo.id === content ? 75 : 25;
                    });
                    await this.player.videoContainer?.updateLayout();
                }
            });
        }

        if (this.allowSwitchSide) {        
            result.push({
                icon: iconSwitchSide,
                position: CanvasButtonPosition.LEFT,
                title: this.player.translate('Switch side'),
                ariaLabel: this.player.translate('Switch side'),
                name: this.name + ':iconSwitchSide',
                click: async () => {
                    if (!this._currentContent) {
                        return;
                    }
                    const ct1 = this._currentContent[0].id;
                    const ct2 = this._currentContent[1].id;
                    const ct1Size = this._currentContent[0].size;
                    const ct2Size = this._currentContent[1].size;
                    this._currentContent[0].id = ct2;
                    this._currentContent[0].size = ct2Size;
                    this._currentContent[1].id = ct1;
                    this._currentContent[1].size = ct1Size;
                    await this.player.videoContainer?.updateLayout();
                }
            });
        }

        result.push({
            icon: iconClose,
            position: CanvasButtonPosition.RIGHT,
            title: this.player.translate("Close video"),
            ariaLabel: this.player.translate("Close video"),
            name: this.name + ':iconClose',
            click: async () => {
                const singleStreamContentIds = this.player.videoContainer?.validContentIds.filter(cid => cid.indexOf("-") === -1);
                const contentId = singleStreamContentIds?.find(cid => cid != content);
                if (contentId) {
                    await this.player.videoContainer?.setLayout(contentId);
                }
            }
        });

        if (this.pipContentIds.length > 0) {
            result.push({
                icon: iconPiP,
                position: CanvasButtonPosition.LEFT,
                title: this.player.translate("Picture-in-picture"),
                ariaLabel: this.player.translate("Picture-in-picture"),
                name: this.name + ':iconPiP',
                click: async () => {
                    const contentId = this.player.videoContainer?.validContentIds.find(cid => this.pipContentIds.indexOf(cid) !== -1);
                    if (contentId) {
                        await this.player.videoContainer?.setLayout(contentId,content);
                    }
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

        return {
            id: "dual-dynamic",
            name: { es: "Dos streams con posición dinámica" },
            hidden: false,
            videos: [
                {
                    content: this._currentContent[0].id,
                    rect: [] as LayoutVideoRect[],
                    visible: true,
                    size: this._currentContent[0].size
                },
                {
                    content: this._currentContent[1].id,
                    rect: [] as LayoutVideoRect[],
                    visible: true,
                    size: this._currentContent[1].size
                }
            ],
            buttons: []
        };
    }
}