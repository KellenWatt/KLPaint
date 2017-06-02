(function(document) {
    var erase = document.getElementById("erase");
    var canvas = document.getElementById("drawspace");
    canvas.setAttribute("width", window.innerWidth);
    canvas.setAttribute("height", window.innerHeight);
    var image = document.getElementById("image");
    image.setAttribute("width", window.innerWidth);
    image.setAttribute("height", window.innerHeight);
    var context = canvas.getContext("2d");

    var cxt = image.getContext("2d");

    var x = 0;
    var y = 0;

    var lock = {x:0, y:0};

    var boom = document.getElementById("boom");
    var color = document.getElementById("color");

    function addAlpha(hex, num) {
        var red = parseInt(hex.substring(1,3), 16);
        var green = parseInt(hex.substring(3,5), 16);
        var blue = parseInt(hex.substring(5,7), 16);
        var alpha = parseInt(num, 16) / 255;
        return "rgba("+red+","+green+","+blue+","+alpha+")";
    }

    color.addEventListener("change", function() {
        console.log(addAlpha(this.value,"7F"));
        context.strokeStyle = addAlpha(this.value,"7F");
        context.fillStyle = addAlpha(this.value,"7F");
        cxt.fillStyle = addAlpha(this.value,"7F");
    });

    canvas.addEventListener("mousemove", function(e) {
        x = e.pageX - this.offsetLeft;
        y = e.pageY - this.offsetTop;
        // console.log(e.pageX, this.offsetLeft);
        // console.log(e.pageY, this.offsetTop)
        var pix = cxt.getImageData(x, y, 1, 1).data;
        context.clearRect(0,0,150, 20);
        cxt.clearRect(0,0,150,20);
        context.fillText("rgba(" + pix[0] + ", " + pix[1] + ", " + pix[2] + ", " + pix[3] + ")", 10, 10);

    });

    var rad = 10;
    var points = [];

    var Point = function(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

    context.lineWidth = rad*2;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.strokeStyle = color.value + "88";
    context.fillStyle = color.value + "88";
    cxt.fillStyle = color.value + "88";

    canvas.addEventListener("mousedown", function(e) {
        context.beginPath();
        context.moveTo(x, y);
        lock.x = x;
        lock.y = y;
        canvas.addEventListener("mousemove", paint);
    });

    canvas.addEventListener("mouseup", function() {
        cxt.drawImage(canvas, 0, 0);
        // cxt.beginPath();
        // cxt.moveTo(points[0].x, points[0].y); // causes error when no down
        // for(var i=1; i<points.length; i++) {
        //     cxt.lineTo(points[i].x, points[i].y);
        // }
        // cxt.fill();
        // cxt.closePath();
        // points = [];
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.removeEventListener("mousemove", paint);
    });

    function paint() {
        // context.clearRect(0, 0, canvas.width, canvas.height);
        // context.beginPath();
        // rectangle
        // context.fillRect(lock.x, lock.y, x - lock.x, y - lock.y);

        // circle
        // var radius = Math.sqrt(Math.pow(x-lock.x, 2) + Math.pow(y-lock.y, 2));
        // context.arc(lock.x, lock.y, radius, 0, 2*Math.PI);
        // context.fill();

        // fill on line
        // context.lineTo(x, y);
        // context.stroke();
        //
        // points.push(new Point(x, y));

        // pencil and erase
        if(erase.checked){
            cxt.save();
            cxt.beginPath();
            cxt.arc(x, y, rad, 0, 2*Math.PI, true);
            cxt.clip();
            cxt.clearRect(x - rad, y - rad, rad*2, rad*2);
            cxt.restore();
        }else {
            context.lineTo(x, y);
            context.stroke();
        }

        // context.closePath();
    }


    boom.addEventListener("click", function(e) {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
    });



})(document);
