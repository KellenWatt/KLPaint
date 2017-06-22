import {Paint} from "Paint";
import {ITool, ToolName} from "../types/tools";
import {Point} from "../definitions";

export default class Color implements ITool {
    paint: Paint;
    drawOnMove: () => void;
    readonly name: ToolName;

    colorChooser: HTMLInputElement;

    constructor() {
        this.name = "color"
        this.drawOnMove = this.draw.bind(this);

        this.colorChooser = document.createElement("input");
        this.colorChooser.type = "color";
        this.colorChooser.addEventListener("change", (e) => {
            let color = (e.target as HTMLInputElement).value;
            this.paint.setColors(color, color);
        })
    }

    prep(paint: Paint) : void { this.paint = paint;}

    draw() : void {}

    finish() : void {
        this.colorChooser.click();
    }
}
