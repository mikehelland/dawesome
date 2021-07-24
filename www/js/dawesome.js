"use strict";

import OMusicContext from "/apps/music/js/omusic.js"
import OMGEmbeddedViewerMusicDrawer from "/apps/music/js/omusic-embed-draw.js"
import OMGWindowManager from "/js/window_manager.js"
import * as fragments from "./dawesome_fragments.js"

export default function Dawesome(config) {
    this.div = config.div

    this.playChar = "&nbsp;&#9654;"
    this.stopChar = "&#9724;"
    this.recChar = "\u23FA"
    
    if (config.musicContext) {
        this.musicContext = config.musicContext
    }
    else {
        this.musicContext = new OMusicContext()
    }
    this.musicContext.loadFullSoundSets = true

    this.partDrawer = new OMGEmbeddedViewerMusicDrawer()
    
    this.wm = new OMGWindowManager(config)

    this.transportWindowConfig = config.transportWindowConfig || {caption: "Transport", width: 600, height: 80, x: 5, y: 5}
    this.timelineWindowConfig = config.timelineWindowConfig || {caption: "Timeline", width: window.innerWidth - 15, height: 480, x: 5, y: 90}
    this.mixerWindowConfig = config.mixerWindowConfig || {caption: "Mixer", width: 500, height: 300, x: 17, y: window.innerHeight - 340}
    this.fxWindowConfig = config.fxWindowConfig || {caption: "FX", width: 500, height: 300, x: 557, y: window.innerHeight - 340}

    if (config.showMainMenu) {
        this.setupMenu()
    }

    if (config.room) {
        this.joinLiveRoom(config.room)
    }
    else if (config.id) {
        fetch("/data/" + config.id).then(res=>res.json()).then(json => {
            this.load({data: json})
        })
    }
    else {
        this.load(config)
        //this.showWelcomeWindow()
    }
}

Dawesome.prototype.load = async function (config) {
    this.wm.clearAll()
    this.setupTransport()
    this.setupTimeline()
    
    await this.loadSong(config)
    
    this.showMixerWindow()
    this.showFXWindow()

    if (this.liveFragment) {
        this.wm.showFragment(this.liveFragment, {
            caption: "Live Collaboration",
            height: 500,
            width: 600,
            x: window.innerWidth - 630,
            y: 10
        })
    }
}

