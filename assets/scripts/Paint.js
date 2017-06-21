define(["require", "exports", "./definitions", "./PaintLayer"], function (require, exports, definitions_1, PaintLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Paint = (function () {
        function Paint(workspace) {
            this.layers = [];
            this.layerCounter = 0;
            this.colors = ["#000000", "#000000"];
            this._weight = 10;
            this.currentTool = "pencil";
            this._fill = false;
            this.workspace = workspace;
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
                    this.layers[i].finalize;
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
            var angle = Math.atan2(this.mouseLock.x - this.mouse.x, this.mouseLock.y - this.mouse.y);
            for (var i = 0; i < dist; i += this.weight / 8) {
                var x = this.mouseLock.x + Math.sin(angle) * i;
                var y = this.mouseLock.y + Math.cos(angle) * i;
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
                        _this.canvas.addEventListener("mousemove", _this.drawPencil);
                        if (_this.fill) {
                            _this.context.save();
                            _this.context.lineWidth = 1;
                        }
                        break;
                    case "brush":
                        _this.context.save();
                        _this.canvas.addEventListener("mousemove", _this.drawBrush);
                        break;
                    case "circle":
                        _this.canvas.addEventListener("mousemove", _this.drawCircle);
                        break;
                    case "square":
                        _this.context.save();
                        _this.context.lineJoin = "miter";
                        _this.canvas.addEventListener("mousemove", _this.drawRectangle);
                        break;
                    case "line":
                        _this.canvas.addEventListener("mousemove", _this.drawLine);
                        break;
                    case "text":
                        _this.context.save();
                        _this.context.lineWidth = 1;
                        _this.context.strokeStyle = "#222";
                        _this.canvas.addEventListener("mousemove", _this.drawText);
                        break;
                    case "eraser":
                        _this.currentLayer.context.save();
                        _this.currentLayer.context.lineJoin = "round";
                        _this.currentLayer.context.lineCap = "round";
                        _this.currentLayer.context.globalCompositeOperation = "destination-out";
                        _this.currentLayer.context.beginPath();
                        _this.canvas.addEventListener("mousemove", _this.erase);
                        break;
                    case "dropper":
                        // needed for completeness
                        break;
                    case "color":
                        // needed for completeness
                        break;
                    case "image":
                        _this.canvas.addEventListener("mousemvoe", _this.drawImage);
                        break;
                    default:
                        alert("Invalid tool selection: " + _this.currentTool);
                        break;
                }
            });
            this.canvas.addEventListener("mouseup", function () {
                switch (_this.currentTool) {
                    case "pencil":
                        _this.canvas.removeEventListener("mousemove", _this.drawPencil);
                        if (_this.fill) {
                            var ctx = _this.currentLayer.context;
                            ctx.beginPath();
                            ctx.moveTo(_this.points[0].x, _this.points[0].y);
                            for (var _i = 0, _a = _this.points; _i < _a.length; _i++) {
                                var p = _a[_i];
                                ctx.lineTo(p.x, p.y);
                            }
                            ctx.fill();
                            ctx.closePath();
                            ctx.restore();
                        }
                        else {
                            _this.currentLayer.context.drawImage(_this.canvas, 0, 0);
                        }
                        if (_this.mouseMoved) {
                            var color = _this.fill ? _this.colors[0] : _this.colors[1];
                            _this.currentLayer.history.pushAction("pencil", color, _this.fill, _this.weight, _this.mouseLock.x, _this.mouseLock.y, _this.mouse.x - _this.mouseLock.x, _this.mouse.y - _this.mouseLock.y, _this.currentLayer.canvas.toDataURL(), _this.points);
                        }
                        _this.points = [];
                        break;
                    case "brush":
                        _this.canvas.removeEventListener("mousemove", _this.drawBrush);
                        _this.context.restore();
                        _this.currentLayer.context.drawImage(_this.canvas, 0, 0);
                        if (_this.mouseMoved) {
                            _this.currentLayer.history.pushAction("brush", _this.colors[0], false, _this.weight, _this.mouseLock.x, _this.mouseLock.y, _this.mouse.x - _this.mouseLock.x, _this.mouse.y - _this.mouseLock.y, _this.currentLayer.canvas.toDataURL(), _this.points);
                        }
                        _this.points = [];
                        break;
                    case "circle":
                        _this.canvas.removeEventListener("mousemove", _this.drawCircle);
                        _this.currentLayer.context.drawImage(_this.canvas, 0, 0);
                        if (_this.mouseMoved) {
                            var color = _this.fill ? _this.colors[0] : _this.colors[1];
                            _this.currentLayer.history.pushAction("circle", color, _this.fill, _this.weight, _this.mouseLock.x, _this.mouseLock.y, _this.mouse.x - _this.mouseLock.x, _this.mouse.y - _this.mouseLock.y, _this.currentLayer.canvas.toDataURL(), []);
                        }
                        break;
                    case "square":
                        _this.canvas.removeEventListener("mousemove", _this.drawRectangle);
                        _this.context.restore();
                        _this.currentLayer.context.drawImage(_this.canvas, 0, 0);
                        if (_this.mouseMoved) {
                            var color = _this.fill ? _this.colors[0] : _this.colors[1];
                            _this.currentLayer.history.pushAction("square", color, _this.fill, _this.weight, _this.mouseLock.x, _this.mouseLock.y, _this.mouse.x - _this.mouseLock.x, _this.mouse.y - _this.mouseLock.y, _this.currentLayer.canvas.toDataURL(), []);
                        }
                        break;
                    case "line":
                        _this.canvas.removeEventListener("mousemove", _this.drawLine);
                        _this.currentLayer.context.drawImage(_this.canvas, 0, 0);
                        if (_this.mouseMoved) {
                            _this.currentLayer.history.pushAction("line", _this.colors[1], false, _this.weight, _this.mouseLock.x, _this.mouseLock.y, _this.mouse.x - _this.mouseLock.x, _this.mouse.y - _this.mouseLock.y, _this.currentLayer.canvas.toDataURL(), []);
                        }
                        break;
                    case "text":
                        _this.canvas.removeEventListener("mousemove", _this.drawText);
                        textbox.style.left = _this.mouseLock.x + "px";
                        textbox.style.top = _this.mouseLock.y + "px";
                        textbox.style.width = _this.mouse.x - _this.mouseLock.x + "px";
                        textbox.style.height = _this.mouse.y - _this.mouseLock.y + "px";
                        _this.workspace.appendChild(textbox);
                        textbox.focus();
                        textbox.addEventListener("blur", function () {
                            _this.currentLayer.context.fillText(textbox.value, _this.mouseLock.x, _this.mouseLock.y, _this.mouse.x - _this.mouseLock.x);
                            textbox.value = "";
                            textbox.remove();
                            if (_this.mouseMoved) {
                                _this.currentLayer.history.pushAction("text", _this.colors[0], false, _this.weight, _this.mouseLock.x, _this.mouseLock.y, _this.mouse.x - _this.mouseLock.x, _this.mouse.y - _this.mouseLock.y, _this.currentLayer.canvas.toDataURL(), []);
                            }
                        });
                        _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                        _this.context.restore();
                        break;
                    case "eraser":
                        _this.canvas.removeEventListener("mousemove", _this.erase);
                        _this.currentLayer.context.restore();
                        if (_this.mouseMoved) {
                            _this.currentLayer.history.pushAction("eraser", _this.colors[0], _this.fill, _this.weight, _this.mouseLock.x, _this.mouseLock.y, _this.mouse.x - _this.mouseLock.x, _this.mouse.y - _this.mouseLock.y, _this.currentLayer.canvas.toDataURL(), _this.points);
                        }
                        _this.points = [];
                        break;
                    case "dropper":
                        var pix = _this.currentLayer.context
                            .getImageData(_this.mouse.x, _this.mouse.y, 1, 1).data;
                        var red = pix[0].toString(16);
                        var green = pix[1].toString(16);
                        var blue = pix[2].toString(16);
                        if (red.length == 1)
                            red = "0" + red;
                        if (green.length == 1)
                            green = "0" + green;
                        if (blue.length == 1)
                            blue = "0" + blue;
                        var colorString = "#" + red + green + blue;
                        _this.setColors(colorString, colorString);
                        break;
                    case "color":
                        colorChooser.click();
                        break;
                    case "image":
                        _this.canvas.removeEventListener("mousemove", _this.drawImage);
                        _this.currentLayer.context.drawImage(_this.canvas, 0, 0);
                        if (_this.mouseMoved) {
                            _this.currentLayer.history.pushAction("image", "#000000", false, _this.weight, _this.mouseLock.x, _this.mouseLock.y, _this.mouse.x - _this.mouseLock.x, _this.mouse.y - _this.mouseLock.y, _this.currentLayer.canvas.toDataURL(), []);
                        }
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
});
