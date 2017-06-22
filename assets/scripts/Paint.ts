import {Point} from "./definitions";
import Layer from "./PaintLayer";
import Pencil from "tools/pencil";
import Brush from "tools/brush";
import Circle from "tools/circle";
import Square from "tools/square";
import Line from "tools/line";
import Text from "tools/text";
import Eraser from "tools/eraser";
import Dropper from "tools/dropper";
import Color from "tools/color-picker";
import Imager from "tools/image";


let pencil = new Pencil();
let brush = new Brush();
let circle = new Circle();
let square = new Square();
let line = new Line();
let text = new Text();
let eraser = new Eraser();
let dropper = new Dropper();
let colorPicker = new Color();
let imager = new Imager();

// TODO: build in map of toolTypes, toss in init


export default class Paint {
    workspace: HTMLElement;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    currentLayer: Layer;
    layers: Layer[];
    private colors: [string, string];
    private _weight: number;
    private currentTool: string;
    private _fill: boolean;
    private image: HTMLImageElement;
    private layerCounter: number;

    colorChangeCallback?: (isPrimary: boolean, isSecondary: boolean) => void;

    mouse: Point;
    mouseLock: Point;
    mouseMoved: boolean;

    points: Point[];

    toolFunction: () => void;

    constructor(workspace: HTMLElement) {
        this.layers = [];
        this.layerCounter = 0;
        this.colors = ["#000000", "#000000"];
        this._weight = 10;
        this.currentTool = "pencil";
        this._fill = false;

        this.workspace = workspace;
        this.mouse = new Point(0, 0);
        this.mouseLock = new Point(0, 0);

        this.points = [];
    }

    get weight() : number {
        return this._weight;
    }

    set weight(wt: number) {
        this._weight = wt;
        this.context.lineWidth = wt;
        this.currentLayer.context.lineWidth = wt;
    }

    addAlpha(hex: string, alpha: number) : string {
        let red = parseInt(hex.substring(1,3), 16);
        let green = parseInt(hex.substring(3,5), 16);
        let blue = parseInt(hex.substring(5,7), 16);

        return `rgba(${red},${green},${blue},${alpha})`;
    }

    setColors(primary: string, secondary: string) : void {
        this.colors = [primary, secondary];
        if(typeof this.colorChangeCallback !== "undefined") {
            this.colorChangeCallback(true, true);
        }

        this.context.fillStyle = primary;
        this.currentLayer.context.fillStyle = primary;

        this.context.strokeStyle = secondary;
        this.currentLayer.context.strokeStyle = secondary;
    }

    get primaryColor() : string {
        return this.colors[0];
    }

    set primaryColor(color: string) {
        this.colors[0] = color;
        if(typeof this.colorChangeCallback !== "undefined") {
            this.colorChangeCallback(true, false);
        }

        this.context.fillStyle = color;
        this.currentLayer.context.fillStyle = color;
    }

    get secondaryColor() : string {
        return this.colors[1];
    }

    set secondaryColor(color: string) {
        this.colors[1] = color;
        if(typeof this.colorChangeCallback !== "undefined") {
            this.colorChangeCallback(false, true);
        }

        this.context.strokeStyle = color;
        this.currentLayer.context.strokeStyle = color;
    }

    setColorChangeCallback(cb: (p:boolean,s:boolean)=>void) : void {
        this.colorChangeCallback = cb;
    }

    addLayer() : Layer[] {
        this.layers.push(new Layer(this.workspace, ++this.layerCounter));
        return this.layers;
    }

    deleteLayer(id: number) : Layer[] {
        for(let i in this.layers) {
            if(this.layers[i].id === id) {
                this.layers[i].finalize();
                this.layers.splice(+i, 1)
                break;
            }
        }
        return this.layers;
    }

    switchLayer(id: number) : void {
        for(let layer of this.layers) {
            if(layer.id === id) {
                this.currentLayer = layer;
                break;
            }
        }
        this.currentLayer.context.fillStyle = this.context.fillStyle;
        this.currentLayer.context.strokeStyle = this.context.strokeStyle;
        this.currentLayer.context.lineWidth = this._weight;

    }

