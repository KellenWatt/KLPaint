class Point {
    constructor(public x: number, public y: number){}
}

type Tool = "pencil"  |
            "brush"   |
            "circle"  |
            "square"  |
            "line"    |
            "text"    |
            "eraser"  |
            "dropper" |
            "color"   |
            "image";

export {Point, Tool};
