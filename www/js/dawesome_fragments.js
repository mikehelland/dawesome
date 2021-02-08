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


/* ADD PART FRAGMENT */

function AddPartFragment(addCallback) {

    this.div = document.createElement("div")
    this.addCallback = addCallback
    this.selectSoundType = document.createElement("select")
    this.selectSoundType.innerHTML = `
        <option value="soundfont">SoundFont</option>
        <option value="synth">Synth</option>
        <option value="search">Search Gallery</option>`
    this.selectSoundType.onchange = e => {
        if (this.selectSoundType.value === "soundfont") {
            this.searchGalleryDiv.style.display = "none"
            this.selectSoundFontDiv.style.display = "block"
        }
        else if (this.selectSoundType.value === "search") {
            this.selectSoundFontDiv.style.display = "none"
            this.searchGalleryDiv.style.display = "block"
            this.gallerySearchBox.search()

        }
        else if (this.selectSoundType.value === "soundfont") {

        }
    }

    this.div.innerHTML = "<div style='padding:20px'>Find sounds in the gallery or add your own</div>"
    this.div.appendChild(this.selectSoundType)

    this.setupSoundFontPage()
    this.setupSearchPage()
}

AddPartFragment.prototype.setupSoundFontPage = function () {

    this.selectSoundFontDiv = document.createElement("div")
    this.selectSoundFontCategory = document.createElement("select")
    this.selectSoundFontPatch = document.createElement("select")
    this.selectSoundFontFile = document.createElement("select")

    this.selectSoundFontDiv.innerHTML = "<p>Select a <a target='_out' href='https://github.com/surikov/webaudiofont'>SoundFont</a></p>"
    var captionDiv
    captionDiv = document.createElement("div")
    captionDiv.innerHTML = "Category:"
    this.selectSoundFontDiv.appendChild(captionDiv)
    this.selectSoundFontDiv.appendChild(this.selectSoundFontCategory)
    captionDiv = document.createElement("div")
    captionDiv.innerHTML = "Patch:"
    this.selectSoundFontDiv.appendChild(captionDiv)
    this.selectSoundFontDiv.appendChild(this.selectSoundFontPatch)
    captionDiv = document.createElement("div")
    captionDiv.innerHTML = "File:"
    this.selectSoundFontDiv.appendChild(captionDiv)
    this.selectSoundFontDiv.appendChild(this.selectSoundFontFile)

    var addButton = document.createElement("button")
    addButton.onclick = e => {
        if (this.addCallback) {
            var name = this.selectSoundFontPatch.options[this.selectSoundFontPatch.selectedIndex].innerHTML
            var file = this.selectSoundFontFile.options[this.selectSoundFontFile.selectedIndex].innerHTML
            this.addCallback({
                name: name,
                soundSet: {
                    soundFont: {
                        url: this.selectSoundFontFile.value, 
                        name: file
                    },
                    octave: 5, lowNote: 0, highNote: 108, chromatic: true
                }
            })
        }
    }
    addButton.innerHTML = "Add"
    this.selectSoundFontDiv.appendChild(addButton)

    this.div.appendChild(this.selectSoundFontDiv)

    fetch("/apps/music/js/libs/soundfonts.json").then(res=>res.json()).then(soundFonts => {
        this.soundFonts = soundFonts
        this.soundFontCategories = {}
        var selectHTML = ""
        soundFonts.forEach(sf => {
            if (!this.soundFontCategories[sf.category]) {
                this.soundFontCategories[sf.category] = []
                selectHTML += "<option value='" + sf.category + "'>" + sf.category + "</option>"
            }
            this.soundFontCategories[sf.category].push(sf)

        })
        this.selectSoundFontCategory.innerHTML = selectHTML
        this.selectSoundFontCategory.onchange()
    })

    this.selectSoundFontCategory.onchange = e => {
        var selectHTML = ""
        this.soundFontCategories[this.selectSoundFontCategory.value].forEach((sf, i) => {
            selectHTML += "<option value='" + i + "'>" + sf.name + "</option>"
        })
        this.selectSoundFontPatch.innerHTML = selectHTML
        this.selectSoundFontPatch.onchange()    
    }

    this.selectSoundFontPatch.onchange = e => {
        var selectHTML = ""
        this.soundFontCategories[this.selectSoundFontCategory.value][this.selectSoundFontPatch.selectedIndex].files.forEach((f, i) => {
            var file = f.split("/")
            file = file[file.length - 1]
            selectHTML += "<option value='" + f + "'>" + file + "</option>"
        })
        this.selectSoundFontFile.innerHTML = selectHTML
    }

}

AddPartFragment.prototype.setupSearchPage = function () {

    this.searchGalleryDiv = document.createElement("div")
    var searchBox = new OMGSearchBox({types: ["SOUNDSET"]})
    this.searchGalleryDiv.appendChild(searchBox.div)
    searchBox.loadSearchResults = results => {
        results.forEach(result => {
            var resultDiv = document.createElement("div")
            resultDiv.innerHTML = result.name
            resultDiv.className = "daw-add-part-search-result"
            searchBox.resultList.appendChild(resultDiv)

            resultDiv.onclick = e => {
                if (this.addCallback) {
                    this.addCallback({soundSet: result})
                }
            }
        })
    }
    this.gallerySearchBox = searchBox

    this.searchGalleryDiv.style.display = "none"
    this.div.appendChild(this.searchGalleryDiv)
}

function SaveFragment(song) {

    var captionDiv

    this.song = song
    this.div = document.createElement("div")
    
    captionDiv = document.createElement("div")
    captionDiv.innerHTML = "Song Name:"
    this.div.appendChild(captionDiv)
    this.nameInput = document.createElement("input")
    this.div.appendChild(this.nameInput)
    
    captionDiv = document.createElement("div")
    captionDiv.innerHTML = "Tags:"
    this.div.appendChild(captionDiv)
    this.tagsInput = document.createElement("input")
    this.div.appendChild(this.tagsInput)
    
    captionDiv = document.createElement("div")
    captionDiv.innerHTML = "Bitcoin Address (your tip jar):"
    this.div.appendChild(captionDiv)
    this.btcInput = document.createElement("input")
    this.div.appendChild(this.btcInput)

    this.nameInput.value = song.data.name || ""
    this.tagsInput.value = song.data.tags || ""
    this.btcInput.value = song.data.btc_address || ""


    
    if (song.data.id) {
        this.overwriteButton = document.createElement("button")
        this.overwriteButton.innerHTML = "Overwrite"
        this.saveCopyButton = document.createElement("button")
        this.saveCopyButton.innerHTML = "Save Copy"
        this.div.appendChild(this.overwriteButton)
        this.div.appendChild(this.saveCopyButton)

        this.overwriteButton.onclick = e => {
            this.post()
        }
        this.overwriteButton.onclick = e => {
            delete song.data.id
            this.post()
        }
    }
    else {
        this.saveButton = document.createElement("button")
        this.saveButton.innerHTML = "Save"
        this.div.appendChild(this.saveButton)

        this.saveButton.onclick = e => {
            this.post()
        }
    }

}

SaveFragment.prototype.post = function () {
    
    this.song.data.name = this.nameInput.value
    this.song.data.tags = this.tagsInput.value
    this.song.data.btc_address = this.btcInput.value

    var data = this.song.getData()
    omg.server.post(data, res => {
        console.log(res)

        // show saved
        // timeout close
    })
}

function OpenFragment(callback) {
    this.div = document.createElement("div")
    var types = ["SONG"]
    this.searchBox = new OMGSearchBox({
        div: this.div,
        types
    })
    this.searchBox.search()
}