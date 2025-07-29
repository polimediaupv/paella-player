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
    const header = contentTableInfo?.header ? `<div class="table-info-pop-up-plugin-header">${contentTableInfo.header}</div>` : '';
    const footer = contentTableInfo?.footer ? `<div class="table-info-pop-up-plugin-footer">${contentTableInfo.footer}</div>` : '';

    const content = createElementWithHtmlText(`
    <div class="table-info-pop-up-plugin">
      ${header}
      <div class="table-info-pop-up-plugin-container">
        ${tableInfo
          .map(
            (category) => `
            <div class="table-info-pop-up-plugin-category">
              <h3 class="table-info-pop-up-plugin-category-title">${this.player.translate(category.category)}</h3>
              <div class="table-info-pop-up-plugin-list">
                ${category.rows
                  .map(
                    (row) => `
                    <div class="table-info-pop-up-plugin-row">
                      <div class="table-info-pop-up-plugin-key">${this.player.translate(row.key)}</div>
                      <div class="table-info-pop-up-plugin-value">${row.value}</div>
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