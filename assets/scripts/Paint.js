define(["require", "exports", "./definitions", "./PaintLayer", "tools/pencil", "tools/brush", "tools/circle", "tools/square", "tools/line", "tools/text", "tools/eraser", "tools/dropper", "tools/color-picker", "tools/image"], function (require, exports, definitions_1, PaintLayer_1, pencil_1, brush_1, circle_1, square_1, line_1, text_1, eraser_1, dropper_1, color_picker_1, image_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var pencil = new pencil_1.default();
    var brush = new brush_1.default();
    var circle = new circle_1.default();
    var square = new square_1.default();
    var line = new line_1.default();
    var text = new text_1.default();
    var eraser = new eraser_1.default();
    var dropper = new dropper_1.default();
    var colorPicker = new color_picker_1.default();
    var imager = new image_1.default();
    // TODO: build in map of toolTypes, toss in init
    var Paint = (function () {
        function Paint(workspace) {
            this.layers = [];
            this.layerCounter = 0;
            this.colors = ["#000000", "#000000"];
            this._weight = 10;
            this.currentTool = "pencil";
            this._fill = false;
            this.workspace = workspace;
            this.mouse = new definitions_1.Point(0, 0);
            this.mouseLock = new definitions_1.Point(0, 0);
            this.points = [];
        }
        Object.defineProperty(Paint.prototype, "weight", {
            get: function () {
                return this._weight;
            },
            set: function (wt) {
                this._weight = wt;
                this.context.lineWidth = wt;
                this.currentLayer.context.lineWidth = wt;
            },
            enumerable: true,
            configurable: true
        });
        Paint.prototype.addAlpha = function (hex, alpha) {
            var red = parseInt(hex.substring(1, 3), 16);
            var green = parseInt(hex.substring(3, 5), 16);
            var blue = parseInt(hex.substring(5, 7), 16);
            return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
        };
        Paint.prototype.setColors = function (primary, secondary) {
            this.colors = [primary, secondary];
            if (typeof this.colorChangeCallback !== "undefined") {
                this.colorChangeCallback(true, true);
            }
            this.context.fillStyle = primary;
            this.currentLayer.context.fillStyle = primary;
            this.context.strokeStyle = secondary;
            this.currentLayer.context.strokeStyle = secondary;
        };
        Object.defineProperty(Paint.prototype, "primaryColor", {
            get: function () {
                return this.colors[0];
            },
            set: function (color) {
                this.colors[0] = color;
                if (typeof this.colorChangeCallback !== "undefined") {
                    this.colorChangeCallback(true, false);
                }
                this.context.fillStyle = color;
                this.currentLayer.context.fillStyle = color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Paint.prototype, "secondaryColor", {
            get: function () {
                return this.colors[1];
            },
            set: function (color) {
                this.colors[1] = color;
                if (typeof this.colorChangeCallback !== "undefined") {
                    this.colorChangeCallback(false, true);
                }
                this.context.strokeStyle = color;
                this.currentLayer.context.strokeStyle = color;
            },
            enumerable: true,
            configurable: true
        });
        Paint.prototype.setColorChangeCallback = function (cb) {
            this.colorChangeCallback = cb;
        };
        Paint.prototype.addLayer = function () {
            this.layers.push(new PaintLayer_1.default(this.workspace, ++this.layerCounter));
            return this.layers;
        };
        Paint.prototype.deleteLayer = function (id) {
            for (var i in this.layers) {
                if (this.layers[i].id === id) {
                    this.layers[i].finalize();
                    this.layers.splice(+i, 1);
                    break;
                }
            }
            return this.layers;
        };
        Paint.prototype.switchLayer = function (id) {
            for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                if (layer.id === id) {
                    this.currentLayer = layer;
                    break;
                }
            }
            this.currentLayer.context.fillStyle = this.context.fillStyle;
            this.currentLayer.context.strokeStyle = this.context.strokeStyle;
            this.currentLayer.context.lineWidth = this._weight;
        };
        Object.defineProperty(Paint.prototype, "layerList", {
            get: function () {
                return this.layers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Paint.prototype, "tool", {
            // Might need to add a getLayerNames method thing
            get: function () {
                return this.currentTool;
            },
            set: function (t) {
                this.currentTool = t;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Paint.prototype, "imageToolImage", {
            get: function () {
                return this.image;
            },
            set: function (img) {
                this.image = img;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Paint.prototype, "fill", {
            get: function () {
                return this._fill;
            },
            set: function (f) {
                this._fill = f;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Paint.prototype, "workingLayer", {
            get: function () {
                return this.currentLayer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Paint.prototype, "changed", {
            get: function () {
                return this.mouseMoved;
            },
            enumerable: true,
            configurable: true
        });
        Paint.prototype.undo = function (index, version) {
            var _this = this;
            version = typeof version === "undefined" ? 0 : version;
            if (typeof index === "undefined") {
                this.currentLayer.history.quickUndo();
            }
            else {
                this.currentLayer.history.undo(index, version);
            }
            var img = new Image();
            img.addEventListener("load", function () {
                _this.currentLayer.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                _this.currentLayer.context.drawImage(img, 0, 0);
                // do save/restore if slow.
            });
            img.src = this.currentLayer.history.getImageData(version);
        };
        Paint.prototype.redo = function (index, version) {
            var _this = this;
            version = typeof version === "undefined" ? 0 : version;
            if (typeof index === "undefined") {
                this.currentLayer.history.quickRedo();
            }
            else {
                this.currentLayer.history.redo(index, version);
            }
            var img = new Image();
            img.addEventListener("load", function () {
                _this.currentLayer.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                _this.currentLayer.context.drawImage(img, 0, 0);
            });
            img.src = this.currentLayer.history.getImageData(version);
        };
        Paint.prototype.reconstruct = function (json) {
            // server-side stuff
        };
        Paint.prototype.collapse = function () {
            var img = document.createElement("canvas");
            img.width = this.canvas.width;
            img.height = this.canvas.height;
            var ctx = img.getContext("2d");
            for (var i = this.layers.length - 1; i >= 0; i--) {
                ctx.drawImage(this.layers[i].canvas, 0, 0);
            }
            return img.toDataURL();
        };
        Paint.prototype.nuke = function () {
            for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                layer.finalize();
            }
            this.layers = [];
            this.layerCounter = 0;
            this.currentLayer = this.addLayer()[0];
            return this.layers;
        };
        Paint.prototype.clearCurrentLayer = function () {
            this.currentLayer.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
        // drawing functions
        Paint.prototype.drawPencil = function () {
            this.mouseMoved = true;
            this.context.lineTo(this.mouse.x, this.mouse.y);
            this.context.stroke();
            this.points.push(new definitions_1.Point(this.mouse.x, this.mouse.y));
        };
        Paint.prototype.drawBrush = function () {
            this.mouseMoved = true;
            var dist = Math.sqrt(Math.pow(this.mouseLock.x - this.mouse.x, 2)
                + Math.pow(this.mouseLock.y - this.mouse.y, 2));
            var angle = Math.atan2(this.mouse.x - this.mouseLock.x, this.mouse.y - this.mouseLock.y);
            for (var i = 0; i < dist; i += this.weight / 8) {
                var x = this.mouseLock.x + (Math.sin(angle) * i);
                var y = this.mouseLock.y + (Math.cos(angle) * i);
                var radgrad = this.context.createRadialGradient(x, y, this.weight / 4, x, y, this.weight / 2);
                radgrad.addColorStop(0, this.addAlpha(this.colors[0], 1));
                radgrad.addColorStop(0.5, this.addAlpha(this.colors[0], 0.5));
                radgrad.addColorStop(1, this.addAlpha(this.colors[0], 0));
                this.context.fillStyle = radgrad;
                this.context.fillRect(x - this.weight / 2, y - this.weight / 2, this.weight, this.weight);
                this.points.push(new definitions_1.Point(x, y));
            }
            this.mouseLock.x = this.mouse.x;
            this.mouseLock.y = this.mouse.y;
        };
        Paint.prototype.drawCircle = function () {
            this.mouseMoved = true;
            var radius = Math.sqrt(Math.pow(this.mouse.x - this.mouseLock.x, 2)
                + Math.pow(this.mouse.y - this.mouseLock.y, 2));
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.beginPath();
            this.context.arc(this.mouseLock.x, this.mouseLock.y, radius, 0, 2 * Math.PI);
            if (this.fill) {
                this.context.fill();
            }
            else {
                this.context.stroke();
            }
        };
        Paint.prototype.drawRectangle = function () {
            this.mouseMoved = true;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.beginPath();
            this.context.rect(this.mouseLock.x, this.mouseLock.y, this.mouse.x - this.mouseLock.x, this.mouse.y - this.mouseLock.y);
            if (this.fill) {
                this.context.fill();
            }
            else {
                this.context.stroke();
            }
        };
        Paint.prototype.drawLine = function () {
            this.mouseMoved = true;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.beginPath();
            this.context.moveTo(this.mouseLock.x, this.mouseLock.y);
            this.context.lineTo(this.mouse.x, this.mouse.y);
            this.context.stroke();
        };
        Paint.prototype.drawText = function () {
            this.mouseMoved = true;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.beginPath();
            this.context.rect(this.mouseLock.x, this.mouseLock.y, this.mouse.x - this.mouseLock.x, this.mouse.y - this.mouseLock.y);
            this.context.stroke();
        };
        Paint.prototype.erase = function () {
            this.mouseMoved = true;
            var ctx = this.currentLayer.context;
            ctx.lineTo(this.mouse.x, this.mouse.y);
            ctx.stroke();
            this.points.push(new definitions_1.Point(this.mouse.x, this.mouse.y));
        };
        Paint.prototype.drawImage = function () {
            this.mouseMoved = true;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.drawImage(this.image, this.mouseLock.x, this.mouseLock.y, this.mouse.x - this.mouseLock.x, this.mouse.y - this.mouseLock.y);
        };
        Paint.prototype.init = function () {
            var _this = this;
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
            this.canvas.addEventListener("mousemove", function (e) {
                _this.mouse.x = e.pageX - _this.workspace.offsetLeft;
                _this.mouse.y = e.pageY - _this.workspace.offsetTop;
            });
            var colorChooser = document.createElement("input");
            colorChooser.type = "color";
            colorChooser.addEventListener("change", function (e) {
                var color = e.target.value;
                _this.setColors(color, color);
            });
            var textbox = document.createElement("textarea");
            textbox.style.position = "absolute";
            this.canvas.addEventListener("mousedown", function () {
                _this.context.beginPath();
                _this.context.moveTo(_this.mouse.x, _this.mouse.y);
                _this.mouseLock.x = _this.mouse.x;
                _this.mouseLock.y = _this.mouse.y;
                _this.mouseMoved = false;
                switch (_this.currentTool) {
                    case "pencil":
                        pencil.prep(_this);
                        break;
                    case "brush":
                        brush.prep(_this);
                        break;
                    case "circle":
                        circle.prep(_this);
                        break;
                    case "square":
                        square.prep(_this);
                        break;
                    case "line":
                        line.prep(_this);
                        break;
                    case "text":
                        text.prep(_this);
                        break;
                    case "eraser":
                        eraser.prep(_this);
                        break;
                    case "dropper":
                        dropper.prep(_this);
                        break;
                    case "color":
                        // needed for completeness
                        colorPicker.prep(_this);
                        break;
                    case "image":
                        // this.toolFunction = this.drawImage.bind(this);
                        // this.canvas.addEventListener("mousemove", this.toolFunction);
                        imager.prep(_this);
                        break;
                    default:
                        alert("Invalid tool selection: " + _this.currentTool);
                        break;
                }
            });
            this.canvas.addEventListener("mouseup", function () {
                switch (_this.currentTool) {
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
                        alert("Invalid tool selection: " + _this.currentTool);
                        break;
                }
                _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            });
        };
        return Paint;
    }());
    exports.Paint = Paint;
    exports.default = Paint;
});
