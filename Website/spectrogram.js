class Spectrogram {
    constructor(analyser, debug, canvasID, color1, color2, color3, threshold) {
        this.analyser = analyser;
        this.debug = debug;
        this.spectrogramCanvas = document.getElementById(canvasID);
        this.spectrogramContext = this.spectrogramCanvas.getContext('2d');
        this.canvasWidth = this.spectrogramCanvas.width;
        this.canvasHeight = this.spectrogramCanvas.height;
        this.spectrogramContext.fillStyle = '#000000';
        this.spectrogramContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.color1 = "#2E2D25";
        this.color2 = "#E75114";
        this.color3 = "#739BA6";
        this.threshold = 0.6;
        this.xZoom = 2;
        this.yZoom = 4;
    }

    interpolateHexColor(color1, color2, factor) {
        let c1 = parseInt(color1.slice(1), 16);
        let c2 = parseInt(color2.slice(1), 16);

        let r1 = (c1 >> 16) & 0xff;
        let g1 = (c1 >> 8) & 0xff;
        let b1 = c1 & 0xff;

        let r2 = (c2 >> 16) & 0xff;
        let g2 = (c2 >> 8) & 0xff;
        let b2 = c2 & 0xff;

        let r = Math.round(r1 + factor * (r2 - r1));
        let g = Math.round(g1 + factor * (g2 - g1));
        let b = Math.round(b1 + factor * (b2 - b1));

        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    getColor(value) {
        const percent = value / 255;
        let color;
        if (percent < this.threshold / 2) {
            color = this.interpolateHexColor(this.color1, this.color2, percent / (this.threshold / 2));
        } else if (percent < this.threshold) {
            color = this.interpolateHexColor(this.color2, this.color3, (percent - this.threshold / 2) / (this.threshold / 2));
        } else {
            color = this.color3;
        }
        return color;
    }

    draw() {
        requestAnimationFrame(() => this.draw());

        this.analyser.getByteFrequencyData(this.dataArray);

        // Shift the current spectrogram image left by xZoom pixels
        const shiftAmount = Math.ceil(this.xZoom);
        const imageData = this.spectrogramContext.getImageData(shiftAmount, 0, this.canvasWidth - shiftAmount, this.canvasHeight);
        this.spectrogramContext.putImageData(imageData, 0, 0);

        // Draw the new data at the right edge
        for (let i = 0; i < this.bufferLength; i++) {
            const value = this.dataArray[i];
            const height = (i / this.bufferLength) * this.canvasHeight * this.yZoom;
            const y = this.canvasHeight - height;
            this.spectrogramContext.fillStyle = this.getColor(value);
            this.spectrogramContext.fillRect(this.canvasWidth - shiftAmount, y, shiftAmount, 1);
        }
    }
}