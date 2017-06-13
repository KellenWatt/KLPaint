(function(document, ko, jq) {
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

        self.clearCanvas = function() {
            paint.clearCurrentLayer();
        };

        self.saveDrawing = function() {
            // do server-side thing here
        };

        self.undo = function() {
            // undo previous thing on current layer
        };

        self.redo = function () {
            // redo thing on current layer
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

        this.layerList = ko.observableArray(paint.getLayers());

        this.newLayer = function() {
            self.layerList(paint.addLayer());
        };

        this.selectedLayerIndex = ko.observable(0);
        this.selectLayer = function(index) {
            paint.setLayer(self.layerList()[index].id)
            self.selectedLayerIndex(index);
        };

        this.deleteLayer = function() {
            var index = self.selectedLayerIndex();
            self.selectedLayerIndex(index > 0 ? index-1 : index);
            self.layerList(paint.deleteLayer(self.layerList()[index].id));
            paint.setLayer(self.layerList()[index > 0 ? index-1 : index].id);
        };
    }

    ko.applyBindings(PaintViewModel());
    // End Knockout bindings
    // Other stuff to do with the canvas



    // End of other stuff
    // ...
    // What? Are you expecting more?
})(document, ko, $);
