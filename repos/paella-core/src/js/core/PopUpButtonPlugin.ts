import ButtonPlugin from './ButtonPlugin';
import { createElementWithHtmlText } from './dom';
import ChevronRight from '../../icons/chevron-right';
import Events from "./Events";
import { PopUpType } from './Config';

export default class PopUpButtonPlugin extends ButtonPlugin {
	constructor(...args: ConstructorParameters<typeof ButtonPlugin>) {
		super(...args);

		(this as any)._refreshContent = true;
	}

	set refreshContent(c: boolean) { (this as any)._refreshContent = c; }

	get refreshContent() : boolean { return (this as any)._refreshContent; }

	get closeParentPopUp() { return this.config.closeParentPopUp || this.getCloseParentPopUp(); }

	getCloseParentPopUp(): boolean {
		return false;
	}

	async action(evt: Events, caller: HTMLElement | null = null) {
		super.action(evt, caller);
		this.parentPopUp = caller;
		await this.showPopUp();
	}
	
	get parentPopUp() {
		return (this as any)._parentPopUp;
	}

	set parentPopUp(p: HTMLElement | null) {
		(this as any)._parentPopUp = p;
	}

	get popUp() {
		return (this as any)._popUp;
	}

	get menuTitle() : string | null {
		return this.config.menuTitle || null;
	}

	get customPopUpClass() : string {
		return this.config.customPopUpClass ?? "";
	}

	get currentContent() : HTMLElement | null {
		return (this as any)._currentContent;
	}

	async getContent() : Promise<HTMLElement> {
		const content = createElementWithHtmlText('<p>Pop Up Button Plugin Content</p>');
		return content;
	}

	async checkRefreshContent() {
		if (this.refreshContent) {
			const content = await this.getContent();
			(this as any)._currentContent.innerHTML = "";
			const children = Array.from(content.children);
			children.forEach(child => (this as any)._currentContent.appendChild(child));
		}
	}

	get popUpType() : PopUpType {
		return this.config.popUpType || "modal"; // "timeline"
	}

	get stateIcon() : string | null {
		return ChevronRight;
	}
	
	hidePopUp() {
		if (!this.player.playbackBar.popUp.isHidden) {
			this.player.playbackBar.popUp.hide();
		}
	}
	
	async showPopUp() {
		if (!(this as any)._keyEventHandler) {
			(this as any)._keyEventHandler = (evt: KeyboardEvent) => {
				if (evt.key === "Escape") {
					this.hidePopUp();
				}
			}
			this.button.addEventListener("keydown", (this as any)._keyEventHandler);
		}
		const popUp = this.player.playbackBar.popUp;
		if (popUp.isHidden || (this as any)._contentId !== popUp.currentContentId) {
			const content = await this.getContent();
			(this as any)._currentContent = content;
			(this as any)._contentId = popUp.show({
				title: this.menuTitle || this.description || "",
				content,
				attachRight: this.popUpType === "timeline" || this.side === "right",
				attachLeft: this.popUpType === "timeline" || this.side === "left",
				parent: this.parentPopUp
			});
		}
		else {
			popUp.hide();
		}
	}
}
