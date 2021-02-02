"use strict";
function Dawesome(config) {
    this.div = config.div

    this.playChar = "&nbsp;&#9654;"
    this.stopChar = "&#9724;"
    
    this.player = new OMusicPlayer()
    this.player.loadFullSoundSets = true
    this.partDrawer = new OMGEmbeddedViewerMusicDrawer()
    
    this.wm = new OMGWindowManager(config)

    this.transportWindowConfig = {caption: "Transport", width: 600, height: 80, x: 0, y: 0}
    this.timelineWindowConfig = {caption: "Timeline", width: window.innerWidth, height: 480, x: 0, y: 80}
    this.mixerWindowConfig = {caption: "Mixer", width: 500, height: 300, x: 17, y: window.innerHeight - 240
}

    this.setupTransport()
    this.setupTimeline()
    this.setupMixer()

    this.loadSong()

    this.transport.updateBeats()
    this.transport.updateKey()

}

Dawesome.prototype.loadSong = function () {
    var defaultSong;
    var blank
    if (blank) {
        defaultSong = JSON.parse("{\"name\":\"\",\"type\":\"SONG\",\"sections\":[{\"name\":\"Intro\",\"type\":\"SECTION\",\"parts\":[],\"chordProgression\":[0]}],\"keyParams\":{\"scale\":[0,2,4,5,7,9,11],\"rootNote\":0},\"beatParams\":{\"bpm\":120,\"beats\":4,\"shuffle\":0,\"measures\":1,\"subbeats\":4}}")
    }
    else {
        defaultSong = JSON.parse("{\"fx\":[],\"name\":\"default\",\"type\":\"SONG\",\"sections\":[{\"name\":\"Intro\",\"type\":\"SECTION\",\"parts\":[{\"fx\":[],\"type\":\"PART\",\"notes\":[],\"surface\":{\"url\":\"PRESET_VERTICAL\",\"skipTop\":10,\"skipBottom\":15},\"soundSet\":{\"url\":\"PRESET_OSC_SINE\",\"name\":\"Sine Oscillator\",\"type\":\"SOUNDSET\",\"octave\":5,\"lowNote\":0,\"highNote\":108,\"chromatic\":true},\"audioParams\":{\"pan\":-0.5654761904761905,\"gain\":0.24350787067584123,\"warp\":1,\"volume\":0.18825301204819278,\"delayTime\":0.3187702265372168,\"delayLevel\":0.45307443365695793}},{\"fx\":[],\"type\":\"PART\",\"tracks\":[{\"url\":\"hh_kick\",\"data\":[1,0,0,0,0,0,0,0,0,0,0,0,0],\"name\":\"Kick\",\"sound\":\"http://mikehelland.com/omg/drums/hh_kick.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"hh_clap\",\"data\":[0,0,0,0,0,0,0,0,0,0,0,0,0],\"name\":\"Clap\",\"sound\":\"http://mikehelland.com/omg/drums/hh_clap.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"rock_hihat_closed\",\"data\":[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],\"name\":\"HiHat Closed\",\"sound\":\"http://mikehelland.com/omg/drums/rock_hihat_closed.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"hh_hihat\",\"data\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\"name\":\"HiHat Open\",\"sound\":\"http://mikehelland.com/omg/drums/hh_hihat.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"hh_tamb\",\"data\":[],\"name\":\"Tambourine\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tamb.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"hh_tom_mh\",\"data\":[0,0,0,0,0,0,0,0,0,0,0,0,0,false],\"name\":\"Tom H\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tom_mh.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"hh_tom_ml\",\"data\":[0,0,0,0,0,0,0,0,0,0,0],\"name\":\"Tom M\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tom_ml.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"hh_tom_l\",\"data\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\"name\":\"Tom L\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tom_l.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}}],\"surface\":{\"url\":\"PRESET_SEQUENCER\"},\"soundSet\":{\"id\":1207,\"url\":\"http://openmusic.gallery/data/1207\",\"data\":[{\"url\":\"hh_kick\",\"name\":\"Kick\",\"sound\":\"http://mikehelland.com/omg/drums/hh_kick.mp3\"},{\"url\":\"hh_clap\",\"name\":\"Clap\",\"sound\":\"http://mikehelland.com/omg/drums/hh_clap.mp3\"},{\"url\":\"rock_hihat_closed\",\"name\":\"HiHat Closed\",\"sound\":\"http://mikehelland.com/omg/drums/rock_hihat_closed.mp3\"},{\"url\":\"hh_hihat\",\"name\":\"HiHat Open\",\"sound\":\"http://mikehelland.com/omg/drums/hh_hihat.mp3\"},{\"url\":\"hh_tamb\",\"name\":\"Tambourine\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tamb.mp3\"},{\"url\":\"hh_tom_mh\",\"name\":\"Tom H\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tom_mh.mp3\"},{\"url\":\"hh_tom_ml\",\"name\":\"Tom M\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tom_ml.mp3\"},{\"url\":\"hh_tom_l\",\"name\":\"Tom L\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tom_l.mp3\"}],\"name\":\"Hip Kit\",\"type\":\"SOUNDSET\",\"prefix\":\"http://mikehelland.com/omg/drums/\",\"lowNote\":72,\"postfix\":\".mp3\",\"user_id\":\"1\",\"approved\":true,\"username\":\"m                   \",\"chromatic\":false,\"created_at\":1542271035794,\"last_modified\":1542271055684,\"defaultSurface\":\"PRESET_SEQUENCER\"},\"audioParams\":{\"pan\":0,\"gain\":0.7228178904703554,\"warp\":1,\"volume\":0.6,\"delayTime\":0.09870550161812297,\"delayLevel\":0.12297734627831715}}],\"chordProgression\":[0]}],\"keyParams\":{\"scale\":[0,2,3,5,7,8,10],\"rootNote\":9},\"beatParams\":{\"bpm\":108,\"beats\":4,\"shuffle\":0,\"measures\":1,\"subbeats\":4},\"created_at\":1547004419230,\"last_modified\":1547004419230}")
    }
    /*    fetch("/data/" + id).then(function (response) {
            response.json().then(data => callback(data));
        });
    */

    this.song = new OMGSong(defaultSong)
    this.player.prepareSong(this.song)
    this.section = this.song.sections[0]
    
    this.loadTimeline()
    this.loadMixer()

    this.setupSongListeners()
}

