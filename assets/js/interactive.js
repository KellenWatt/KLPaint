window.onload = function() {
    var palette = document.getElementById("palette");
    var toolbar = document.getElementById("toolbar");
    var layerPanel = document.getElementById("layers-panel");
    var layers = document.getElementById("layers");
    var historyPanel = document.getElementById("history-panel");
    var history = document.getElementsByClassName("layer-history")[0];

    var selectedLayer;

    palette.addEventListener("click", function(e) {
        toolbar.style.display = (toolbar.style.display == "none" ? "flex" : "none");
    });

    layerPanel.addEventListener("click", function(e) {
        layers.style.display = (layers.style.display == "none" ? "flex" : "none");
    });

    historyPanel.addEventListener("click", function(e) {
        history.style.display = (history.style.display == "none" ? "flex" : "none");
    });

    var kaboom = document.getElementById("clear-screen");
    kaboom.addEventListener("click", function () {
        // TODO: clear current canvas with this
        console.log("KABOOM!!!");
    });

    var saveButton = document.getElementById("save");
    saveButton.addEventListener("click", function() {
        // TODO: some form of saving, probably serverside;
        console.log("Saving...");
    });


    var createLayerButton = document.getElementById("create-layer");
    var layerList = document.getElementById("layer-list");
    var layerCount = 1;
    createLayerButton.addEventListener("click", function() {
        // TODO: Add canvas;
        var newLayer = document.createElement("li");
        newLayer.className = "layer-list-item";
        newLayer.id = "layer" + layerCount;
        var img = document.createElement("img");
        img.src = "assets/images/visible.png";
        newLayer.appendChild(img);
        newLayer.innerHTML = newLayer.innerHTML + "Layer" + layerCount++;
        newLayer.addEventListener("click", function(e) {
            // TODO: integrate canvas selection;
            if(selectedLayer) {
                document.getElementById(selectedLayer).style.backgroundColor = "#999";
            }
            selectedLayer = this.id;
            this.style.backgroundColor = "lightgrey";
        });
        layerList.insertBefore(newLayer, layerList.childNodes[-1]);
    });

    var deleteLayerButton = document.getElementById("delete-layer");
    deleteLayerButton.addEventListener("click", function () {
        // TODO: remove canvas;
        if(selectedLayer){
            layerList.removeChild(document.getElementById(selectedLayer));
            selectedLayer = null;
            // TODO: MAYBE: highlight previous layer
        }
    });



};
