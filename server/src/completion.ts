/**
 * 
 */
import { IConnection, TextDocumentPositionParams, CompletionItem, CompletionItemKind } from 'vscode-languageserver';
import { DependentFiles } from './dependentFiles';
import { Constants } from './constants';

export class Completion {

    isIdCompletionActive: boolean;
    documentContent: string;

    constructor(public connection: IConnection, public dependentFiles: DependentFiles){
        this.isIdCompletionActive = false;
    }

    observe(content: string){
        this.connection.console.log(content);
        this.documentContent = content;
    }

    handler(textDocumentPosition: TextDocumentPositionParams): CompletionItem[] {
        let position = textDocumentPosition.position.character;
        let ch: string = this.documentContent.charAt(position-1);

        let completionResult: CompletionItem[] = new Array<CompletionItem>();

        if(ch === '#'){
            let ids = this.dependentFiles.getIds();

            ids.forEach(id => {
                let result = {
                    label: id,
                    kind: CompletionItemKind.Text,
                    data: ids.findIndex(x => x == id)
                };

                completionResult.push(result);
            });
        }

        console.log(ch);
        return completionResult;
    }

}