Dawesome.prototype.loadSong = async function (config) {
    /*var defaultSong;
    var blank
    if (blank) {
        defaultSong = JSON.parse("{\"name\":\"\",\"type\":\"SONG\",\"sections\":[{\"name\":\"Intro\",\"type\":\"SECTION\",\"parts\":[],\"chordProgression\":[0]}],\"keyParams\":{\"scale\":[0,2,4,5,7,9,11],\"rootNote\":0},\"beatParams\":{\"bpm\":120,\"beats\":4,\"shuffle\":0,\"measures\":1,\"subbeats\":4}}")
    }
    else {
        defaultSong = JSON.parse("{\"fx\":[],\"name\":\"default\",\"type\":\"SONG\",\"sections\":[{\"name\":\"Intro\",\"type\":\"SECTION\",\"parts\":[{\"fx\":[],\"type\":\"PART\",\"notes\":[],\"surface\":{\"url\":\"PRESET_VERTICAL\",\"skipTop\":10,\"skipBottom\":15},\"soundSet\":{\"url\":\"PRESET_OSC_SINE\",\"name\":\"Sine Oscillator\",\"type\":\"SOUNDSET\",\"octave\":5,\"lowNote\":0,\"highNote\":108,\"chromatic\":true},\"audioParams\":{\"pan\":-0.5654761904761905,\"gain\":0.24350787067584123,\"warp\":1,\"volume\":0.18825301204819278,\"delayTime\":0.3187702265372168,\"delayLevel\":0.45307443365695793}},{\"fx\":[],\"type\":\"PART\",\"tracks\":[{\"url\":\"hh_kick\",\"data\":[1,0,0,0,0,0,0,0,0,0,0,0,0],\"name\":\"Kick\",\"sound\":\"http://mikehelland.com/omg/drums/hh_kick.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"hh_clap\",\"data\":[0,0,0,0,0,0,0,0,0,0,0,0,0],\"name\":\"Clap\",\"sound\":\"http://mikehelland.com/omg/drums/hh_clap.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"rock_hihat_closed\",\"data\":[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],\"name\":\"HiHat Closed\",\"sound\":\"http://mikehelland.com/omg/drums/rock_hihat_closed.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"hh_hihat\",\"data\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\"name\":\"HiHat Open\",\"sound\":\"http://mikehelland.com/omg/drums/hh_hihat.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"hh_tamb\",\"data\":[],\"name\":\"Tambourine\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tamb.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"hh_tom_mh\",\"data\":[0,0,0,0,0,0,0,0,0,0,0,0,0,false],\"name\":\"Tom H\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tom_mh.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"hh_tom_ml\",\"data\":[0,0,0,0,0,0,0,0,0,0,0],\"name\":\"Tom M\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tom_ml.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}},{\"url\":\"hh_tom_l\",\"data\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\"name\":\"Tom L\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tom_l.mp3\",\"audioParams\":{\"pan\":0,\"gain\":1,\"warp\":1}}],\"surface\":{\"url\":\"PRESET_SEQUENCER\"},\"soundSet\":{\"id\":1207,\"url\":\"http://openmusic.gallery/data/1207\",\"data\":[{\"url\":\"hh_kick\",\"name\":\"Kick\",\"sound\":\"http://mikehelland.com/omg/drums/hh_kick.mp3\"},{\"url\":\"hh_clap\",\"name\":\"Clap\",\"sound\":\"http://mikehelland.com/omg/drums/hh_clap.mp3\"},{\"url\":\"rock_hihat_closed\",\"name\":\"HiHat Closed\",\"sound\":\"http://mikehelland.com/omg/drums/rock_hihat_closed.mp3\"},{\"url\":\"hh_hihat\",\"name\":\"HiHat Open\",\"sound\":\"http://mikehelland.com/omg/drums/hh_hihat.mp3\"},{\"url\":\"hh_tamb\",\"name\":\"Tambourine\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tamb.mp3\"},{\"url\":\"hh_tom_mh\",\"name\":\"Tom H\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tom_mh.mp3\"},{\"url\":\"hh_tom_ml\",\"name\":\"Tom M\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tom_ml.mp3\"},{\"url\":\"hh_tom_l\",\"name\":\"Tom L\",\"sound\":\"http://mikehelland.com/omg/drums/hh_tom_l.mp3\"}],\"name\":\"Hip Kit\",\"type\":\"SOUNDSET\",\"prefix\":\"http://mikehelland.com/omg/drums/\",\"lowNote\":72,\"postfix\":\".mp3\",\"user_id\":\"1\",\"approved\":true,\"username\":\"m                   \",\"chromatic\":false,\"created_at\":1542271035794,\"last_modified\":1542271055684,\"defaultSurface\":\"PRESET_SEQUENCER\"},\"audioParams\":{\"pan\":0,\"gain\":0.7228178904703554,\"warp\":1,\"volume\":0.6,\"delayTime\":0.09870550161812297,\"delayLevel\":0.12297734627831715}}],\"chordProgression\":[0]}],\"keyParams\":{\"scale\":[0,2,3,5,7,8,10],\"rootNote\":9},\"beatParams\":{\"bpm\":108,\"beats\":4,\"shuffle\":0,\"measures\":1,\"subbeats\":4},\"created_at\":1547004419230,\"last_modified\":1547004419230}")
    }
        fetch("/data/" + id).then(function (response) {
            response.json().then(data => callback(data));
        });
    */

    if (config && config.player && config.song) {
        this.song = config.song
        this.player = config.player
    }
    else {
        var {song, player} = await this.musicContext.load(config ? config.data : undefined)
        this.song = song
        this.player = player    
    }

    // set the the first section, and make one if needed
    this.section = Object.values(this.song.sections)[0]
    if (!this.section) {
        this.section = this.song.addSection({name: "Intro"})
    }
    
    this.loadTimeline()
    
    this.setupSongListeners()

    this.transport.updateBeats()
    this.transport.updateKey()
    
}

