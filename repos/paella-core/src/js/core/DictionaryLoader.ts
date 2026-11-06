import type { Dictionaries, Dictionary } from './Localization';

export type DictionaryLoader = () => Promise<{ default: Dictionary }>;
export type DictionaryProvider = (language?: string) => Promise<Dictionaries | null>;

/** Exact codes and explicit aliases only. Failed imports can be retried. */
export function createDictionaryLoader(
    loaders: Record<string, DictionaryLoader>,
    aliases: Record<string, string> = {}
): DictionaryProvider {
    const cache = new Map<DictionaryLoader, Promise<Dictionary>>();
    const codes = [...Object.keys(loaders), ...Object.keys(aliases)];
    const loaderFor = (code: string) => {
        const canonical = Object.hasOwn(aliases, code) ? aliases[code] : code;
        return Object.hasOwn(loaders, canonical) ? loaders[canonical] : undefined;
    };
    const load = (loader: DictionaryLoader) => {
        let pending = cache.get(loader);
        if (!pending) {
            pending = Promise.resolve().then(loader).then(module => module.default).catch(error => {
                cache.delete(loader);
                throw error;
            });
            cache.set(loader, pending);
        }
        return pending;
    };
    return async (language?: string) => {
        const selected = language === undefined ? undefined : loaderFor(language);
        if (language !== undefined && !selected) return null;
        const entries = await Promise.all(codes.filter(code =>
            language === undefined || loaderFor(code) === selected
        ).map(async code => [code, await load(loaderFor(code)!)] as const));
        return Object.fromEntries(entries);
    };
}
