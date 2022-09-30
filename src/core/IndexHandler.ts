import * as vscode from 'vscode';

export class IndexHandler {
    /**
     * index recorder
     */
    private indexMap = new Map;

    constructor() {
        // init the index recorder datas
		this.indexMap.set('#', 0);
		this.indexMap.set('##', 0);
		this.indexMap.set('###', 0);
		this.indexMap.set('####', 0);
    }

    /**
     * 
     * @param lineContent Per line of content.
     */
    public indexRecord(lineContent: string) {
        if(lineContent.startsWith('# ')) {
            this.indexMap.set('# '.trim(), 1+this.indexMap.get('#'));
        }
        else if(lineContent?.startsWith('## ')) {
            this.indexMap.set('## '.trim(), 1+this.indexMap.get('##'));
            this.indexMap.set('### '.trim(), 0); // reset ### count when ## was encountered
        }
        else if(lineContent?.startsWith('### ')) {
            this.indexMap.set('### '.trim(), 1+this.indexMap.get('###'));
            this.indexMap.set('#### '.trim(), 0); // reset ('#### count when ('### was encountered
        }
        else if(lineContent?.startsWith('#### ')) {
            this.indexMap.set('#### '.trim(), 1+this.indexMap.get('####'));
            this.indexMap.set('##### '.trim(), 0); // reset ('#### count when ('### was encountered
        }
    }

    /**
     * clear old title index, if it is title's line to handle or not.
     * @param lineContent 
     * @returns 
     */
    public clearIndexOfLine(lineContent: string) {
        let lineContentTmp;
        if(lineContent.startsWith('#')) {
            let lineContentOfClear = new Array();
            lineContent.split(' ').forEach((value, index)=>{
                // if only contains numbers and dots, continue
                const regex = /^[0-9.]*$/;
                if(!(index===1 && regex.test(value))) {
                    lineContentOfClear.push(value);
                }
            });
            lineContentTmp = lineContentOfClear.join(' ');
        } else {
            lineContentTmp = lineContent;
        }

        return lineContentTmp;
    }

    /**
     * add index of title
     * @param lineContent 
     * @returns 
     */
    public addIndex(lineContent: string) {
        let flag: string;
        // Second-level title index
        if(lineContent?.startsWith('## ')) {
            flag = '## ';
            lineContent = flag 
                + this.indexMap.get('##') + '.'
                + lineContent.substring(flag.trim().length);
        }
        // Three-level title index
        else if(lineContent?.startsWith('### ')) {
            flag = '### ';
            lineContent = flag 
                + this.indexMap.get('##') + '.' + this.indexMap.get('###') + '.'
                + lineContent.substring(flag.trim().length);
        }
        // Four-level title index
        else if(lineContent?.startsWith('#### ')) {
            flag = '#### ';
            lineContent = flag 
                + this.indexMap.get('##') + '.' + this.indexMap.get('###') + '.' + this.indexMap.get('####') + '.' 
                + lineContent.substring(flag.trim().length);
        }

        return lineContent; 
    }

}