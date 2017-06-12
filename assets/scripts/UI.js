(function(document, ko, jq) {
    // Paint declaration pre-reqs
    var drawspace = document.getElementById("drawspace");
    var color = document.getElementById("primary-color");
    var iweight = +(document.getElementById("brush-size").value)

    console.log(color.value);
    var paint = new Paint(drawspace, color.value, color.value, iweight);
    paint.init();
    paint.setCurrentTool("brush");

    color.addEventListener("change", function() {
        paint.setColors(this.value, this.value);
    });

    document.getElementById("fill").addEventListener("change", function() {
        paint.setFill(this.checked);
    });

    document.getElementById("brush-size").addEventListener("change", function(){
        if(this.value < 1) {
            this.value = 1;
        }
        paint.setWeight(+this.value);
    });


    // Knockout bindings

    function ToolbarViewModel() {
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

        this.selectedTool = ko.observable("pencil");
        this.selectedTool.subscribe(function(newval) {
            paint.setCurrentTool(newval);
        });

    }

    ko.applyBindings(ToolbarViewModel());
    // End Knockout bindings
    // Other stuff to do with the canvas



    // End of other stuff
    // ...
    // What? Are you expecting more?
})(document, ko, $);
