import VideoLayout from '../core/VideoLayout';

import { CanvasButtonPosition } from '../core/CanvasPlugin';
import type { Canvas } from '../core/CanvasPlugin';
import type { LayoutStructure, LayoutVideoRect } from '../core/VideoLayout';
import type { Stream } from '../core/Manifest';

import defaultIconSideBySide from '../../icons/icon_side_by_side';

import PaellaCoreLayouts from './PaellaCoreLayouts';

type DynamicVideoState = {
    id: string;
    size: number;
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

const DEFAULT_DUAL_VIDEO_CONTENT_IDS: string[] = [
    'presenter-presentation-dynamic',
    'presenter-2-presentation-dynamic',
    'presenter-presenter-2-dynamic',
    'presenter-presentation',
    'presenter-2-presentation',
    'presenter-presenter-2'
];

export default class SingleVideoDynamicLayout extends VideoLayout {
    private dualVideoContentIds: string[] = DEFAULT_DUAL_VIDEO_CONTENT_IDS;
    private _multiStream: boolean = false;
    private _currentContent: DynamicVideoState[] = [];

    getPluginModuleInstance() {
        return PaellaCoreLayouts.Get();
    }

    get name() {
		return super.name || 'es.upv.paella.singleVideoDynamic';
	}

    get layoutType() {
        return 'dynamic';
    }

    async load() {
        this.player.log.debug('Single video dynamic layout loaded');
        const cfg = (this.config as any) ?? {};
        this.dualVideoContentIds = cfg.dualVideoContentIds || DEFAULT_DUAL_VIDEO_CONTENT_IDS;
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

        const iconSideBySide = this.player.getCustomPluginIcon(this.name,'iconSideBySide') || defaultIconSideBySide;

        const result: CanvasButtonDefinition[] = [];
        if (this._multiStream) {
            result.push({
                icon: iconSideBySide,
                position: CanvasButtonPosition.LEFT,
                title: this.player.translate('Dual stream 50%'),
                ariaLabel: this.player.translate('Dual stream 50%'),
                name: this.name + ':iconSideBySide',
                click: async () => {
                    const availableContentIds = this.player.videoContainer?.validContentIds;
                    const dualVideoContentId = this.dualVideoContentIds.find(id => availableContentIds?.indexOf(id) !== -1);
                    if (dualVideoContentId) {
                        this.player.videoContainer?.setLayout(dualVideoContentId);
                    }
                }
            });
        }
        return result;
    }

    getLayoutStructure(streamData: Stream[], contentId: string, mainContent: string | null = null): LayoutStructure | null {
        if (streamData.length > 1) {
            this._multiStream = true;
        }

        const valid = this.validContent.find(vc => vc.id === contentId);
        const firstContentId = valid?.content?.[0];
        if (!firstContentId) {
            return null;
        }

        this._currentContent = valid.content.map((c: string) => ({
            id: c,
            size: 50
        }));

        return {
            id: 'single-dynamic',
            name: { es: 'One stream' },
            hidden: false,
            videos: [
                {
                    content: this._currentContent[0].id,
                    rect: [] as LayoutVideoRect[],
                    visible: true,
                    size: this._currentContent[0].size
                }
            ],
            buttons: []
        };
    }
}
