define(["require", "exports", "Paint", "knockout"], function (require, exports, Paint_1, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PaintViewModel = (function () {
        function PaintViewModel() {
            var _this = this;
            var drawspace = document.getElementById("drawspace");
            this.paint = new Paint_1.Paint(drawspace);
            this.paint.tool = "pencil";
            this.paint.weight = 10;
            this.fileChooser = document.createElement("input");
            this.fileChooser.type = "file";
            this.fileChooser.addEventListener("change", function (e) {
                var file = e.target.files[0];
                var reader = new FileReader();
                reader.addEventListener("load", function (e) {
                    var img = new Image();
                    img.src = e.target.result;
                    _this.paint.imageToolImage = img;
                });
                reader.readAsDataURL(file);
            }, false);
            this.paletteVisible = ko.observable(true);
            this.layersVisible = ko.observable(true);
            this.historyVisible = ko.observable(true);
            this.sidebarVisible = ko.computed(function () {
                return _this.layersVisible() || _this.historyVisible();
            });
            this.selectedTool = ko.observable("pencil");
            this.selectedTool.subscribe(function (newval) {
                _this.paint.tool = newval;
            });
            this.selectedTool("pencil");
            this.primaryColor = ko.observable("#000000");
            this.primaryColor.subscribe(function (color) {
                _this.paint.setColors(color, color);
            });
            this.paint.setColorChangeCallback(function (primary, secondary) {
                _this.primaryColor(_this.paint.primaryColor);
            });
            this.brushWeight = ko.observable(10);
            this.brushWeight.subscribe(function (weight) {
                if (weight < 1) {
                    _this.brushWeight(1);
                    _this.paint.weight = 1;
                }
                _this.paint.weight = weight;
            });
            this.brushWeight(10);
            this.fillValue = ko.observable(false);
            this.fillValue.subscribe(function (f) {
                _this.paint.fill = f;
            });
            this.fillValue(false);
            this.historyLayers = ko.observableArray(this.paint.workingLayer.history.fullHistory());
            this.layerList = ko.observableArray(this.paint.layerList);
            this.selectedLayerIndex = ko.observable(0);
            this.selectedHistoryUnit = ko.observable({ index: 0, version: 0 });
        }
        PaintViewModel.prototype.togglePalette = function () {
            this.paletteVisible(!this.paletteVisible());
        };
        PaintViewModel.prototype.toggleLayers = function () {
            this.layersVisible(!this.layersVisible());
        };
        PaintViewModel.prototype.toggleHistory = function () {
            this.historyVisible(!this.historyVisible());
        };
        PaintViewModel.prototype.nukeProject = function () {
            this.layerList(this.paint.nuke());
            this.selectedLayerIndex(0);
            this.historyLayers(this.paint.workingLayer.history.fullHistory());
            this.selectedHistoryUnit({ index: 0, version: 0 });
        };
        PaintViewModel.prototype.download = function () {
            var link = document.createElement("a");
            link.href = this.paint.collapse();
            link.download = "MyDrawing.png";
            link.click();
        };
        PaintViewModel.prototype.upload = function () { };
        PaintViewModel.prototype.toolbarUndo = function () {
            this.paint.undo();
            var i = this.selectedHistoryUnit().index;
            this.selectedHistoryUnit({ index: (i <= 0 ? 0 : i - 1), version: 0 });
        };
        PaintViewModel.prototype.toolbarRedo = function () {
            this.paint.redo();
            var i = this.selectedHistoryUnit().index;
            var l = this.paint.workingLayer.history.states.length;
            this.selectedHistoryUnit({ index: (i == l - 1 ? l - 1 : i + 1), version: 0 });
        };
        PaintViewModel.prototype.findImage = function () {
            this.selectedTool("image");
            this.fileChooser.click();
        };
        PaintViewModel.prototype.newLayer = function () {
            this.layerList(this.paint.addLayer());
            this.historyLayers(this.paint.workingLayer.history.fullHistory());
        };
        PaintViewModel.prototype.selectLayer = function (index) {
            this.paint.switchLayer(this.layerList()[index].id);
            this.selectedLayerIndex(index);
            this.historyLayers(this.paint.workingLayer.history.fullHistory());
            this.selectedHistoryUnit({ index: this.paint.workingLayer.history.states.length - 1,
                version: this.paint.workingLayer.history.version });
        };
        PaintViewModel.prototype.deleteLayer = function () {
            if (this.paint.layerList.length > 1) {
                var index = this.selectedLayerIndex();
                this.selectedLayerIndex(index > 0 ? index - 1 : index);
                this.layerList(this.paint.deleteLayer(this.layerList()[index].id));
                this.paint.switchLayer(this.layerList()[index > 0 ? index - 1 : index].id);
                this.historyLayers(this.paint.workingLayer.history.fullHistory());
                this.selectedHistoryUnit({ index: this.paint.workingLayer.history.states.length - 1,
                    version: this.paint.workingLayer.history.version });
            }
        };
        PaintViewModel.prototype.updateHistory = function () {
            if (this.paint.changed) {
                this.historyLayers([]);
                this.historyLayers(this.paint.workingLayer.history.fullHistory());
                this.selectedHistoryUnit({ index: this.selectedHistoryUnit().index + 1,
                    version: 0 });
            }
        };
        PaintViewModel.prototype.selectHistoryUnit = function (index, version) {
            if (index >= this.selectedHistoryUnit().index) {
                this.paint.redo(index, version);
            }
            else {
                this.paint.undo(index, version);
            }
            this.selectedHistoryUnit({ index: index, version: version });
        };
        PaintViewModel.prototype.isHistoryUnitSelected = function (index, version) {
            return this.selectedHistoryUnit().index == index &&
                this.selectedHistoryUnit().version == version;
        };
        return PaintViewModel;
    }());
    ko.applyBindings(new PaintViewModel());
});
