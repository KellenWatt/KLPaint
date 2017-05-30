var Paint = (function() {
    // Perhaps include some way to tie a UI into the object

    var layers = [];
    var colors = [];
    var stroke;
    var _layerid = 0;

    function Paint(stroke = 10, primary = "black", secondary = "white") {
        this.stroke = stroke;
        this.colors = [primary, secondary];
    }

    Paint.prototype.setPrimary(primary) {
        this.colors[0] = primary;
    }

    Paint.prototype.setSecondary(secondary) {
        this.colors[1] = secondary;
    }

    Paint.prototype.setColors(primary, secondary) {
        this.colors = [primary, secondary];
    }

    Print.prototype.getColors() {
        return this.colors;
    }

    Paint.prototype.addLayer(name = null) {
        this.layers.push(new Layer(++_layerID, name))
    }

    Paint.prototype.deleteLayer(identifier) {
        if((typeof identifier) === "number") {
            for(var i=0; i < this.layers.length; i++) {
                if(layers[i].id === identifier) {
                    this.layers.splice(i, 1);
                }
            }
        } else {
            for(var i=0; i < this.layers.length; i++) {
                if(layers[i].name === identifier) {
                    this.layers.splice(i, 1);
                }
            }
        }
    }

    Paint.prototype.getLayers() {
        return this.layers;
    }

    Paint.prototype.setStroke(weight) {
        this.stroke = weight;
    }

    Paint.prototype.getStroke() {
        return this.stroke;
    }

}());
