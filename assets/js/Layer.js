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


var Layer = (function() {
    var id;
    var name;
    var canvas;
    var _context;
    var history;

    function Layer(lid, canvas, name = null) {
        this.id = lid;
        this.canvas = canvas;
        this._context = canvas.getContext("2d");
        this.name = name;
    }

    Layer.prototype.remove = function() {
        this.id = -1;
        this.name = null;
        this.canvas = null;
    }

    Layer.prototype.getID = function() {
        return this.id;
    }

    Layer.prototype.getName = function() {
        if(this.name) {
            return this.name;
        }else {
            return "Layer"+this.id;
        }
    }

    Layer.prototype.setName = function(str) {
        this.name = str;
    }

    Layer.prototype.getCanvas = function() {
        return this.canvas;
    }

    Layer.prototype.getCanvasContext = function() {
        return this._context;
    }

    Layer.prototype.finalize = function() {
        this.id = -1;
        this.name = null,
        this.canvas = null;
    }



    return Layer;
}());
