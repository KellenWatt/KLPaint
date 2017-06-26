define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HistoryNode = (function () {
        function HistoryNode(tool, color, fill, weight, x, y, dx, dy, imageData, points) {
            this.tool = tool;
            this.color = color;
            this.fill = fill;
            this.weight = weight;
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.imageData = imageData;
            this.points = points;
        }
        return HistoryNode;
    }());
    exports.HistoryNode = HistoryNode;
    var HistoryLayer = (function () {
        function HistoryLayer() {
            this.versions = [];
            this._selectedVersion = 0;
        }
        HistoryLayer.prototype.addAction = function (node) {
            this.versions.push(node);
            if (this.versions.length > 2) {
                this.versions.shift();
            }
            this._selectedVersion = this.versions.length - 1;
        };
        HistoryLayer.prototype.currentVersion = function (version) {
            return this.versions[version];
        };
        HistoryLayer.prototype.branchCount = function () {
            return this.versions.length;
        };
        Object.defineProperty(HistoryLayer.prototype, "selectedVersion", {
            get: function () {
                return this._selectedVersion;
            },
            enumerable: true,
            configurable: true
        });
        return HistoryLayer;
    }());
    exports.HistoryLayer = HistoryLayer;
    var PaintHistory = (function () {
        function PaintHistory(image) {
            this.states = [];
            this.currentLayer = 0;
            this.version = 0;
            this.inPrevState = false;
            this.states.push(new HistoryLayer());
            this.states[0].addAction(new HistoryNode(null, null, null, null, null, null, null, null, image, null));
        }
        PaintHistory.prototype.pushAction = function (tool, color, fill, weight, x, dx, y, dy, image, points) {
            if (!this.inPrevState) {
                this.states.push(new HistoryLayer());
            }
            this.currentLayer += 1;
            if (this.currentLayer == this.states.length - 1) {
                this.inPrevState = false;
            }
            this.states[this.currentLayer].addAction(new HistoryNode(tool, color, fill, weight, x, y, dx, dy, image, points));
        };
        PaintHistory.prototype.undo = function (index, version) {
            if (this.currentLayer != 0) {
                this.inPrevState = true;
                this.currentLayer = index;
                this.version = version;
            }
        };
        PaintHistory.prototype.quickUndo = function () {
            if (this.currentLayer != 0) {
                this.inPrevState = true;
                this.currentLayer -= 1;
                this.version = this.states[this.currentLayer].selectedVersion;
            }
        };
        PaintHistory.prototype.redo = function (index, version) {
            if (this.currentLayer != this.states.length - 1) {
                this.currentLayer = index;
                this.version = version;
                if (index == this.states.length - 1) {
                    this.inPrevState = false;
                }
            }
        };
        PaintHistory.prototype.quickRedo = function () {
            if (this.currentLayer != this.states.length - 1) {
                this.currentLayer += 1;
                this.version = this.states[this.currentLayer].selectedVersion;
                if (this.currentLayer == this.states.length - 1) {
                    this.inPrevState = false;
                }
            }
        };
        PaintHistory.prototype.fullHistory = function () {
            return this.states;
        };
        PaintHistory.prototype.getCurrentState = function () {
            return this.states[this.currentLayer];
        };
        PaintHistory.prototype.getImageData = function (version) {
            return this.states[this.currentLayer].currentVersion(version).imageData;
        };
        return PaintHistory;
    }());
    exports.default = PaintHistory;
});
