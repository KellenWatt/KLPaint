import {Paint} from "Paint";
import * as ko from "knockout";

(function(document, ko, $) {
    // Paint declaration pre-reqs
    var drawspace = document.getElementById("drawspace");
    var color = document.getElementById("primary-color");
    var iweight = +(document.getElementById("brush-size").value)

    var paint = new Paint(drawspace);
    paint.init();


    var fileChooser = document.createElement("input");
    fileChooser.type = "file";
    fileChooser.addEventListener("change", function(e) {
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function(f) {
            return function(e) {
                var img = new Image();
                img.src = e.target.result;
                paint.imageToolImage = img;
            };
        }(file));

        reader.readAsDataURL(file);

    }, false);

    // Knockout bindings

    function PaintViewModel() {
        var self = this;

        self.paletteVisible = ko.observable(true);
        self.togglePalette = function() {
            self.paletteVisible(!self.paletteVisible());
        };

        self.layersVisible = ko.observable(true);
        self.toggleLayers = function() {
            self.layersVisible(!self.layersVisible());
        };

        self.historyVisible = ko.observable(true);
        self.toggleHistory = function() {
            self.historyVisible(!self.historyVisible());
        };

        self.sidebarVisible = ko.computed(function() {
            return self.layersVisible() || self.historyVisible();
        });

        self.nukeProject = function() {
            self.layerList(paint.nuke());
            self.selectedLayerIndex(0);
            self.historyLayers(paint.workingLayer.history.fullHistory();
            self.selectedHistoryUnit({index: 0, version: 0});
        };

        self.download = function() {
            var link = document.createElement("a");
            link.href = paint.collapse();
            link.download = "MyDrawing.png";
            link.click();
        };

        self.upload = function() {

        };

        self.toolbarUndo = function() {
            // undo previous thing on current layer
            paint.undo()
            var i = self.selectedHistoryUnit().index;
            self.selectedHistoryUnit({index: (i <= 0 ? 0 : i-1),
                                      version: 0});
        };

        self.toolbarRedo = function() {
            // redo thing on current layer
            paint.redo();
            var i = self.selectedHistoryUnit().index;
            var l = paint.workingLayer.history.states.length;
            self.selectedHistoryUnit({index: (i == l-1 ? l-1 : i+1),
                                      version: 0})
        }

        this.selectedTool = ko.observable();
        this.selectedTool.subscribe(function(newval) {
            paint.tool = newval;
        });
        this.selectedTool("pencil");

        this.findImage = function() {
            self.selectedTool("image");
            fileChooser.click();
        };

        this.primaryColor = ko.observable();
        this.primaryColor.subscribe(function(color) {
            paint.setColors(color, color);
        });

        this.secondaryColor = ko.observable();
        this.secondaryColor.subscribe(function(color) {
            paint.secondaryColor = color;
        });

        this.primaryColor(paint.primaryColor);
        paint.setColorChangeCallback(function(primary, secondary) {
            self.primaryColor(paint.primaryColor);
        });

        this.brushWeight = ko.observable();
        this.brushWeight.subscribe(function(wt) {
            if(wt < 1) {
                self.brushWeight(1);
            }
            paint.weight = wt;
        });
        this.brushWeight(10);

        this.fillValue = ko.observable();
        this.fillValue.subscribe(function(f) {
            paint.fill = f;
        });
        this.fillValue(false);

        this.historyLayers = ko.observableArray(paint.workingLayer.history.fullHistory());
        this.layerList = ko.observableArray(paint.layerList());

        this.newLayer = function() {
            self.layerList(paint.addLayer());
            self.historyLayers(paint.workingLayer.history.fullHistory());
        };

        this.selectedLayerIndex = ko.observable(0);
        this.selectLayer = function(index) {
            paint.switchLayer(self.layerList()[index].id)
            self.selectedLayerIndex(index);
            self.historyLayers(paint.workingLayer.history.fullHistory());
            self.selectedHistoryUnit({index: paint.workingLayer.history.states.length-1,
                                    version: paint.workingLayer.history.version});
        };

        this.deleteLayer = function() {
            if(paint.layerList.length > 1) {
                var index = self.selectedLayerIndex();
                self.selectedLayerIndex(index > 0 ? index-1 : index);
                self.layerList(paint.deleteLayer(self.layerList()[index].id));
                paint.switchLayer(self.layerList()[index > 0 ? index-1 : index].id);
                self.historyLayers(paint.workingLayer.history.fullHistory());
                self.selectedHistoryUnit({index: paint.workingLayer.history.states.length-1,
                                        version: paint.workingLayer.history.version});
            }
        };

        this.updateHistory = function() {
            self.historyLayers([]);
            self.historyLayers(paint.workingLayer.history.fullHistory());
            var ver = 0;
            if(paint.changed{
                self.selectedHistoryUnit({index: self.selectedHistoryUnit().index + 1,
                                      version: ver});
            }
        };

        this.selectedHistoryUnit = ko.observable({
            index: 0,
            version: 0
        });

        this.selectHistoryUnit = function(i, v) {
            console.log(i, self.selectedHistoryUnit().index)
            if(i >= self.selectedHistoryUnit().index) {
                paint.redo(i,v);
            } else {
                paint.undo(i,v);
            }
            self.selectedHistoryUnit({index: i, version: v});

        };

        this.isHistoryUnitSelected = function(i, v) {
            return self.selectedHistoryUnit().index == i &&
                   self.selectedHistoryUnit().version == v;
        };



    }

    ko.applyBindings(PaintViewModel());
    // End Knockout bindings
    // Other stuff to do with the canvas



    // End of other stuff
    // ...
    // What? Are you expecting more?
})(document, ko, jQuery);
