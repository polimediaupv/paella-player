import { createElementWithHtmlText } from './dom';
import PopUpButtonPlugin from './PopUpButtonPlugin';

import '../../css/TableInfoPopUpPlugin.css'

export type TableInfoPopUpPluginContent = {
	table: {
		category: string;
		rows: { key: string; value: string }[];
	}[];
	header?: string;
	footer?: string;
};

export default class TableInfoPopUpPlugin extends PopUpButtonPlugin {
	async getContentTableInfo(): Promise<TableInfoPopUpPluginContent | null> {
		return null;
	}

	async getContent() {
		const contentTableInfo = await this.getContentTableInfo();
		const tableInfo = contentTableInfo?.table || [];
		const header = contentTableInfo?.header ? `<div class="table-info-pop-up-plugin-header">${contentTableInfo.header}</div>` : '';
		const footer = contentTableInfo?.footer ? `<div class="table-info-pop-up-plugin-footer">${contentTableInfo.footer}</div>` : '';

		const content = createElementWithHtmlText(`<div class="table-info-pop-up-plugin">
			${header}
			<div class="table-info-pop-up-plugin-container">
				${tableInfo.map((category) => `
					<div class="table-info-pop-up-plugin-category">
					<h3 class="table-info-pop-up-plugin-category-title">${this.player.translate(category.category)}</h3>
					<div class="table-info-pop-up-plugin-list">
						${ category.rows.map((row) => `
							<div class="table-info-pop-up-plugin-row">
							<div class="table-info-pop-up-plugin-key">${this.player.translate(row.key)}</div>
							<div class="table-info-pop-up-plugin-value">${row.value}</div>
							</div>
						`)
						.join('') }
					</div>
					</div>
				`).join('')}
			</div>
				${footer}
			</div>
		`);

		return content;
	}
}
