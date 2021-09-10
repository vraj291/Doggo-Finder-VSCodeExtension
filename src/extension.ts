import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('doggo-finder.helloWorld', () => {
	// 		vscode.window.showInformationMessage('Ho Gandu!');
	// 	})
	// );

	context.subscriptions.push(
		
		vscode.commands.registerCommand('doggo-finder.getDog', () => {
			
			const columnToShowIn = vscode.window.activeTextEditor
        		? vscode.window.activeTextEditor.viewColumn
        		: undefined;
			
			if(currentPanel){
				currentPanel.reveal(columnToShowIn);
			}else{
				currentPanel= vscode.window.createWebviewPanel(
					'doggo-finder',
					'Doggo Finder',
					columnToShowIn? columnToShowIn : vscode.ViewColumn.One,
					{
						enableScripts: true
					}
				);
				const stylesUri = currentPanel.webview.asWebviewUri(
					vscode.Uri.file(
						path.join(context.extensionPath, 'public', 'main.css')
					)
				);
				currentPanel.webview.html = getWebviewContent(stylesUri);
			}

			currentPanel.webview.onDidReceiveMessage(
				message => {
				  switch (message.command) {
					case 'exit':
					  currentPanel?.dispose();
					  return;
				  }
				},
				undefined,
				context.subscriptions
			);

			currentPanel.onDidDispose(
				() => {
				  currentPanel = undefined;
				},
				null,
				context.subscriptions
			);
		})
	);
}

function getWebviewContent(stylesUri : any) {
	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cat Coding</title>
	  <link href="${stylesUri}" rel="stylesheet">
  </head>
  <body>
	  <div class="title"> Here is A GOOD BOY just for you !</div>
	  <div class="wrapper">
	  	<img id="dog" width="475" height="400"/>
	  	<div class="subtitle" id="breed"></div>
	  	<button class="butt" onclick="getDog()"> Another One? </button>
		  <button class="butt" onclick="exit()"> Maybe Later </button>
	  </div>
	  <script>

	  	const vscode = acquireVsCodeApi();
	  	const image = document.getElementById('dog')
		const breed = document.getElementById('breed')

		const getDog = async () => {
	  		fetch('https://dog.ceo/api/breeds/image/random')
	  		.then(response => response.json())
	  		.then(data => {
				image.src = data.message
				breed.innerHTML = data.message.slice(30,data.message.lastIndexOf('/')).toUpperCase()
			});
		}

		const exit = () => {
			vscode.postMessage({
				command: 'exit'
			})
		}

		getDog()

	  </script>
  </body>
  </html>`;
  }

export function deactivate() {}
