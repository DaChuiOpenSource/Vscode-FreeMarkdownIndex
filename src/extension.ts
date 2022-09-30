// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {TextEditor} from "vscode";
import { IndexHandler } from './core/IndexHandler';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "FreeMarkdownIndex" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('FreeMarkdownIndex.markdownAddIndex', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from FreeMarkdownIndex!');
		const editor: TextEditor | undefined = vscode.window.activeTextEditor;
		if (!editor) {
            vscode.window.showInformationMessage('No open text editor');
            return; // No open text editor
        }
		const document: vscode.TextDocument | undefined = editor?.document;
        if (document.languageId !== 'markdown') {
            vscode.window.showInformationMessage('Unsupported file type');
            return; // Unsupported file type
        }

		// get line numbers of the document of active editor
		let lineNums: number|undefined = document?.lineCount;
		if(lineNums === undefined || lineNums === 0) {
			vscode.window.showInformationMessage('No lines in the editor');
			return;
		}

		let indexHandler = new IndexHandler();
		let newContents = '';
		for (let index = 0; index < lineNums; index++) {
			// per line content
			let lineContent = document?.lineAt(index).text;
			// record the index ordinal datas
			indexHandler.indexRecord(lineContent);

			// clear index
			let lineContentTmp = indexHandler.clearIndexOfLine(lineContent);

			// add index
			lineContentTmp = indexHandler.addIndex(lineContentTmp);
			newContents += lineContentTmp + '\n';
		}

		let tmpSelection = editor.selection;
		// identify whether a region is selected, if no selected create a selection has all contents
		/* let selection = editor.selection;
		if(selection?.start.line===selection?.end.line && selection?.start.character===selection?.end.character) {
				selection = new vscode.Selection(0, 0, lineNums, 0);
		} */
		let selection = new vscode.Selection(0, 0, lineNums, 0);

		editor?.edit(editBuilder => {
			editBuilder.replace(new vscode.Range(selection?.start, selection?.end), newContents);
		});
		// set the cusor position
		editor.selection = new vscode.Selection(
			tmpSelection.start.line, 
			editor.document.lineAt(tmpSelection.start.line).text.length + 100, 
			tmpSelection.end.line, 
			editor.document.lineAt(tmpSelection.start.line).text.length + 100); // new vscode.Selection(0, 0, 0, 0);
		vscode.window.showInformationMessage('The title number was added successfully！');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
