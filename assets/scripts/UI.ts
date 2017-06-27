import {Paint} from "Paint";
import {HistoryLayer} from "PaintHistory";
import {Layer} from "PaintLayer";
import * as ko from "knockout";
import {Point} from "definitions";


interface HistoryUnit {
    index: number,
    version: number
}

class PaintViewModel {
    paint: Paint;
    fileChooser: HTMLInputElement;

    paletteVisible: KnockoutObservable<boolean>;
    layersVisible: KnockoutObservable<boolean>;
    historyVisible: KnockoutObservable<boolean>;
    sidebarVisible: KnockoutComputed<boolean>;

    selectedTool: KnockoutObservable<string>;
    primaryColor: KnockoutObservable<string>;
    brushWeight: KnockoutObservable<number>;
    fillValue: KnockoutObservable<boolean>;

    historyLayers: KnockoutObservableArray<HistoryLayer>
    layerList: KnockoutObservableArray<Layer>;

    selectedLayerIndex: KnockoutObservable<number>;
    selectedHistoryUnit: KnockoutObservable<HistoryUnit>;


    constructor() {
        let drawspace = document.getElementById("drawspace");
        this.paint = new Paint(drawspace);
        this.paint.init();
        this.paint.tool = "pencil";
        this.paint.weight = 10;

        this.fileChooser = document.createElement("input") as HTMLInputElement;
        this.fileChooser.type = "file";
        this.fileChooser.addEventListener("change", (e) => {
            let file = (e.target as HTMLInputElement).files[0];
            let reader = new FileReader();

            reader.addEventListener("load", (e) => {
                let img = new Image();
                img.src = (e.target as FileReader).result;
                this.paint.imageToolImage = img;
            });

            reader.readAsDataURL(file);
        }, false);

        this.paletteVisible = ko.observable(true);
        this.layersVisible = ko.observable(true);
        this.historyVisible = ko.observable(true);
        this.sidebarVisible = ko.computed(() => {
            return this.layersVisible() || this.historyVisible();
        });

        this.selectedTool = ko.observable("pencil");
        this.selectedTool.subscribe((newval) => {
            this.paint.tool = newval;
        });
        this.selectedTool("pencil");

        this.primaryColor = ko.observable("#000000");
        this.primaryColor.subscribe((color: string) => {
            this.paint.setColors(color, color)
        })
        this.paint.setColorChangeCallback((primary: boolean, secondary: boolean) => {
            this.primaryColor(this.paint.primaryColor);
        });

        this.brushWeight = ko.observable(10);
        this.brushWeight.subscribe((weight) => {
            if(weight < 1) {
                this.brushWeight(1);
                this.paint.weight = 1;
            }
            this.paint.weight = weight;
        });
        this.brushWeight(10);

        this.fillValue = ko.observable(false);
        this.fillValue.subscribe((f) => {
            this.paint.fill = f;
        });
        this.fillValue(false);

        this.historyLayers = ko.observableArray(this.paint.workingLayer.history.fullHistory());
        this.layerList = ko.observableArray(this.paint.layerList);

        this.selectedLayerIndex = ko.observable(0);

        this.selectedHistoryUnit = ko.observable({index: 0, version: 0});
    }

    togglePalette() : void {
        this.paletteVisible(!this.paletteVisible());
    }

    toggleLayers() : void {
        this.layersVisible(!this.layersVisible());
    }

    toggleHistory() : void {
        this.historyVisible(!this.historyVisible());
    }

    nukeProject() : void {
        this.layerList(this.paint.nuke());
        this.selectedLayerIndex(0);
        this.historyLayers(this.paint.workingLayer.history.fullHistory());
        this.selectedHistoryUnit({index: 0, version: 0});
    }

    download() : void {
        let link = document.createElement("a");
        link.href = this.paint.collapse();
        link.download = "MyDrawing.png";
        link.click();
    }

    upload() : void {}

    toolbarUndo() : void {
        this.paint.undo();
        let i = this.selectedHistoryUnit().index;
        this.selectedHistoryUnit({index: (i <= 0 ? 0 : i-1), version: 0});
    }

    toolbarRedo() : void {
        this.paint.redo();
        let i = this.selectedHistoryUnit().index;
        let l = this.paint.workingLayer.history.states.length;
        this.selectedHistoryUnit({index: (i == l-1 ? l-1 : i+1), version: 0});
    }

    findImage() : void {
        this.selectedTool("image");
        this.fileChooser.click();
    }

    newLayer() : void {
        this.layerList(this.paint.addLayer());
        this.historyLayers(this.paint.workingLayer.history.fullHistory());
    }

    selectLayer(index: number) : void {
        this.paint.switchLayer(this.layerList()[index].id);
        this.selectedLayerIndex(index);
        this.historyLayers(this.paint.workingLayer.history.fullHistory());
        this.selectedHistoryUnit({index: this.paint.workingLayer.history.states.length-1,
                                version: this.paint.workingLayer.history.version});
    }

    deleteLayer() {
        if(this.paint.layerList.length > 1) {
            let index = this.selectedLayerIndex();
            this.selectedLayerIndex(index > 0 ? index-1 : index);
            this.layerList(this.paint.deleteLayer(this.layerList()[index].id));
            this.paint.switchLayer(this.layerList()[index > 0 ? index-1 : index].id);
            this.historyLayers(this.paint.workingLayer.history.fullHistory());
            this.selectedHistoryUnit({index: this.paint.workingLayer.history.states.length-1,
                                    version: this.paint.workingLayer.history.version});
        }
    }

    updateHistory() : void {
        if(this.paint.changed) {
            this.historyLayers([]);
            this.historyLayers(this.paint.workingLayer.history.fullHistory());
            this.selectedHistoryUnit({index: this.selectedHistoryUnit().index + 1,
                                    version: 0});
        }
    }

    selectHistoryUnit(index: number, version: number) : void {
        if(index >= this.selectedHistoryUnit().index) {
            this.paint.redo(index, version);
        } else {
            this.paint.undo(index, version);
        }
        this.selectedHistoryUnit({index: index, version: version});
    }

    isHistoryUnitSelected(index: number, version: number) {
        return this.selectedHistoryUnit().index == index &&
               this.selectedHistoryUnit().version == version;
    }

}

ko.applyBindings(new PaintViewModel());
