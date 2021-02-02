function BeatParamsFragment(song) {

    this.div = document.createElement("div")
    this.paramsList = document.createElement("div")
    this.div.appendChild(this.paramsList)
    this.tapButton = document.createElement("div")

    this.song = song


    var beatParams = song.data.beatParams
    var onchange = () => {
        song.beatsChanged("beatsFragment")
    }

    var bpmProperty = {"property": "bpm", "name": "BPM", "type": "slider", "min": 20, "max": 250, 
            "color": "#008800", step: 1};
    this.bpmRange = new SliderCanvas(null, bpmProperty, null, beatParams, onchange);
    this.bpmRange.div.className = "fx-slider";
    
    var beatsProperty = {"property": "beats", "name": "Beats", "type": "options", options: [1,2,3,4,5,6,7,8], 
    "color": "#008800"};
    this.beatsRange = new SliderCanvas(null, beatsProperty, null, beatParams, onchange);
    this.beatsRange.div.className = "fx-slider";
            
    var subbeatsProperty = {"property": "subbeats", "name": "Subbeats", "type": "options", options: [1,2,3,4,5,6,7,8], 
    "color": "#008800"};
    this.subbeatsRange = new SliderCanvas(null, subbeatsProperty, null, beatParams, onchange);
    this.subbeatsRange.div.className = "fx-slider";
        
    var shuffleProperty = {"property": "shuffle", "name": "Shuffle", "type": "slider", "min": 0, "max": 1, 
            "color": "#008800", step: 0.01};
    this.shuffleRange = new SliderCanvas(null, shuffleProperty, null, beatParams, onchange);
    this.shuffleRange.div.className = "fx-slider";

    this.paramsList.appendChild(this.bpmRange.div)
    this.paramsList.appendChild(this.beatsRange.div)
    this.paramsList.appendChild(this.subbeatsRange.div)
    this.paramsList.appendChild(this.shuffleRange.div)        


}
 BeatParamsFragment.prototype.onshow = function () {

    /*if (this.song !== this.song) {
        this.setupForSong()
    }*/

    this.bpmRange.sizeCanvas();
    this.beatsRange.sizeCanvas();
    this.subbeatsRange.sizeCanvas();
    this.shuffleRange.sizeCanvas();
    this.refresh();    
    this.song.onBeatChangeListeners.push(() => this.refresh());
},
BeatParamsFragment.prototype.onhide = function () {
    this.song.onBeatChangeListeners.splice(
        this.song.onBeatChangeListeners.indexOf(tg.beatsFragment.refresh), 1);
};

BeatParamsFragment.prototype.setupTapTempoButton = function () {
    var bf = tg.beatsFragment;

    this.tapButton.onmousedown = (e) => {
        e.preventDefault()

        if (!this.lastTap || Date.now() - this.lastTap > 2000) {
            this.taps = []
        }
        else if (this.taps.length >= 6) {
            this.taps.splice(0, this.taps.length - 6)
        }
    
        this.lastTap = Date.now()
        this.taps.push(this.lastTap)

        if (this.taps.length >= 2) {
            var sum = 0
            for (var i = 1; i < this.taps.length; i++) {
                sum += this.taps[i] - this.taps[i - 1]
            }
            var msPerBeat = sum / (this.taps.length - 1)
            var bpm = Math.round(1 / (msPerBeat / 1000) * 60)
            this.song.data.beatParams.bpm = bpm
            this.song.beatsChanged("tapTempoButton")
        }
    }
}

BeatParamsFragment.prototype.setup = function () {
    tg.beatsFragment.setupTapTempoButton()
}


BeatParamsFragment.prototype.refresh = function (data, source) {
    if (source === "beatsFragment") {
        return
    }
    if (source === "tapTempoButton") {
        this.bpmRange.drawCanvas();
        return
    }
    this.bpmRange.drawCanvas();
    this.beatsRange.drawCanvas();
    this.subbeatsRange.drawCanvas();
    this.shuffleRange.drawCanvas();
};


/* KEY FRAGMENT */


