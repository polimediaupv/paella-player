import { createElementWithHtmlText } from './dom';
import PopUpButtonPlugin from './PopUpButtonPlugin';

import '../../css/TableInfoPopUpPlugin.css'

export default class TableInfoPopUpPlugin extends PopUpButtonPlugin {
  async getContentTableInfo() {
	return null;
  }

  async getContent() {
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