Dawesome.prototype.setupTransport = function () {
    this.transport = {}

    this.transport.playButtonEl = document.createElement("div")
    this.transport.playButtonEl.className = "daw-transport-play-button"
    this.transport.playButtonEl.innerHTML = this.playChar

    this.transport.beatParamsEl = document.createElement("div")
    this.transport.beatParamsEl.className = "daw-transport-control"

    this.transport.keyParamsEl = document.createElement("div")
    this.transport.keyParamsEl.className = "daw-transport-control"
    this.transport.keyParamsEl.innerHTML = "C Major"

    this.transport.loopSectionEl = document.createElement("div")
    this.transport.loopSectionEl.className = "daw-transport-control"
    this.transport.loopSectionEl.innerHTML = "Loop Section"
    
    this.transport.window = this.wm.newWindow(this.transportWindowConfig)

    this.transport.div = this.transport.window.contentDiv
    this.transport.div.appendChild(this.transport.playButtonEl)
    this.transport.div.appendChild(this.transport.beatParamsEl)
    this.transport.div.appendChild(this.transport.keyParamsEl)
    this.transport.div.appendChild(this.transport.loopSectionEl)

    this.transport.playButtonEl.onclick = e => {
        if (this.player.playing) {
            this.player.stop()
            this.transport.playButtonEl.innerHTML = this.playChar
        }
        else {
            this.player.play()
            this.transport.playButtonEl.innerHTML = this.stopChar
        }
    }

    this.transport.loopSectionEl.onclick = e => {
        if (this.player.loopSection === -1) {
            this.player.loopSection = this.song.sections.indexOf(this.player.section)
            this.transport.loopSectionEl.classList.add("daw-transport-control-active")
            this.player.section.timelineCaptionDiv.classList.add("daw-timeline-section-caption-active")
        }
        else {
            this.player.section.timelineCaptionDiv.classList.remove("daw-timeline-section-caption-active")
            this.player.loopSection = -1
            this.transport.loopSectionEl.classList.remove("daw-transport-control-active")
        }
    }
    this.transport.beatParamsEl.onclick = e => {
        this.showBeatParamsWindow()
    }
    this.transport.keyParamsEl.onclick = e => {
        this.showKeyParamsWindow()
    }

    this.transport.updateBeats = () => {
        this.transport.beatParamsEl.innerHTML = this.song.data.beatParams.beats + "/" + 
                this.song.data.beatParams.subbeats + " " + this.song.data.beatParams.bpm + " bpm"
    }
    this.transport.updateKey = () => {
        this.transport.keyParamsEl.innerHTML = omg.ui.getKeyCaption(this.song.data.keyParams)
    }
}

