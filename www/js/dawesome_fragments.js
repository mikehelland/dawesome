import SliderCanvas from "./slider_canvas.js"

export function MixerFragment(daw) {
    this.daw = daw
    this.song = daw.song
    this.div = document.createElement("div")
    this.div.classList.add("daw-mixer")

    this.parts = {}
    for (var partName in this.song.parts) {
        this.addMixerChannel(this.song.parts[partName])
    }

    this.onPartAddListener = (part) => {
        this.addMixerChannel(part)
    }
    this.onAudioParamsChange = (part) => {
        this.parts[part.data.name].refresh()
    }
    this.song.onPartAddListeners.push(this.onPartAddListener)
    this.song.onPartAudioParamsChangeListeners.push(this.onAudioParamsChange)
}

MixerFragment.prototype.onshow = function () {
    for (var partName in this.parts) {
        this.parts[partName].refresh()
    }
}

MixerFragment.prototype.addMixerChannel = function (part) {
    var channelDiv = document.createElement("div")
    channelDiv.className = "daw-mixer-channel"

    var caption = document.createElement("div")
    caption.innerHTML = part.data.name
    caption.className = "daw-mixer-caption"

    var volumeCanvas = document.createElement("canvas")
    volumeCanvas.className = "daw-mixer-volume"
    
    var panCanvas = document.createElement("canvas")
    panCanvas.className = "daw-mixer-pan"

    channelDiv.appendChild(panCanvas)
    channelDiv.appendChild(volumeCanvas)
    channelDiv.appendChild(caption)

    this.div.appendChild(channelDiv)

    var onchange = () => {
        part.song.partMuteChanged(part);
    }

    var volumeProperty = {"property": "gain", "name": "", "type": "slider", "min": 0, "max": 1.5, 
            "color": part.data.audioParams.mute ?"#880000" : "#008800", transform: "square", direction: "vertical"};
    var volumeSlider = new SliderCanvas(volumeCanvas, volumeProperty, part.gain, part.data.audioParams, onchange);

    var panProperty = {"property": "pan", "name": "", "type": "slider", "min": -1, "max": 1, resetValue: 0, "color": "#000080", hideValue: true};
    var panSlider = new SliderCanvas(panCanvas, panProperty, part.panner, part.data.audioParams, onchange);

    volumeSlider.sizeCanvas()
    panSlider.sizeCanvas()
    
    /*var meterHolder = document.createElement("div")
    meterHolder.className = "daw-mixer-meter"
    volumeHolder.appendChild(meterHolder)
    if (part.postFXGain) {
        this.mixer.visibleMeters.push(new PeakMeter(part.postFXGain, meterHolder, this.player.context));
    }
    else {
        part.onnodesready = () => {
            this.mixer.visibleMeters.push(new PeakMeter(part.postFXGain, meterHolder, this.player.context));
        }
    }*/

    this.parts[part.data.name] = {volumeSlider, panSlider, refresh: () => {
            volumeSlider.controlInfo.color = part.data.audioParams.mute ? "#880000" : "#008800"
            volumeSlider.sizeCanvas()
            panSlider.sizeCanvas()
        }
    }
}


