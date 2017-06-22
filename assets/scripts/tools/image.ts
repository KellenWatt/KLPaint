import {Paint} from "Paint";
import {ITool, ToolName} from "../types/tools";
import {Point} from "../definitions";

export default class Images implements ITool {
    paint: Paint;
    drawOnMove: () => void;
    readonly name: ToolName;

    constructor() {
        this.name = "pencil";
        this.drawOnMove = this.draw.bind(this);
    }

    prep(paint: Paint) : void {
        this.paint = paint;
        this.paint.canvas.addEventListener("mousemove", this.drawOnMove);
    }

    draw() : void {
        this.paint.mouseMoved = true;
        this.paint.context.clearRect(0, 0, this.paint.canvas.width, this.paint.canvas.height);
        this.paint.context.drawImage(this.paint.imageToolImage, this.paint.mouseLock.x, this.paint.mouseLock.y,
                               this.paint.mouse.x - this.paint.mouseLock.x,
                               this.paint.mouse.y - this.paint.mouseLock.y);
    }

    finish() : void {
        this.paint.canvas.removeEventListener("mousemove", this.drawOnMove);
        this.paint.currentLayer.context.drawImage(this.paint.canvas, 0, 0);

        if(this.paint.mouseMoved) {
            this.paint.currentLayer.history.pushAction("image", "#000000", false,
                this.paint.weight, this.paint.mouseLock.x, this.paint.mouseLock.y,
                this.paint.mouse.x - this.paint.mouseLock.x, this.paint.mouse.y - this.paint.mouseLock.y,
                this.paint.currentLayer.canvas.toDataURL(), []);
        }
    }
}
