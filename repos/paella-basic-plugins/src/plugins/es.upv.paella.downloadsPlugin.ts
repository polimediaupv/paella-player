import {
    createElementWithHtmlText,
    MenuButtonPlugin,
    PopUpButtonPlugin,
    translate,
    type Stream,
    type Source
} from "@asicupv/paella-core";
import BasicPluginsModule from './BasicPluginsModule';

// @ts-ignore
import '../css/DownloadsPlugin.css';

import { DownloadIcon as defaultDownloadIcon } from '../icons/download.js';

type DownloadItemBase = {
    id: string;
    src: string;
    res: { w: number; h: number };
    mimetype: string;
};

type DownloadItem = DownloadItemBase & {
    content: string;
};

type DownloadMenuItem = {
    id: string;
    title: string;
    icon: null;
    selected: false;
};

type DownloadMap = Record<string, DownloadItemBase[]>;

export default class DownloadsPlugin extends MenuButtonPlugin {
    private _downloads: DownloadItem[] = [];

    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.downloadsPlugin";
    }

    getAriaLabel() {
        return translate('Available downloads') || null;
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async isEnabled() {
        if (!(await super.isEnabled())) {
            return false;
        }

        const downloadsMap: DownloadMap = {};
        const { streams } = this.player.videoManifest;

        streams.forEach((s: Stream) => {
            const streamDownloads: DownloadItemBase[] = [];
            const { mp4 } = s.sources;
            if (mp4) {
                mp4.forEach((v: Source) => {
                    streamDownloads.push({
                        id: `${s.content}_${v.res?.w || 0}_${v.res?.h || 0}`,
                        src: v.src,
                        res: v.res || { w: 0, h: 0 },
                        mimetype: v.mimetype
                    });
                });
            }
            if (streamDownloads.length > 0) {
                downloadsMap[s.content] = streamDownloads;
            }
        });

        this._downloads = Object.entries(downloadsMap).flatMap(([k, v]) => {
            return v.map(downloadData => ({
                content: k,
                id: downloadData.id,
                src: downloadData.src,
                res: downloadData.res,
                mimetype: downloadData.mimetype
            }));
        });

        return this._downloads.length > 0;
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "downloadIcon") || defaultDownloadIcon;
    }

    async getMenu(): Promise<DownloadMenuItem[]> {
        return this._downloads.map(d => ({
            id: d.id,
            title: `${d.content} - ${d.res.w}x${d.res.h}`,
            icon: null,
            selected: false
        }));
    }

    itemSelected(itemData: DownloadMenuItem) {
        const download = this._downloads.find(d => d.id === itemData.id);
        if (download) {
            window.open(download.src, '_blank');
        }
    }

    async getHelp() {
        return {
            title: "Downloads menu",
            description: "Provides a menu to download available video streams or resources."
        };
    }
}
export class DownloadsPluginPopup extends PopUpButtonPlugin {
    private _downloads: DownloadMap = {};

    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.downloadsPlugin";
    }

    async isEnabled() {
        const enabled = await super.isEnabled();
        this._downloads = {};

        if (enabled) {
            const { streams } = this.player.videoManifest;

            streams.forEach((s: Stream) => {
                const streamDownloads: DownloadItemBase[] = [];
                const { mp4 } = s.sources;
                if (mp4) {
                    mp4.forEach((v: Source) => {
                        streamDownloads.push({
                            id: `${s.content}_${v.res?.w || 0}_${v.res?.h || 0}`,
                            src: v.src,
                            res: v.res || { w: 0, h: 0 },
                            mimetype: v.mimetype
                        });
                    });
                }
                if (streamDownloads.length > 0) {
                    this._downloads[s.content] = streamDownloads;
                }
            });
        }

        return Object.keys(this._downloads).length > 0;
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "downloadIcon") || defaultDownloadIcon;
    }

    async getContent() {
        const container = createElementWithHtmlText(`
          <div class="downloads-plugin">
              <h4>${translate('Available downloads')}</h4>
          </div>`);
        const downloadKeys = Object.keys(this._downloads);
        downloadKeys.forEach(k => {
            const J = createElementWithHtmlText(`
          <div class="downloadStream">
            <div class="title">${k}</div>
          </div>`, container);
            const list = createElementWithHtmlText('<ul></ul>', J);
            const streamDownloads = this._downloads[k];
            if (!streamDownloads) {
                return;
            }
            streamDownloads.forEach(d => {
                const res = `${d.res.w}x${d.res.h}`;
                createElementWithHtmlText(`
                  <li>
                    <a href="${d.src}" target="_blank">
                      <span class="mimetype">[${d.mimetype}]</span><span class="res">${res}</span>
                    </a>
                  </li>
              `, list);
            });
        });
        return container;
    }
}
