/**
 * This class finds all the dependent files and provide interface to read/search in a file. 
 */
import { IConnection } from 'vscode-languageserver';
var JSsoup = require('jssoup').default;
var fs = require('fs');
var path = require('path');

export class DependentFiles{

    fileName: string;
    dependentFileList: string[];
    
    ids: string[] = new Array<string>();

    constructor(public rootPath: string, public connection: IConnection){
        this.dependentFileList = new Array<string>();
    }

    public load(filePath: string ){
        this.fileName = path.basename(filePath);
        this.searchFile(this.rootPath);
        this.setAllId();
    }

    public setAllId(){
        this.dependentFileList.forEach(file => {
            let soup = new JSsoup(fs.readFileSync(file,'UTF-8'));
            let elements = soup.findAll();
            elements.forEach(element => {
                if(element.attrs.id != null){
                    this.ids.push(element.attrs.id);
                }
            });
        });
    }

    getIds(){
        return this.ids;
    }

    /**
     * Searches for dependent files
     * @param dir Directory in which to search for dependent file
     */
    private searchFile(dir: string){
        let files = fs.readdirSync(dir);
        files.forEach(file => {
            
            //Recursively search file
            if(fs.statSync(dir+"\\"+file).isDirectory()){
                this.searchFile(dir+"\\"+file);
            }

            if(file.endsWith(".html") || file.endsWith(".htm")){
                let filePath = dir+'\\'+file;
                let soup = new JSsoup(fs.readFileSync(filePath,'UTF-8'));
                let scriptTags = soup.findAll('script');
                scriptTags.forEach(tag => {
                    let jssrc = tag.attrs.src;
                    if(jssrc.endsWith(this.fileName)){
                        this.dependentFileList.push(filePath);
                    }
                });
            }
        });
    }
    
}
