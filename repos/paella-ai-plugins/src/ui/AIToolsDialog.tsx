import { useRef } from "react";
import type AIContentPlugin from "../plugins/es.upv.paella.ai.content";
import { AIToolsContainer } from "./AIToolsContainer";


import "./AIToolsDialog.css";


const CloseIcon = () => {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
        <path d="M18 6l-12 12"></path>
        <path d="M6 6l12 12"></path>
    </svg>)
}


export const AIDialog = ({paellaPlugin}: {paellaPlugin: AIContentPlugin }) => {
    paellaPlugin.dialogRef = useRef<HTMLDialogElement>(null);

    const hideDialog = () => {
        paellaPlugin.dialogRef?.current?.close();
    }

    return (
        <dialog ref={paellaPlugin.dialogRef}>
            <div className="dialog-content">
                <header>
                    <button onClick={() => hideDialog()}><CloseIcon /></button>
                </header>
                <AIToolsContainer paellaPlugin={paellaPlugin} />
            </div>
        </dialog>
    );
}