Dawesome.prototype.setupTimeline = function () {
    // the timeline is a grid, parts are the rows, sections are the columns

    this.timeline = {}
    this.timeline.window = this.wm.newWindow(this.timelineWindowConfig)
    this.timeline.div = this.timeline.window.contentDiv
    this.timeline.div.classList.add("daw-timeline")

    this.timeline.measureWidth = 500
    this.timeline.headerWidth = 200
    this.timeline.partHeight = 60
    this.timeline.subbeatLength = 30

    this.timeline.headersDiv = document.createElement("div")
    this.timeline.headersDiv.className = "daw-timeline-headers"
    
    this.timeline.headersHeaderDiv = document.createElement("div")
    this.timeline.headersHeaderDiv.className = "daw-timeline-headers-header"
    this.timeline.addPartButton = document.createElement("div")
    this.timeline.addSectionButton = document.createElement("div")

    this.timeline.addPartButton.className = "daw-timeline-add-button"
    this.timeline.addSectionButton.className = "daw-timeline-add-button"

    this.timeline.addPartButton.innerHTML = "Add Part"
    this.timeline.addSectionButton.innerHTML = "Add Section"

    this.timeline.addPartButton.onclick = e => {
        this.showAddPartWindow()
    }
    this.timeline.addSectionButton.onclick = e => {
        this.addSection()
    }
    
    this.timeline.headersHeaderDiv.appendChild(this.timeline.addPartButton)
    this.timeline.headersHeaderDiv.appendChild(this.timeline.addSectionButton)
    this.timeline.headersDiv.appendChild(this.timeline.headersHeaderDiv)
    this.timeline.div.appendChild(this.timeline.headersDiv)

    this.timeline.beatMarker = document.createElement("div")
    this.timeline.beatMarker.style.width = this.timeline.subbeatLength + "px"
    this.timeline.beatMarker.style.top = this.timeline.headersHeaderDiv.clientHeight + "px"
    this.player.onBeatPlayedListeners.push((isubbeat, section) => {
        this.timeline.beatMarker.style.left = section.timelineDiv.offsetLeft +
                                            //this.timeline.headerWidth + 
                                            (isubbeat === -1 ? 0 : isubbeat) * 
                                            this.timeline.subbeatLength + "px"
    })
    this.timeline.beatMarker.style.left = this.timeline.headerWidth + "px"
    this.timeline.beatMarker.style.display = "block"
    this.timeline.beatMarker.style.height = "100%"
    this.timeline.beatMarker.className = "beat-marker"
    //this.beatMarker.style.height = "100%"
    this.timeline.div.appendChild(this.timeline.beatMarker)
}

Dawesome.prototype.setupMixer = function () {
    this.mixer = {}
    this.mixer.window = this.wm.newWindow(this.mixerWindowConfig)
    this.mixer.div = this.mixer.window.contentDiv
    this.mixer.div.classList.add("daw-mixer")

}

Dawesome.prototype.loadTimeline = function () {
    
    if (this.song.sections.length === 0) {
        // TODO show empty? make one?
        return 
    }

    this.timeline.partHeaders = {}

    this.timeline.subbeatLength = this.timeline.measureWidth / 
                                (this.song.data.beatParams.subbeats * 
                                this.song.data.beatParams.beats)
    this.timeline.beatMarker.style.width = this.timeline.subbeatLength + "px"

    this.timeline.sectionWidthUsed = 0
    var firstSection = true
    for (var section of this.song.sections) {

        this.addTimelineSection(section)
        
        for (var part of section.parts) {
            if (!part.daw) {
                part.daw = {}
            }
            if (firstSection) {
                this.addTimelinePartHeader(part)
            }

            part.daw.timelineHeader = this.timeline.partHeaders[part.data.name]

        }

        this.addSectionPartsToTimeline(section)
        firstSection = false
    }
}


