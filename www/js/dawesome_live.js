export function LiveFragment(daw, joinRoom) {
    this.daw = daw

    // todo I don't think this should be here,
    // figure out how collaborators start and stop
    this.remoteTo = true

    this.div = document.createElement("div")
    this.div.style.display = "flex"
    this.div.style.flexDirection = "column"

    this.collabCaption = document.createElement("div")
    this.collabCaption.innerHTML = "Invite others to join your session. Chat through text or video."
    this.div.appendChild(this.collabCaption)
    
    this.goLiveButton = document.createElement("button")
    this.goLiveButton.innerHTML = "Go Live!"
    this.div.appendChild(this.goLiveButton)
    this.goLiveButton.onclick = e => {
        this.goLive()
    }

    this.collabLink = document.createElement("input")
    this.collabLink.className = "daw-live-chat-input"
    this.collabLink.value = window.location
    this.collabLink.style.display = "none"
    this.div.appendChild(this.collabLink)
    
    //this.watchLink = document.createElement("input")
    //this.div.appendChild(this.watchLink)
    
    this.liveDetails = document.createElement("div")
    this.liveDetails.className = "daw-live-details"
    
    this.liveChat = document.createElement("textarea")
    this.liveChat.className = "daw-live-chat"
    
    this.liveChatUsers = document.createElement("div")
    this.liveChatUsers.innerHTML = "(Not currently live)"
    this.liveChatUsers.className = "daw-live-users"
    
    this.liveDetails.appendChild(this.liveChat)
    this.liveDetails.appendChild(this.liveChatUsers)
    this.div.appendChild(this.liveDetails)

    this.chatInput = document.createElement("input")
    this.chatInput.className = "daw-live-chat-input"
    this.div.appendChild(this.chatInput)
    this.chatInput.placeholder = "type and press enter to send"    
    this.chatInput.onkeypress = e => {
        if (e.key === "Enter") {
            this.emit("chat", {meToo: true, message: this.chatInput.value})
            this.chatInput.value = ""
        }
    }

    this.userParts = new Map()
    this.username = "guest" + Math.trunc(Math.random() * 100000)

    if (joinRoom) {
        this.goLive(joinRoom)
    }
}

LiveFragment.prototype.goLive = function (joinRoom) {

    this.roomname = window.location.origin + window.location.pathname + "?room=" + encodeURIComponent(joinRoom || this.username)
    
    this.song = this.daw.song
    var data = joinRoom ? null : this.song.getData()
    
    if (!this.daw.rt) {
        this.daw.rt = new OMGRealTime()
        this.daw.rt.onready = () => {
            this.daw.rt.join(this.roomname, this.username, data)
        }
    }
    else {
        this.daw.rt.join(this.roomname, this.username, data)
    }

    this.daw.rt.onnewuser = (name, user) => {
        this.showNewText({from: name, message: "[joined]"})
        this.addUser(name, user)
    }

    this.daw.rt.onuserleft = (name, user) => {
        this.showNewText({from: name, message: "[left]"})
        this.removeUser(name, user)
    }
    this.daw.rt.onuserdisconnected = (name, user) => {
        this.showNewText({from: name, message: "[disconnected]"})
        this.removeUser(name, user)
    }

    this.daw.rt.onjoined = async e => {
        if (joinRoom && e.thing) {
            await this.daw.load(e.thing)
            this.song = this.daw.song
        }
        this.live = new DawesomeLive(this.daw.rt, this.song, this.daw.player)
        //this.setupListeners()
        
        this.collabLink.value = this.roomname
        this.liveChatUsers.innerHTML = this.username + " (you)"
        for (var username in e.users) {
            if (username !== this.username) {
                this.addUser(username, e.users[username])
            }
        }

        this.collabCaption.innerHTML = "Collaboration link:"
        this.goLiveButton.style.display = "none"
        this.collabLink.style.display = "block"
        
    }
    this.daw.rt.on("chat", e => {
        this.showNewText(e)
    })
    this.daw.rt.on("SONG", e => {
        this.live.ondata(e)
    })

    this.daw.rt.onincomingcall = (name, callback) => {
        var user = this.daw.rt.remoteUsers[name]
        if (!user) {
            console.warn("call from unknown user", name)
        }
        this.daw.wm.showFragment({div: user.video}, {width: 180, height: 160})
        if (this.isLocalVideoShowing) {
            callback()
        }
        else {
            this.daw.rt.getUserMedia((video) => {
                this.daw.wm.showFragment({div: video, onhide: ()=> {this.isLocalVideoShowing = false}}, {width: 180, height: 160})
                this.isLocalVideoShowing = true
    
                callback()
            })
        }
    }
}

