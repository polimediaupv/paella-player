import {
    ButtonPlugin,
    type ButtonPluginConfig
} from '@asicupv/paella-core'


import defaultOpenChatIcon from '../../icons/message-square-more.svg?raw';
import defaultCloseChatIcon from '../../icons/message-square-off.svg?raw';

import PackagePluginModule from '../PackagePluginModule';

interface AIAgentChatButtonConfig extends ButtonPluginConfig {
    ariaLabelOpenChat?: string;
    ariaLabelCloseChat?: string;
    titleOpenChat?: string;
    titleCloseChat?: string;
};

export default class AIAgentChatButtonPlugin extends ButtonPlugin<AIAgentChatButtonConfig> {
    private openChatIcon: string | null = null;
    private closeChatIcon: string | null = null;
    private isOpened: boolean = false;

	getPluginModuleInstance() {
        return PackagePluginModule.Get();
    }
	
	get name() {
		return 'es.upv.paella.ai.agentChatButton';
	}

	async load() {        
		this.openChatIcon = this.player.getCustomPluginIcon(this.name,'openChat') || defaultOpenChatIcon;
		this.closeChatIcon = this.player.getCustomPluginIcon(this.name,'closeChat') || defaultCloseChatIcon;		
		this.icon = this.openChatIcon;

		// bindEvent(this.player, Events.PLAY, () => {
		// 	this.icon = pauseIcon;
		// 	this.button.ariaLabel = ariaLabelPause;
		// 	this.button.title = titlePause;
		// });
		// bindEvent(this.player, Events.PAUSE, () => {
		// 	this.icon = playIcon;
		// 	this.button.ariaLabel = ariaLabelPlay;
		// 	this.button.title = titlePlay;
		// });
		// bindEvent(this.player, Events.ENDED, () => {
		// 	this.icon = replayIcon;
		// 	this.button.ariaLabel = ariaLabelPlay;
		// 	this.button.title = titlePlay;
		// });
		// bindEvent(this.player, Events.STOP, () => {
		// 	this.icon = playIcon;
		// 	this.button.ariaLabel = ariaLabelPlay;
		// 	this.button.title = titlePlay;
		// });
	}
	
	async action() {
        if (this.isOpened) {
            this.icon = this.openChatIcon || defaultOpenChatIcon;
            this.button.ariaLabel = this.player.translate(this.config.ariaLabelOpenChat || 'Open Chat');
            this.button.title = this.player.translate(this.config.titleOpenChat || 'Open Chat');
            this.player.videoCanvasArea?.hidePanel();
        }
        else {
            this.icon = this.closeChatIcon || defaultCloseChatIcon;
            this.button.ariaLabel = this.player.translate(this.config.ariaLabelCloseChat || 'Close Chat');
            this.button.title = this.player.translate(this.config.titleCloseChat || 'Close Chat');
            this.player.videoCanvasArea?.showInteractiveAreaPlugin("es.upv.paella.ai.agentChat");
        }
        this.isOpened = !this.isOpened;		
	}

	async getHelp() {
		return {
			title: this.player.translate('Open/Close Chat'),
			description: this.player.translate('Opens or closes the AI Agent Chat window.'),
		};
	}
}