Dawesome.prototype.loadMixer = function () {
    
    this.mixer.div.innerHTML = ""
    this.mixer.visibleMeters = []
    
    if (!this.section || this.section.parts.length === 0) {
        // TODO show empty?
        return 
    }

    for (var i = 0; i < this.section.parts.length; i++) {
        this.addMixerChannel(this.section.parts[i])
    }

}

Dawesome.prototype.addMixerChannel = function (part) {
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

    this.mixer.div.appendChild(channelDiv)

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
}

Dawesome.prototype.addTimelinePartHeader = function (part) {

    var header = {
        div: document.createElement("div"),
        caption: document.createElement("div"),
        muteButton: document.createElement("div")
    }

    header.div.className = "daw-timeline-header"
    header.div.style.width = this.timeline.headerWidth + "px"
    header.div.style.height = this.timeline.partHeight + "px"

    header.caption.innerHTML = part.data.name
    header.caption.className = "daw-timeline-part-caption"
    header.caption.innerHTML = part.data.name
    
    header.muteButton = document.createElement("div")
    header.muteButton.className = "daw-timeline-mute-button"
    header.muteButton.innerHTML = "M"
    header.muteButton.onclick = e => {
        this.player.mutePart(part, !part.data.audioParams.mute)
    }

    header.recordButton = document.createElement("div")
    header.recordButton.className = "daw-timeline-record-button"
    header.recordButton.innerHTML = "R"

    header.div.appendChild(header.caption)
    header.div.appendChild(header.muteButton)
    //header.div.appendChild(header.recordButton)
    this.timeline.headersDiv.appendChild(header.div)
    this.timeline.partHeaders[part.data.name] = header
    return header
}

Dawesome.prototype.addTimelineSection = function (section) {
    var div = document.createElement("div")
    div.className = "daw-timeline-section"
    div.style.width = this.timeline.measureWidth + "px" //TODO figure out how many measures


    var captionDiv = document.createElement("div")
    captionDiv.innerHTML = section.data.name
    captionDiv.className = "daw-timeline-section-caption"
    div.appendChild(captionDiv)
    
    this.timeline.div.appendChild(div)
    section.timelineDiv = div
    section.timelineCaptionDiv = captionDiv
    var measures = 1 // TODO from song or section
    div.style.left = this.timeline.headerWidth + this.timeline.sectionWidthUsed + "px"
    this.timeline.sectionWidthUsed += measures * this.timeline.measureWidth

}


Dawesome.prototype.newPartCanvas = function (part) {
    var div = document.createElement("canvas")
    div.innerHTML = part.data.name
    div.className = "daw-timeline-part-canvas"
    div.style.width = this.timeline.measureWidth + "px" //TODO figure out how many measures

    div.onclick = e => {
        this.showPartDetail(part)
    }

    return div
}

Dawesome.prototype.showPartDetail = function (part) {

    //check to see if the window already exists
    part.detailWindow = this.wm.newWindow({
        caption: part.data.name + " - " + part.section.data.name, 
        width: 400, height: 600
    })

    if (part.data.surface.url === "PRESET_SEQUENCER") {
        part.detailSurface = new OMGDrumMachine(part.detailWindow.contentDiv, part)
    }
    else {
        part.detailSurface = new OMGMelodyMaker(part.detailWindow.contentDiv, part, this.player)
    }
    part.detailSurface.readOnly = false
    part.detailSurface.draw()

    part.detailWindow.onmove = () => {
        part.detailSurface.setPageOffsets()
    }
    part.detailWindow.onresize = () => {
        part.detailSurface.backgroundDrawn = false
        part.detailSurface.draw()
    }
}

