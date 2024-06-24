import { Plugin, WorkspaceLeaf } from 'obsidian';
import CsvView, {CSV_VIEW_TYPE} from 'src/views/CsvView';

export default class MyPlugin extends Plugin {
	async onload() {
		this.registerExtensions(['csv'], CSV_VIEW_TYPE);
        this.registerView(CSV_VIEW_TYPE, (leaf: WorkspaceLeaf) => new CsvView(leaf));
	}

	onunload() {
		// Nothing to unload yet
	}
}
