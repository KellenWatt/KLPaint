(function(document, ko, jq) {
    // Paint declaration pre-reqs
    var drawspace = document.getElementById("drawspace");
    var color1 = document.getElementById("primary-color");
    var iweight = +(document.getElementById("brush-size").value)

    var paint = new Paint(drawspace, color1, color1, iweight);
    paint.init();
    paint.setCurrentTool("dropper");

    document.getElementById("fill").addEventListener("change", function() {
        paint.setFill(this.checked);
    });

    document.getElementById("brush-size").addEventListener("change", function(){
        paint.setWeight(+this.value);
    });


    // Knockout stuff



    // End Knockout stuff
    // Other stuff to do with the canvas



    // End of other stuff
    // ...
    // What? Are you expecting more?
})(document, ko, $);