Dawesome.prototype.showAddPartWindow = function () {
    var win = this.wm.newWindow({
        caption: "Add Part", 
        width: 300, height: window.innerHeight - 40, 
        x: window.innerWidth - 610, y: 40,
        overflowY: "auto"
    })

    var searchBox = new OMGSearchBox({types: ["SOUNDSET"]})
    win.contentDiv.appendChild(searchBox.div)
    searchBox.loadSearchResults = results => {
        results.forEach(result => {
            var resultDiv = document.createElement("div")
            resultDiv.innerHTML = result.name
            resultDiv.className = "daw-add-part-search-result"
            searchBox.resultList.appendChild(resultDiv)

            resultDiv.onclick = e => {
                this.addPart(result)
                this.wm.close(win)
            }
        })
    }
    searchBox.search()
}

Dawesome.prototype.addSection = function () {
    var newSectionData = this.section.getData();
    
    var names = this.song.sections.map(section => section.data.name);
    newSectionData.name = omg.util.getUniqueName(newSectionData.name, names);
    var newSection = new OMGSection(newSectionData, this.song);
    this.player.loadSection(newSection);
    //this.player.loopSection = this.song.sections.indexOf(newSection);
    
    newSection.parts.forEach(part => {
        part.daw = {}
        part.daw.timelineHeader = this.timeline.partHeaders[part.data.name]
        if (!part.daw.timelineHeader) {
            console.warn("no part header!", part.data.name)
        }
    })

    this.addTimelineSection(newSection)
    
    this.addSectionPartsToTimeline(newSection);
    return newSection;
}

Dawesome.prototype.addSectionPartsToTimeline = function (section) {
    for (var part of section.parts) {
        this.addPartToTimeline(part, section)
    }
}

Dawesome.prototype.addPartToTimeline = function (part, section) {

    var canvas = this.newPartCanvas(part, section)
    section.timelineDiv.appendChild(canvas)
    canvas.style.top = part.daw.timelineHeader.div.clientTop + "px"
    canvas.style.left = "0px"
    canvas.style.width = "100%"
    canvas.style.height = part.daw.timelineHeader.div.clientHeight + "px"

    part.daw.timelineCanvas = canvas
    part.daw.updateTimelineCanvas = (track, subbeat, value) => {
        this.partDrawer.drawPartCanvas(part.data, canvas, 
            this.song.data.beatParams)
    }
    part.daw.updateTimelineCanvas()
}

Dawesome.prototype.addPart = function (data) {
    var part = new OMGPart(null, {soundSet: data}, this.section)
    this.player.loadPart(part)
    part.daw = {}

    this.addMixerChannel(part)
    var partHeader = this.addTimelinePartHeader(part)
    part.daw.timelineHeader = partHeader
    this.addPartToTimeline(part, this.section)
}

Dawesome.prototype.showBeatParamsWindow = function () {
    if (!this.beatParamsFragment) {
        this.beatParamsFragment = new BeatParamsFragment(this.song)        
    }

    this.wm.showFragment(this.beatParamsFragment, {
        caption: "Beat Parameters",
        height: 250,
        width: 300
    })
}

Dawesome.prototype.showKeyParamsWindow = function () {
    if (!this.keyParamsFragment) {
        this.keyParamsFragment = new KeyParamsFragment(this.song)
    }

    this.wm.showFragment(this.keyParamsFragment, {
        caption: "Key Parameters",
        height: 400,
        width: 300
    })
}

Dawesome.prototype.setupSongListeners = function () {
 
    this.song.onBeatChangeListeners.push(() => {
        this.transport.updateBeats()
    })
 
    this.song.onKeyChangeListeners.push(() => {
        this.transport.updateKey()
    })

    /*this.onPartAddListeners = [];
    this.onChordProgressionChangeListeners = [];
    this.onFXChangeListeners = [];*/
 
    this.song.onPartAudioParamsChangeListeners.push(part => {
        this.timeline.partHeaders[part.data.name].muteButton.style.backgroundColor = part.data.audioParams.mute ?
            "red" : "initial"
    })
    this.song.onPartChangeListeners.push((part, track, subbeat, value, source) => {
        part.daw.updateTimelineCanvas()
    })
}