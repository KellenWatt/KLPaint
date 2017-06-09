(function(document, ko, jq) {
    // Paint declaration pre-reqs
    var drawspace = document.getElementById("drawspace");
    var color1 = document.getElementById("primary-color");
    var color2 = document.getElementById("secondary-color");
    var iweight = +(document.getElementById("brush-size").value)
    var paint = new Paint(drawspace, color1, color2, iweight);
    paint.init();
    paint.setCurrentTool("pencil");

    // Knockout stuff



    // End Knockout stuff
    // Other stuff to do with the canvas



    // End of other stuff
    // ...
    // What? Are you expecting more?
}(document, ko, $));
