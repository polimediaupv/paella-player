import VideoLayout from '../core/VideoLayout';

import iconRotate from '../../icons/icon_rotate';

import PaellaCoreLayouts from './PaellaCoreLayouts';
import type { LayoutButton, LayoutRect, LayoutStructure, LayoutVideoRect } from '../core/VideoLayout';
import type { Stream } from '../core/Manifest';

type TripleContent = [string, string, string];

type TripleVideoDefinition = {
    content: string | null;
    rect: LayoutVideoRect[];
    visible: boolean;
    layer: number;
};

type TripleLayoutTemplate = {
    videos: [TripleVideoDefinition, TripleVideoDefinition, TripleVideoDefinition];
    buttons: [
        {
            rect: LayoutRect;
            onClick: (event?: unknown) => void;
            label: string;
            icon: string;
            layer: number;
        }
    ];
};

const layoutTemplate: TripleLayoutTemplate = {
    videos: [
        {
            content: null,
            rect: [
                { aspectRatio: '16/9', left: 239, top: 17, width: 803, height: 451 }
            ],
            visible: true,
            layer: 1
        },
        {
            content: null,
            rect: [
                { aspectRatio: '16/9', left: 44, top: 482, width: 389, height: 218 }
            ],
            visible: true,
            layer: 1
        },
        {
            content: null,
            rect: [
                { aspectRatio: '16/9', left: 847, top: 482, width: 389, height: 218 }
            ],
            visible: true,
            layer: 1
        }
    ],
    buttons: [
        {
            rect: { left: 618, top: 495, width: 45, height: 45 },
            onClick: function (_event?: unknown) { /* legacy placeholder */ },
            label: 'Rotate',
            icon: 'icon_rotate.svg',
            layer: 2
        }
    ]
};

function asTripleContent(content: string[]): TripleContent | null {
    return content.length === 3 ? [content[0], content[1], content[2]] : null;
}

function getLayout(validContent: TripleContent) {
    const selectedLayout: TripleLayoutTemplate = JSON.parse(JSON.stringify(layoutTemplate));
    selectedLayout.videos[0].content = validContent[0];
    selectedLayout.videos[1].content = validContent[1];
    selectedLayout.videos[2].content = validContent[2];
    return selectedLayout;
}

export default class TripleVideoLayout extends VideoLayout {
    private _currentContent: TripleContent | null = null;
    private _currentContentId: string | null = null;

    getPluginModuleInstance() {
        return PaellaCoreLayouts.Get();
    }

    get name() {
		return super.name || 'es.upv.paella.tripleVideo';
	}

    get identifier() { return 'triple-video'; }

    async load() {
        this.player.log.debug('Triple video layout loaded');
    }

    getValidStreams(streamData: Stream[]) {
        return super.getValidStreams(streamData)
            .filter(stream => stream.length === 3);
    }

    switchContent() {
        if (!this._currentContent) {
            return;
        }
        const v0 = this._currentContent[0];
        const v1 = this._currentContent[1];
        const v2 = this._currentContent[2];
        this._currentContent[0] = v2;
        this._currentContent[1] = v0;
        this._currentContent[2] = v1;

        this.player.videoContainer?.updateLayout();
    }

    getLayoutStructure(streamData: Stream[], contentId: string) : LayoutStructure | null {
        if (!this._currentContent || this._currentContentId !== contentId) {
            this._currentContentId = contentId;
            const valid = this.validContent.find(vc => vc.id === contentId);
            const parsed = valid ? asTripleContent(valid.content) : null;
            if (!parsed) {
                return null;
            }
            this._currentContent = parsed;
        }

        const selectedLayout = getLayout(this._currentContent);

        const buttons: LayoutButton[] = [
            {
                rect: selectedLayout.buttons[0].rect,
                onClick: () => { this.switchContent(); },
                label: 'Switch',
                icon: iconRotate,
                layer: 2,
                ariaLabel: 'Swap the position of the videos',
                title: 'Swap the position of the videos',
                name: this.name + ':iconRotate'
            }
        ];

        return {
            id: 'triple-video',
            name: { es: 'Three streams with dynamic position' },
            hidden: false,
            videos: selectedLayout.videos,
            buttons
        };
    }
}
