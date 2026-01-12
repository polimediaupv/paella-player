import UserInterfacePlugin from './UserInterfacePlugin';
import { getPluginsOfType } from './plugin_tools';
import { createElementWithHtmlText } from './dom';
import Events, { triggerEvent } from './Events';
import { translate } from './Localization';
import { sanitizeHTML } from './utils';
import type Paella from '../Paella';
import type { ButtonPluginSide, ButtonSize } from './Config';
import Plugin from "./Plugin";

export function getButtonPlugins(player: Paella, side: ButtonPluginSide | "any" = "any", parent: string = "playbackBar") {
	return getPluginsOfType(player, "button")
		.filter((btn: Plugin) => {
			return ((btn as ButtonPlugin).side === side || side === "any") && (btn as ButtonPlugin).parentContainer === parent
		});
}

export function getLeftButtonPlugins(player: Paella) {
	return getButtonPlugins(player, "left", "playbackBar");
}

export function getRightButtonPlugins(player: Paella) {
	return getButtonPlugins(player, "right", "playbackBar");
}

export async function addButtonPlugin(plugin: ButtonPlugin, buttonAreaElem: HTMLElement | null) {
	(plugin as any)._isAnchor = (await plugin.getAnchorUrl()) !== null;
	
	const parent = createElementWithHtmlText('<li></li>', buttonAreaElem);
	(parent as any).plugin = plugin;
	const ariaLabel = plugin.ariaLabel;
	const description = plugin.description;
	const fixedSizeClass = plugin.dynamicWidth ? 'dynamic-width' : 'fixed-width';
	const id = plugin.id ? `id="${plugin.id}" ` : "";
	const name = plugin.buttonName ? `name="${plugin.buttonName}" ` : `name="${plugin.name}" `;
	const tabIndex = plugin.tabIndex ? ` tabindex="${plugin.tabIndex}" ` : "";

	if (plugin.interactive) {
		const urlTarget = plugin.anchorTarget !== null ? `target="${plugin.anchorTarget}" ` : "";
		const downloadFilename = plugin.anchorDownloadFilename !== null ? `download="${plugin.anchorDownloadFilename}" ` : "";
		const referrerPolicy = plugin.anchorReferrerPolicy !== null ? `referrerpolicy="${plugin.anchorReferrerPolicy}" ` : "";
		const button = plugin.isAnchor ?
			createElementWithHtmlText(`
				<a href="${ await plugin.getAnchorUrl() }" ${id}${name}class="${ fixedSizeClass }"${ tabIndex }aria-label="${ ariaLabel }" title="${ description }" ${urlTarget}${downloadFilename}${referrerPolicy}>
				</a>
			`, parent)
		:
			createElementWithHtmlText(`
				<button type="button" ${id}${name}class="${ fixedSizeClass }"${ tabIndex }aria-label="${ ariaLabel }" title="${ description }">
				</button>
			`, parent)

		if (plugin.className !== "") {
			button.classList.add(plugin.className);
		}

		(plugin as any)._button = button;
		(plugin as any)._container = parent;
		(button as any)._pluginData = plugin;
		(parent as any)._pluginData = plugin;
	
		button.addEventListener("click", (evt) => {
			const plugin = (button as any)._pluginData;
			triggerEvent(plugin.player, Events.BUTTON_PRESS, {
				plugin: plugin
			});
			plugin.action(evt, null);
			
			
			evt.stopPropagation();

			// We remove the focus on the button click event, because otherwise the user
			// interface will never be hidden.
			// We use pageX and pageY to differentiate the origin of the click: if it was produced
			// by a keyboard action, then we do not remove the focus so as not to hinder accessibility.
			if (evt.pageX !== 0 && evt.pageY !== 0) {
				(document.activeElement as HTMLElement)?.blur();
			}
		});

		let addHiddenTimer: ReturnType<typeof setTimeout> | null = null;
		const clearHideTimer = () => {
			if (addHiddenTimer) {
				clearTimeout(addHiddenTimer);
				addHiddenTimer = null;
			}
		}
		const addHiddenClass = () => {
			clearHideTimer();
			addHiddenTimer = setTimeout(() => {
				if (plugin.leftSideContainerPresent) {
					plugin.leftSideContainer?.classList.add("hidden");
				}
				if (plugin.rightSideContainerPresent) {
					plugin.rightSideContainer?.classList.add("hidden");
				}
				addHiddenTimer = null;
			}, 300);
		}

		const removeHiddenClass = () => {
			clearHideTimer();
			if (plugin.leftSideContainerPresent) {
				plugin.leftSideContainer.classList.remove("hidden");
			}
			if (plugin.rightSideContainerPresent) {
				plugin.rightSideContainer.classList.remove("hidden");
			}
		}

		button.addEventListener("focus", removeHiddenClass);
		button.addEventListener("mouseover", removeHiddenClass);
		button.addEventListener("mouseout", addHiddenClass);
		button.addEventListener("blur", addHiddenClass);

		const clickWithSpacebar = plugin.player.config.accessibility?.clickWithSpacebar !== undefined ? 
				plugin.player.config.accessibility?.clickWithSpacebar: true;
		if (!clickWithSpacebar) {
			button.addEventListener("keyup", evt => {
				// prevent to send the clic event with spacebar
				if (evt.keyCode == 32 ) {
					evt.preventDefault();
				} 
			});
			button.addEventListener("keydown", evt => {
				// prevent to send the hover event with spacebar
				if (evt.keyCode == 32 ) {
					evt.preventDefault();
				} 
			});
		}

		if (plugin.className !== "") {
			button.classList.add(plugin.className);
		}
	}
	else {
		const button = createElementWithHtmlText(`
			<div ${id}${name} class="non-interactive ${ fixedSizeClass }" title="${ description }">
			</div>
		`, parent);

		(plugin as any)._button = button;
		(plugin as any)._container = parent;
		(button as any)._pluginData = plugin;
		(parent as any)._pluginData = plugin;

		if (plugin.className !== "") {
			button.classList.add(plugin.className);
		}
	}
}

