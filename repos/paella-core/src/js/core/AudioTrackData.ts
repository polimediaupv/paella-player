
export default class AudioTrackData {
    #id: string;
    #name: string
    #groupId: string;
    #lang: string
    #selected: boolean;

    constructor({
        id, 
        name,
        groupId = "", 
        language = "",
        selected = false
    } : {
        id: string;
        name: string;
        groupId?: string;
        language?: string;
        selected?: boolean;
    }) {
        this.#id = id;
        this.#name = name;
        this.#groupId = groupId;
        this.#lang = language;
        this.#selected = selected;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get groupId() {
        return this.#groupId;
    }

    get language() {
        return this.#lang;
    }

    get selected() {
        return this.#selected;
    }

    set selected(s) {
        this.#selected = s;
    }
}
