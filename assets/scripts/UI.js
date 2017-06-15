(function(document, ko, $) {
    // Paint declaration pre-reqs
    var drawspace = document.getElementById("drawspace");
    var color = document.getElementById("primary-color");
    var iweight = +(document.getElementById("brush-size").value)

    var paint = new Paint(drawspace, color.value, color.value, iweight);
    paint.init();
    // paint.setCurrentTool("brush");

    // color.addEventListener("change", function() {
    //     paint.setColors(this.value, this.value);
    // });

    // document.getElementById("fill").addEventListener("change", function() {
    //     paint.setFill(this.checked);
    // });

    var fileChooser = document.createElement("input");
    fileChooser.type = "file";
    fileChooser.addEventListener("change", function(e) {
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function(f) {
            return function(e) {
                var img = new Image();
                img.src = e.target.result;
                paint.setImage(img);
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
            // paint.clearCurrentLayer();
            self.layerList(paint.nuke());
            self.selectedLayerIndex(0);
            self.historyLayers(paint.getCurrentLayer().history.fullHistory());
            self.selectedHistoryUnit({index: 0, version: 0});
        };

        self.saveDrawing = function() {
            // do server-side thing here
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
            var l = paint.getCurrentLayer().history.states.length;
            self.selectedHistoryUnit({index: (i == l-1 ? l-1 : i+1),
                                      version: 0})
        }

        this.selectedTool = ko.observable();
        this.selectedTool.subscribe(function(newval) {
            paint.setCurrentTool(newval);
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
            paint.setSecondaryColor(color);
        });

        this.primaryColor(paint.getColors()[0]);
        paint.setColorChangeCallback(function() {
            self.primaryColor(paint.getColors()[0]);
        });

        this.brushWeight = ko.observable();
        this.brushWeight.subscribe(function(wt) {
            if(wt < 1) {
                self.brushWeight(1);
            }
            paint.setWeight(wt);
        });
        this.brushWeight(10);

        this.fillValue = ko.observable();
        this.fillValue.subscribe(function(f) {
            paint.setFill(f);
        });
        this.fillValue(false);

        this.historyLayers = ko.observableArray(paint.getCurrentLayer().history.fullHistory());
        this.layerList = ko.observableArray(paint.getLayers());

        this.newLayer = function() {
            self.layerList(paint.addLayer());
            self.historyLayers(paint.getCurrentLayer().history.fullHistory());
        };

        this.selectedLayerIndex = ko.observable(0);
        this.selectLayer = function(index) {
            paint.setLayer(self.layerList()[index].id)
            self.selectedLayerIndex(index);
            self.historyLayers(paint.getCurrentLayer().history.fullHistory());
            self.selectedHistoryUnit({index: paint.getCurrentLayer().history.states.length-1,
                                    version: paint.getCurrentLayer().history.version});
        };

        this.deleteLayer = function() {
            if(paint.getLayers().length > 1) {
                var index = self.selectedLayerIndex();
                self.selectedLayerIndex(index > 0 ? index-1 : index);
                self.layerList(paint.deleteLayer(self.layerList()[index].id));
                paint.setLayer(self.layerList()[index > 0 ? index-1 : index].id);
                self.historyLayers(paint.getCurrentLayer().history.fullHistory());
                self.selectedHistoryUnit({index: paint.getCurrentLayer().history.states.length-1,
                                        version: paint.getCurrentLayer().history.version});
            }
        };

        this.updateHistory = function() {
            self.historyLayers([]);
            self.historyLayers(paint.getCurrentLayer().history.fullHistory());
            var ver = 0;
            self.selectedHistoryUnit({index: self.selectedHistoryUnit().index + 1,
                                      version: ver});
        };

        this.selectedHistoryUnit = ko.observable({
            index: 0,
            version: 0
        });

        this.selectHistoryUnit = function(i, v) {
            if(i > self.selectedHistoryUnit().index) {
                paint.redo(i,v);
            } else if(i < self.selectedHistoryUnit().index) {
                paint.undo(i,v);
            } else {
                paint.redo(i,v);
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
