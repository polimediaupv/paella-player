import {
    VideoLayout,
    utils,  
    CanvasButtonPosition
} from 'paella-core';

import LayoutPluginsModule from './LayoutPluginsModule';


import defaultIconMinimize from '../icons/minimize.svg';
import defaultIconMaximize from '../icons/maximize.svg';
import defaultIconClose from '../icons/close.svg';

const { getCookie, setCookieIfAllowed } = utils;

const layouts = {
    // First layout: side by side
    "sideBySide": {
        id: "sideBySide",
        videos: [
            {
                content:null,
                rect:[
                    {aspectRatio:"16/9",width:614,height:345,top:187,left:17},
                    {aspectRatio:"16/10",width:614,height:384,top:167,left:17},
                    {aspectRatio:"4/3",width:614,height:460,top:130,left:17},
                    {aspectRatio:"3/2",width:614,height:409,top:155,left:17},
                    {aspectRatio:"5/4",width:614,height:491,top:114,left:17}  
                ],
                visible:true,
                layer:1
            },
            {
                content:null,
                rect:[
                    {aspectRatio:"16/9",width:614,height:345,top:187,left:649},
                    {aspectRatio:"16/10",width:614,height:384,top:167,left:649},
                    {aspectRatio:"4/3",width:614,height:460,top:130,left:649},
                    {aspectRatio:"3/2",width:614,height:409,top:155,left:649},
                    {aspectRatio:"5/4",width:614,height:491,top:114,left:649}
                ],
                visible:true,
                layer:"1"
            }
        ],
        buttons: []
    },

    // Second layout: presentation maximized
    "leftMaximized": {
        id: "leftMaximized",
        videos:[
            {
                content:null,
                rect:[
                    {aspectRatio:"5/4",left:35,top:8,width:847,height:699},
                    {aspectRatio:"3/2",left:35,top:66,width:874,height:584},
                    {aspectRatio:"4/3",left:35,top:32,width:874,height:656},
                    {aspectRatio:"16/10",left:35,top:84,width:874,height:548},
                    {aspectRatio:"16/9",left:35,top:112,width:874,height:493}
                ],
                visible:true,
                layer:1
            },
            {
                content:null,
                rect:[
                    {aspectRatio:"5/4",left:947,top:352,width:316,height:253},
                    {aspectRatio:"3/2",left:947,top:374,width:316,height:211},
                    {aspectRatio:"4/3",left:947,top:360,width:316,height:237},
                    {aspectRatio:"16/10",left:947,top:380,width:316,height:198},
                    {aspectRatio:"16/9",left:947,top:390,width:316,height:178}
                ],
                visible:true,
                layer:2
            }
        ],
        buttons: []
    },

    // Third layout: presenter maximized
    "rightMaximized": {
        id: "rightMaximized",
        videos:[
            {
                content:null,
                rect:[
                    {aspectRatio:"5/4",left:35,top:352,width:316,height:253},
                    {aspectRatio:"3/2",left:35,top:374,width:316,height:211},
                    {aspectRatio:"4/3",left:35,top:360,width:316,height:237},
                    {aspectRatio:"16/10",left:35,top:380,width:316,height:198},
                    {aspectRatio:"16/9",left:35,top:390,width:316,height:178}
                ],
                visible:true,
                layer:1
            },
            {
                content:null,
                rect:[
                    {aspectRatio:"5/4",left:359,top:8,width:847,height:699},
                    {aspectRatio:"3/2",left:359,top:66,width:874,height:584},
                    {aspectRatio:"4/3",left:359,top:32,width:874,height:656},
                    {aspectRatio:"16/10",left:359,top:84,width:874,height:548},
                    {aspectRatio:"16/9",left:359,top:112,width:874,height:493}
                ],
                visible:true,
                layer:2
            }
        ],
        buttons: []
    }
};

let g_currentLayout = "sideBySide";

function currentLayout(validContent) {
    // Set the valid content from the current player configuration
    let selectedLayout = JSON.parse(JSON.stringify(layouts[g_currentLayout]));
    selectedLayout.videos[0].content = validContent[0];
    selectedLayout.videos[1].content = validContent[1];
    return selectedLayout;
}

