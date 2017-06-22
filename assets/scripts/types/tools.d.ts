import {Paint} from "Paint";

interface IPoint {
    x: number;
    y: number;
}

interface ITool {
    paint: Paint;
    prep: (controller: Paint) => void;
    draw: () => void;
    finish: () => void;
}

export {IPoint, ITool};
