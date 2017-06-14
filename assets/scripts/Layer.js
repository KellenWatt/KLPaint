// function Layer(lid) {
//     this.id = lid;
//
//     canvas = document.createElement("canvas");
//     canvas.className = "layer";
//     canvas.id = "canvas" + lid;
//     document.getElementById("drawspace").appendChild(canvas);
//     this.canvas = canvas;
//
//     var layer = document.createElement("li");
//     layer.className = "layer-list-item";
//     layer.id = "layer" + lid;
//     var img = document.createElement("img");
//     img.src = "assets/images/visible.png";
//     layer.appendChild(img);
//     layer.appendChild(document.createTextNode("Layer " + lid));
//     layer.addEventListener("click", function(e) {
//         if(selectedLayer) {
//             layers[lid].layer.style.backgroundColor = "#999";
//         }
//         selectedLayer = layers[lid];
//         this.style.backgroundColor = "lightgrey";
//     });
//     this.layer = layer;
//     layerList.insertBefore(newLayer, layerList.childNodes[-1]);
//
//     this.remove = function() {
//         this.canvas.remove();
//         this.canvas = null;
//         this.layer.remove();
//         this.layer = null;
//         this.id = -1;
//     };
//
// }

var PaintHistory = (function() {

    // Begin HistoryNode
    var HistoryNode = (function() {
        function HistoryNode(tool, color, fill, x, y, dx, dy, image, points) {
            this.tool = tool;
            this.color = color;
            this.fill = fill;
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
            this.children = [];
        }

        HistoryLayer.prototype.addAction = function(node) {
            this.children.push(node);
            if(this.children.length > 2) {
                this.children.shift();
            }
        };

        return HistoryLayer;
    })();
    // End HistoryLayer

    function PaintHistory() {
        this.states = [];
        this.states.push(new HistoryLayer());
        this.states[0].addAction(new HistoryNode(null, null, null, null, null, null));
        this.currentLayer = 0;
        this.version = 0;
    }

    function addHistoryLayer() {
        this.states.push(new HistoryLayer());
    }

    PaintHistory.prototype.pushAction = function(tool, color, fill, x, y, dx, dy, image, points) {
        this.states.push(new HistoryLayer());
        this.currentLayer += 1;

        this.states[this.currentLayer].addAction(
            new HistoryNode(tool, color, fill, x, y, dx, dy, image, points));
        console.log(this.states);
    };

    PaintHistory.prototype.undo = function(version) {
        if(this.currentLayer != 0) {
            this.inPrevState = true;
            this.currentLayer -= 1;
            this.version = version;
        }
    };

    PaintHistory.prototype.redo = function(index, version) {
        this.currentLayer = index;
        this.version = version;
        if(index == this.states.length-1) {
            this.inPrevState = false;
        }
    };

    PaintHistory.prototype.fullHistory = function() {
        return this.states;
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