Dawesome.prototype.setupTransport = function () {
    this.transport = {}

    this.transport.playButtonEl = document.createElement("div")
    this.transport.playButtonEl.className = "daw-transport-play-button"
    this.transport.playButtonEl.innerHTML = this.playChar

    this.transport.recordButtonEl = document.createElement("div")
    this.transport.recordButtonEl.className = "daw-transport-play-button"
    this.transport.recordButtonEl.innerHTML = this.recChar

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
    this.transport.div.appendChild(this.transport.recordButtonEl)
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

    this.transport.recordButtonEl.onclick = e => {
        if (!this.recordingArmed) {
            this.recordingArmed = true
            this.transport.recordButtonEl.style.backgroundColor = "red"
        }
        else {
            this.recordingArmed = false
            this.transport.recordButtonEl.style.backgroundColor = "initial"
        }
    }

    this.transport.loopSectionEl.onclick = e => {
        if (!this.player.loopSection) {
            this.player.loopSection = this.player.section
            this.transport.loopSectionEl.classList.add("daw-transport-control-active")
            this.player.section.timelineCaptionDiv.classList.add("daw-timeline-section-caption-active")
        }
        else {
            this.player.section.timelineCaptionDiv.classList.remove("daw-timeline-section-caption-active")
            this.player.loopSection = null
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
        this.transport.keyParamsEl.innerHTML = this.musicContext.getKeyCaption(this.song.data.keyParams)
    }
}

Dawesome.prototype.setupTimeline = function () {
    // the timeline is a grid, parts are the rows, sections are the columns

    this.timeline = {}
    this.timeline.window = this.wm.newWindow(this.timelineWindowConfig)
    this.timeline.div = this.timeline.window.contentDiv
    this.timeline.div.classList.add("daw-timeline")

    this.timeline.measureWidth = 200
    this.timeline.headerWidth = 200
    this.timeline.partHeight = 60
    this.timeline.subbeatLength = 30

    this.timeline.headersDiv = document.createElement("div")
    this.timeline.headersDiv.className = "daw-timeline-headers"
    
    this.timeline.headersHeaderDiv = document.createElement("div")
    this.timeline.headersHeaderDiv.className = "daw-timeline-headers-header"
    this.timeline.headersHeaderDiv.style.width = this.timeline.headerWidth + "px"
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
    this.timeline.beatMarker.style.left = this.timeline.headerWidth + "px"
    this.timeline.beatMarker.style.display = "block"
    this.timeline.beatMarker.style.height = "100%"
    this.timeline.beatMarker.className = "beat-marker"
    this.timeline.div.appendChild(this.timeline.beatMarker)

    this.timeline.scrollBarX = {startPercent: 0, x: 0}
    this.timeline.scrollBarX.div = document.createElement("div")
    this.timeline.scrollBarX.div.className = "daw-timeline-horizontal-scrollbar"
    this.timeline.scrollBarX.div.style.left = this.timeline.headerWidth + "px"
    this.timeline.div.appendChild(this.timeline.scrollBarX.div)
    this.timeline.scrollBarX.canvas = document.createElement("canvas")
    this.timeline.scrollBarX.canvas.className = "daw-timeline-horizontal-scrollbar-canvas"
    this.timeline.scrollBarX.div.appendChild(this.timeline.scrollBarX.canvas)
    this.timeline.scrollBarX.context = this.timeline.scrollBarX.canvas.getContext("2d")
    this.setupScrollBarEvents(this.timeline.scrollBarX)

    this.timeline.zoomXOutButton = document.createElement("button")
    this.timeline.zoomXInButton = document.createElement("button")
    this.timeline.zoomXInButton.innerHTML = "+"
    this.timeline.zoomXOutButton.innerHTML = "-"
    this.timeline.zoomXOutButton.className = "daw-timeline-horizontal-zoom"
    this.timeline.zoomXInButton.className = "daw-timeline-horizontal-zoom"
    
    this.timeline.scrollBarX.div.appendChild(this.timeline.zoomXOutButton)
    this.timeline.scrollBarX.div.appendChild(this.timeline.zoomXInButton)
    this.timeline.zoomXInButton.onclick = e => {
        this.timeline.measureWidth += 50
        this.resizeTimelineSections()
    }
    this.timeline.zoomXOutButton.onclick = e => {
        this.timeline.measureWidth = Math.max(50, this.timeline.measureWidth - 50)
        this.resizeTimelineSections()
    }
}

Dawesome.prototype.loadTimeline = function () {
    
    this.onPartAddListenerInstance = (part, source) => this.onPartAddListener(part, source)
    this.song.onPartAddListeners.push(this.onPartAddListenerInstance)

    if (this.song.sections.length === 0) {
        // TODO show empty? make one?
        //return 
    }

    this.timeline.partHeaders = {}
    this.timeline.sectionDivs = []

    this.timeline.subbeatLength = this.timeline.measureWidth / 
                                (this.song.data.beatParams.subbeats * 
                                this.song.data.beatParams.beats)
    this.timeline.beatMarker.style.width = this.timeline.subbeatLength + "px"
    this.timeline.currentSection = Object.values(this.song.sections)[0]
    this.timeline.currentBeat = 0 
    this.player.onBeatPlayedListeners.push((isubbeat, section) => {
        this.timeline.currentBeat = isubbeat === -1 ? 0 : isubbeat
        this.timeline.currentSection = section
        this.updateTimelineBeatMarker()
    })
    
    for (var partName in this.song.parts) {
        this.addTimelinePartHeader(this.song.parts[partName])
    }
    this.timeline.sectionWidthUsed = 0
    for (var sectionName in this.song.sections) {
        var section = this.song.sections[sectionName]

        this.addTimelineSection(section)
        for (var partName in section.parts) {
            var part = section.parts[partName]
            if (!part.daw) {
                part.daw = {}
            }

            part.daw.timelineHeader = this.timeline.partHeaders[part.data.name]
        }

        this.addSectionPartsToTimeline(section)
    }

    this.refreshTimelineScrollBars()
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
        this.musicContext.mutePart(part, !part.data.audioParams.mute)
    }
    if (part.data.audioParams.mute) {
        header.muteButton.style.backgroundColor = "red"
    }

    header.optionsButton = document.createElement("div")
    header.optionsButton.className = "daw-timeline-options-button"
    header.optionsButton.innerHTML = "O"
    header.optionsButton.onclick = e => {
        this.wm.showFragment(new fragments.PartOptionsFragment(part, this), 
            {width:300, height:400, caption: part.data.name + " Options"})
    }

    header.recordButton = document.createElement("div")
    header.recordButton.className = "daw-timeline-record-button"
    header.recordButton.innerHTML = "R"

    header.div.appendChild(header.caption)
    header.div.appendChild(header.muteButton)
    header.div.appendChild(header.optionsButton)
    //header.div.appendChild(header.recordButton)
    this.timeline.headersDiv.appendChild(header.div)
    this.timeline.partHeaders[part.data.name] = header
    return header
}

