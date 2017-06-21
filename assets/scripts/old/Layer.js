

var PaintHistory = (function() {

    // Begin HistoryNode
    var HistoryNode = (function() {
        function HistoryNode(tool, color, fill, weight, x, y, dx, dy, image, points) {
            this.tool = tool;
            this.color = color;
            this.fill = fill;
            this.weight = weight;
            this.rootX = x;
            this.changeX = dx;
            this.rootY = y;
            this.changeY = dy;
            this.image = image;
            this.points = points;
        }

        return HistoryNode;
    })();
    // End HistoryNode
    // Begin HistoryLayer
    var HistoryLayer = (function() {
        function HistoryLayer() {
            this.versions = [];
            this.selectedVersion = 0;
        }

        HistoryLayer.prototype.addAction = function(node) {
            this.versions.push(node);
            if(this.versions.length > 2) {
                this.versions.shift();
            }
            this.selectedVersion = this.versions.length-1;
        };

        HistoryLayer.prototype.getVersion = function(version) {
            return this.versions[version];
        };

        HistoryLayer.prototype.getBranchCount = function() {
            return this.versions.length;
        };

        return HistoryLayer;
    })();
    // End HistoryLayer

    function PaintHistory() {
        this.states = [];
        this.currentLayer = 0;
        this.version = 0;
        this.inPrevState = false;
    }

    PaintHistory.prototype.init = function(image) {
        this.states.push(new HistoryLayer());
        this.states[0].addAction(new HistoryNode("Empty", null, null, null, null, null, null, null, image, null));
    };

    PaintHistory.prototype.pushAction = function(tool, color, fill, weight, x, y, dx, dy, image, points) {
        if(!this.inPrevState) {
            this.states.push(new HistoryLayer());
        }
        this.currentLayer += 1;
        if(this.currentLayer == this.states.length-1) {
            this.inPrevState = false;
        }

        this.states[this.currentLayer].addAction(
            new HistoryNode(tool, color, fill, weight, x, y, dx, dy, image, points));
    };

    PaintHistory.prototype.undo = function(index, version) {
        if(this.currentLayer != 0) {
            this.inPrevState = true;
            this.currentLayer = index;
            this.version = version;
        }
    };

    PaintHistory.prototype.quickUndo = function() {
        if(this.currentLayer != 0) {
            this.inPrevState = true;
            this.currentLayer -= 1;
            this.version = this.states[this.currentLayer].selectedVersion;
        }
    };

    PaintHistory.prototype.redo = function(index, version) {
        if(this.currentLayer != this.states.length-1){
            this.currentLayer = index;
            this.version = version;
            if(index == this.states.length-1) {
                this.inPrevState = false;
            }
        }
    };

    PaintHistory.prototype.quickRedo = function() {
        if(this.currentLayer != this.states.length-1) {
            this.currentLayer += 1;
            this.version = this.states[this.currentLayer].selectedVersion;
            if(this.currentLayer == this.states.length-1) {
                this.inPrevState = false;
            }
        }
    };

    PaintHistory.prototype.fullHistory = function() {
        return this.states;
    };

    PaintHistory.prototype.getCurrentState = function() {
        return this.states[this.currentLayer];
    };

    PaintHistory.prototype.getImage = function(version) {
        return this.states[this.currentLayer].getVersion(version).image;
    };

    return PaintHistory;
})();


var Layer = (function(document) {

    /**
        Creates a model for a layer, creating the associated canvas and
        inserting it into the DOM.
    */
    function Layer(parent, lid) {
        this.id = lid;
        this.name = "Layer " + lid;
        this.canvas = document.createElement("canvas");
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;
        this.canvas.style.position = "absolute";
        this.canvas.style.left = 0;
        this.canvas.style.top = 0;

        parent.insertBefore(this.canvas, parent.firstChild);

        this.context = this.canvas.getContext("2d");

        this.history = new PaintHistory();
    }

    Layer.prototype.getID = function() {
        return this.id;
    }

    Layer.prototype.getName = function() {
        return this.name;
    }

    Layer.prototype.setName = function(n) {
        this.name = n;
    }

    Layer.prototype.getCanvas = function() {
        return this.canvas;
    }

    Layer.prototype.getCanvasContext = function() {
        return this.context;
    }



    Layer.prototype.finalize = function() {
        this.id = -1;
        this.name = null;
        this.canvas.parentNode.removeChild(this.canvas);
        this.canvas = null;
        this.context = null;
    }



    return Layer;
})(document);
