import {Paint} from "Paint";

interface IPoint {
    x: number;
    y: number;
}

interface ITool {
    paint: Paint;
    readonly name: string;
    prep: (controller: Paint) => void;
    draw: () => void;
    finish: () => void;
}

type ToolName = string;

export {IPoint, ITool, ToolName};
