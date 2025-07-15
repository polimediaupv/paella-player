import { PopUpButtonPlugin, type PopUpButtonPluginConfig } from '@asicupv/paella-core';
import { createRoot } from 'react-dom/client';
import { createContext, StrictMode, useContext, useRef, type ReactNode, type RefObject } from 'react';
import CloseIcon from "../../icons/close.svg?raw";

import './PreactButtonPlugin.css';


const PaellaPluginContext = createContext<PreactButtonPlugin | null>(null);

export const usePaellaPlugin = () => {
  const context = useContext(PaellaPluginContext);
  if (!context) {
    throw new Error("usePaellaPlugin must be used inside PreactContainer");
  }
  return context;
};

export const usePaellaTranslate = () => {
  const plugin = usePaellaPlugin();
  return plugin.player.translate;
};


export type PreactButtonPluginConfig = PopUpButtonPluginConfig & {
    mode?: "popup" | "dialog";
}
export class PreactButtonPlugin<C extends PreactButtonPluginConfig = PreactButtonPluginConfig> extends PopUpButtonPlugin<C>  {
    private _appRootElement: HTMLDivElement | null = null;
    dialogRef: RefObject<HTMLDialogElement| null> | null = null;

    async action() {
        if (this.config.mode === "popup") {
            return super.action();
        }
        // If the mode is dialog, we create the dialog element and render the AIDialog component
        if (this._appRootElement === null) {
            this._appRootElement = document.createElement("div");
            this._appRootElement.classList.add("PreactButtonPlugin-dialog");
    
            document.body.appendChild(this._appRootElement);
                        
            createRoot(this._appRootElement).render(
                <StrictMode>
                    <PreactDialog paellaPlugin={this} children={this.getReactNode()} />                    
                </StrictMode>
            );
            // We need to wait a bit to ensure the dialog is rendered
            // Otherwise, the dialogRef will be null when we try to show it
            setTimeout(() => this.dialogRef?.current?.show(), 50);
        }
        if (this.dialogRef?.current?.open) {
            this.dialogRef?.current?.close();
        }
        else {
            this.dialogRef?.current?.show();
        }
    }

    async getContent(): Promise<HTMLElement> {
        if (this._appRootElement === null) {
            this._appRootElement = document.createElement("div");        
            this._appRootElement.classList.add("PreactButtonPlugin-popup");
        
            createRoot(this._appRootElement).render(
                <StrictMode>
                    <PreactContainer paellaPlugin={this} children={this.getReactNode()} />
                </StrictMode>
            );
        }
        return this._appRootElement;
    }

    getReactNode(): ReactNode {        
        return (
            <div> Hola </div>
        );
    }
}


type PreactDialogProps = {
    paellaPlugin: PreactButtonPlugin;
    children?: ReactNode;
};

const PreactDialog = ({paellaPlugin, children}: PreactDialogProps) => {
    paellaPlugin.dialogRef = useRef<HTMLDialogElement>(null);
    const closeIcon = paellaPlugin.player.getCustomPluginIcon(paellaPlugin.name, "close") || CloseIcon;

    const hideDialog = () => {
        paellaPlugin.dialogRef?.current?.close();
    }

    return (
        <dialog ref={paellaPlugin.dialogRef}>
            <div className="dialog-content">
                <header>
                    <button onClick={() => hideDialog()}><span dangerouslySetInnerHTML={{ __html: closeIcon }}/></button>
                </header>
                <PreactContainer paellaPlugin={paellaPlugin}>
                    {children}
                </PreactContainer>
            </div>
        </dialog>
    );
}


type PreactContainerProps = {
    paellaPlugin: PreactButtonPlugin;
    children?: ReactNode;
};

const PreactContainer = ({paellaPlugin, children}: PreactContainerProps) => {    
    return (     
        <PaellaPluginContext.Provider value={paellaPlugin}>
            {children}
        </PaellaPluginContext.Provider>   
    );
};