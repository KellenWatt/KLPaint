declare var require: any;
require.config({
    baseUrl: "assets/scripts/",
    paths: {
        "knockout": "./lib/knockout-3.4.2",
        "jquery": "./lib/jquery-3.2.2.min",
        "d3": "./lib/d3-zoom.v1.min.js",
        "Paint": "Paint"
    },

});

require(["d3", "UI"]);
