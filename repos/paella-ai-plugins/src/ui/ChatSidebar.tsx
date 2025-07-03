import type { Chat } from "../plugins/es.upv.paella.ai.chat";
import { usePaellaPlugin } from "../plugins/PreactButtonPlugin/PreactButtonPlugin";
import "./ChatSidebar.css";




interface ChatSidebarProps {
    chatsList?: Chat[];
    chatActive?: number | null;
    onSettingsClick?: () => void;
    onNewChatClick?: () => void;
    onChangeChat?: (index: number) => void;
    onDeleteChat?: (index: number) => void;
}

export default function ChatSidebar({
    chatsList = [],
    chatActive = undefined,
    onSettingsClick = () => {} ,
    onNewChatClick = () => {} ,
    onChangeChat = () => {},
    onDeleteChat = () => {}
}: ChatSidebarProps) {
    
    const paellaPlugin = usePaellaPlugin();

    const handleDeleteChat = (e: React.MouseEvent<HTMLDivElement>, i: number): void => {
        e.stopPropagation();
        onDeleteChat(i);
    };

    return (        
        <div className="sidebar">
            <header>                    
                <div className="sidebar-title-container">
                    <div className="sidebar-title">{paellaPlugin.player.translate("Paella AI Bot")}</div>
                    <div className="sidebar-sub-title">{paellaPlugin.player.translate("Ask to the lecture document")}</div>
                </div>
                <div className="sidebar-logo" onClick={(e) => {handleDeleteChat(e, 0)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="44" height="44" strokeWidth="2">
                        <path d="M6 4m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
                        <path d="M12 2v2"></path>
                        <path d="M9 12v9"></path>
                        <path d="M15 12v9"></path>
                        <path d="M5 16l4 -2"></path>
                        <path d="M15 14l4 2"></path>
                        <path d="M9 18h6"></path>
                        <path d="M10 8v.01"></path>
                        <path d="M14 8v.01"></path>
                    </svg>                
                </div>
            
            </header>

            <div className="sidebar-header-bar">
                {/* <button role="button">                        
                    Prompts
                </button> */}
                <button role="button" onClick={onSettingsClick}>
                   {paellaPlugin.player.translate("Settings")}
                </button>
            </div>

            <div className="sidebar-content">
                <ul>
                    { chatsList?.map((chat, i) => (
                        <li key={`chat-id-${i}`}>
                            <button className={`${i === chatActive ? 'active' : ''}`} role="button" onClick={() => {onChangeChat(i);}}>
                                <div className="title"> {chat.title} </div>
                                <div className="info"> 
                                    <div className="info-count"> {`${chat?.messages?.length ?? 0} ${paellaPlugin.player.translate("messages")}`} </div>
                                    {/* <div className="info-date"> 3/2/2025, 12:26:49 </div> */}
                                </div>
                                <div className="close" onClick={(e) => {handleDeleteChat(e, i);}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" strokeWidth="1.75">
                                        <path d="M4 7l16 0"></path>
                                        <path d="M10 11l0 6"></path>
                                        <path d="M14 11l0 6"></path>
                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                                    </svg>
                                </div>
                            </button>
                        </li>
                    )) }
                </ul>
            </div>

            <footer>
                <button role="button" onClick={onNewChatClick}>
                    {paellaPlugin.player.translate("New chat")}
                </button>
            </footer>
        </div>            
    );
}