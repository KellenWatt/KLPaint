import {Point, Tool} from "./definitions"

export class HistoryNode {
    constructor(public tool: Tool | null,
                public color: string | null,
                public fill: boolean | null,
                public weight: number | null,
                public x: number | null,
                public y: number | null,
                public dx: number | null,
                public dy: number | null,
                public imageData: string,
                public points: Point[]) {}
}

export class HistoryLayer {
    versions: HistoryNode[];
    private _selectedVersion: number;

    constructor() {
        this.versions = [];
        this._selectedVersion = 0;
    }

    addAction(node: HistoryNode) : void {
        this.versions.push(node);
        if(this.versions.length > 2) {
            this.versions.shift();
        }
        this._selectedVersion = this.versions.length - 1;
    }

    currentVersion(version: number) : HistoryNode {
        return this.versions[version];
    }

    branchCount() : number {
        return this.versions.length;
    }

    get selectedVersion() : number {
        return this._selectedVersion;
    }
}

export default class PaintHistory {
    states: HistoryLayer[];
    currentLayer: number;
    version: number;
    inPrevState: boolean;

    constructor(image: string) {
        this.states = [];
        this.currentLayer = 0;
        this.version = 0;
        this.inPrevState = false;
        this.states.push(new HistoryLayer());
        this.states[0].addAction(new HistoryNode(null, null, null, null, null, null, null, null, image, null));
    }

    pushAction(tool: Tool, color: string, fill: boolean,
               weight: number, x: number, dx: number,
               y: number, dy: number, image: string,
               points: Point[]) : void {
        if(!this.inPrevState) {
            this.states.push(new HistoryLayer());
        }
        this.currentLayer += 1;
        if(this.currentLayer == this.states.length-1) {
            this.inPrevState = false;
        }

        this.states[this.currentLayer].addAction(
            new HistoryNode(tool, color, fill, weight, x, y, dx, dy, image, points));
    }

    undo(index: number, version: number) : void {
        if(this.currentLayer != 0) {
            this.inPrevState = true;
            this.currentLayer= index;
            this.version = version;
        }
    }

    quickUndo() : void {
        if(this.currentLayer != 0) {
            this.inPrevState = true;
            this.currentLayer -= 1;
            this.version = this.states[this.currentLayer].selectedVersion;
        }
    }

    redo(index: number, version: number) : void{
        if(this.currentLayer != this.states.length - 1) {
            this.currentLayer = index;
            this.version = version;
            if(index == this.states.length - 1) {
                this.inPrevState = false;
            }
        }
    }

    quickRedo() : void {
        if(this.currentLayer != this.states.length - 1) {
            this.currentLayer += 1;
            this.version = this.states[this.currentLayer].selectedVersion;
            if(this.currentLayer == this.states.length - 1) {
                this.inPrevState = false;
            }
        }
    }

    fullHistory() : HistoryLayer[] {
        return this.states;
    }

    getcurrentState() : HistoryLayer {
        return this.states[this.currentLayer];
    }

    getImageData(version: number) : string {
        return this.states[this.currentLayer].currentVersion(version).imageData;
    }
}