LiveFragment.prototype.showNewText = function (data) {
    var newTextDiv = document.createTextNode(data.from + ": " +  data.message + "\n")
    this.liveChat.appendChild(newTextDiv)
    this.liveChat.scrollTop = this.liveChat.scrollHeight;
}

LiveFragment.prototype.addUser = function (name, user) {
    var userDiv = document.createElement("div")
    userDiv.innerHTML = name
    var callUserButton = document.createElement("button")
    callUserButton.innerHTML = "Call"
    callUserButton.onclick = e => this.callUser(name, user)
    userDiv.appendChild(callUserButton)
    this.liveChatUsers.appendChild(userDiv)

    this.userParts.set(user, userDiv)
}

LiveFragment.prototype.removeUser = function (name, user) {
    var partDiv = this.userParts.get(user)
    if (partDiv) {
        this.liveChatUsers.removeChild(partDiv)
    }
}

LiveFragment.prototype.callUser = function (name, user) {

    var callUser = () => {
        this.daw.rt.callUser(name, user => {
            this.daw.wm.showFragment({div: user.video}, {width: 180, height: 160})
        })
    }    

    if (this.isLocalVideoShowing) {
        callUser()
    }
    else {
        this.daw.rt.getUserMedia((video) => {
            this.daw.wm.showFragment({div: video, onhide: ()=> {this.isLocalVideoShowing = false}}, {width: 180, height: 160})
            this.isLocalVideoShowing = true

            callUser()
        })
    }
    

}


export function RemoteFragment(daw) {

    this.daw = daw
    this.username = "guest" + Math.trunc(Math.random() * 100000)
    this.roomname = window.location.pathname + "?room=test"
    var fullURL = window.location.origin + "/apps/gauntlet/?remoteTo=" + encodeURIComponent(this.roomname)
    
    this.div = document.createElement("div")

    var caption = document.createElement("div")
    caption.innerHTML = "<div>Remote control this session from another device:</div>"
    this.div.appendChild(caption)
    this.urlInput = document.createElement("input")
    this.urlInput.value = fullURL
    this.urlInput.style.width = "100%"
    this.div.appendChild(this.urlInput)

    var connectedCaption = document.createElement("div")
    connectedCaption.innerHTML = "Connected remote controls:"
    this.div.appendChild(connectedCaption)

    this.connectedList = document.createElement("div")
    this.div.appendChild(this.connectedList)

    this.song = this.daw.song
    var data = this.song.getData()
    
    this.rt = new OMGRealTime()
    this.rt.onready = () => {
        this.rt.join(this.roomname, this.username, data)
    }
    
    this.rt.onnewuser = (name, user) => {
        user.connectedDiv = document.createElement("div")
        user.connectedDiv.innerHTML = name
        this.connectedList.appendChild(user.connectedDiv)
        //this.showNewText({from: name, message: "[joined]"})
        //this.addUser(name, user)
    }

    this.rt.onuserleft = (name, user) => {
        //this.connectedList.removeChild(user.connectedDiv)
        //this.showNewText({from: name, message: "[left]"})
        //this.removeUser(name, user)
    }
    this.rt.onuserdisconnected = (name, user) => {
        this.connectedList.removeChild(user.connectedDiv)
        //this.showNewText({from: name, message: "[disconnected]"})
        //this.removeUser(name, user)
    }

    this.rt.onuserreconnected = (name, user) => {
        this.connectedList.appendChild(user.connectedDiv)
    }

    this.rt.onjoined = async e => {
        this.live = new DawesomeLive(this.rt, this.song, this.daw.player)

        for (var username in e.users) {
            if (username !== this.username) {
                //this.addUser(username, e.users[username])
            }
        }
    }
    
    this.rt.on("SONG", e => {
        this.live.ondata(e)
    })
    
}