Dawesome.prototype.addTimelineSection = function (section) {
    var div = document.createElement("div")
    div.className = "daw-timeline-section"

    var captionDiv = document.createElement("div")
    captionDiv.innerHTML = section.data.name
    captionDiv.className = "daw-timeline-section-caption"
    div.appendChild(captionDiv)
    captionDiv.onclick = e => {
        this.showSectionOptionFragment(section)
    }

    
    var chordsDiv = document.createElement("div")
    chordsDiv.innerHTML = this.makeChordsCaption(section)
    chordsDiv.className = "daw-timeline-section-tool-button"
    captionDiv.appendChild(chordsDiv)
    section.dawTimelineChordsDiv = chordsDiv
    chordsDiv.onclick = e => {
        e.preventDefault()
        this.showChordsFragment(section)
    }

    var measuresDiv = document.createElement("div")
    measuresDiv.innerHTML = "1 m - 1X"
    measuresDiv.className = "daw-timeline-section-tool-button"
    //captionDiv.appendChild(measuresDiv)

    this.timeline.div.appendChild(div)
    section.timelineDiv = div
    section.timelineCaptionDiv = captionDiv
    div.style.left = this.timeline.headerWidth + this.timeline.sectionWidthUsed + "px"
    
    this.timeline.sectionDivs.push({section, div, left: this.timeline.headerWidth + this.timeline.sectionWidthUsed})

    this.sizeTimelineSection(section)
}

