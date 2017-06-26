define(["require", "exports", "./PaintHistory"], function (require, exports, PaintHistory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Layer = (function () {
        function Layer(parent, id) {
            this._id = id;
            this._name = "Layer " + this._id;
            this._canvas = document.createElement("canvas");
            this._canvas.width = parent.offsetWidth;
            this._canvas.height = parent.offsetHeight;
            this._canvas.style.position = "absolute";
            this._canvas.style.left = "0px";
            this._canvas.style.top = "0px";
            parent.insertBefore(this._canvas, parent.firstChild);
            this._context = this._canvas.getContext("2d");
            this._history = new PaintHistory_1.default(this._canvas.toDataURL());
        }
        Object.defineProperty(Layer.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layer.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (name) {
                this._name = name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layer.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layer.prototype, "context", {
            get: function () {
                return this._context;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layer.prototype, "history", {
            get: function () {
                return this._history;
            },
            enumerable: true,
            configurable: true
        });
        Layer.prototype.zoom = function () {
        };
        Layer.prototype.finalize = function () {
            this._id = -1;
            this._name = null;
            this._canvas.parentNode.removeChild(this._canvas);
            this._canvas = null;
            this._context = null;
        };
        return Layer;
    }());
    exports.Layer = Layer;
    exports.default = Layer;
});