function DawesomeLive(rt, song, player) {
    this.rt = rt
    this.song = song
    this.player = player

    this.onPlayListenerInstance = (e, source) => this.onPlayListener(e, source)
    this.onBeatChangeListenerInstance = (e, source) => this.onBeatChangeListener(e, source)
    this.onKeyChangeListenerInstance = (e, source) => this.onKeyChangeListener(e, source)
    this.onChordProgressionChangeListenerInstance = (e, source) => this.onChordProgressionChangeListener(e, source)
    this.onPartAudioParamsChangeListenerInstance = (e, source) => this.onPartAudioParamsChangeListener(e, source)
    this.onPartAddListenerInstance = (e, source) => this.onPartAddListener(e, source)
    this.onFXChangeListenerInstance = (action, part, fx, source) => this.onFXChangeListener(action, part, fx, source)


    this.player.onPlayListeners.push(this.onPlayListenerInstance);
    song.onBeatChangeListeners.push(this.onBeatChangeListenerInstance);
    song.onKeyChangeListeners.push(this.onKeyChangeListenerInstance);
    song.onChordProgressionChangeListeners.push(this.onChordProgressionChangeListenerInstance);
    song.onPartAudioParamsChangeListeners.push(this.onPartAudioParamsChangeListenerInstance);
    song.onPartAddListeners.push(this.onPartAddListenerInstance);
    song.onFXChangeListeners.push(this.onFXChangeListenerInstance)
};

DawesomeLive.prototype.removeListeners = function () {
    this.removeListener(this.daw.player.onPlayListeners, this.onPlayListenerInstance);
    this.removeListener(this.song.onBeatChangeListeners, this.onBeatChangeListener);
    this.removeListener(this.song.onKeyChangeListeners, this.onKeyChangeListener);
    this.removeListener(this.song.onChordProgressionChangeListeners, this.onChordProgressionChangeListener);
    this.removeListener(this.song.onPartAudioParamsChangeListeners, this.onPartAudioParamsChangeListener);
    this.removeListener(this.song.onPartAddListeners, this.onPartAddListener);
    this.removeListener(this.song.onFXChangeListeners, this.onFXChangeListener);

};

DawesomeLive.prototype.removeListener = function (listeners, listener) {
    var index = listeners.indexOf(listener)
    if (index > -1) {
        listeners.splice(index, 1);
    }
};

DawesomeLive.prototype.onLoadSongListener = function (source) {
    if (source === "omglive") return;

    this.setupListeners();

    this.emit("SONG", {
        action: "loadSong", 
        value: this.song.getData()
    });
};

DawesomeLive.prototype.onFXChangeListener = function (action, part, fx, source) {
    if (source === "omglive") return;

    this.emit("SONG", {
        action: "fxChange",
        fxAction: action, 
        partName: part === this.song ? undefined : part.data.name,
        fxName: fx.data.name,
        fxData: action === "add" ? fx.data : undefined
    });
};

DawesomeLive.prototype.onBeatChangeListener = function (beatParams, source) {
    if (source === "omglive") return;

    this.emit("SONG", {
        property: "beatParams", 
        value: beatParams
    });
};

