function Dawesome(config) {
    this.div = config.div

    this.playChar = "&nbsp;&#9654;"
    this.stopChar = "&#9724;"
    
    this.player = new OMusicPlayer()
    this.player.loadFullSoundSets = true
    this.partDrawer = new OMGEmbeddedViewerMusicDrawer()
    
    this.wm = new OMGWindowManager(config)

    this.setupTransport()
    this.setupTimeline()
    this.setupMixer()

    this.loadSong()

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

    this.loadSections()
    this.loadParts()
}

Dawesome.prototype.setupTransport = function () {
    this.transport = {}

    this.transport.playButtonEl = document.createElement("div")
    this.transport.playButtonEl.className = "daw-transport-play-button"
    this.transport.playButtonEl.innerHTML = this.playChar
    this.transport.window = this.wm.newWindow({caption: "Transport", 
                            width: 100, height: 80, x: 0, y: 0})

    this.transport.div = this.transport.window.contentDiv
    this.transport.div.appendChild(this.transport.playButtonEl)

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
}

Dawesome.prototype.setupTimeline = function () {
    this.timeline = {}
    this.timeline.window = this.wm.newWindow({caption: "Timeline", 
                    width: window.innerWidth - 140, height: 180, x: 100, y: 0})
    this.timeline.div = this.timeline.window.contentDiv
    this.timeline.div.classList.add("daw-timeline")

    this.timeline.measureWidth = 500
    this.timeline.headerWidth = 200
    this.timeline.partHeight = 60

    this.timeline.headersDiv = document.createElement("div")
    this.timeline.headersDiv.innerHTML = "&nbsp;"//placeholder
    this.timeline.headersDiv.className = "daw-timeline-headers"

    this.timeline.div.appendChild(this.timeline.headersDiv)

    
}

Dawesome.prototype.setupMixer = function () {
    this.mixer = {}
    this.mixer.window = this.wm.newWindow({caption: "Mixer", width: 500, height: 200, x: 7, y: 240})
    this.mixer.div = this.mixer.window.contentDiv
    this.mixer.div.classList.add("daw-mixer")

}

Dawesome.prototype.loadSections = function () {
    
    if (this.song.sections.length === 0) {
        // TODO show empty? make one?
        return 
    }

    var widthUsed = 0
    for (var i = 0; i < this.song.sections.length; i++) {
        var div = this.newTimelineSection(this.song.sections[i])
        this.timeline.div.appendChild(div)

        var measures = 1 // TODO from song or section
        div.style.left = this.timeline.headerWidth + widthUsed + "px"
        widthUsed += measures * this.timeline.measureWidth

        this.song.sections[i].timelineDiv = div
    }
}


Dawesome.prototype.loadParts = function () {
    
    this.mixer.div.innerHTML = ""
    
    if (!this.section || this.section.parts.length === 0) {
        // TODO show empty?
        return 
    }

    for (var i = 0; i < this.section.parts.length; i++) {
        var mixerChannel = this.newMixerChannel(this.section.parts[i])
        this.mixer.div.appendChild(mixerChannel)

        var timelineChannel = this.newTimelineHeader(this.section.parts[i])
        this.timeline.headersDiv.appendChild(timelineChannel)

        for (var j = 0; j < this.song.sections.length; j++) {
            var canvas = this.newPartCanvas(this.section.parts[i], this.song.sections[j])
            this.song.sections[j].timelineDiv.appendChild(canvas)
            canvas.style.top = timelineChannel.clientTop + "px"
            canvas.style.left = "0px"
            canvas.style.width = "100%"
            canvas.style.height = timelineChannel.clientHeight + "px"

            this.partDrawer.drawPartCanvas(this.section.parts[i].data, canvas, 
                    this.song.data.beatParams)
        }
    }
}

Dawesome.prototype.newMixerChannel = function (part) {
    var channelDiv = document.createElement("div")
    channelDiv.innerHTML = part.data.name
    return channelDiv
}

Dawesome.prototype.newTimelineHeader = function (part) {
    var div = document.createElement("div")
    div.innerHTML = part.data.name
    div.className = "daw-timeline-header"
    div.style.width = this.timeline.headerWidth + "px"
    div.style.height = this.timeline.partHeight + "px"
    return div
}

Dawesome.prototype.newTimelineSection = function (section) {
    var div = document.createElement("div")
    div.className = "daw-timeline-section"
    div.style.width = this.timeline.measureWidth + "px" //TODO figure out how many measures


    var captionDiv = document.createElement("div")
    captionDiv.innerHTML = section.data.name
    captionDiv.className = "daw-timeline-section-caption"
    div.appendChild(captionDiv)
    return div
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
    part.detailWindow = this.wm.newWindow({caption: part.data.name, width: 400, height: 600})

    if (part.data.surface.url === "PRESET_SEQUENCER") {
        part.sequencer = new OMGDrumMachine(part.detailWindow.contentDiv, part)
        part.sequencer.readOnly = false
        part.sequencer.draw()
    }
    else {
        part.vertical = new OMGMelodyMaker(part.detailWindow.contentDiv, part, this.player)
        part.vertical.readOnly = false
        part.vertical.draw()
    }

}
