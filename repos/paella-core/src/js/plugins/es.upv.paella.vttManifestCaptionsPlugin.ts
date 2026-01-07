import CaptionsPlugin from '../captions/CaptionsPlugin';
import WebVTTParser from '../captions/WebVTTParser';
import PaellaCorePlugins from './PaellaCorePlugins';

import { resolveResourcePath } from '../core/utils';
import type { CaptionManifestItem } from '../core/Manifest';

export default class VttManifestCaptionsPlugin extends CaptionsPlugin {
    getPluginModuleInstance() {
        return PaellaCorePlugins.Get();
    }

    get name() {
		return super.name || 'es.upv.paella.vttManifestCaptionsPlugin';
	}

    async isEnabled() {
        const enabled = await super.isEnabled();
        return  enabled &&
                this.player.videoManifest.captions &&
                this.player.videoManifest.captions.length > 0;
    }

    async getCaptions() {
        const result: any[] = [];
        const promises: Promise<void>[] = [];
        const items: CaptionManifestItem[] = this.player.videoManifest.captions || [];

        items.forEach((captions) => {
            promises.push((async () => {
                if (!/vtt/i.test(captions.format)) {
                    return;
                }

                const fileUrl = resolveResourcePath(this.player, captions.url);
                const fetchResult = await fetch(fileUrl);
                if (!fetchResult.ok) {
                    return;
                }

                const text = await fetchResult.text();
                const parser = new WebVTTParser(text);
                parser.captions.label = captions.text;
                parser.captions.language = captions.lang;
                result.push(parser.captions);
            })());
        });

        await Promise.allSettled(promises);
        return result;
    }
}