    get layerList() : Layer[] {
        return this.layers;
    }
    // Might need to add a getLayerNames method thing

    get tool() : string {
        return this.currentTool;
    }

    set tool(t: string) {
        this.currentTool = t;
    }

    get imageToolImage() : HTMLImageElement {
        return this.image;
    }

    set imageToolImage(img: HTMLImageElement) {
        this.image = img;
    }

    get fill() : boolean {
        return this._fill;
    }

    set fill(f: boolean) {
        this._fill = f;
    }

    get workingLayer() : Layer {
        return this.currentLayer;
    }

    get changed() : boolean {
        return this.mouseMoved;
    }

    undo(index?: number, version?: number) {
        version = typeof version === "undefined" ? 0 : version;
        if(typeof index === "undefined") {
            this.currentLayer.history.quickUndo();
        } else {
            this.currentLayer.history.undo(index, version);
        }
        let img = new Image();
        img.addEventListener("load", () => {
            this.currentLayer.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.currentLayer.context.drawImage(img, 0, 0);
            // do save/restore if slow.
        });
        img.src = this.currentLayer.history.getImageData(version);
    }

    redo(index?: number, version?: number) {
        version = typeof version === "undefined" ? 0 : version;
        if(typeof index === "undefined") {
            this.currentLayer.history.quickRedo();
        } else {
            this.currentLayer.history.redo(index, version);
        }
        let img = new Image();
        img.addEventListener("load", () => {
            this.currentLayer.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.currentLayer.context.drawImage(img, 0, 0);
        });
        img.src = this.currentLayer.history.getImageData(version);
    }

    reconstruct(json: string) : void {
        // server-side stuff
    }

    collapse() : string{
        let img = document.createElement("canvas");
        img.width = this.canvas.width;
        img.height = this.canvas.height;
        let ctx = img.getContext("2d");
        for(let i=this.layers.length-1; i >= 0; i--) {
            ctx.drawImage(this.layers[i].canvas, 0, 0);
        }

        return img.toDataURL();
    }

    nuke() : Layer[] {
        for(let layer of this.layers) {
            layer.finalize();
        }
        this.layers = [];
        this.layerCounter = 0;
        this.currentLayer = this.addLayer()[0];
        return this.layers;
    }

    clearCurrentLayer() : void {
        this.currentLayer.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // drawing functions

    private drawPencil() : void {
        this.mouseMoved = true;
        this.context.lineTo(this.mouse.x, this.mouse.y);
        this.context.stroke();
        this.points.push(new Point(this.mouse.x, this.mouse.y));
    }

    private drawBrush() : void {
        this.mouseMoved = true;
        let dist = Math.sqrt(Math.pow(this.mouseLock.x - this.mouse.x, 2)
                             + Math.pow(this.mouseLock.y - this.mouse.y, 2));
        let angle = Math.atan2(this.mouse.x - this.mouseLock.x,
                               this.mouse.y - this.mouseLock.y);

        for(let i=0; i < dist; i += this.weight / 8) {
            let x = this.mouseLock.x + (Math.sin(angle) * i);
            let y = this.mouseLock.y + (Math.cos(angle) * i);

            var radgrad = this.context.createRadialGradient(x, y, this.weight/4,
                                                            x, y, this.weight/2);
            radgrad.addColorStop(0, this.addAlpha(this.colors[0], 1));
            radgrad.addColorStop(0.5, this.addAlpha(this.colors[0], 0.5));
            radgrad.addColorStop(1, this.addAlpha(this.colors[0], 0));

            this.context.fillStyle = radgrad;
            this.context.fillRect(x - this.weight/2, y - this.weight/2,
                                  this.weight, this.weight);
            this.points.push(new Point(x, y));
        }

        this.mouseLock.x = this.mouse.x;
        this.mouseLock.y = this.mouse.y;
    }

    private drawCircle() : void {
        this.mouseMoved = true;
        let radius = Math.sqrt(Math.pow(this.mouse.x - this.mouseLock.x, 2)
                               + Math.pow(this.mouse.y - this.mouseLock.y, 2));

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();
        this.context.arc(this.mouseLock.x, this.mouseLock.y, radius, 0, 2*Math.PI);
        if(this.fill) {
            this.context.fill();
        } else {
            this.context.stroke();
        }
    }

    private drawRectangle() : void {
        this.mouseMoved = true;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();
        this.context.rect(this.mouseLock.x, this.mouseLock.y,
                          this.mouse.x - this.mouseLock.x,
                          this.mouse.y - this.mouseLock.y)
        if(this.fill) {
            this.context.fill();
        } else {
            this.context.stroke();
        }
    }

    private drawLine() : void {
        this.mouseMoved = true;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();
        this.context.moveTo(this.mouseLock.x, this.mouseLock.y);
        this.context.lineTo(this.mouse.x, this.mouse.y);
        this.context.stroke();
    }

    private drawText() : void {
        this.mouseMoved = true;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();
        this.context.rect(this.mouseLock.x, this.mouseLock.y,
                          this.mouse.x - this.mouseLock.x,
                          this.mouse.y - this.mouseLock.y);
        this.context.stroke();
    }

    private erase() : void {
        this.mouseMoved = true;
        let ctx = this.currentLayer.context;
        ctx.lineTo(this.mouse.x, this.mouse.y);
        ctx.stroke();
        this.points.push(new Point(this.mouse.x, this.mouse.y));
    }

    private drawImage() : void {
        this.mouseMoved = true;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.image, this.mouseLock.x, this.mouseLock.y,
                               this.mouse.x - this.mouseLock.x,
                               this.mouse.y - this.mouseLock.y);
    }


