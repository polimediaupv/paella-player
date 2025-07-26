import { createElementWithHtmlText, PopUpButtonPlugin, type PopUpButtonPluginConfig } from '@asicupv/paella-core';
import PackagePluginModule from './PackagePluginModule';
import BooksIcon from '../icons/book-open-text.svg?raw';
import '../css/RelatedDocument.css';
import '../css/RelatedDocument-markdown.css';
import type { marked } from 'marked';

export type RelatedDocument = {
    title: string;
    content?: {
        data: string;
        mimeType: string;
    },
    media?: {
        url: string;
        mimeType: string;
    }
};

export type RelatedDocuments = RelatedDocument[];


export type RelatedDocumentsPluginconfig = PopUpButtonPluginConfig & {
    dataContext?: string;
};

export default class RelatedDocumentsPlugin extends PopUpButtonPlugin<RelatedDocumentsPluginconfig> {    
    contentToShow: RelatedDocuments = [];
    marked?: typeof marked;

    getPluginModuleInstance() {
        return PackagePluginModule.Get();
    }

    get name() {
        return super.name || 'es.upv.paella.relatedDocuments';
    }

    getAriaLabel() {
        return this.player.translate('Related documents');
    }

    getDescription() {
        return this.getAriaLabel();
    }


    async getHelp() {
        return {
            title: this.player.translate('Related documents'),
            description: this.player.translate('Displays a list of documents related to the current video.')
        };
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, 'buttonIcon') || BooksIcon;
    }

    async isEnabled(): Promise<boolean> {
        if (!(await super.isEnabled())) {
            return false;
        }

        this.contentToShow = await this.player.data.read<RelatedDocuments>(this.config.dataContext ?? "related.documents", "documents") ?? [];          

        return this.contentToShow.length > 0;
    }
    

    async getMarkdownParser(): Promise<typeof marked> {
        if (!this.marked) {
            // Dynamically import the marked library and its plugins        
            const { marked } = await import('marked');
            const { default: markedAlert } = await import('marked-alert');
            const { markedEmoji } = await import("marked-emoji");                
            
            const {allEmojis} = await import('../utils/emojis');
            
            const options = {
                emojis: allEmojis,
                renderer: (token: any) => token.emoji
            };

            
            this.marked = marked
                .setOptions({
                    gfm: true,
                    breaks: true,
                })
                .use(markedAlert())
                .use(markedEmoji(options));
        }

        return this.marked;
    }

    async getContent() {
        const container = createElementWithHtmlText(`
            <div class="relared-documents-container">
                <div class="relared-documents-tabs"></div>
                <div class="relared-documents-display"></div>
            </div>
        `);

        const tabsContainer = container.querySelector('.relared-documents-tabs') as HTMLDivElement;
        const display = container.querySelector('.relared-documents-display') as HTMLDivElement;

        const maxTabs = 5; // Maximum number of tabs before using a selector

        const updateDisplay = async (index: number) => {
            const data = this.contentToShow[index];
            let contentHtml = '';

            if (data.content?.mimeType === 'text/markdown' && data.content?.data) {
                    const marked = await this.getMarkdownParser();
                    const markedHtml = await marked.parse(data.content.data);
                    contentHtml = `<div class="markdown-body">${markedHtml}</div>`;
            } 
            else if (data.content?.mimeType === 'application/json' && data.content?.data) {
                try {
                    const jsonData = JSON.parse(data.content.data);
                    contentHtml = `<pre>${JSON.stringify(jsonData, null, 2)}</pre>`;
                } catch (error) {
                    contentHtml = `<pre>${data.content.data}</pre>`;
                }
            } 
            else if (data.content?.mimeType === 'text/plain' && data.content?.data) {
                contentHtml = `<pre style="white-space: pre-wrap;">${data.content.data}</pre>`;
            } 
            else {
                contentHtml = `<pre style="white-space: pre-wrap;">${data.content?.data || 'No content available.'}</pre>`;
            }

            display.innerHTML = `                                
                ${data.media?.url ? `
                    <video 
                        controls 
                        src="${data.media.url}" 
                        type="${data.media.mimeType}" 
                        style="${data.media.mimeType.startsWith('audio/') ? 'width: 100%; height: 32px;' : 'max-width: 100%;'}">
                    </video>` : ''}
                ${contentHtml}
            `;

            // Update active tab
            tabsContainer.querySelectorAll('.relared-documents-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            const activeTab = tabsContainer.querySelector(`[data-index="${index}"]`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
        };

        // Create tabs for the first few documents
        this.contentToShow.slice(0, maxTabs).forEach((data, index) => {
            const tab = document.createElement('button');
            tab.className = 'relared-documents-tab';
            tab.textContent = data.title;
            tab.setAttribute('data-index', index.toString());
            tab.addEventListener('click', () => updateDisplay(index));
            tabsContainer.appendChild(tab);
        });

        // If there are more documents, add a selector directly
        if (this.contentToShow.length > maxTabs) {
            const selector = document.createElement('select');
            selector.className = 'relared-documents-selector';
            this.contentToShow.slice(maxTabs).forEach((data, index) => {
                const option = document.createElement('option');
                option.value = index.toString();
                option.textContent = data.title;
                selector.appendChild(option);
            });

            selector.addEventListener('change', () => updateDisplay(parseInt(selector.value, 10)));
            tabsContainer.appendChild(selector);
        }

        // Initialize display with the first document
        if (this.contentToShow.length > 0) {
            await updateDisplay(0);
        }

        return container;
    }

}