const getSideContainer = () => {
	const container = document.createElement('span');
	container.classList.add("side-container");
	container.classList.add("hidden");
	return container;
}


export class ButtonPluginObserver {
	onIconChanged(plugin: ButtonPlugin, prevIcon: string, newIcon: string) {}
	onTitleChanged(plugin: ButtonPlugin, prevTitle: string, newTitle: string) {}
	onStateChanged(plugin: ButtonPlugin, prevText: string, newText: string, prevIcon: string, newIcon: string) {}
}

export default class ButtonPlugin extends UserInterfacePlugin {
	get type() { return "button" }
	
	// _container and _button are loaded in PlaybackBar
	get container(): HTMLElement { return (this as any)._container as HTMLElement; }
	get button(): HTMLElement { return (this as any)._button as HTMLElement; }
	get interactive() { return true; }
	get dynamicWidth() { return false; }
	
	getId(): string | null {
		return null;
	}

	get id(): string | null { return this.config.id || this.getId(); }

	getButtonName(): string | null {
		return null;
	}

	get buttonName(): string | null {
		return this.config.name || this.getButtonName() || this.name;
	}
	
	getAriaLabel(): string | null {
		return "";
	}
	
	get ariaLabel(): string | null {
		return this.player.translate(this.config.ariaLabel || this.getAriaLabel());
	}
	
	getTabIndex(): number | null  {
		return null;
	}

	get tabIndex(): number | null {
		return this.config.tabIndex || this.getTabIndex();
	}

	getDescription(): string | null  {
		return "";
	}

	get description(): string | null {
		return this.player.translate(this.config.description || this.getDescription());
	}