    init() : void {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.workspace.offsetWidth;
        this.canvas.height = this.workspace.offsetHeight;
        this.canvas.style.position = "absolute";
        this.canvas.style.left = "0";
        this.canvas.style.top = "0";
        this.workspace.appendChild(this.canvas);

        this.currentLayer = this.addLayer()[0];

        this.context = this.canvas.getContext("2d");

        this.context.lineCap = "round";
        this.context.lineJoin = "round";

        this.canvas.addEventListener("mousemove", (e) => {
            this.mouse.x = e.pageX - this.workspace.offsetLeft;
            this.mouse.y = e.pageY - this.workspace.offsetTop;
        });

        let colorChooser = document.createElement("input");
        colorChooser.type = "color";
        colorChooser.addEventListener("change", (e) => {
            let color = (e.target as HTMLInputElement).value;
            this.setColors(color, color);
        });

        let textbox = document.createElement("textarea");
        textbox.style.position = "absolute";

        this.canvas.addEventListener("mousedown", () => {
            this.context.beginPath();
            this.context.moveTo(this.mouse.x, this.mouse.y);
            this.mouseLock.x = this.mouse.x;
            this.mouseLock.y = this.mouse.y;
            this.mouseMoved = false;

            switch(this.currentTool) {
            case "pencil":
                pencil.prep(this);
                break;
            case "brush":
                brush.prep(this);
                break;
            case "circle":
                circle.prep(this);
                break;
            case "square":
                square.prep(this);
                break;
            case "line":
                line.prep(this);
                break;
            case "text":
                text.prep(this);
                break;
            case "eraser":
                eraser.prep(this);
                break;
            case "dropper":
                dropper.prep(this);
                break;
            case "color":
                // needed for completeness
                colorPicker.prep(this);
                break;
            case "image":
                // this.toolFunction = this.drawImage.bind(this);
                // this.canvas.addEventListener("mousemove", this.toolFunction);
                imager.prep(this);
                break;
            default:
                alert(`Invalid tool selection: ${this.currentTool}`);
                break;
            }
        });

        this.canvas.addEventListener("mouseup", () => {
            switch(this.currentTool) {
            case "pencil":
                pencil.finish();
                break;
            case "brush":
                brush.finish();
                break;
            case "circle":
                circle.finish();
                break;
            case "square":
                square.finish();
                break;
            case "line":
                line.finish();
                break;
            case "text":
                text.finish();
                break;
            case "eraser":
                eraser.finish();
                break;
            case "dropper":
                dropper.finish();
                break;
            case "color":
                colorPicker.finish();
                break;
            case "image":
                imager.finish();
                break;
            default:
                alert(`Invalid tool selection: ${this.currentTool}`);
                break;
            }
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        });

    }

}

export {Paint};
