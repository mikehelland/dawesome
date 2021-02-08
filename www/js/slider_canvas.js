// note, this has a dependency on omg.audioContext buried in there

function SliderCanvas(canvas, controlInfo, audioNode, data, onchange) {
    var m = this;
    if (!canvas) {
        canvas = document.createElement("canvas");
    }
    this.offsets = omg.ui.totalOffsets(canvas);
    canvas.onmousedown = function (e) {
        m.offsets = omg.ui.totalOffsets(canvas);
        m.ondown(e.clientX - m.offsets.left, e.clientY - m.offsets.top);
    };
    canvas.onmousemove = function (e) {
        m.onmove(e.clientX - m.offsets.left, e.clientY - m.offsets.top);};
    canvas.onmouseup = function (e) {m.onup();};
    canvas.onmouseout = function (e) {m.onup();};
    canvas.addEventListener("touchstart", function (e) {
        e.preventDefault();

        m.offsets = omg.ui.totalOffsets(canvas);
        m.ondown(e.targetTouches[0].pageX - m.offsets.left, e.targetTouches[0].pageY - m.offsets.top);
    });
    canvas.addEventListener("touchmove", function (e) {
        m.onmove(e.targetTouches[0].pageX - m.offsets.left, e.targetTouches[0].pageY - m.offsets.top);
    });
    canvas.addEventListener("touchend", function (e) {m.onup();});

    this.div = canvas;
    this.ctx = canvas.getContext("2d");
    this.data = data;
    this.audioNode = audioNode;
    this.controlInfo = controlInfo;
    this.onchange = onchange || controlInfo.onchange;
    this.percent = 0;
    this.isAudioParam = audioNode && typeof audioNode[controlInfo.property] === "object" && controlInfo.property !== "xy";
    
    this.frequencyTransformScale = Math.log(controlInfo.max) - Math.log(controlInfo.min);

    if (data && typeof data[controlInfo.property] === "undefined" && 
            typeof controlInfo.default !== "undefined") {
        data[controlInfo.property] = controlInfo.default;
    }

    if (typeof this.controlInfo.resetValue === "number") {
        var slider = this;
        this.div.ondblclick = function () {
            slider.onupdate(slider.controlInfo.resetValue);
        };
    }
}

SliderCanvas.prototype.ondown = function (x, y) {
    this.isTouching = true;
    this.onnewX(x, y);
};
SliderCanvas.prototype.onmove = function (x, y) {
    if (this.isTouching) {
        this.onnewX(x, y);
    }
};
SliderCanvas.prototype.onnewX = function (x, y) {
    if (this.controlInfo.direction === "vertical") {
        this.percent = 1 - y / this.div.clientHeight;
    }
    else {
        this.percent = x / this.div.clientWidth;
    }

    if (this.controlInfo.type === "xy") {
        this.onupdate([this.percent, y / this.div.clientHeight]);
        return;
    }

    if (this.controlInfo.type === "options") {
        var i = Math.floor(this.percent * this.controlInfo.options.length);
        this.onupdate(this.controlInfo.options[Math.min(this.controlInfo.options.length - 1, i)]);
        return;
    }

    if (this.controlInfo.transform === "square") {
        this.percent = this.percent * this.percent;
    }
    var value;
    if (this.controlInfo.min === 20 && this.controlInfo.max > 10000) {
        value = Math.exp(this.percent * this.frequencyTransformScale + Math.log(this.controlInfo.min));
    }
    else {
        value = Math.min(this.controlInfo.max, 
                 Math.max(this.controlInfo.min, 
            (this.controlInfo.max - this.controlInfo.min) * this.percent + this.controlInfo.min));
    }
    if (this.controlInfo.step) {
        value = Math.round(value / this.controlInfo.step) * this.controlInfo.step
    }
    this.onupdate(value);
};