DawesomeLive.prototype.onKeyChangeListener = function (keyParams, source) {
    if (source === "omglive") return;

    this.emit("SONG", {
        property: "keyParams", 
        value: keyParams
    });
};

DawesomeLive.prototype.onChordProgressionChangeListener = function (source) {
    if (source === "omglive") return;

    this.emit("SONG", {
        property: "chordProgression", 
        value: tg.currentSection.data.chordProgression
    });
};

DawesomeLive.prototype.onPartAudioParamsChangeListener = function (part, source) {
    if (source === "omglive") return;
    this.emit("SONG", {
        property: "audioParams", 
        partName: part.data.name,
        value: part.data.audioParams
    });
};

DawesomeLive.prototype.onPartAddListener = function (part, source) {
    if (source === "omglive") return;
    this.emit("SONG", {
        action: "partAdd", 
        part: part.data,
    });
};

DawesomeLive.prototype.onSequencerChangeListener = function (part, trackI, subbeat) {
    var data = {
        action: "sequencerChange", 
        partName: part.data.name,
        value: part.data.tracks[trackI].data[subbeat],
        trackI: trackI,
        subbeat: subbeat
    };
    this.emit("SONG", data);
};

DawesomeLive.prototype.onVerticalChangeListener = function (part, frets, autobeat) {
    if (tg.omglive.peerDataChannel) {
        tg.omglive.peerDataChannel.send(JSON.stringify({
            action: "verticalChangeFrets", 
            partName: part.data.name,
            value: frets,
            autobeat: frets.autobeat
        }));
        return;
    }
    
    if (tg.omglive.calculateNotesLocally) {
        this.emit("SONG", {
            action: "verticalChangeNotes", 
            partName: part.data.name,
            value: part.data.notes
        });
    }
    else {
        this.emit("SONG", {
            action: "verticalChangeFrets", 
            partName: part.data.name,
            value: frets,
            autobeat: frets.autobeat
        });        
    }
};

DawesomeLive.prototype.onPlayListener = function (play) {
    if (this.remoteTo) {
        //??return
    }
    var data = {
        action: play ? "play" : "stop"
    };
    console.log(data)
    this.emit("SONG", data);
};


DawesomeLive.prototype.emit = function (type, data) {
    data.room = true
    //from: this.userName
    this.rt.emit(type, data)
}

DawesomeLive.prototype.ondata = function (data) {
    console.log(data)
    if (data.action === "loadSong") {
        tg.omglive.removeListeners();
        tg.loadSong(data.value, "omglive");
        tg.omglive.setupListeners();
    }
    else if (data.property === "beatParams") {
        this.song.data.beatParams.bpm = data.value.bpm;
        this.song.data.beatParams.shuffle = data.value.shuffle;
        this.song.data.beatParams.subbeats = data.value.subbeats;
        this.song.data.beatParams.beats = data.value.beats;
        this.song.data.beatParams.measures = data.value.measures;
        this.song.beatsChanged("omglive");
    }
    else if (data.property === "keyParams") {
        this.song.data.keyParams.rootNote = data.value.rootNote;
        this.song.data.keyParams.scale = data.value.scale;
        this.song.keyChanged("omglive");
    }
    else if (data.property === "chordProgression") {
        tg.currentSection.data.chordProgression = data.value;
        this.song.chordProgressionChanged("omglive");
    }
    else if (data.property === "audioParams" && data.partName) {
        let part = this.song.parts[data.partName];
        if (!part) return;
        part.data.audioParams.mute = data.value.mute;
        part.data.audioParams.gain = data.value.gain;
        part.data.audioParams.pan = data.value.pan;
        part.data.audioParams.warp = data.value.warp;
        this.song.partMuteChanged(part, "omglive");
    }
    else if (data.action === "partAdd") {
        this.song.addPart(data.part, "omglive");
    }
    else if (data.action === "partSectionAdd") {
        this.song.addPartToSection(this.song.parts[data.part.name], 
            this.song.sections[data.section], "omglive");
    }
    else if (data.action === "sequencerChange") {
        let section = this.song.sections[data.sectionName]
        if (!section) return
        let part = section.parts[data.partName]
        if (!part) return
        part.data.tracks[data.trackI].data[data.subbeat] = data.value;
        part.change(data.trackI, data.subbeat, data[data.subbeat])
    }
    else if (data.action === "verticalChangeFrets") {
        this.onVerticalChangeFrets(data);
    }
    else if (data.action === "fxChange") {
        this.onFXChange(data);
    }
    else if (data.action === "play") {
        if (this.remoteTo && !this.player.playing) {
            this.player.play()
        }
    }
    else if (data.action === "stop") {
        if (this.remoteTo && this.player.playing) {
            this.player.stop()
        }
    }
    else if (data.action === "playSound") {
        //store the part so not searching everytime
        if (tg.omglive.lastPartName !== data.partName) {
            tg.omglive.lastPart = tg.currentSection.getPart(data.partName)
            tg.omglive.lastPartName = data.partName
        }
        tg.player.playSound(tg.omglive.lastPart.data.tracks[data.noteNumber].sound, 
                tg.omglive.lastPart, 
                tg.omglive.lastPart.data.tracks[data.noteNumber].audioParams, data.strength)
    }
};

