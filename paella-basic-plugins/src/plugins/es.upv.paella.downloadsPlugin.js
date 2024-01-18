import {
    createElementWithHtmlText,
    PopUpButtonPlugin,
    translate
} from 'paella-core';
import BasicPluginsModule from './BasicPluginsModule';

import '../css/DownloadsPlugin.css';

import defaultDownloadIcon from '../icons/download.svg';

export default class DownloadsPlugin extends PopUpButtonPlugin {
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

            streams.forEach(s => {
                let streamDownloads = [];
                const { mp4 } = s.sources;
                if (mp4) {
                    mp4.forEach(v => {
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
