window.addEventListener("load", function() {

    var palette = document.getElementById("palette");
    var toolbar = document.getElementById("toolbar");
    var layerPanel = document.getElementById("layers-panel");
    var layerPane = document.getElementById("layers");
    var historyPanel = document.getElementById("history-panel");
    var history = document.getElementsByClassName("layer-history")[0];
    var createLayerButton = document.getElementById("create-layer");
    var layerList = document.getElementById("layer-list");
    var toolbox = document.getElementsByClassName("toolbox")[0];

    var selectedLayer = null;
    var currentTool = "pencil";
    var layers = [];

    function toggleShow(e) {
        e.target.style.display = (e.target.display == "none" ? "flex" : "none");
    }

    palette.addEventListener("click", toggleShow);

    layerPanel.addEventListener("click", toggleShow);

    historyPanel.addEventListener("click", toggleShow);

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


    createLayerButton.addEventListener("click", function() {
        layers.push(new Layer(layers.length));

        var newLayer = document.createElement("li");
        newLayer.className = "layer-list-item";
        newLayer.id = "layer" + layerCount;
        var img = document.createElement("img");
        img.src = "assets/images/visible.png";
        newLayer.appendChild(img);
        newLayer.innerHTML = newLayer.innerHTML + "Layer" + layerCount;
        newLayer.addEventListener("click", function(e) {
            // TODO: integrate canvas selection;
            if(selectedLayer) {
                document.getElementById("layer"+selectedLayer).style.backgroundColor = "#999";
            }
            document.getElementsByClassName("toolbox")[0]
            selectedLayer = this.id.slice(5,-1);
            console.log(selectedLayer);
            this.style.backgroundColor = "lightgrey";
        });
        layerList.insertBefore(newLayer, layerList.childNodes[-1]);
        //Add canvas with same id# as layer
        var newCanvas = document.createElement("canvas");
        newCanvas.className = "layer-list";
        newCanvas.id = "canvas" + layerCount;
        document.getElementById("drawspace").appendChild(newCanvas);
        layerCount++;
    });

    var deleteLayerButton = document.getElementById("delete-layer");
    deleteLayerButton.addEventListener("click", function () {
        // TODO: remove canvas;
        if(selectedLayer){
            layerList.removeChild(document.getElementById("layer"+selectedLayer));
            selectedLayer = null;
            // TODO: MAYBE: highlight previous layer
        }
    });


    var tools = toolbox.children;
    for(var i=0; i < tools.length; i++) {
        tools[i].addEventListener("click", function(e) {
            currentTool = this.value;
            console.log(currentTool);
        });
    }


});
