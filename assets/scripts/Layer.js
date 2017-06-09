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
    var root;

    var HistoryNode = (function() {
        var action;

        function HistoryNode(action) {
            this.action = action;
        }

        return HistoryNode;
    }());

    function History() {
        this.root = new HistoryNode();
    }

    return History;
}());


var Layer = (function(document) {
    var id;
    var canvas;
    var context;
    var history;

    /**
        Creates a model for a layer, creating the associated canvas and
        inserting it into the DOM.
    */
    function Layer(parent, lid) {
        id = lid;
        canvas = document.createElement("canvas");
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        canvas.style.position = "absolute";
        canvas.style.left = 0;
        canvas.style.top = 0;

        parent.insertBefore(canvas, parent.firstChild);

        context = canvas.getContext("2d");
    }

    // probably redundant
    Layer.prototype.remove = function() {
        id = -1;
        name = null;
        canvas.remove();
        canvas = null;
    }

    Layer.prototype.getID = function() {
        return id;
    }

    Layer.prototype.getCanvas = function() {
        return canvas;
    }

    Layer.prototype.getCanvasContext = function() {
        return context;
    }

    Layer.prototype.finalize = function() {
        id = -1;
        name = null;
        canvas.remove();
        canvas = null;
    }



    return Layer;
}(document));
