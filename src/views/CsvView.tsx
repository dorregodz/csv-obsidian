import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import { WorkspaceLeaf, TextFileView } from 'obsidian';
import * as Papa from 'papaparse';
import TableContainer from "src/components/table/TableContainer";

export const CSV_VIEW_TYPE = 'csv-view'

export default class CsvView extends TextFileView {
    root: Root | null = null;

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

        this.renderReactCsvTable(container, data);
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
                <TableContainer data={parsed.data}/>
			</StrictMode>,
		);
    }
}