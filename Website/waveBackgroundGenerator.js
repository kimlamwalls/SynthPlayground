class WaveBackgroundGenerator {
    constructor(svgSelector) {
        this.svg = document.querySelector(svgSelector);
        this.vh = window.innerHeight; // used for viewport height to calculate vertical position
        this.baseAmplitude = 250;
        this.baseFrequency1 = 0.4;
        this.baseFrequency2 = 0.15;
        this.baseFrequency3 = 0.007;
        this.phase = Math.PI / 4;
        this.scale = 17;
        this.speed = 0.003;
        this.layers = 13;
        this.layerXOffset = 18;
        this.layerYOffset = 9;
        this.amplitudeOffset = 5;
        this.colors = [
            '#FAFAFA', '#F7F7F7', '#F2F2F2', '#EBEBEB', '#E2E2E2',
            '#D6D6D6', '#D3D8DB', '#CBD6DE', '#C5DDE6', '#F7C6B2',
            '#F7C6B2', '#F7C6B2', '#F7C6B2'
        ];
        this.phaseLayerOffset = 0.3; // Phase layer offset for shifting x position of layers
        this.stepSize = 0.3; // Step size for higher or lower resolution
        this.time = 0; // Initialize the time variable for animation timekeeping
        this.wavePaths = this.initWavePaths(this.layers, this.colors);
        this.variances = this.generateVariances(this.layers);
        this.initialY = this.calculateInitialY();
        this.wavePaths.forEach(path => this.svg.appendChild(path));
        this.animateWave(); // Start the animation
    }

    // Initialize the SVG paths for each layer and return the paths array
    initWavePaths(layers, colors) {
        const wavePaths = [];
        for (let i = 0; i < layers; i++) {
            const wavePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            wavePath.setAttribute('fill', 'none');
            wavePath.setAttribute('stroke', colors[i % colors.length]);
            wavePath.setAttribute('class', 'wave-paths');
            wavePaths.push(wavePath);
        }
        return wavePaths;
    }

    generateVariances(layers) {
        const variances = [];
        for (let i = 0; i < layers; i++) {
            const variance = {
                amplitudeVariance: this.baseAmplitude + i * this.amplitudeOffset,
                frequency1Variance: this.baseFrequency1,
                frequency2Variance: this.baseFrequency2,
                frequency3Variance: this.baseFrequency3,
            };
            variances.push(variance);
        }
        return variances;
    }

    // Calculate position of the initial Y based on viewport height
    calculateInitialY() {
        const totalHeight = this.layerYOffset * (this.layers * 2);
        return (this.vh / 2) - (totalHeight / 2);
    }

    // Draw paths for each wave layer
    drawPaths() {
        this.wavePaths.forEach((path, index) => {
            const variance = this.variances[index];
            const yPos = this.initialY + this.layerYOffset * index;
            let pathData = `M ${index * this.layerXOffset} ${yPos} `;
            for (let i = 0; i <= 100; i += this.stepSize) {
                const x = i * this.scale + index * this.layerXOffset;
                const y = yPos + variance.amplitudeVariance * Math.sin(variance.frequency1Variance * i + this.phase + this.time + index * this.phaseLayerOffset)
                    * Math.cos(variance.frequency2Variance * i) * Math.sin(variance.frequency3Variance * i);
                pathData += `L ${x} ${y} `;
            }
            path.setAttribute('d', pathData);
        });
    }

    // Animate the waves recursively using the requestAnimationFrame API
    animateWave() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.time += this.speed;
            this.drawPaths();
        }
        animate();
    }

    // Update viewport dimensions and redraw paths on window resize
    updateViewport() {
        this.vh = window.innerHeight;
        this.initialY = this.calculateInitialY();
        this.drawPaths();
    }
}