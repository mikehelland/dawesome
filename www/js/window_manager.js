function OMGWindowManager(config) {

    this.div = config.div
    this.div.className = "omgwm-desktop"
    this.windows = []

    this.windowPadding = 0
    this.nextZ = 1
}

OMGWindowManager.prototype.newWindow = function (options) {

    var win = {
        div: document.createElement("div"),
        moveDiv: document.createElement("div"),
        resizeDiv: document.createElement("div"),
        closeDiv: document.createElement("div"),
        contentDiv: document.createElement("div"),
        width: options.width || 120,
        height: options.height || 80,
        x: typeof options.x === "number" ? options.x : (this.windows.length * 20),
        y: typeof options.y === "number" ? options.y : (this.windows.length * 20),
        visible: true,
    }

    win.contentDiv.className = "omgwm-content"
    win.moveDiv.className = "omgwm-control-move"
    win.resizeDiv.className = "omgwm-control omgwm-control-resize"
    win.closeDiv.className = "omgwm-control omgwm-control-close"
    win.moveDiv.innerHTML = options.caption || "&nbsp;"
    win.resizeDiv.innerHTML = "&nbsp;"
    win.closeDiv.innerHTML = "&nbsp;"

    win.div.appendChild(win.moveDiv)
    win.div.appendChild(win.resizeDiv)
    win.div.appendChild(win.closeDiv)

    win.div.appendChild(win.contentDiv)

    win.div.className = "omgwm-window"
    win.div.style.padding = this.windowPadding + "px"
    win.div.style.width = this.windowPadding * 2 + win.width + "px"
    win.div.style.height = this.windowPadding * 2 + win.height + "px"
    win.div.style.left = win.x + "px"
    win.div.style.top = win.y + "px"
    
    if (options.overflowX) {
        win.contentDiv.style.overflowX = options.overflowX
    }
    if (options.overflowY) {
        win.contentDiv.style.overflowY = options.overflowY
    }
    this.div.appendChild(win.div)

    this.windows.push(win)

    this.makeDraggable(win.moveDiv, win, "MOVE")
    this.makeDraggable(win.resizeDiv, win, "RESIZE")
    win.closeDiv.onclick = e => {
        this.close(win)
    }

    this.show(win)
    return win
}

OMGWindowManager.prototype.move = function (win, x, y) {
    win.div.style.left = x + "px"
    win.div.style.top = y + "px"
    win.x = x
    win.y = y

    if (win.onmove) {
        win.onmove()
    }
}


OMGWindowManager.prototype.resize = function (win, w, h) {
    win.div.style.width = w + this.windowPadding * 2 + "px"
    win.div.style.height = h + this.windowPadding * 2 + "px"
    win.width = w
    win.height = h

    if (win.onresize) {
        win.onresize()
    }
}

OMGWindowManager.prototype.close = function (win) {
    var i = this.windows.indexOf(win)
    if (i > -1) {
        this.windows.splice(i, 1)
    }
    this.div.removeChild(win.div)
}

OMGWindowManager.prototype.makeDraggable = function (control, win, mode) {

    //??
    //div.style.pointerEvents = "initial"


    control.onmousedown = e => {
        e.preventDefault()
        this.dndStart(control, win, e.pageX, e.pageY, mode)

        this.show(win)        
    }

    control.onmouseup = e => {
        e.preventDefault()
        this.dndEnd(win, e.pageX, e.pageY)
    }

    control.addEventListener("touchstart", e => {
        e.preventDefault()
        dndContext.ondown(e.targetTouches[0].pageX, e.targetTouches[0].pageY, div, songInfo, sourceSet)

    })
}

OMGWindowManager.prototype.dndStart = function (control, win, x, y, mode) {

    if (mode === "MOVE") {
        this.dndOffsets = {left: x - win.x, top: y - win.y} 
    }
    else if (mode === "RESIZE") {
        this.dndOffsets = {left: x - (win.x + win.width), top: y - (win.y + win.height)} 
    }
    
    this.div.onmousemove = e => {
        if (mode === "MOVE") {
            this.move(win, e.pageX - this.dndOffsets.left, e.pageY - this.dndOffsets.top)
        }
        else if (mode === "RESIZE") {
            this.resize(win, e.pageX - this.dndOffsets.left - win.x, 
                            e.pageY - this.dndOffsets.top - win.y)
        }
    }
    this.div.addEventListener("touchmove", e => {
        dndContext.onmove(e.targetTouches[0].pageX, e.targetTouches[0].pageY)
    })
    
}


OMGWindowManager.prototype.dndEnd = function (win, x, y, onupdate) {

    this.div.onmousemove = undefined
    this.div.addEventListener("touchmove", e => {
        dndContext.onmove(e.targetTouches[0].pageX, e.targetTouches[0].pageY)
    })
    
}

OMGWindowManager.prototype.show = function (win) {
    win.div.style.zIndex = this.nextZ
    this.nextZ += 1
    
}