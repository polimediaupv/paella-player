import { createElementWithHtmlText, PopUpButtonPlugin, type PopUpButtonPluginConfig } from '@asicupv/paella-core';
import './TableInfoPopUpPlugin.css';


export type ContentTableInfo = {
  header?: string; // Optional header for the table
  footer?: string; // Optional footer for the table
  table: TableInfo[];
}

type TableInfo = {
  category: string;
  rows: { key: string; value: string }[];
};

export default class TableInfoPopUpPlugin<C extends PopUpButtonPluginConfig = PopUpButtonPluginConfig>  extends PopUpButtonPlugin<C> {
  async getContentTableInfo(): Promise<ContentTableInfo | null> {
    return null;
  }

  async getContent(): Promise<HTMLElement> {
    const contentTableInfo = await this.getContentTableInfo();
    const tableInfo = contentTableInfo?.table || [];
    const header = contentTableInfo?.header ? `<div class="TableInfoPopUpPlugin-header">${contentTableInfo.header}</div>` : '';
    const footer = contentTableInfo?.footer ? `<div class="TableInfoPopUpPlugin-footer">${contentTableInfo.footer}</div>` : '';

    const content = createElementWithHtmlText(`
    <div class="TableInfoPopUpPlugin">
      ${header}
      <div class="TableInfoPopUpPlugin-container">
        ${tableInfo
          .map(
            (category) => `
            <div class="TableInfoPopUpPlugin-category">
              <h3 class="TableInfoPopUpPlugin-category-title">${this.player.translate(category.category)}</h3>
              <div class="TableInfoPopUpPlugin-list">
                ${category.rows
                  .map(
                    (row) => `
                    <div class="TableInfoPopUpPlugin-row">
                      <div class="TableInfoPopUpPlugin-key">${this.player.translate(row.key)}</div>
                      <div class="TableInfoPopUpPlugin-value">${row.value}</div>
                    </div>
                  `
                  )
                  .join('')}
              </div>
            </div>
          `
          )
          .join('')}
      </div>
      ${footer}
    </div>
  `);

    return content;
  }
}