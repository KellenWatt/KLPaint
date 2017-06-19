import {Point, Tool} from "./definitions.js";
import Layer from "./PaintLayer.js";


class Paint {
    workspace: HTMLElement;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    currentLayer: Layer;
    layers: Layer[];
    colors: [string, string];
    weight: number;
    currentTool: Tool;
    fill: boolean;

    image: HTMLImageElement;
    textbox: HTMLTextAreaElement;

    layerCounter: number;

    colorChangeCallback: () => void;

    mouse: Point;
    mouseLock: Point;
    mouseMoved: boolean;

    points: Point[];

    constructor(workspace: HTMLElement, primary: string, secondary: string) {
        
    }
}
