import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import { WorkspaceLeaf, TextFileView, TFile } from 'obsidian';
import * as Papa from 'papaparse';
import TableContainer from "src/components/table/TableContainer";

export const CSV_VIEW_TYPE = 'csv-view'

export default class CsvView extends TextFileView {
    root: Root | null = null;
    file: TFile | null = null;

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
        return this.data;
    }

    async setViewData(data: string, clear: boolean) {
        this.data = data;

        const container = this.containerEl.children[1];
        container.empty();

        this.createSaveButton();
        this.renderReactCsvTable(container, data);
    }

    async onLoadFile(file: TFile) {
        this.file = file;
        const content = await this.app.vault.read(file);
        this.setViewData(content, false);   
    }

    async onSave(data: Array<object>) {
        const unparsed = Papa.unparse(data, { header: true });
        this.data = unparsed;
        this.save();
    }

    async save() {
        if (this.file === null) {
            return;
        }
        const data = this.getViewData()
        await this.app.vault.modify(this.file, data);
        await this.setViewData(data, false);
    }

    clear() {
        // Nothing to clear yet
    }

    async onClose() {
        this.root?.unmount();
    }

    private renderReactCsvTable(container : Element, fileContent: string) {
        this.root = createRoot(container);

        const parsed : Papa.ParseResult<{[key: string] : string}> = Papa.parse(fileContent, { header: true });

        this.root.render(
			<StrictMode>
                <TableContainer data={parsed.data} onSave={(data: Array<object>) => this.onSave(data)}/>
			</StrictMode>,
		);
    }

    private createSaveButton() : void {
        const saveCsvBtnClassName = 'save-csv-btn';

        const viewHeader = this.containerEl.children[0] as HTMLElement;
        const viewActions = viewHeader.querySelector('.view-actions') as HTMLElement;

        if (viewActions.querySelector(`.${saveCsvBtnClassName}`)) {
            return;
        }

        const button = document.createElement('button');
        button.innerText = "Save to file";
        button.className = `clickable-icon view-action ${saveCsvBtnClassName}`;
        // @ts-ignore ts(2339)
        button.onclick = () => {window.onSaveDzCsv && window.onSaveDzCsv()};

        viewActions.insertBefore(button, viewActions.firstChild);

    }
}