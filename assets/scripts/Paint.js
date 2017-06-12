var Paint = (function(document) {
    var self = this;


    var workspace;
    var canvas;
    var ctx; // canvas:workspace context
    var currentLayer;
    var layers = [];
    var colors = [];
    var weight;
    var currentTool;
    var fill = false;

    var image;
    var textBox;

    var _layerCounter = 0;


    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    var mouse = new Point(0, 0);
    var mouseLock = new Point(0, 0);

    var points  = [];


    /**
        Takes a container DOM element (eg. div), and creates a workspace canvas
        and all layer containers inside of the element.

        Takes colorpicker DOM elements (ie. <input type="color"...>), and
        associates those with the colors of the canvas. Note that the colorpickers
        don't strictly need to be the DOM  element, but need to have a 'value'
        attribute.
    */
    function Paint(ws, primary, secondary, wt) {
        colors[0] = typeof primary !== 'undefined' ? primary : "#000000";
        colors[1] = typeof secondary !== 'undefined' ? secondary : "#000000";
        weight = typeof wt !== 'undefined' ? wt : 10;

        layers = [];

        workspace = ws;
        canvas = document.createElement("canvas");
        canvas.setAttribute("width", workspace.offsetWidth);
        canvas.setAttribute("height", workspace.offsetHeight);
        canvas.style.position = "absolute";
        canvas.style.left = 0;
        canvas.style.top = 0;
        workspace.appendChild(canvas);
        currentLayer = this.addLayer();

        ctx = canvas.getContext("2d");

        ctx.fillStyle = primary.value;
        currentLayer.getCanvasContext().fillStyle = primary.value;

        ctx.strokeStyle = secondary.value;
        currentLayer.getCanvasContext().strokeStyle = secondary.value;

        ctx.lineWidth = weight;
        currentLayer.getCanvasContext().lineWidth = weight;
        ctx.fillStyle = primary.value;
        currentLayer.getCanvasContext().fillStyle = primary.value;
        ctx.strokeStyle = secondary.value;
        currentLayer.getCanvasContext().strokeStyle = secondary.value;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        canvas.addEventListener("mousemove", function(e) {
            mouse.x = e.pageX - workspace.offsetLeft;
            mouse.y = e.pageY - workspace.offsetTop;
        });
    }

    function addAlpha(hex, num) {
        var red = parseInt(hex.substring(1,3), 16);
        var green = parseInt(hex.substring(3,5), 16);
        var blue = parseInt(hex.substring(5,7), 16);
        // var alpha = parseInt(num, 16) / 255; //alpha is [0,1]
        var alpha = num;
        return "rgba("+red+","+green+","+blue+","+alpha+")";
    }

    Paint.prototype.setPrimaryColor = function(primary) {
        colors[0] = primary;

        ctx.strokeStyle = primary.value;
        currentLayer.getCanvasContext().strokeStyle = primary.value;
    };

    Paint.prototype.setSecondaryColor = function(secondary) {
        colors[1] = secondary;

        ctx.fillColor = secondary.value;
        currentLayer.getCanvasContext().fillColor = secondary.value;
    };

    Paint.prototype.setColors = function(primary, secondary) {
        colors = [primary, secondary];

        ctx.fillStyle = primary.value;
        currentLayer.getCanvasContext().fillStyle = primary.value;

        ctx.strokeStyle = secondary.value;
        currentLayer.getCanvasContext().strokeStyle = secondary.value;
    };

    // Is this even practical?
    Paint.prototype.getColors = function() {
        return colors;
    };

    Paint.prototype.addLayer = function() {
        var newLayer = new Layer(workspace, ++_layerCounter);
        layers.push(newLayer);
        return newLayer;
    };

    Paint.prototype.deleteLayer = function(id) {
        for(var i=0; i < layers.length; i++) {
            if(layers[i].id === id) {
                layers[i].finalize();
                layers.splice(i, 1);
                return;
            }
        }
    };

    Paint.prototype.setLayer = function(id) {
        for(var i=0; i < layers.length; i++) {
            if(layers[i].id === id) {
                currentLayer = layers[i];
                return;
            }
        }
    };

    Paint.prototype.getLayers = function() {
        return layers;
    };

    Paint.prototype.setWeight = function(wt) {
        weight = wt;
        ctx.lineWidth = wt;
    };

    Paint.prototype.getWeight = function() {
        return weight;
    };

    Paint.prototype.setCurrentTool = function(tool) {
        currentTool = tool;
    };

    Paint.prototype.getCurrentTool = function() {
        return currentTool;
    };

    Paint.prototype.setImage = function(img) {
        image = img;
    };

    Paint.prototype.getImage = function() {
        return image;
    };

    Paint.prototype.setFill = function(f) {
        fill = f;
    };

    Paint.prototype.getFill = function() {
        return fill;
    };


    // Begin drawing functions
    function drawPencil() {
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        points.push(new Point(mouse.x, mouse.y));
    }
    function distanceBetween(point1, point2) {
      return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }
    function angleBetween(point1, point2) {
      return Math.atan2( point2.x - point1.x, point2.y - point1.y );
    }
    function drawBrush() {
        var dist = distanceBetween(mouseLock, mouse);
        var angle = angleBetween(mouseLock, mouse);
        // var dist = Math.sqrt(Math.pow(mouse.x - mouseLock.x, 2)
        //                      + Math.pow(mouse.y - mouseLock.y,2));
        // var angle = Math.atan2(mouse.x - mouseLock.x, mouse.y - mouseLock.y);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";


        for(var i=0; i < dist; i += weight/8) {
            x = mouseLock.x + (Math.sin(angle) * i);
            y = mouseLock.y + (Math.cos(angle) * i);

            var radgrad = ctx.createRadialGradient(x, y, weight/4, x, y, weight/2);

            radgrad.addColorStop(0, addAlpha(colors[0], 1));
            radgrad.addColorStop(0.5, addAlpha(colors[0], 0.5));
            radgrad.addColorStop(1, addAlpha(colors[0], 0));

            ctx.fillStyle = radgrad;
            ctx.fillRect(x - weight/2, y - weight/2, weight, weight);
        }

        mouseLock.x = mouse.x;
        mouseLock.y = mouse.y;
    }

    function drawCircle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        var radius = Math.sqrt(Math.pow(mouse.x - mouseLock.x, 2) +
                               Math.pow(mouse.y - mouseLock.y, 2));
        ctx.arc(mouseLock.x, mouseLock.y, radius, 0, 2*Math.PI);
        if(fill) {
            ctx.fill();
        }else {
            ctx.stroke();
        }
    }

    function drawRectangle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(mouseLock.x, mouseLock.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    }

    function drawText() { // need to work on this more
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.rect(mouseLock.x, mouseLock.y,
                 mouse.x - mouseLock.x, mouse.y - mouseLock.y);
        ctx.stroke();
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

    function drawImage() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, mouseLock.x, mouseLock.y,
                             mouse.x - mouseLock.x, mouse.y - mouseLock.y);
    }

    Paint.prototype.init = function() {
        var colorChooser = document.createElement("input");
        colorChooser.setAttribute("type", "color");
        colorChooser.addEventListener("change", function() {
            colors[0] = this.value;
        });


        textBox = document.createElement("textarea");
        textBox.style.position = "absolute";
        // textBox.style.left = mouseLock.x;
        // textBox.style.top = mouseLock.y;
        // textBox.style.width = mouseLock.x - mouse.x;
        // textBox.style.height = mouseLock.y - mouse.y;


        canvas.addEventListener("mousedown", function(e) {
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            mouseLock.x = mouse.x;
            mouseLock.y = mouse.y;

            switch(currentTool) {
            case "pencil":
                canvas.addEventListener("mousemove", drawPencil);
                if(fill) {
                    ctx.save();
                    ctx.lineWidth = 1;
                }
                break;
            case "brush":
                ctx.save();
                canvas.addEventListener("mousemove", drawBrush);
                break;
            case "circle":
                canvas.addEventListener("mousemove", drawCircle);
                break;
            case "square":
                ctx.save();
                ctx.lineJoin = "miter";
                canvas.addEventListener("mousemove", drawRectangle);
                break;
            case "line":
                canvas.addEventListener("mousemove", drawLine);
                break;
            case "text":
                ctx.save();
                ctx.lineWidth = 1;
                ctx.strokeColor = "#222";
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

        canvas.addEventListener("mouseup", function(e) {
            switch(currentTool) {
            case "pencil":
                if(fill) {
                    var context = currentLayer.getCanvasContext();
                    context.beginPath();
                    context.moveTo(points[0].x, points[0].y);
                    for(var i=0; i<points.length; i++) {
                        context.lineTo(points[i].x, points[i].y);
                    }
                    context.fill();
                    context.closePath();
                    points = [];
                    ctx.restore();
                }else {
                    currentLayer.getCanvasContext().drawImage(canvas, 0, 0);
                };
                canvas.removeEventListener("mousemove", drawPencil);
                break;
            case "brush":
                canvas.removeEventListener("mousemove", drawBrush);
                ctx.restore();
                currentLayer.getCanvasContext().drawImage(canvas, 0, 0);
                break;
            case "circle":
                canvas.removeEventListener("mousemove", drawCircle);
                currentLayer.getCanvasContext().drawImage(canvas, 0, 0);
                break;
            case "square":
                canvas.removeEventListener("mousemove", drawRectangle);
                ctx.restore();
                currentLayer.getCanvasContext().drawImage(canvas, 0, 0);
                break;
            case "line":
                canvas.removeEventListener("mousemove", drawLine);
                currentLayer.getCanvasContext().drawImage(canvas, 0, 0);
                break;
            case "text":
            // TODO: Definitely need to look at this more
                canvas.removeEventListener("mousemove", drawText)

                textBox.style.left = mouseLock.x + "px";
                textBox.style.top = mouseLock.y + "px";
                textBox.style.width = mouse.x - mouseLock.x + "px";
                textBox.style.height = mouse.y - mouseLock.y + "px";

                workspace.appendChild(textBox);
                textBox.focus();
                textBox.addEventListener("blur", function() {
                    currentLayer.getCanvasContext().fillText(textBox.value,
                        mouseLock.x, mouseLock.y, mouse.x - mouseLock.x);
                    textBox.remove();
                });
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
                break;
            case "eraser":
                // test on further integration
                canvas.removeEventListener("mousemove", erase);
                break;
            case "dropper":
                // canvas.removeEventListener("click", findColor);
                var pix = currentLayer.getCanvasContext()
                            .getImageData(mouse.x, mouse.y, 1, 1).data;
                var red = (255-pix[0]).toString(16);
                var green = (255-pix[1]).toString(16);
                var blue = (255-pix[2]).toString(16);
                if(red.length == 1) red = "0" + ("" + red);
                if(green.length == 1) green = "0" + ("" + green);
                if(blue.length == 1) blue = "0" + ("" + blue);
                colors[0] = "#" + red + green + blue;
                break;
            case "color":
                // test on further integration
                colorChooser.click();
                break;
            case "image":
                // test on further integration
                canvas.removeEventListener("mousemove", drawImage);
                currentLayer.getCanvasContext().drawImage(canvas, 0, 0);
                break;
            default:
                alert("Invalid tool selection");
                // royal screw up
                break;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }

    Paint.prototype.clearCurrentLayer = function() {
        currentLayer.getCanvasContext().clearRect(0,0,
                            currentLayer.getCanvas().width,
                            currentLayer.getCanvas().height);
    };

    return Paint;
})(document);