	get minContainerSize(): number {
		return this.config.minContainerSize || this.getMinContainerSize();
	}

	getMinContainerSize(): number {
		return 0;
	}

	setObserver(observer: ButtonPluginObserver) {
		if (observer instanceof ButtonPluginObserver) {
			(this as any)._observer = observer;
		}
		else if (typeof (observer as ButtonPluginObserver).onIconChanged === "function" ||
			typeof (observer as ButtonPluginObserver).onTitleChanged === "function" ||
			typeof (observer as ButtonPluginObserver).onStateChanged === "function")
		{
			(this as any)._observer = observer;
		}
		else {
			throw new Error("Invalid observer for ButtonPlugin");
		}
	}
	
	#updateIcon() {
		const thisButton = (this as any)._button as HTMLElement;
		const thisMenuIcon = (this as any)._menuIcon;
		const thisIcon = (this as any)._icon;
		const prevIcon = this.isMenuButton ? thisMenuIcon : thisIcon;
		const observer = (this as any)._observer;
		const icon = (this.isMenuButton && this.haveMenuIcon) ?
			this.menuIcon : this.icon;
		if (icon && thisButton instanceof HTMLElement) {
			const cur = thisButton.querySelector('i') || createElementWithHtmlText(`<i></i>`, thisButton);
			cur.innerHTML = icon;
		}
		else if (thisButton instanceof HTMLElement){
			const cur = thisButton.querySelector('i');
			if (cur) {
				thisButton.removeChild(cur);
			}
		}