function KeyParamsFragment(song) {
    this.song = song
    this.div = document.createElement("div")
    this.keyList = document.createElement("div")
    this.scaleList = document.createElement("div")
    this.div.style.display = "flex"

    this.keyList.className = "daw-key-fragment-key-list"
    this.scaleList.className = "daw-key-fragment-scale-list"

    this.div.appendChild(this.keyList)
    this.div.appendChild(this.scaleList)

    this.selectedCSSClass = "daw-selected-list-item"
    this.setup()
}
KeyParamsFragment.prototype.onshow = function () {
    this.song.onKeyChangeListeners.push(this.listener);
    if (this.lastKey) {
        this.lastKey.classList.remove(this.selectedCSSClass);
    }
    var selectedKeyDiv = this.keyList.childNodes[this.song.data.keyParams.rootNote]
    if (selectedKeyDiv) {
        selectedKeyDiv.classList.add(this.selectedCSSClass);
        this.lastKey = selectedKeyDiv;
    }
    
    if (this.lastScale) {
        this.lastScale.classList.remove(this.selectedCSSClass);
    }
    for (var i = 0; i < omg.ui.scales.length; i++) {
        if (omg.ui.scales[i].value.join() === this.song.data.keyParams.scale.join()) {
            let scaleDiv = this.scaleList.childNodes[i]
            scaleDiv.classList.add(this.selectedCSSClass);
            this.lastScale = scaleDiv;

        }
    }
},
KeyParamsFragment.prototype.onhide = function () {
    var i = this.song.onKeyChangeListeners.indexOf(tg.keyFragment.listener);
    if (i > -1) {
        this.song.onKeyChangeListeners.splice(i, 1);
    }
}

KeyParamsFragment.prototype.listener = function (keyParams, source) {
    if (source === "keyFragment") return;
    if (this.lastKey) {
        this.lastKey.classList.remove("selected-list-item");
    }
    this.lastKey = this.keyList.children[keyParams.rootNote];
    this.lastKey.classList.add("selected-list-item");
    
    for (var i = 0; i < omg.ui.scales.length; i++) {
        if (omg.ui.scales[i].value.join() === keyParams.scale.join()) {
            if (this.lastScale) {
                this.lastScale.classList.remove("selected-list-item");
            }
            this.lastScale = this.scaleList.children[i];
            this.lastScale.classList.add("selected-list-item");
            break;
        }
    }
};

KeyParamsFragment.prototype.setup = function () {
    
    this.keyList.innerHTML = "";
    this.scaleList.innerHTML = "";
    var keyI = 0;
    omg.ui.keys.forEach((key, i) => {
        var keyDiv = document.createElement("div");
        keyDiv.className = "daw-key-select-button";
        keyDiv.innerHTML = key;
        keyDiv.onclick = e => {
            this.song.data.keyParams.rootNote = i;
            this.song.keyChanged("keyFragment");

            if (this.lastKey) {
                this.lastKey.classList.remove(this.selectedCSSClass);
            }
            this.lastKey = keyDiv;
            keyDiv.classList.add(this.selectedCSSClass);
        }
        
        this.keyList.appendChild(keyDiv);
        keyI++;
    });
    omg.ui.scales.forEach((scale) => {
        var scaleDiv = document.createElement("div");
        scaleDiv.className = "daw-scale-select-button";
        scaleDiv.innerHTML = scale.name;
        scaleDiv.onclick = e => {
            this.song.setKey(this.song.data.keyParams.rootNote, scale.value, "keyFragment")

            if (this.lastScale) {
                this.lastScale.classList.remove(this.selectedCSSClass);
            }
            this.lastScale = scaleDiv;
            scaleDiv.classList.add(this.selectedCSSClass);
        }
        
        this.scaleList.appendChild(scaleDiv);
    });
};

KeyParamsFragment.prototype.keyChanged = function () {
    /*tg.currentSection.parts.forEach(function (part) {
        if (part.mm) {
            part.mm.setupFretBoard();
        }
    });*/
    this.song.keyChanged();
};
