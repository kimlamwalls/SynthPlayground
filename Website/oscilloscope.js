class Oscilloscope {
    constructor(analyser, debug, svg, fps) {
        this.analyser = analyser;
        this.debug = debug;
        this.svg = svg;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.lastDrawTime = performance.now();
        this.draw = this.draw.bind(this); // Bind the draw method
        this.oscilloscopeFPS = fps; // Frames per second for oscilloscope
    }

    init() {
        this.lastDrawTime = performance.now();
        this.draw(); // Start the drawing loop
    }

    draw(fps, zoomFactor, sliceWidth, audioSource, svgID) {
        {
            const now = performance.now();
            const elapsed = now - this.lastDrawTime;
            const fpsInterval = 1000 / this.oscilloscopeFPS;
            if (elapsed > fpsInterval) {
                this.lastDrawTime = now - (elapsed % fpsInterval);
                this.analyser.getByteTimeDomainData(this.dataArray);
                // Clear previous SVG content
                while (this.svg.firstChild) {
                    this.svg.removeChild(this.svg.firstChild);
                }
                const zoomFactor = 0.1; // Zoom in/out
                const sliceWidth = (this.svg.width.baseVal.value) / (this.bufferLength * zoomFactor);
                let x = 0;

                const pathData = ['M', 0, (this.svg.height.baseVal.value / 2) + ((this.dataArray[0] / 128.0 - 1) * (this.svg.height.baseVal.value / 2))];
                for (let i = 1; i < this.bufferLength; i++) {
                    const v = this.dataArray[i] / 128.0;
                    const y = (this.svg.height.baseVal.value / 2) + ((v - 1) * (this.svg.height.baseVal.value / 2));
                    pathData.push('L', x, y);
                    x += sliceWidth;
                }
                const pathString = pathData.join(' ');
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', pathString);
                path.setAttribute('class', 'oscilloscope-path'); // Assign a class to the path
                this.svg.appendChild(path);
            }
            requestAnimationFrame(this.draw);
        }
    }
}