		if (observer?.onIconChanged) {
			observer.onIconChanged(this, prevIcon, icon);
		}
	}

	get icon(): string {
		if (!(this as any)._icon) {
			(this as any)._icon = "";
		}
		return (this as any)._icon;
	}
	
	set icon(icon: string) {
		if (typeof icon === "string") {
			icon = sanitizeHTML(icon);
		}

		(this as any)._icon = icon;
		this.#updateIcon();
	}

	get haveIcon(): boolean {
		return this.icon !== "";
	}

	get menuIcon(): string {
		if (!(this as any)._menuIcon) {
			(this as any)._menuIcon = "";
		}
		return (this as any)._menuIcon;
	}

	set menuIcon(icon: string) {
		if (typeof icon === "string") {
			icon = sanitizeHTML(icon);
		}

		(this as any)._menuIcon = icon;
		this.#updateIcon();
	}

	get haveMenuIcon(): boolean {
		return this.menuIcon !== "";
	}

	get isMenuButton(): boolean {
		// If the parentContainer is not defined in the configuration, the button 
		// will be placed in the playbackBar, so it is not a menu button.
		// If the parentContainer is explicitly defined as "playbackBar" or "videoContainer",
		// then is placed in the playbackBar or in the videoContainer, so it is not a menu button.
		// In any other case, the button is placed inside a menu button.
		const inPlaybackBar = this.config?.parentContainer === "playbackBar" || !this.config?.parentContainer;
		const inVideoContainer = this.config?.parentContainer === "videoContainer";
		return !inPlaybackBar && !inVideoContainer;
	}

	get title() {
		return (this as any)._title || "";
	}

	set title(t) {
		const thisButton = (this as any)._button as HTMLElement
		if (t && thisButton instanceof HTMLElement) {
			const cur = thisButton.querySelector('span') || createElementWithHtmlText(`<span class="button-title-${ this.titleSize }"></span>`, thisButton);
			cur.innerHTML = t;
		}
		else if (thisButton instanceof HTMLElement){
			const cur = thisButton.querySelector('span');
			if (cur) {
				thisButton.removeChild(cur);
			}
		}

		if ((this as any)._observer?.onTitleChanged) {
			(this as any)._observer.onTitleChanged(this, (this as any)._title, t);
		}
		(this as any)._title = t;
	}

	get titleSize(): ButtonSize {
		return "medium";
	}
	
	get side() : ButtonPluginSide {
		return this.config?.side || "left"
	}

	get closePopUps() {
		return this.config.closePopUps || this.getClosePopUps();
	}

	getClosePopUps() {
		return true;
	}

	// "playbackBar" or "videoContainer"
	get parentContainer(): string {
		const parent = this.config?.parentContainer;
		return parent || "playbackBar";
	}
	
	get className() { return ""; }

	enable() {
		(this as any)._enabled = true;
		this.show();
	}

	disable() {
		(this as any)._enabled = false;
		this.hide();
	}
	
	hide() {
		if ((this as any)._button) {
			(this as any)._button.style.display = "none";
		}
	}
	
	show() {
		if ((this as any)._enabled === false) {
			return;
		}
		const { width } = this.player.playbackBar?.containerSize ?? { width: 0 };
		if ((this as any)._button && (width > this.minContainerSize || this.parentContainer !== "playbackBar")) {
			(this as any)._button.style.display = null;
		}
	}

	get hidden(): boolean {
		return (this as any)._button.style.display === "none";
	}

	#leftSideContainer: HTMLElement | null = null;
	get leftSideContainer() {
		if (!this.#leftSideContainer) {
			this.#leftSideContainer = getSideContainer();
			this.container.appendChild(this.#leftSideContainer);
		}
		return this.#leftSideContainer;
	}

	get leftSideContainerPresent() {
		return this.#leftSideContainer !== null;
	}

	#rightSideContainer: HTMLElement | null = null;
	get rightSideContainer() {
		if (!this.#rightSideContainer) {
			this.#rightSideContainer = getSideContainer();
			this.container.appendChild(this.#rightSideContainer);
		}
		return this.#rightSideContainer;
	}

	get rightSideContainerPresent() {
		return this.#rightSideContainer !== null;
	}

	get stateText() : string | null {
		return null;
	}

	get stateIcon() : string | null {
		return null;
	}

	setState({ text = null, icon = null } = {}) {
		const prevText = (this as any)._statusText;
		const prevIcon = (this as any)._statusIcon;
		(this as any)._statusText = text;
		(this as any)._statusIcon = icon;
		this.#updateStateCallbacks.forEach((cb: (plugin: ButtonPlugin) => void) => cb(this));
		if ((this as any)._statusIcon) {
			this.icon = (this as any)._statusIcon;
			this.menuIcon = (this as any)._statusIcon;
		}
		if ((this as any)._statusText) {
			this.title = (this as any)._statusText;
		}

		(this as any)._observer?.onStateChanged?.(this, prevText, text, prevIcon, icon);
	}

	#updateStateCallbacks: (() => void)[] = [];

	onStateChange(cb: () => void) {
		if (typeof cb === "function") {
			this.#updateStateCallbacks.push(cb);
		}
		else {
			this.player.log.warn("Invalid callback for ButtonPlugin.onStateChange");
		}
	}

	async action(even: Events, callerContainer: HTMLElement | null = null) {
	}

	async getAnchorUrl() {
		return null;
	}

	get isAnchor() : boolean {
		// This property is set in addButtonPlugin, depending on whether the getUrl() method returns a value or not.
		return (this as any)._isAnchor;
	}

	onResize({ width, height } : { width: number, height: number }) {
		if (width < this.minContainerSize) {
			this.hide();
		}
		else {
			this.show();
		}
	}

	focus() {
		this.button?.focus();
	}

	blur() {
		this.button?.blur();
	}

	isFocus() : boolean {
		return this.button === document.activeElement;
	}

	// anchor attributes
	get anchorTarget(): string {
		return this.config?.urlTarget || "_self";
	}

	get anchorDownloadFilename() : string | null {
		return null; // null means no download attribute, empty string means download attribute with no filename
	}

	get anchorReferrerPolicy() : string {
		return "no-referrer"; // null means no referrerpolicy attribute
	}
}

