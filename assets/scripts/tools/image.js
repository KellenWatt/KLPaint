define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Images = (function () {
        function Images() {
            this.name = "pencil";
            this.drawOnMove = this.draw.bind(this);
        }
        Images.prototype.prep = function (paint) {
            this.paint = paint;
            this.paint.canvas.addEventListener("mousemove", this.drawOnMove);
        };
        Images.prototype.draw = function () {
            this.paint.mouseMoved = true;
            this.paint.context.clearRect(0, 0, this.paint.canvas.width, this.paint.canvas.height);
            this.paint.context.drawImage(this.paint.imageToolImage, this.paint.mouseLock.x, this.paint.mouseLock.y, this.paint.mouse.x - this.paint.mouseLock.x, this.paint.mouse.y - this.paint.mouseLock.y);
        };
        Images.prototype.finish = function () {
            this.paint.canvas.removeEventListener("mousemove", this.drawOnMove);
            this.paint.currentLayer.context.drawImage(this.paint.canvas, 0, 0);
            if (this.paint.mouseMoved) {
                this.paint.currentLayer.history.pushAction("image", "#000000", false, this.paint.weight, this.paint.mouseLock.x, this.paint.mouseLock.y, this.paint.mouse.x - this.paint.mouseLock.x, this.paint.mouse.y - this.paint.mouseLock.y, this.paint.currentLayer.canvas.toDataURL(), []);
            }
        };
        return Images;
    }());
    exports.default = Images;
});
