import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { useState, useRef, useEffect, Fragment } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import ChatSidebar from "./ChatSidebar.jsx"
import ChatSettings from "./ChatSettings.jsx"
import ChatWelcome from "./ChatWelcome.jsx"
import { usePaellaPlugin } from '../plugins/PreactButtonPlugin/PreactButtonPlugin';
// import MarkdownView from 'react-showdown';

import "./Chat.css";
import type AIChatPlugin from '../plugins/es.upv.paella.ai.chat.jsx';
import type { Chat, Settings } from '../plugins/es.upv.paella.ai.chat.jsx';



interface AIToolChatProps {
    className?: string;
}

//model: 'Phi-3-mini-4k-instruct-q4f16_1-MLC',
//model: 'Llama-3.2-3B-Instruct-q4f32_1-MLC',
// baseUrl: "http://localhost:11434"
export default function AIToolChat({ className = "" }: AIToolChatProps) {
    const paellaPlugin = usePaellaPlugin() as AIChatPlugin;
    const [showWelcomeView, setShowWelcomeView] = useState<boolean>(paellaPlugin.showWelcomeMessage);
    const [showSettingsView, setShowSettingsView] = useState<boolean>(false);
    const [settings, setSettings] = useState<Settings>(paellaPlugin?.webllmSettings || {});
    const [chats, setChats] = useState<Chat[]>(paellaPlugin.loadChats());
    const [currentChatIndex, setCurrentChatIndex] = useState<number | null>(null);
    const [inputMessage, setInputMessage] = useState<string>("");
    const [processing, setProcessing] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);


    useEffect(() => {
        listRef.current?.scrollTo(0, listRef.current?.scrollHeight);
    }, [chats, currentChatIndex]);

    useEffect(() => {
        if (currentChatIndex !== null && !processing) {
            inputRef.current?.focus();
        }
    }, [currentChatIndex, processing]);


    const handleSettingsView = (): void => {
        setShowSettingsView(true);
    };

    const handleNewChat = (): void => {
        setChats([
            ...chats,
            {
                title: `Chat ${chats.length + 1}`,
                date: new Date(),
                messages: []
            }
        ]);
        setCurrentChatIndex(chats.length);
    };

    const handleChangeChat = (i: number): void => {
        setCurrentChatIndex(i);
    };

    const handleDeleteChat = (i: number): void => {
        const newChats = chats.filter((_, j) => i !== j);
        setChats(newChats);
        setCurrentChatIndex(null);
        paellaPlugin.saveChats(newChats);
    };

    const handleSettingsChange = (settings: Settings): void => {
        paellaPlugin.saveSettings(settings);
        setSettings(settings);
        setShowSettingsView(false);
    };

    const submitMessage = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        let currentChat = null;
        let newChats = [...chats];

        if (currentChatIndex != null) {
            currentChat = chats[currentChatIndex];
        }
        else {
            currentChat = {
                title: `Chat ${chats.length + 1}`,
                date: new Date(),
                messages: []
            }
            newChats.push(currentChat);
            setChats(newChats);
            setCurrentChatIndex(chats.length);
        }


        paellaPlugin.player.log.info(`Send message: ${inputMessage}`);
        if (currentChat != null) {
            currentChat.messages.push({ role: "human", text: inputMessage });
            currentChat.messages.push({ role: "system", text: '' });
        }
        const messageResponse = currentChat.messages[currentChat.messages.length - 1]
        setInputMessage("");
        setChats([...newChats]);
        paellaPlugin.saveChats(chats);


        messageResponse.processing = true;
        setProcessing(true);

        if (paellaPlugin.model == null) {
            await paellaPlugin.loadModel(settings, (progress) => {
                console.log("Progress: ", progress);
                messageResponse.text = (progress as any).text;
                setChats([...newChats]);
            });
        }


        messageResponse.text = ""
        setChats([...newChats]);

        const chatHistory = currentChat.messages.slice(0, -2).map((msg) => {            
            if (msg.role === "human")
                return new HumanMessage({ content: msg.text });
            return new AIMessage({ content: msg.text });
        });
        const ragPrompt = `
You are a helpful assistant who can answer questions about the course content. You can also provide guidance on how to solve problems and help me better understand the concepts.
Given the following video transcription of a lecture, where you first have the time instant and then the transcript.

<video_transcription>
${paellaPlugin.captionsRAG}
</video_transcription>

Answer the questions indicating the time instants that are relevant to the answer.
If the answer is not in video transcription, please indicate that it cannot be answered with the information from the video.

Answer in the same language as the question.
`
        const promptTemplate = ChatPromptTemplate.fromMessages([
            new SystemMessage({ content: paellaPlugin.captionsRAG ? ragPrompt : (settings.systemPrompt ?? "") }),
            ...chatHistory,
            new MessagesPlaceholder("input"),
        ]);

        const runnable = promptTemplate.pipe(paellaPlugin.model);
        const stream = await runnable.stream({ input: new HumanMessage(inputMessage) })

        for await (const chunk of stream) {
            messageResponse.text += (chunk as any).content
            setChats([...newChats]);
        }

        messageResponse.processing = false;
        setChats([...newChats]);
        paellaPlugin.saveChats(newChats);
        setProcessing(false);
    }


    return (
        <section className={`aitool-chat${className ? " " + className : ""}`}>
            {showWelcomeView
                ? <ChatWelcome onClick={() => { paellaPlugin.showWelcomeMessage = false; setShowWelcomeView(paellaPlugin.showWelcomeMessage); }} />
                : (showSettingsView
                    ? <ChatSettings
                        settings={settings}
                        onSettingsChange={handleSettingsChange}
                        onSettingsDefault={() => { setSettings(paellaPlugin.webllmSettings); }}
                        onClose={() => { setShowSettingsView(false); }}
                    />
                    : (
                        <div className="chat">
                            <ChatSidebar
                                chatsList={chats}
                                chatActive={currentChatIndex}
                                onSettingsClick={handleSettingsView}
                                onNewChatClick={handleNewChat}
                                onChangeChat={handleChangeChat}
                                onDeleteChat={handleDeleteChat}
                            />
                            {true
                                ? <div className="chat-content">
                                    <article>
                                        <ul ref={listRef}>
                                            {chats && currentChatIndex != null &&
                                                chats[currentChatIndex]?.messages?.map((msg, i) =>
                                                    <li key={i} className={`chat-message msg-role-${msg.role}`}>
                                                        {msg.role === "human"
                                                            ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                                                <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z"></path>
                                                                <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z"></path>
                                                            </svg>
                                                            : (
                                                                msg.role === "system" && msg.processing
                                                                    ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
                                                                        <path d="M6.5 7h11"></path>
                                                                        <path d="M6.5 17h11"></path>
                                                                        <path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z"></path>
                                                                        <path d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z"></path>
                                                                    </svg>
                                                                    : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
                                                                        <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"></path>
                                                                        <path d="M9.5 9h.01"></path>
                                                                        <path d="M14.5 9h.01"></path>
                                                                        <path d="M9.5 13a3.5 3.5 0 0 0 5 0"></path>
                                                                    </svg>
                                                            )
                                                        }

                                                        <div>
                                                            <div className="header">
                                                                <span className="user">
                                                                    {msg.role === "human" ? paellaPlugin.player.translate("You") : paellaPlugin.player.translate("Assistant")}
                                                                </span>
                                                                {/* <span className="time">11:46</span> */}
                                                            </div>
                                                            {/* <MarkdownView className='markdown-view'
                                                                markdown={msg.text}
                                                                options={{ tables: true, emoji: true }}                                                            
                                                            /> */}
                                                            <Markdown remarkPlugins={[remarkGfm]}>
                                                                {msg.text}
                                                            </Markdown>
                                                            
                                                        </div>
                                                    </li>
                                                )}
                                        </ul>
                                    </article>
                                    <footer>
                                        <form onSubmit={submitMessage}>
                                            <input ref={inputRef} type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} disabled={processing} />
                                            <button type="submit" disabled={processing}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" strokeWidth="2">
                                                    <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"></path>
                                                </svg>
                                                {paellaPlugin.player.translate("Send")}
                                            </button>
                                        </form>
                                    </footer>
                                </div>

                                : <Fragment></Fragment>
                            }
                        </div>
                    )
                )
            }
        </section>
    )
}