import { CanvasButtonPosition } from '../core/CanvasPlugin';
import type { Canvas } from '../core/CanvasPlugin';
import type { LayoutStructure } from '../core/VideoLayout';
import type { Stream } from '../core/Manifest';

import VideoLayout from '../core/VideoLayout';

import sideBySideIcon from '../../icons/icon_side_by_side';

import PaellaCoreLayouts from './PaellaCoreLayouts';

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

export default class SingleVideoLayout extends VideoLayout {
    private dualVideoContentIds: string[] = DEFAULT_DUAL_VIDEO_CONTENT_IDS;
    private _multiStream: boolean = false;

    getPluginModuleInstance() {
        return PaellaCoreLayouts.Get();
    }

    get name() {
		return super.name || 'es.upv.paella.singleVideo';
	}

    get identifier() { return 'single-video'; }

    async load() {
        this.player.log.debug('Single video layout loaded');
        const cfg = (this.config as any) ?? {};
        this.dualVideoContentIds = cfg.dualVideoContentIds || DEFAULT_DUAL_VIDEO_CONTENT_IDS;
    }

    getValidStreams(streamData: Stream[]) {
        return super.getValidStreams(streamData)
            .filter(stream => stream.length === 1);
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
        const videoCanvas = (typeof layoutStructureOrContent === 'string') ? (videoOrCanvas as Canvas) : videoCanvasMaybe;

        if (!layoutStructure || !videoCanvas) {
            return [];
        }

        if (!this._multiStream) {
            return [];
        }

        return [
            {
                icon: this.player.getCustomPluginIcon(this.name, 'iconSideBySide') || sideBySideIcon,
                position: CanvasButtonPosition.LEFT,
                title: this.player.translate('Two videos 50%'),
                ariaLabel: this.player.translate('Two videos 50%'),
                name: this.name + ':iconSideBySide',
                click: () => {
                    const availableContentIds = this.player.videoContainer?.validContentIds;
                    const dualVideoContentId = this.dualVideoContentIds.find(id => availableContentIds?.indexOf(id) !== -1);
                    if (dualVideoContentId) {
                        this.player.videoContainer?.setLayout(dualVideoContentId);
                    }
                }
            }
        ];
    }

    getLayoutStructure(streamData: Stream[], contentId: string) : LayoutStructure | null {
        const valid = this.validContent.find(c => c.id === contentId);
        const streamContent = valid?.content?.[0];
        if (!streamContent) {
            return null;
        }

        if (streamData.length > 1) {
            this._multiStream = true;
        }

        return {
            id: 'single-video',
            player: this.player,
            name: { es: 'One stream' },
            hidden: false,
            videos: [
                {
                    content: streamContent,
                    rect: [
                        { aspectRatio: '1/1', left: 280, top: 0, width: 720, height: 720 },
                        { aspectRatio: '6/5', left: 208, top: 0, width: 864, height: 720 },
                        { aspectRatio: '5/4', left: 190, top: 0, width: 900, height: 720 },
                        { aspectRatio: '4/3', left: 160, top: 0, width: 960, height: 720 },
                        { aspectRatio: '11/8', left: 145, top: 0, width: 990, height: 720 },
                        { aspectRatio: '1.41/1', left: 132, top: 0, width: 1015, height: 720 },
                        { aspectRatio: '1.43/1', left: 125, top: 0, width: 1029, height: 720 },
                        { aspectRatio: '3/2', left: 100, top: 0, width: 1080, height: 720 },
                        { aspectRatio: '16/10', left: 64, top: 0, width: 1152, height: 720 },
                        { aspectRatio: '5/3', left: 40, top: 0, width: 1200, height: 720 },
                        { aspectRatio: '16/9', left: 0, top: 0, width: 1280, height: 720 },
                        { aspectRatio: '1.85/1', left: 0, top: 14, width: 1280, height: 692 },
                        { aspectRatio: '2.35/1', left: 0, top: 87, width: 1280, height: 544 },
                        { aspectRatio: '2.41/1', left: 0, top: 94, width: 1280, height: 531 },
                        { aspectRatio: '2.76/1', left: 0, top: 128, width: 1280, height: 463 }
                    ],
                    visible: true,
                    layer: 1
                }
            ],
            background: {
                content: 'slide_professor_paella.jpg',
                zIndex: 5,
                rect: { left: 0, top: 0, width: 1280, height: 720 },
                visible: true,
                layer: 0
            },
            logos: [
                {
                    content: 'paella_logo.png',
                    zIndex: 5,
                    rect: { top: 10, left: 10, width: 49, height: 42 }
                }
            ],
            buttons: [],
            onApply: () => { }
        };
    }
}