Dawesome.prototype.sizeTimelineSection = function (section, resizing) {
    if (resizing) {
        this.timeline.sectionWidthUsed -= section.timelineDiv.clientWidth
    } 
    
    section.timelineDiv.style.width = section.data.measures * this.timeline.measureWidth + "px" 
    this.timeline.sectionWidthUsed += section.data.measures * this.timeline.measureWidth

    if (resizing) {
        let after = false
        this.timeline.sectionWidthUsed = 0
        let o
        for (o of this.timeline.sectionDivs) {
            if (after) {
                o.left = this.timeline.headerWidth + this.timeline.sectionWidthUsed
            }
            else if (o.section === section) {
                after = true
            }

            this.timeline.sectionWidthUsed += o.div.clientWidth
        }
        this.refreshTimelineScrollBars()
        this.moveTimeline(this.timeline.scrollBarX.x, 0)

        let part
        for (part in section.parts) {
            section.parts[part].daw.updateTimelineCanvas()
        }
    }
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

Dawesome.prototype.showPartDetail = async function (part) {

    //check to see if the window already exists
    part.detailWindow = this.wm.newWindow({
        caption: part.data.name + " - " + part.section.data.name, 
        x: window.innerWidth / 2,
        width: 600, height: 600
    })

    if (part.data.surface.url === "PRESET_SEQUENCER") {
        let o = await import("/apps/music/js/sequencer_surface.js")
        let OMGDrumMachine = o.default
        part.detailSurface = new OMGDrumMachine(part.detailWindow.contentDiv, part)
    }
    else {
        let o = await import("/apps/music/js/vertical_surface.js")
        let OMGMelodyMaker = o.default
        part.detailSurface = new OMGMelodyMaker(part.detailWindow.contentDiv, part, this.player)
    }

    var listener = (isubbeat) => {
        part.detailSurface.updateBeatMarker(isubbeat);
    }
    this.player.onBeatPlayedListeners.push(listener)
    part.detailWindow.onhide = () => {
        var i = this.player.onBeatPlayedListeners.indexOf(listener)
        if (i > -1) {
            this.player.onBeatPlayedListeners.splice(i, -1)
        }
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
    var addCallback = data => {
        var headPart = this.song.addPart(data)
        this.wm.close(win)
    }

    var win = this.wm.showFragment(new fragments.AddPartFragment(addCallback), {
        caption: "Add Part", 
        width: 400, height: window.innerHeight - 80, 
        x: window.innerWidth - 610, y: 40,
        overflowY: "auto"
    })
    
}

Dawesome.prototype.addSection = function () {
    
    var newSection
    if (this.section) {
        newSection = this.song.addSection(this.section.data)
    }
    else {
        newSection = this.song.addSection()
    }
    
    for (var partName in newSection.parts) {
        var part = newSection.parts[partName]
        part.daw = {}
        part.daw.timelineHeader = this.timeline.partHeaders[part.data.name]
        if (!part.daw.timelineHeader) {
            console.warn("no part header!", part.data.name)
        }
    }

    this.addTimelineSection(newSection)
    this.addSectionPartsToTimeline(newSection);
    this.refreshTimelineScrollBars()

    return newSection;
}

Dawesome.prototype.addSectionPartsToTimeline = function (section) {
    for (var partName in section.parts) {
        var part = section.parts[partName]
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
            this.song.data.beatParams, section.data.measures)
    }
    part.daw.updateTimelineCanvas()
}

Dawesome.prototype.onPartAddListener = function (headPart) {
    
    headPart.daw = {}

    var partHeader = this.addTimelinePartHeader(headPart)
    headPart.daw.timelineHeader = partHeader

    for (var sectionName in this.song.sections){
        var section = this.song.sections[sectionName]
        var part = section.parts[headPart.data.name] 
        
        part.daw = {}
        part.daw.timelineHeader = this.timeline.partHeaders[part.headPart.data.name]
        this.addPartToTimeline(part, section)
    }
    
}

Dawesome.prototype.showBeatParamsWindow = function () {
    if (!this.beatParamsFragment) {
        this.beatParamsFragment = new fragments.BeatParamsFragment(this.song)        
    }

    this.wm.showFragment(this.beatParamsFragment, {
        caption: "Beat Parameters",
        height: 250,
        width: 300
    })
}

Dawesome.prototype.showKeyParamsWindow = function () {
    if (!this.keyParamsFragment) {
        this.keyParamsFragment = new fragments.KeyParamsFragment(this.song)
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

    this.player.onreachedend = () => {
        if (this.recordingArmed) {
            this.extendSong()
            return true
        }
    }
}

Dawesome.prototype.setupMenu = function () {
    this.wm.showMainMenu({
        items: [
            {name: "File", items: [
                {name: "User", onclick: () => this.showUserWindow()},
                {separator: true},
                {name: "New", onclick: () => this.newSong()},
                {name: "Open", onclick: () => this.showOpenWindow()},
                {name: "Save", onclick: () => this.showSaveWindow()},
                {separator: true},
                {name: "Settings", onclick: () => this.showSettingsWindow()},
                {separator: true},
                {name: "OMG Home", onclick: () => window.location = "/"}
            ]},
            {name: "Window", items: [
                {name: "Transport", onclick: () => this.showTransportWindow()},
                {name: "Timeline", onclick: () => this.showTimelineWindow()},
                {name: "Mixer", onclick: () => this.showMixerWindow()},
                {separator: true},
                {name: "FX", onclick: () => this.showFXWindow()},
                {name: "Arrangement", onclick: () => this.showArrangementWindow()},
                {separator: true},
                {name: "Live Collaboration", onclick: () => this.showLiveWindow()},
                {name: "Remote Controls", onclick: () => this.showRemoveControlsWindow()},
                {name: "Monkey Randomizer", onclick: () => this.showRandomizerWindow()}
            ]},
            {name: "Help", items: [
            ]}
        ]
    })


}

Dawesome.prototype.showSaveWindow = function () {
    var f = new fragments.SaveFragment(this.song)

    this.wm.showFragment(f, {
        caption: "Save",
        height: 250,
        width: 300
    })
}

Dawesome.prototype.showOpenWindow = function () {
    var f = new fragments.OpenFragment(viewer => {
        console.log(viewer.data)

        if (this.player.playing) {
            this.player.stop()
        }

        this.load({data: viewer.data})
        
    })

    this.wm.showFragment(f, {
        caption: "Open",
        height: 450,
        width: 600,
        overflowY: "scroll",
    })
}

Dawesome.prototype.newSong = function () {
    // todo check to save!
    this.load()
}

Dawesome.prototype.refreshTimelineScrollBars = function () {
    
    this.timeline.scrollBarX.canvas.width = this.timeline.scrollBarX.canvas.clientWidth
    this.timeline.scrollBarX.canvas.height = this.timeline.scrollBarX.canvas.clientHeight
    this.timeline.scrollBarX.context.fillStyle = "#404040"
    this.timeline.scrollBarX.context.fillRect(0, 0, this.timeline.scrollBarX.canvas.width, this.timeline.scrollBarX.canvas.height)
    
    if (this.timeline.div.clientWidth - this.timeline.headerWidth < this.timeline.sectionWidthUsed) {
        //this.timeline.scrollBarX.div.style.display = "flex"
        this.timeline.scrollBarX.context.fillStyle = "#888888"
        this.timeline.scrollBarX.widthPercent = this.timeline.scrollBarX.canvas.width / this.timeline.sectionWidthUsed
        this.timeline.scrollBarX.context.fillRect(
            this.timeline.scrollBarX.startPercent * this.timeline.scrollBarX.canvas.width, 
            0, 
            this.timeline.scrollBarX.widthPercent * this.timeline.scrollBarX.canvas.width, 
            this.timeline.scrollBarX.canvas.height)

    }
    else {
        //this.timeline.scrollBarX.div.style.display = "none"
    }
}

Dawesome.prototype.setupScrollBarEvents = function (scrollBar) {

    scrollBar.canvas.onmousedown = e => {
        scrollBar.offsets = this.wm.getTotalOffsets(scrollBar.canvas);
        scrollBar.startX = e.clientX //- scrollBar.offsets.left
        scrollBar.isTouching = true

        // this works when there's only a couple sections, otherwise too short
        this.wm.div.onmousemove = e => {
            if (scrollBar.isTouching) {
                //var dx = (e.clientX - scrollBar.offsets.left) - scrollBar.startX 
                var dx = e.clientX - scrollBar.startX 
                scrollBar.startPercent = Math.min(1 - scrollBar.widthPercent, Math.max(0, scrollBar.startPercent + dx / scrollBar.div.clientWidth))
                scrollBar.startX = e.clientX// - scrollBar.offsets.left
                this.moveTimeline(scrollBar.startPercent / (scrollBar.widthPercent), 0)
                this.refreshTimelineScrollBars()
            }
        }

        this.wm.div.onmouseup = e => {
            this.wm.div.onmousemove = undefined
            scrollBar.isTouching = false
        }
    }

}

Dawesome.prototype.moveTimeline = function (x, y) {
    this.timeline.scrollBarX.x = x
    for (var section in this.timeline.sectionDivs) {
        this.timeline.sectionDivs[section].div.style.left = 
            this.timeline.sectionDivs[section].left - x * 
            this.timeline.scrollBarX.canvas.clientWidth + "px"
    }
    this.updateTimelineBeatMarker()
}

Dawesome.prototype.showTransportWindow = function () {
    this.wm.show(this.transport.window)
}
Dawesome.prototype.showTimelineWindow = function () {
    this.wm.show(this.timeline.window)
}
Dawesome.prototype.showMixerWindow = function () {
    var f = new fragments.MixerFragment(this)
    this.wm.showFragment(f, this.mixerWindowConfig)
}

Dawesome.prototype.showFXWindow = function () {
    var f = new fragments.FXFragment(this)
    
    this.wm.showFragment(f, this.fxWindowConfig)

}

Dawesome.prototype.showLiveWindow = function (joinRoom) {
    var f = new fragments.LiveFragment(this, joinRoom)

    this.wm.showFragment(f, {
        caption: "Live Collaboration",
        height: 500,
        width: 600,
        x: window.innerWidth - 630,
        y: 10
    })
}

Dawesome.prototype.joinLiveRoom = function (joinRoom) {
    this.liveFragment = new fragments.LiveFragment(this, joinRoom)
}


Dawesome.prototype.showFXDetail = function (fx, part) {
    var f = new fragments.FXDetailFragment(fx, part, this.player)

    this.wm.showFragment(f, {
        caption: fx.data.name + " - " + part.data.name,
        height: 300,
        width: 300
    })

}

Dawesome.prototype.showRemoveControlsWindow = function () {
    var f = new fragments.RemoteFragment(this)

    this.wm.showFragment(f, {
        caption: "Remote Controls",
        height: 300,
        width: 400,
        x: window.innerWidth - 630,
        y: window.innerHeight - 530
    })
}

Dawesome.prototype.makeChordsCaption = function (section) {
    var chordsCaption = "";
    section.data.chordProgression.forEach((chordI, i) => {
        if (this.player && this.player.playing && i === this.player.section.currentChordI) {
            chordsCaption += "<span class='current-chord'>";
        }
        chordsCaption += this.makeChordCaption(chordI);
        if (this.player && this.player.playing && i === this.player.section.currentChordI) {
            chordsCaption += "</span>";
        }
        chordsCaption += " "
    });
    return chordsCaption;
};

Dawesome.prototype.makeChordCaption = function (chordI) {
    var index = chordI < 0 ? this.song.data.keyParams.scale.length + chordI : chordI;
    var chord = this.song.data.keyParams.scale[index];
    var sign = chordI < 0 ? "-" : "";
    if (chord === 0) return sign + "I";
    if (chord === 2) return sign + "II";
    if (chord === 3 || chord === 4) return sign + "III";
    if (chord === 5) return sign + "IV";
    if (chord === 6) return sign + "Vb";
    if (chord === 7) return sign + "V";
    if (chord === 8 || chord === 9) return sign + "VI";
    if (chord === 10 || chord === 11) return sign + "VII";
    return sign + "?";
}

Dawesome.prototype.showChordsFragment = function (section) {
    var f = new fragments.ChordProgressionFragment(section, this)

    this.wm.showFragment(f, {
        caption: "Chord Progression - " + section.data.name,
        height: 600,
        width: 350,
    })
}

Dawesome.prototype.updateTimelineBeatMarker = function () {
    this.timeline.beatMarker.style.left = this.timeline.currentSection.timelineDiv.offsetLeft +
                                            //this.timeline.headerWidth + 
                                            this.timeline.currentBeat * 
                                            this.timeline.subbeatLength + "px"
}

Dawesome.prototype.showSectionOptionFragment = function (section) {
    var f = new fragments.SectionOptionsFragment(section, this)

    this.wm.showFragment(f, {
        caption: "Section Options- " + section.data.name,
        height: 300,
        width: 350,
    })
}

Dawesome.prototype.extendSong = function () {
    var startCopy = this.song.data.beatParams.subbeats * this.song.data.beatParams.beats * (this.player.section.data.measures - 1)
    var startPaste = this.song.data.beatParams.subbeats * this.song.data.beatParams.beats * this.player.section.data.measures

    this.player.section.data.measures++

    for (var partName in this.player.section.parts) {
        if (this.player.section.parts[partName].data.tracks) {
            this.extendPartTracks(this.player.section.parts[partName], startCopy, startPaste)
        }
    }


    this.sizeTimelineSection(this.player.section, true)

}

Dawesome.prototype.extendPartTracks = function (part, startCopy, startPaste) {

    console.log(part, startCopy, startPaste)
    var j 
    for (var track of part.data.tracks) {
        j = 0
        for (var i = startCopy; i < startPaste; i++) {

            if (track.data[i]) {
                track.data[j + startPaste] = track.data[i]
            }
            j++

        }

    }

}

Dawesome.prototype.resizeTimelineSections = function () {
    var x = this.timeline.scrollBarX.x
    var left
    var used = 0
    var width
    for (var section in this.timeline.sectionDivs) {
        width = this.timeline.measureWidth * 1 
        left = used + this.timeline.headerWidth
        
        this.timeline.sectionDivs[section].div.style.width = width + "px"

        this.timeline.sectionDivs[section].div.style.left = left + "px"
            //this.timeline.sectionDivs[section].left - x * 
            //this.timeline.scrollBarX.canvas.clientWidth + "px"
        
        this.timeline.sectionDivs[section].left = left
        used += width
        
    }
    this.timeline.sectionWidthUsed = used
    this.refreshTimelineScrollBars()
    this.updateTimelineBeatMarker()
}