export default class DualVideoSideBySideLayout extends VideoLayout {
    getPluginModuleInstance() {
        return LayoutPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.dualVideoSideBySide";
    }

    get identifier() { return "dual-video-ethz"; }

    async load() {
        this.cookieType = this.config.cookieType || "preferences";
        let layoutName = getCookie('dualVideoLayoutEthz');
        if (layoutName !== "" && Object.keys(layouts).indexOf(layoutName) !== -1) {
            g_currentLayout = layoutName;
        }
        this.player.log.debug("Dual video ETHZ layout loaded");
    }

    getValidStreams(streamData) {
        // As this is a dual stream layout plugin, we make sure that the valid streams containis
        // two streams. This prevents a bad configuration of the plugin
        return super.getValidStreams(streamData)
            .filter(stream => stream.length === 2);
    }

    setSideBySide() {
        g_currentLayout = "sideBySide";
        this.player.videoContainer.updateLayout();
    }

    setLeftMaximized() {
        g_currentLayout = "leftMaximized";
        this.player.videoContainer.updateLayout();
    }

    setRightMaximized() {
        g_currentLayout = "rightMaximized";
        this.player.videoContainer.updateLayout();
    }

    closeVideo(content) {
        const singleStreamContentIds = this.player.videoContainer.validContentIds.filter(cid => cid.indexOf("-") === -1);
        const contentId = singleStreamContentIds.find(cid => cid != content);
        this.player.videoContainer.setLayout(contentId);
    }

    getVideoCanvasButtons(layoutStructure, content, video, videoCanvas) {
        const minimizeButton = () => { 
            return {
                icon: this.player.getCustomPluginIcon(this.name,"iconMinimize") || defaultIconMinimize,
                position: CanvasButtonPosition.RIGHT,
                title: this.player.translate('Minimize video'),
                ariaLabel: this.player.translate('Minimize video'),
                click: () => {
                    if (content === this._currentContent[0]) {
                        this.setRightMaximized();
                    }
                    else {
                        this.setLeftMaximized();
                    }
                }
            }
        };
        const maximizeButton = () => {
            return {
                icon: this.player.getCustomPluginIcon(this.name,"iconMaximize") || defaultIconMaximize,
                position: CanvasButtonPosition.RIGHT,
                title: this.player.translate('Maximize video'),
                ariaLabel: this.player.translate('Maximize video'),
                click: () => {
                    this.setSideBySide();
                }
            }
        }
        const closeButton = () => {
            return {
                icon: this.player.getCustomPluginIcon(this.name,"iconClose") || defaultIconClose,
                position: CanvasButtonPosition.RIGHT,
                title: this.player.translate('Close video'),
                ariaLabel: this.player.translate('Close video'),
                click: () => {
                    this.closeVideo(content);
                }
            }
        }

        if (layoutStructure.id === "sideBySide") {
            return [ closeButton(), minimizeButton() ];
        }
        else if (layoutStructure.id === "leftMaximized") {
            return content === this._currentContent[0] ?
                [closeButton(),minimizeButton()] : [closeButton(),maximizeButton()]
        }
        else if (layoutStructure.id === "rightMaximized") {
            return content === this._currentContent[0] ?
                [closeButton(),maximizeButton()] : [closeButton(),minimizeButton()]
        }
    }

    getLayoutStructure(streamData, contentId) {
        if (!this._currentContent) {
            const {content} = this.validContent.find(content => content.id === contentId);
            this._currentContent = content;
        }
        const selectedLayout = currentLayout(this._currentContent);

        const result = {
            id: selectedLayout.id,
            player: this.player,
            name:{es:"Dos streams con posición dinámica"},
            hidden:false,
            videos: selectedLayout.videos,
            buttons: []
        };

        // Save layout settings
        setCookieIfAllowed(this.player, this.cookieType, "dualVideoLayoutEthz", g_currentLayout);

        return result;
    }

    async getDictionaries() {
        return {
            "es": {
                "Maximize video": "Maximizar vídeo",
                "Minimize video": "Minimizar vídeo",
                "Close video": "Cerrar vídeo"
            }
        }
    }
}
