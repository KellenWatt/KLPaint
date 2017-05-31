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

var Layer = (function() {
    var id;
    var name;
    var canvas;

    function Layer(lid, name = null) {
        this.id = lid;
        if(!name) {
            name = lid;
        }
        this.canvas = new Canvas(lid);
    }

    Layer.prototype.remove = function() {
        this.id = -1;
        this.canvas = null;
        this.name = null;
    }

    Layer.prototype.getID() {
        return this.id;
    }

    Layer.prototype.getName() {
        return this.name;
    }

    Layer.prototaype.setName(str) {
        this.name = str;
    }

    Layer.prototype.getCanvas() {
        return this.canvas;
    }

    return Layer;
}());
