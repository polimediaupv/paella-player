
import Events, { bindEvent } from './Events';
import type Paella from "../Paella";
import type PlaybackBar from "./PlaybackBar";
import type VideoContainer from './VideoContainer';
import { HtmlVideo } from '../videoFormats/es.upv.paella.htmlVideoFormat';

export function loadSvgIcon(url: string) : Promise<string> {
    return new Promise((resolve,reject) => {
        fetch(url)
            .then((icon) => {
                return icon.text()
            })
            .then(svg => {
                resolve(svg);
            })
            .catch(err => reject(err));
    })
}

export function isSvgString(svg: string) : boolean {
    if (typeof(svg) !== "string") {
        return false;
    }
    const re = /<svg[^>]*>/i;
    return re.test(svg);
}

export function getUrlParameter(name: string) : string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(name) ? urlParams.get(name) : null;
}

export function getHashParameter(name: string) : string | null {
    const search = window.location.hash.replace('#','?');
    const urlParams = new URLSearchParams(search);
    return urlParams.has(name) ? urlParams.get(name) : null;
}

export function joinPath(parts: string[], sep: string = '/') : string {
    const separator = sep;
    parts = parts.map((part, index)=>{
        if (index) {
            part = part.replace(new RegExp('^' + separator), '');
        }
        if (index !== parts.length - 1) {
            part = part.replace(new RegExp(separator + '$'), '');
        }
        return part;
    })
    return parts.join(separator);
}

export function isAbsoluteUrl(src: string) : boolean {
    // We consider that the URLs starting with / are absolute and local to this server
    return new RegExp('^([a-z]+://|//)', 'i').test(src) || /^\//.test(src);
}

export function isBase64(str: string) : boolean {
    return /^data:([a-zA-Z]+\/[a-zA-Z0-9-.+]+)?;base64,/.test(str);
}

export function getUrlFileName(url: string) : string | undefined {
    try {
        return new URL(url).pathname.split('/').pop();
    }
    catch (e) {
        return url.split('/').pop();
    }
}

export function removeExtension(url: string) : string {
    return url.split('.').reduce((ac,v,i,a) => i<a.length-1 ? (ac !== "" ? `${ac}.${v}` : v) : ac, "");
}

export function removeFileName(url: string) : string {
    const remove = (path: string) => {
        const result = path.split('/').reduce((ac,v,i,a) => i<a.length-1 ? (ac !== "" ? `${ac}/${v}` : v) : ac, "");
        return (path[0] === '/' ? `/${result}` : result) + '/';
    }

    try {
        const u = new URL(url);
        return u.origin + remove(u.pathname);
    }
    catch (e) {
        return remove(url);
    }
}

export function getFileExtension(url: string) : string {
    const file = getUrlFileName(url);
    return file?.split('.').pop() || "";
}

// Returns the absolute path of a video manifest resource file.
// If the path is absolute, it returns it unchanged.
export function resolveResourcePath(player: Paella, src: string) : string {
    if (isAbsoluteUrl(src) || isBase64(src)) {
        return src;
    }
    else {
        return joinPath([player.manifestUrl, src]);
    }
}

export function pauseAutoHideUiTimer(player: Paella) {
    (player as any).__hideTimerPaused__ = true;
}

export function resumeAutoHideUiTimer(player: Paella) {
    (player as any).__hideTimerPaused__ = false;
}

export function setupAutoHideUiTimer(player: Paella, hideUiTimePropertyName: string = "hideUiTime") {
    (player as any).__hideTimer__ = null;

    const hideUserInterface = async () => {
        //player.__hideTimer__ = null;
        if ((player as any).__hideTimerPaused__) {
            player.log.debug("UI not hidden because the auto hide timer is paused");
            //setupTimer();
            return false;
        }
        else if (checkFocus()) {
            player.log.debug("UI not hidden because there is a focused element");
            //setupTimer();
            return false;
        }
        await player.hideUserInterface();
        return true;
    }
    
    // Used to hide user interface when the mouse leave the player container
    if (player.config.ui?.hideOnMouseLeave) {
        player.containerElement.addEventListener("mouseleave", () => {
            hideUserInterface();
        });
    }

    const checkFocus = () => {
        const active: Element | null = document.activeElement;
        const focusVisible = document.querySelector(":focus-visible");
        return  (player.playbackBar.element?.contains(active) ||
                player.videoContainer.element?.contains(active)) &&
                [
                    "input",
                    "textarea",
                    "button"
                ].find((tagName: string) => active?.tagName.toLowerCase() === tagName) &&
                focusVisible;
    }
    
    const setupTimer = async () => {
        if ((player as any).__hideTimer__) {
            clearTimeout((player as any).__hideTimer__);
        }
        await player.showUserInterface();
        (player as any).__hideTimer__ = setTimeout(async () => {
            (player as any).__hideTimer__ = null;
            if (!hideUserInterface()) {
                setupTimer();
            }
        }, (player as any)[hideUiTimePropertyName]);
    }
    
    player.containerElement.addEventListener("mousemove", async (evt) => {
        setupTimer();
    });
    
    bindEvent(player, Events.PLAY, async () => {
        setupTimer();
    });
    
    bindEvent(player, Events.PAUSE, async () => {
        await player.showUserInterface();
    });
    
    bindEvent(player, Events.ENDED, async () => {
        await player.showUserInterface();
    });

    document.addEventListener('keydown', async() => {
        setupTimer();
    });

    //document.addEventListener('focusin', async () => {
    //    setupTimer();
    //});
}

