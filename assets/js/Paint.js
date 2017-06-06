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

    var image;

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

    function addAlpha(hex, num) {
        var red = parseInt(hex.substring(1,3), 16);
        var green = parseInt(hex.substring(3,5), 16);
        var blue = parseInt(hex.substring(5,7), 16);
        var alpha = parseInt(num, 16) / 255;
        return "rgba("+red+","+green+","+blue+","+alpha+")";
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
    function drawPencil() {
        ctx.lineto(mouse.x, mouse.y);
        ctx.stroke();
        points.push(new Point(mouse.x, mouse.y));
    }

    function drawBrush() {
        // Fill this in later because I don't know the exact implementation.
        var dist = Math.sqrt(Math.pow(mouse.x - mouseLock.x, 2)
                             + Math.pow(mouse.y - mouseLock.y,2));
        var angle = Math.atan2(mouse.x - mouseLock.x, mouse.y - mouseLock.y);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        for(var i=0; i < dist; i += Math.ceil(weight/8)) {
            x = mouseLock.x + (Math.sin(angle) * i);
            y = mouseLock.y + (Math.cos(angle) * i);

            var radgrad = ctx.createRedialGradient(x, y, weight/4, x, y, weight/2);

            radgrad.addColorStop(0, addAlpha(colors[0], 1));
            radgrad.addColorStop(0.5, addAlpha(colors[0], 0.5));
            radgrad.addColorStop(1, addAlpha(colors[0], 0);

            ctx.fillsytle = radgrad;
            ctx.fillRect(x - weight/2, y - weight/2, weight, weight);
        }

        mouseLock = mouse;
    }

    function drawCircle() {
        ctx.clearRect(0, 0, workspace.width, workspace.height);
        ctx.beginPath();
        var radius = Math.sqrt(Math.pow(mouse.x - mouseLock.x, 2) +
                               Math.pow(mouse.y - mouseLock.y, 2));
        context.arc(mouseLock.x, mouseLock.y, radius, 0, 2*Math.PI);
        if(fill) {
            ctx.fill();
        }else {
            ctx.stroke();
        }
    }

    function drawSqure() {
        ctx.clearRect(0, 0, workspace.width, workspace.height);
        ctx.beginPath();
        ctx.rect(mouseLock.x, mouseLock.y,
                 mouse.x - mouseLock.x, mouse.y - mouseLock.y);
        if(fill) {
            ctx.fill();
        }else {
            ctx.stroke();
        }
    }

    function drawLine() {
        ctx.clearRect(0, 0, workspace.width, workspace.height);
        ctx.beginPath();
        ctx.moveTo(mouseLock.x, mouseLock.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    }

    function drawText() { // need to work on this more
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
        //     ctx.fillText(this.value, x, y, )
        // });
        //
        // workspace.parentNode.appendChild(textIn);
    }

    function erase() {
        var context = currentLayer.getCanvasContext();
        context.save();
        context.arc(mouse.x, mouse.y, weight, 0, 2*Math.PI, true);
        context.clip();
        context.clearRect(mouse.x - weight, mouse.y - weight, weight*2, weight*2);
        context.restore();
    }

    function findColor() {
        var pix = currentLayer.getCanvasContext()
                    .getImageData(mouse.x, mouse.y, 1, 1).data;
        var red = parseInt(""+pix[0], 16);
        var green = parseInt(""+pix[1], 16);
        var blue = parseInt(""+pix[2], 16);
        colors[0] = "#" + red + green + blue;
    }

    function chooseColor() {
        // probably not needed
    }

    function drawImage() {
        ctx.clearRect(0, 0, workspace.width, workspace.height);
        ctx.drawImage(image, mouseLock.x, mouseLock.y,
                             mouse.x - mouseLock.x, mouse.y - mouseLock.y);
    }


    Paint.prototype.init() {
        var tool = this.tool;
        var colorChooser = document.createElement("input");
        colorChooser.setAttribute("type", "color");
        colorChooser.addEventListener("change", function() {
            colors[0] = this.value;
        });

        this.workspace.addEventListener("mousedown", function() {
            ctx.beginPath();
            ctx.moveTo(this.mouse.x, this.mouse.y);
            mouseLock.x = mouse.x;
            mouseLock.y = mouse.y;

            switch(tool) {
            case "pencil":
                canvas.addEventListener("mousemove", drawPencil);
            break;
            case "brush":
                ctx.save();
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
                // canvas.addEventListener("click", findColor);
                // handled in the mouseup event
            break;
            case "color":
                // not likely to be needed
                // will be handled in the mouseup event
            break;
            case "image":
                canvas.addEventListener("mousemove", drawImage);
            break;
            default:
                alert("Invalid tool selection");
                // royal screw up
            break;
            }
        });

        this.workspace.addEventListener("mouseup", function() {
            switch(tool) {
            case "pencil":
                if(fill) {
                    ctx.beginPath();
                    ctx.moveTo(points[0].x, points[0].y);
                    for(var i=0; i<points.length; i++) {
                        ctx.lineTo(points[i].x, points[i].y);
                    }
                    ctx.fill();
                    ctx.closePath();
                    points = [];
                }else {
                    currentLayer.getCanvasContext().drawImage(workspace, 0, 0);
                };
                canvas.removeEventListener("mousemove", drawPencil);
            break;
            case "brush":
                canvas.removeEventListener("mousemove", drawBrush);
                ctx.restore();
                currentLayer.getCanvasContext().drawImage(workspace, 0, 0);
            break;
            case "circle":
                canvas.removeEventListener("mousemove", drawCircle);
                currentLayer.getCanvasContext().drawImage(workspace, 0, 0);
            break;
            case "square":
                canvas.removeEventListener("mousemove", drawSquare);
                currentLayer.getCanvasContext().drawImage(workspace, 0, 0);
            break;
            case "line":
                canvas.removeEventListener("mousemove", drawLine);
                currentLayer.getCanvasContext().drawImage(workspace, 0, 0);
            break;
            case "text":
                canvas.removeEventListener("mousemove", drawText)
            break;
            case "eraser":
                canvas.removeEventListener("mousemove", erase);
            break;
            case "dropper":
                // canvas.removeEventListener("click", findColor);
                var pix = currentLayer.getCanvasContext()
                            .getImageData(mouse.x, mouse.y, 1, 1).data;
                var red = parseInt(""+pix[0], 16);
                var green = parseInt(""+pix[1], 16);
                var blue = parseInt(""+pix[2], 16);
                colors[0] = "#" + red + green + blue;
            break;
            case "color":
                colorChooser.click();
            break;
            case "image":
                canvas.removeEventListener("mousemove", drawImage);
                currentLaye.getCanvasContext().drawImage(workspace, 0, 0);
            break;
            default:
                alert("Invalid tool selection");
                // royal screw up
            break;
            }
            ctx.clearRect(0, 0, workspace.width, workspace.height);
        });
    }

    return Paint();
}(document));