SliderCanvas.prototype.onupdate = function (value) {
    if (this.audioNode) {
        if (this.isAudioParam) {
            this.audioNode[this.controlInfo.property].setValueAtTime(value, window.omgmusic.audioContext.currentTime);
        }
        else {
            this.audioNode[this.controlInfo.property] = value;
        }
    }
    if (this.data) {
        this.data[this.controlInfo.dataProperty || this.controlInfo.property] = value;
    }
    this.drawCanvas(this.div);
    if (this.onchange) {
        this.onchange(value);
    }
};
SliderCanvas.prototype.onup = function (e) {
    this.isTouching = false;
    if (this.controlInfo.type === "xy") {
        this.onupdate([-1, -1]);
        return;
    }
};
SliderCanvas.prototype.sizeCanvas = function () {
    this.offsets = omg.ui.totalOffsets(this.div);
    this.div.width = this.div.clientWidth;
    if (this.controlInfo.type === "xy") {
        this.div.style.height = Math.min(200, this.div.width) + "px";
    }
    this.div.height = this.div.clientHeight;
    this.drawCanvas();
};
SliderCanvas.prototype.drawOptionsCanvas = function () {    
    var value = this.controlInfo.options.indexOf(this.data[this.controlInfo.property]);
    
    this.ctx.fillRect(value * this.div.clientWidth / this.controlInfo.options.length,
        0, this.div.clientWidth / this.controlInfo.options.length, this.div.height);
    this.ctx.fillStyle = "white";
    this.ctx.font = "10pt sans-serif";
    this.ctx.fillText(this.controlInfo.name, 10, this.div.height / 2 + 5);
    var caption = this.controlInfo.options[value];
    
    var valueLength = this.ctx.measureText(caption).width;
    this.ctx.fillText("", 0, 0);
    this.ctx.fillText(caption, this.div.clientWidth - valueLength - 10, this.div.height / 2 + 5);
};
SliderCanvas.prototype.drawCanvas = function () {
    this.div.width = this.div.width;
    this.ctx.fillStyle = this.controlInfo.color || "#008800";
    
    if (this.controlInfo.type === "options") {
        this.drawOptionsCanvas();
        return;
    }
    
    var value = this.data[this.controlInfo.dataProperty || this.controlInfo.property];
    var percent = value;
    percent = (percent - this.controlInfo.min) / (this.controlInfo.max - this.controlInfo.min);
    if (this.controlInfo.transform === "square") {
        percent = Math.sqrt(percent);
    }
    if (this.controlInfo.min === 20 && this.controlInfo.max > 10000) {
        percent = (Math.log(value) - Math.log(this.controlInfo.min)) / this.frequencyTransformScale;
    }
    var startX = this.controlInfo >= 0 ? 0 : 
            ((0 - this.controlInfo.min) / (this.controlInfo.max - this.controlInfo.min));
    startX = startX * this.div.clientWidth;
    if (startX) {
        this.ctx.fillRect(startX - 2, 0, 4, this.div.height);
    }
    if (this.controlInfo.direction === "vertical") {
        this.ctx.fillRect(startX, this.div.height - (percent * this.div.height), this.div.width, this.div.height);
    }
    else {
        this.ctx.fillRect(startX, 0, percent * this.div.clientWidth - startX, this.div.height);
    }
    this.ctx.fillStyle = "white";
    this.ctx.font = "10pt sans-serif";
    if (this.controlInfo.name) {
        this.ctx.fillText(this.controlInfo.name, 10, this.div.height / 2 + 5);
    }

    if (this.controlInfo.hideValue) {
        return 
    }
    this.ctx.globalAlpha = 0.5
    var suffix = "";
    if (value > 1000) {
        value = value / 1000;
        suffix = "K";
    }
    value = Math.round(value * 100) / 100;
    value = value + "" + suffix;
    if (this.controlInfo.direction === "vertical") {
        this.ctx.textAlign = "center"
        this.ctx.fillText(value, this.div.clientWidth  /2 , 15);
    }
    else {
        var valueLength = this.ctx.measureText(value).width;
        this.ctx.fillText("", 0, 0); //??
        this.ctx.fillText(value, this.div.clientWidth - valueLength - 10, this.div.height / 2 + 5);
    }
    this.ctx.globalAlpha = 1
};