export function clearAutoHideTimer(player: Paella) {
    if ((player as any).__hideTimer__) {
        clearTimeout((player as any).__hideTimer__);
        delete (player as any).__hideTimer__;
    }
}

export function secondsToTime(timestamp: number) : string {
    const hours = Math.floor(timestamp / 60 / 60);
    const minutes = Math.floor(timestamp / 60) - hours * 60;
    const seconds = Math.floor(timestamp % 60);
    return  (hours>0 ? hours.toString().padStart(2,'0') + ":" : "") +
            minutes.toString().padStart(2,'0') + ":" +
            seconds.toString().padStart(2,'0');
}

export function timeToSeconds(timeString: string) : number | null {
    const re = /^(?:(\d+):){0,1}(\d+):(\d+)(\.\d+)?$/;
    const result = re.exec(timeString);
    if (result) {
        const hours = result[1] !== undefined ? Number(result[1]) : 0;
        const minutes = Number(result[2]);
        const seconds = Number(result[3]);
        return hours * 3600 + minutes * 60 + seconds;
    }
    return null;
}

export function timeToMilliseconds(timeString: string) : number | null {
    const re = /^(?:(\d+):){0,1}(\d+):(\d+)\.(\d+)?$/;
    const result = re.exec(timeString);
    if (result) {
        const hours = result[1] !== undefined ? Number(result[1]) : 0;
        const minutes = Number(result[2]);
        const seconds = Number(result[3]);
        const milliseconds = result[4] && Number(result[4]) || 0;
        return hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
    }
    return null;
}

export function setCookie(cname: string, cvalue: string, exdays: number = 365) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = `expires=${d.toUTCString()}`;
    document.cookie = `${ cname }=${ cvalue };${ expires};path=/;SameSite=None;` + (/Apple/.test(navigator.vendor) ? "" : "Secure;"); 
}

export function setCookieIfAllowed(player: Paella, type: string, cname: string, cvalue: string, exdays: number = 365) {
    if (player.cookieConsent.getConsentForType(type)) {
        setCookie(cname, cvalue, exdays);
    }
}

export function getCookie(cname: string) : string {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; ++i) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

export function getNumericCookie(cname: string) : number | null {
    const rawValue = getCookie(cname);
    const numValue = Number(rawValue);
    return (rawValue !== "" && !isNaN(numValue)) ? numValue : null;
}

export function getJSONCookie(cname: string) : object | null {
    try {
        return JSON.parse(getCookie(cname));
    }
    catch (err) {
        return null;
    }
}

export function loadStyle(url: string, { addToHeader = true, timeoutMs = 3000 } : { addToHeader?: boolean, timeoutMs?: number } = {}) : Promise<HTMLLinkElement | null> {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.setAttribute('rel','stylesheet');
        link.setAttribute('href',url);

        // It's not waranted that the onload or onerror events will be called,
        // for example, when the resource is loaded from cache.
        // To avoid waiting indefinitely, we set a timeout.
        const timeout = setTimeout(() => {
            cleanup();
            resolve(link);
        }, timeoutMs);

        const cleanup = () => {
            clearTimeout(timeout);
            link.onload = null;
            link.onerror = null;
        }

        link.onload = () => {
            clearTimeout(timeout);
            resolve(link);
        }

        link.onerror = () => {
            clearTimeout(timeout);
            reject();
        }

        const head = document.getElementsByTagName('head')[0];
        if (addToHeader) {
            head.appendChild(link);
        }
    });
}

export function unloadStyle(link: HTMLLinkElement) {
    if (!link) {
        return;
    }
    const head = document.getElementsByTagName('head')[0];
    head.removeChild(link);
}

export function mergeObjects(baseData: object, extendData: object, mergeArrays: boolean = true) {
    for (const key in extendData) {
        const baseVal = (baseData as any)[key];
        let extendVal = (extendData as any)[key];

        if (mergeArrays && Array.isArray(baseVal) && Array.isArray(extendVal)) {
            // Replace objects if there is an identifier property
            baseVal.forEach(item => {
                extendVal = extendVal.filter((extendItem: any) => {
                    if (typeof(item) === "object" &&
                        typeof(extendItem) === "object" &&
                        item.id === extendItem.id)
                    {
                        mergeObjects(item, extendItem, mergeArrays);
                        return false;
                    }
                    return true;
                });
            });
            
            // Add objects that have not been added before
            extendVal.forEach(extendItem => {
                baseVal.push(extendItem);
            });
        }
        else if (typeof(baseVal) == "object" && extendVal) {
            mergeObjects(baseVal, extendVal, mergeArrays);
        }
        else {
            (baseData as any)[key] = (extendData as any)[key];
        }
    }
}

export function sanitizeHTML(html: string, { excludedTags = null } : { excludedTags?: string[] | null }  = {} ) {
    const div = document.createElement('div');
    div.innerHTML = html;

    const exclude = ["script"];
    if (Array.isArray(excludedTags)) {
        exclude.push(...excludedTags);
    }
    
    exclude.flatMap(tag => Array.from(div.getElementsByTagName(tag)))
        .forEach(tag => {
            const parent = tag.parentElement;
            parent?.removeChild(tag)
        });

    return div.innerHTML;
}

let video: HTMLVideoElement | null = null;

export function supportsVideoType(type: string) {
    if (!type) return false;
    if (!video) {
        video = document.createElement("video");
    }

    let canPlay = video.canPlayType(type);
    if (canPlay === "maybe" || canPlay === "probably") {
        return true;
    }
    else if (/video\/mp4/i.test(type)) {
        canPlay = video.canPlayType("video/mp4");
        return canPlay === "maybe" || canPlay === "probably";
    }
}
