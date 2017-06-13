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

var History = (function() {

    var HistoryNode = (function() {
        function HistoryNode(action, color, fill, x, y, points) {
            this.tool = tool;
            this.color = color;
            this.fill = fill;
            this.rootX = x;
            this.rootY = y;
            this.points = points;
        }

        return HistoryNode;
    }());

    function History() {
        this.root = new HistoryNode();
    }

    return History;
}());


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
        console.log(this.canvas.parentElement);
        this.canvas.parentNode.removeChild(this.canvas);
        this.canvas = null;
        this.context = null;
    }



    return Layer;
}(document));
