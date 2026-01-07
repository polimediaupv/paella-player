import CaptionsPlugin from '../captions/CaptionsPlugin';
import DFXPParser from '../captions/DFXPParser';
import PaellaCorePlugins from './PaellaCorePlugins';

import { resolveResourcePath } from '../core/utils';
import type { CaptionManifestItem } from '../core/Manifest';

export default class DfxpManifestCaptionsPlugin extends CaptionsPlugin {
    getPluginModuleInstance() {
        return PaellaCorePlugins.Get();
    }

    get name() {
        return super.name || 'es.upv.paella.dfxpManifestCaptionsPlugin';
    }

    async isEnabled() {
        const enabled = await super.isEnabled();
        return enabled &&
            this.player.videoManifest.captions &&
            this.player.videoManifest.captions.length > 0;
    }

    async getCaptions() {
        const result: any[] = [];
        const promises: Promise<void>[] = [];
        const items: CaptionManifestItem[] = this.player.videoManifest.captions || [];

        items.forEach((captions) => {
            promises.push((async () => {
                if (!/dfxp/i.test(captions.format)) {
                    return;
                }

                const fileUrl = resolveResourcePath(this.player, captions.url);
                const fetchResult = await fetch(fileUrl);
                if (!fetchResult.ok) {
                    return;
                }

                let text = await fetchResult.text();

                // fix malformed xml replacing the malformed characters with blank
                // Ignore no-control-regex is Ok for cleaning test per eslint docs
                // "If you need to use control character pattern matching, then you should turn this rule off."
                // ref https://eslint.org/docs/latest/rules/no-control-regex
                // eslint-disable-next-line no-control-regex
                text = text.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, '');
                text = text.replace(/&\w+;/gmi, '');
                text = text.replace(/<br>/g, '');

                const parser = new DFXPParser(this.player, text);
                Object.entries(parser.captions as Record<string, any>).forEach(([, parsedCaptions]) => {
                    result.push(parsedCaptions);
                });
            })());
        });

        await Promise.allSettled(promises);
        return result;
    }
}
