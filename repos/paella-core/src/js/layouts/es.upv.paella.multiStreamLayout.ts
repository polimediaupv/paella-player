import { Canvas } from '../core/CanvasPlugin';
import { Stream } from '../core/Manifest';
import PluginModule from '../core/PluginModule';
import VideoLayout, {
    type CanvasButtonDefinition,
    type LayoutStructure,
    type CssLayoutVideo,
    type LegacyLayoutVideo
} from '../core/VideoLayout';
import PaellaCoreLayouts from './PaellaCoreLayouts';

import "../../css/multi-stream-layout.css";

import defaultIconSideBySide from '../../icons/icon_side_by_side';

export default class MultiStreamLayout extends VideoLayout {
    getPluginModuleInstance(): PluginModule | null {
        return PaellaCoreLayouts.Get();
    }

    get name() {
        return "es.upv.paella.multiStreamLayout";
    }

    get layoutType() {
        return "css";
    }

    async load() {

    }

    getVideoCanvasButtons(layoutStructure: LayoutStructure, content: string, video: LegacyLayoutVideo | CssLayoutVideo, videoCanvas: Canvas): CanvasButtonDefinition[] {
        const buttons: CanvasButtonDefinition[] = [];
        buttons.push({
            icon: defaultIconSideBySide,
            click(content) {
                alert("Prueba")
            },
            position: "right"
        })
        return buttons;
    }

    getLayoutStructure(streamData: Stream[], contentId: string, mainContent: string | null = null): LayoutStructure | null {
        console.log(streamData);
        console.log(contentId);
        console.log(mainContent);
        return {
            type: "css",
            id: "multiStreamLayout",
            className: "multi-stream-layout",
            name: { en: "Multi stream layout" },
            videos: streamData.map(stream => {
                return {
                    content: stream.content,
                    className: [
                        `stream-rect`,
                        `stream-${stream.content}`
                    ],
                }
            })
        }
    }
}