export function BeatParamsFragment(song) {

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


export function KeyParamsFragment(song) {
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

export function AddPartFragment(addCallback) {

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

export function SaveFragment(song) {

    var captionDiv

    this.song = song
    this.div = document.createElement("div")
    
    this.saveDiv = document.createElement("div")
    this.div.appendChild(this.saveDiv)

    captionDiv = document.createElement("div")
    captionDiv.innerHTML = "Song Name:"
    this.saveDiv.appendChild(captionDiv)
    this.nameInput = document.createElement("input")
    this.saveDiv.appendChild(this.nameInput)
    
    captionDiv = document.createElement("div")
    captionDiv.innerHTML = "Tags:"
    this.saveDiv.appendChild(captionDiv)
    this.tagsInput = document.createElement("input")
    this.saveDiv.appendChild(this.tagsInput)
    
    captionDiv = document.createElement("div")
    captionDiv.innerHTML = "Bitcoin Address (your tip jar):"
    this.saveDiv.appendChild(captionDiv)
    this.btcInput = document.createElement("input")
    this.saveDiv.appendChild(this.btcInput)

    this.nameInput.value = song.data.name || ""
    this.tagsInput.value = song.data.tags || ""
    this.btcInput.value = song.data.btc_address || ""

    this.saveDiv.appendChild(document.createElement("br"))
    
    if (song.data.id) {
        this.overwriteButton = document.createElement("button")
        this.overwriteButton.innerHTML = "Overwrite"
        this.saveCopyButton = document.createElement("button")
        this.saveCopyButton.innerHTML = "Save Copy"
        this.saveDiv.appendChild(this.overwriteButton)
        this.saveDiv.appendChild(this.saveCopyButton)

        this.overwriteButton.onclick = e => {
            this.post()
        }
        this.saveCopyButton.onclick = e => {
            delete song.data.id
            this.post()
        }
    }
    else {
        this.saveButton = document.createElement("button")
        this.saveButton.innerHTML = "Save"
        this.saveDiv.appendChild(this.saveButton)

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

        this.song.data.id = res.id

        this.div.removeChild(this.saveDiv)

        var el = document.createElement("div")
        el.innerHTML = "Saved!"
        this.div.appendChild(el)

        el = document.createElement("div")
        el.innerHTML = "You can view your song here:"
        this.div.appendChild(el)

        el = document.createElement("input")
        el.value = window.location.origin + "/view/" + res.id
        this.div.appendChild(el)

        // show saved
        // timeout close
    })
}

export function OpenFragment(callback) {
    this.div = document.createElement("div")
    var types = ["SONG"]
    this.searchBox = new OMGSearchBox({
        div: this.div,
        types,
    })
    this.searchBox.onclickcontent = callback
    this.searchBox.search()
}

export function FXFragment(daw) {
    this.daw = daw
    this.player = daw.player
    this.song = daw.song
    this.wm = daw.wm

    this.partDivs = new Map()

    this.div = document.createElement("div");
    this.div.className = "daw-fx"

    for (var partName in this.song.parts) {
        this.addFXChannel(this.song.parts[partName])
    }


    this.fxChangeListener = (action, part, fx) => {
        if (action === "remove" || action === "add") {
            var partDiv = this.partDivs.get(part)
            this.loadChannelFXList(part, partDiv.listDiv)
        }
    }
    this.addPartListener = (part) => {
        this.addFXChannel(part)
    }
    this.song.onFXChangeListeners.push(this.fxChangeListener)
    this.song.onPartAddListeners.push(this.addPartListener)

}

FXFragment.prototype.addFXChannel = function (part) {
    var div = document.createElement("div")
    div.className = "daw-mixer-channel"

    var caption = document.createElement("div")
    caption.innerHTML = part.data.name
    caption.className = "daw-mixer-caption"

    var listDiv = document.createElement("div")
    listDiv.className = "daw-fx-list"
    
    var warpCanvas = document.createElement("canvas")
    warpCanvas.className = "daw-fx-warp"

    var addButton = document.createElement("div")
    addButton.className = "daw-fx-add"
    addButton.innerHTML = "+"

    div.appendChild(warpCanvas)
    div.appendChild(addButton)
    div.appendChild(listDiv)
    div.appendChild(caption)

    this.div.appendChild(div)

    var prop = {"property": "warp", "name": "warp", "type": "slider", "min": 0, "max": 2, resetValue: 0, "color": "#008000"};
    var warpSlider = new SliderCanvas(warpCanvas, prop, part.panner, part.data.audioParams, onchange);

    warpSlider.sizeCanvas()

    this.partDivs.set(part, {div, listDiv})

    this.loadChannelFXList(part, listDiv)

    addButton.onclick = async e => {
        var fxMenu = []

        var fxFactory = await this.daw.musicContext.getFXFactory()

        for (let fxName in fxFactory.fx) {
            fxMenu.push({name: fxName, onclick: () => {
                    var fx = this.daw.musicContext.addFXToPart(fxName, part)
                    this.daw.showFXDetail(fx, part)        
                }
            })
        }
        this.wm.showSubMenu({
            div: addButton, 
            items: fxMenu,
            toTheRight: true
        })
    }

}

FXFragment.prototype.loadChannelFXList = function (part, listDiv) {
    listDiv.innerHTML = ""
    part.fx.forEach(fx => {
        this.loadChannelFX(part, fx, listDiv)
    })
}
FXFragment.prototype.loadChannelFX = function (part, fx, listDiv) {
    var fxDiv = document.createElement("div")
    fxDiv.innerHTML = fx.data.name
    fxDiv.className = "daw-fx-button"
    listDiv.appendChild(fxDiv)

    fxDiv.onclick = e => {
        this.daw.showFXDetail(fx, part)
    }
}

export function FXDetailFragment(fx, part, player) {
    this.fx = fx

    this.div = document.createElement("div");
    this.div.className = "fx-controls";
    
    var tools = document.createElement("div");
    tools.className = "daw-fx-tools";
    this.div.appendChild(tools);
    var bypassButton = document.createElement("div");
    bypassButton.innerHTML = "Bypass FX";
    bypassButton.onclick = function () {
        fx.node.bypass = !fx.node.bypass ? 1 : 0;
        fx.data.bypass = fx.bypass ? 1 : 0;
        bypassButton.classList.toggle("daw-selected-option");
    };
    bypassButton.className = "daw-fx-tool"
    var removeButton = document.createElement("div");
    removeButton.innerHTML = "Remove FX";
    removeButton.onclick = () => {
        player.removeFXFromPart(fx, part);
        this.window.close()
    };
    removeButton.className = "daw-fx-tool"
    tools.appendChild(bypassButton);
    tools.appendChild(removeButton);
    
    this.setupFXControls(fx, part, this.div);
    
    if (fx.node.bypass) {
        bypassButton.classList.add("daw-selected-option");
    }
};

FXDetailFragment.prototype.setupFXControls = function (fx, part, fxDiv) {

    var controls = fx.controls;
    var divs = [];
    controls.forEach(function (control) {        
        var canvas = document.createElement("canvas");
        canvas.className = "fx-slider";
        fxDiv.appendChild(canvas);
        var div = new SliderCanvas(canvas, control, fx.node, fx.data, (value) => {
            var changes = {}
            changes[control.property] = value
            part.song.fxChanged(changes, part, fx)
        });
        divs.push(div);
    });
    fx.controlDivs = divs;
}

FXDetailFragment.prototype.onshow = function () {
    this.fx.controlDivs.forEach((div) => {
        div.sizeCanvas();
    });
}


export function PartOptionsFragment(part, daw) {
    this.div = document.createElement("div")
    
    var nameInput = document.createElement("input")
    nameInput.value = part.data.name
    this.div.appendChild(nameInput)

    if (navigator.requestMIDIAccess) {
        var onchannelchange = () => {
            if (!daw.midi) {
                daw.midi = new OMGMIDI()
            }
            daw.midi.player = daw.player
            var index = daw.midi.parts.indexOf(part);
            if (this.midiCanvas.value === "Off" && index > -1) {
                daw.midi.parts.splice(index, 1);
            }
            else if (this.midiCanvas.value !== "Off" && index === -1) {
                part.activeMIDINotes = [];
                part.activeMIDINotes.autobeat = 0//1;
                daw.midi.parts.push(part);
            }
        };

        if (!part.midiChannel) {
            part.midiChannel = "Off"
        }
        var midiProperty = {"property": "midiChannel", "name": "MIDI Channel", "type": "options",
                options: ["Off", "All", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                "color": "#008800", transform: "square"};
        this.midiCanvas = new SliderCanvas(undefined, midiProperty, undefined, part, onchannelchange);
        this.midiCanvas.div.className = "fx-slider";
        this.div.appendChild(this.midiCanvas.div)
    }
}

PartOptionsFragment.prototype.onshow = function () {
    if (this.midiCanvas) {
        this.midiCanvas.sizeCanvas()
    }
}

export function ChordProgressionFragment(section, daw) {
    this.section = section 
    this.daw = daw
    this.div = document.createElement("div")
    this.div.style.display = "flex"
    this.div.style.flexDirection = "column"

    this.topRow = document.createElement("div")
    this.topRow.className = "daw-chords-top-row"
    this.appendButton = document.createElement("div")
    this.appendButton.innerHTML = "Append"
    this.appendButton.className = "daw-chords-top-button"
    this.appendButton.onclick = () => {
        this.appendMode = !this.appendMode
        this.appendButton.style.backgroundColor = this.appendMode ? "darkblue" : "initial"
    }

    this.displayDiv = document.createElement("div")
    this.displayDiv.innerHTML = daw.makeChordsCaption(section)
    this.displayDiv.className = "daw-chords-display"
    
    this.clearButton = document.createElement("div")
    this.clearButton.innerHTML = "Clear"
    this.clearButton.className = "daw-chords-top-button"
    this.clearButton.onclick = e => {
        this.section.data.chordProgression = [0]
        this.update()
    }
    
    this.topRow.appendChild(this.appendButton)
    this.topRow.appendChild(this.displayDiv)
    this.topRow.appendChild(this.clearButton)
    
    this.chordListDiv = document.createElement("div")
    this.chordListDiv.className = "daw-chords-chord-list"

    this.div.appendChild(this.topRow)
    this.div.appendChild(this.chordListDiv)

    for (var i = daw.song.data.keyParams.scale.length - 1; i >= 0; i--) {
        this.chordListDiv.appendChild(this.makeChordButton(i));
    }
    for (var i = 1; i < daw.song.data.keyParams.scale.length; i++) {
        this.chordListDiv.appendChild(this.makeChordButton(i * -1));
    }
}

ChordProgressionFragment.prototype.makeChordButton = function (chordI) {
    var chordDiv = document.createElement("div");
    chordDiv.className = "daw-chords-chord-button";
    chordDiv.innerHTML = this.daw.makeChordCaption(chordI);
    chordDiv.onclick = () => {
        if (this.appendMode) {
            this.section.data.chordProgression.push(chordI);
        }
        else {
            this.section.data.chordProgression = [chordI];
        }
        this.update()
    };
    return chordDiv;
};

ChordProgressionFragment.prototype.update = function () {
    var caption = this.daw.makeChordsCaption(this.section)
    this.displayDiv.innerHTML = caption
    this.section.dawTimelineChordsDiv.innerHTML = caption
}

export function SectionOptionsFragment(section, daw) {
    this.div = document.createElement("div")
    
    var nameInput = document.createElement("input")
    nameInput.value = section.data.name
    this.div.appendChild(nameInput)

    var measuresInput = document.createElement("input")
    measuresInput.value = section.data.measures || 1
    measuresInput.type = "number"
    measuresInput.min = 1
    this.div.appendChild(measuresInput)

    measuresInput.onchange = e => {
        section.data.measures = Math.max(1, measuresInput.value)
        daw.sizeTimelineSection(section, true)
    }

}