import { TFile, WorkspaceLeaf, TextFileView } from 'obsidian';
import * as Papa from 'papaparse';

export const CSV_VIEW_TYPE = 'csv-view'

export default class CsvView extends TextFileView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return CSV_VIEW_TYPE;
    }

    getDisplayText() {
        return this.file ? this.file.basename : 'CSV Viewer';
    }

    getViewData() : string {
        return this.data
    }

    async setViewData(data: string, clear: boolean) {
        this.data = data;

        const container = this.containerEl.children[1];
        container.empty();

        await this.renderCsvTable(container, data)
    }

    clear() {
        // Nothing to clear yet
    }

    async onClose() {
        // Nothing to clean up yet
    }

    private async renderCsvTable(container : Element, fileContent: string) {
        const parsed = Papa.parse(fileContent, { header: true });

        const table = document.createElement('table');

        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        for (const header of parsed.meta.fields) {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');
        for (const row of parsed.data) {
            const tr = document.createElement('tr');
            for (const cell of parsed.meta.fields) {
                const td = document.createElement('td');
                td.textContent = row[cell];
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        container.appendChild(table);
    }
}