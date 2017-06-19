interface Point {
    x: number;
    y: number;
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
