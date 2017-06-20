class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
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
