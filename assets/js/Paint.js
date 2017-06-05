var Paint = (function(document) {
    // Perhaps include some way to tie a UI into the object

    var workspace;
    var ctx; // canvas:workspace context
    var currentLayer;
    var layers = [];
    var colors = [];
    var weight;
    var currentTool;
    var fill = false;
    var _layerid = 0;


    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    var mouse = new Point(0, 0);
    var mouseLock = new Point(0, 0);

    var points  = [];

    // require pass dom element, check if canvas, else create canvas as child.
    // Also, default argument aren't a valid thing
    function Paint(canvas, weight = 10, primary = "black", secondary = "white") {

        this.workspace = canvas;
        this.ctx = canvas.getContext("2d");
        this.weight = stroke;
        this.colors = [primary, secondary];

        canvas.addEventListener("mousemove", function(e) {
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        });
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

    Paint.prototype.addLayer(canvas, name = null) {
        var newLayer = new Layer(++this._layerID, canvas, name);
        this.layers.push(newLayer);
        return newLayer;
    }

    Paint.prototype.deleteLayer(id) {
        for(var i=0; i < this.layers.length; i++) {
            if(this.layers[i].id === id) {
                this.layers[i].finalize();
                this.layers.splice(i, 1);
                return;
            }
        }
    }

    Paint.prototype.setLayer(id) {
        for(var i=0; i < this.layers.length; i++) {
            if(this.layers[i].id === id) {
                this.currentLayer = this.layers[i];
                return;
            }
        }
    }

    Paint.prototype.getLayers() {
        return this.layers;
    }

    Paint.prototype.setWeight(weight) {
        this.stroke = weight;
    }

    Paint.prototype.getWeight() {
        return this.stroke;
    }

    Paint.prototype.setCurrentTool(tool) {
        this.currentTool = tool;
    }

    Paint.prototype.getCurrentTool() {
        return this.currentTool;
    }


    // Begin drawing functions
    Paint.prototype.drawPencil() {
        cxt.lineto(mouse.x, mouse.y);
        cxt.stroke();
        points.push(new Point(mouse.x, mouse.y));
    }

    Paint.prototype.drawBrush() {
        // Fill this in later because I don't know the exact implementation.
    }

    Paint.prototype.drawCircle() {
        cxt.clearRect(0, 0, workspace.width, workspace.height);
        cxt.beginPath();
        var radius = Math.sqrt(Math.pow(mouse.x - mouseLock.x, 2) +
                               Math.pow(mouse.y - mouseLock.y, 2));
        context.arc(mouseLock.x, mouseLock.y, radius, 0, 2*Math.PI);
        if(fill) {
            cxt.fill();
        }else {
            cxt.stroke();
        }
    }

    Paint.prototype.drawSqure() {
        cxt.clearRect(0, 0, workspace.width, workspace.height);
        cxt.beginPath();
        cxt.rect(mouseLock.x, mouseLock.y,
                 mouse.x - mouseLock.x, mouse.y - mouseLock.y);
        if(fill) {
            cxt.fill();
        }else {
            cxt.stroke();
        }
    }

    Paint.prototype.drawLine() {
        cxt.clearRect(0, 0, workspace.width, workspace.height);
        cxt.beginPath();
        cxt.moveTo(mouseLock.x, mouseLock.y);
        cxt.lineTo(mouse.x, mouse.y);
        cxt.stroke();
    }

    Paint.protype.drawText() { // need to work on this more
        // var textIn = document.createElement("input");
        // textIn.setAttribute("type", "text");
        // textIn.style.position = "absolute";
        // textIn.style.left = mouseLock.x;
        // textIn.style.top = mouseLock.y;
        // textIn.id = "canvas-text-box";
        //
        // textIn.addEventListener("blur", function() {
        //     var x = mouseLock.x;
        //     var y = mouseLock.y;
        //     cxt.fillText(this.value, x, y, )
        // });
        //
        // workspace.parentNode.appendChild(textIn);
    }

    Paint.prototype.erase() {
        var context = currentLayer.getCanvasContext();
        context.save();
        context.arc(mouse.x, mouse.y, weight, 0, 2*Math.PI, true);
        context.clip();
        context.cleearRect(mouse.x - weight, mouse.y - weight, weight*2, weight*2);
        context.restore();
    }


    Paint.prototype.chooseColor() {

    }

    Paint.prototype.drawImage() {

    }


    Paint.prototype.init() {
        var tool = this.tool;

        this.workspace.addEventListener("mousedown", function() {
            cxt.beginPath();
            cxt.moveTo(this.mouse.x, this.mouse.y);
            mouseLock.x = mouse.x;
            mouseLock.y = mouse.y;

            switch(tool) {
            case "pencil":
                canvas.addEventListener("mousemove", drawPencil);
            break;
            case "brush":
                canvas.addEventListener("mousemove", drawBrush);
            break;
            case "circle":
                canvas.addEventListener("mousemove", drawCircle);
            break;
            case "square":
                canvas.addEventListener("mousemove", drawSquare);
            break;
            case "line":
                canvas.addEventListener("mousemove", drawLine);
            break;
            case "text":
                canvas.addEventListener("mousemove", drawText);
            break;
            case "eraser":
                canvas.addEventListener("mousemove", erase);
            break;
            case "dropper":
                document.getElementById("primary").click();
            break;
            case "color":
                // canvas.addEventListener("mousemove", drawBrush);
            break;
            case "image":
                canvas.addEventListener("mousemove", drawImage);
            break;
            default:

            break;
            }
        });

        this.workspace.addEventListener("mouseup", function() {
            switch(tool) {
            case "pencil":
                if(fill) {
                    cxt.beginPath();
                    cxt.moveTo(points[0].x, points[0].y);
                    for(var i=0; i<points.length; i++) {
                        cxt.lineTo(points[i].x, points[i].y);
                    }
                    cxt.fill();
                    cxt.closePath();
                    points = [];
                }else {
                    currentLayer.getCanvasContext().drawImage(workspace, 0, 0);
                };
            break;
            case "brush":

            break;
            case "circle":
                currentLayer.getCanvasContext().drawImage(workspace, 0, 0);
            break;
            case "square":
                currentLayer.getCanvasContext().drawImage(workspace, 0, 0);
            break;
            case "line":
                currentLayer.getCanvasContext().drawImage(workspace, 0, 0);
            break;
            case "text":

            break;
            case "eraser":

            break;
            case "dropper":

            break;
            case "color":

            break;
            case "image":

            break;
            default:

            break;
            }
            ctx.clearRect(0, 0, workspace.width, workspace.height);
            workspace.removeEventListener("mousemove", drawPencil)
        });
    }

    return Paint();
}(document));