DawesomeLive.prototype.onVerticalChangeFrets = function (data) {
    var part = this.song.parts[data.partName];
    if (data.value.length > 0) {
        data.value.autobeat = data.autobeat;
        this.player.playLiveNotes(data.value, part, 0);
    }
    else {
        this.player.endLiveNotes(part);
    }
};

DawesomeLive.prototype.onFXChange = function (data) {
    let part = data.partName ? this.song.parts[data.partName] : this.song;
    if (!part) return;

    if (data.fxAction === "add") {
        this.daw.musicContext.addFXToPart(data.fxName, part, "omglive");
    }
    else if (data.fxAction === "remove") {
        var fx = part.getFX(data.fxName)
        this.daw.musicContext.removeFXFromPart(fx, part, "omglive");
    }
    else if (data.fxAction) {
        var fx = part.getFX(data.fxName)
        for (var property in data.fxAction) {
            this.daw.musicContext.adjustFX(fx, part, property, data.fxAction[property], "omglive");
        }
    }
}

DawesomeLive.prototype.partData = function (part, data) {
    
    var fret = Math.max(0, Math.min(part.mm.frets.length - 1,
        part.mm.skipFretsBottom + Math.round((1 - data.y) * 
            (part.mm.frets.length - 1 - part.mm.skipFretsTop - part.mm.skipFretsBottom))));

    var noteNumber = part.mm.frets[fret].note;

    var note = {beats: 0.25};
    if (part.omglive.users[data.user]) {
        if (part.omglive.users[data.user].note.scaledNote === noteNumber) {
            part.omglive.users[data.user].x = data.x;
            part.omglive.users[data.user].y = data.y;
            return;
        }
        note = part.omglive.users[data.user].note;
    }
    else {
        part.omglive.notes.push(note);
    }
    note.note = fret - part.mm.frets.rootNote,
    note.scaledNote = noteNumber;
    data.note = note;

    part.omglive.users[data.user] = data;
    
    tg.player.playLiveNotes(part.omglive.notes, part, 0);    
};

DawesomeLive.prototype.partDataEnd = function (part, data) {
    var noteIndex = part.omglive.notes.indexOf(part.omglive.users[data.user].note);
    part.omglive.notes.splice(noteIndex, 1);
    delete part.omglive.users[data.user];
    
    if (part.omglive.notes.length > 0) {
        tg.player.playLiveNotes(part.omglive.notes, part, 0);
    }
    else {
        tg.player.endLiveNotes(part);
    }   
};



