let audioEngine = null;


class ControlFactory {
    constructor() {

    }
}

const controlFactory = new ControlFactory();

function typingAnimationEffect(element, text, i = 0) {
    const typingSpeed = 4;
    if (i < text.length) {
        // Check for linebreak and add all at once so it displays correctly
        if (text.substring(i, i + 4) === '<br>') {
            element.innerHTML += '<br>';
            i += 4;
        } else {
            element.innerHTML += text[i];
            i++;
        }
        setTimeout(() => typingAnimationEffect(element, text, i), typingSpeed);
    }
}


document.addEventListener('DOMContentLoaded', () => {

    /* Navigation buttons*/
    const nextModuleButton = document.querySelector('#next-module-button');
    const previousModuleButton = document.querySelector('#previous-module-button');
    const introductionLink = document.querySelector('#introduction-link');
    const oscillatorLink = document.querySelector('#oscillator-link');
    const filterLink = document.querySelector('#filter-link');

    /*======================= Module Content =======================*/
    const moduleInfoHeading = document.querySelector('#module-info-heading');
    const moduleInfoText = document.querySelector('#module-text');
    const interactiveModuleHeading = document.querySelector('#interactive-module-heading');
    const interactiveModule = document.querySelector('#interactive-module');
    const interactiveModuleContent = document.querySelector('#interactive-module-content');

    function introductionModule() {
        resetLinks();
        introductionLink.classList.add('current-link');
        moduleInfoHeading.innerHTML = '';
        moduleInfoText.innerHTML = '';
        const headingText = 'Introduction';
        const text = 'This is a hands-on introduction into the world of musical synthesizers.<br><br>Here you will be able to experiment and play with the basic components that make up a synthesizer.<br><br>Make sure your sound is turned on. Click/tap the box to test!';
        typingAnimationEffect(moduleInfoHeading, headingText);
        typingAnimationEffect(moduleInfoText, text);
        interactiveModuleHeading.innerHTML = 'Try it out!';
        interactiveModuleContent.innerHTML = `<p class = "module-text">Click the button below to test!<br><br>You should hear a sound, if you don't check your audio settings.</p>`;
        const bloopButton = document.createElement('button');
        bloopButton.classList.add('bloop-button');
        bloopButton.classList.add('workshop-button');
        bloopButton.innerHTML = 'Click Me!';
        interactiveModuleContent.appendChild(bloopButton);
        bloopButton.addEventListener('pointerdown', bloop);
        /*hide next module button*/
        previousModuleButton.style.display = 'none';
        nextModuleButton.style.display = 'block';
    }

    function oscillatorModule() {
        resetLinks();
        /*wait a tic before making sound to avoid js warnings*/
        setTimeout(() => {
            initAudioEngine();
        }, 160);
        oscillatorLink.classList.add('current-link');
        moduleInfoHeading.innerHTML = '';
        moduleInfoText.innerHTML = '';
        const headingText = 'Oscillator';
        const text = 'In sound synthesis, an oscillator is a constant steady signal/vibration we hear as a single pitch. <br> <br> ' +
            '<br>The shape of the waveform determines its character, try the different wave shapes and see if you can hear the difference!';
        typingAnimationEffect(moduleInfoHeading, headingText);
        typingAnimationEffect(moduleInfoText, text);
        interactiveModuleHeading.innerHTML = 'Interactive Oscillator';
        interactiveModuleContent.innerHTML = `
           <sl-switch class="workshop-switch"">Oscillator On/Off</sl-switch>
            <sl-range id="pitch-slider" label="Pitch Control (Hz)" max="1800" min="30" step="1" value="220"></sl-range>
            <sl-radio-group id="waveform-group" label="Select a waveform" name="waveform-group" value="sawtooth">
                <sl-radio-button checked name="waveform" value="sawtooth">Sawtooth</sl-radio-button>
                <sl-radio-button name="waveform" value="sine">Sine</sl-radio-button>
                <sl-radio-button name="waveform" value="square">Square</sl-radio-button>
                <sl-radio-button name="waveform" value="triangle">Triangle</sl-radio-button>
            </sl-radio-group> 
        `+ drawWaveformHTML(); /*Programmatically draw content to avoid repetition*/

        /*connect audio controls*/
        const pitchControl = document.querySelector('#pitch-slider');
        const waveformGroup = document.getElementById('waveform-group');
        const bigSwitch = document.querySelector('.workshop-switch');

        pitchControl.addEventListener('input', () => audioEngine.changePitch(pitchControl.value));
        waveformGroup.addEventListener('sl-change', function (event) {
            const currentValue = event.target.value;
            audioEngine.setWaveform(currentValue);
            /*remove active class from all waveform icons*/
            document.querySelectorAll('.waveform-icon').forEach(icon => icon.classList.remove('active'));
            /*select active waveform icon and add active class*/
            document.querySelector(`#${currentValue}`).classList.add('active');
        });
        bigSwitch.addEventListener('sl-change', () => audioEngine.toggleVCA());
        previousModuleButton.style.display = 'block'
    }


    function updateFill(event) {
        const blockRect = block.getBoundingClientRect();
        const clickPosition = (event.clientX || event.touches[0].clientX) - blockRect.left;
        const blockWidth = blockRect.width;

        // Ensure click position is within bounds
        const fillPercentage = Math.min(Math.max((clickPosition / blockWidth) * 100, 0), 100);
        fill.style.width = `${fillPercentage}%`;

        // Update the pitch value based on the fill percentage
        pitchValue.textContent = Math.round(fillPercentage);
    }
    const block = document.getElementById('block');
    const fill = document.getElementById('fill');
    const pitchValue = document.getElementById('pitch-value');

    block.addEventListener('mousedown', function(event) {
        isDragging = true;
        updateFill(event);
    });

    block.addEventListener('touchstart', function(event) {
        isDragging = true;
        updateFill(event);
    });

    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            updateFill(event);
        }
    });

    document.addEventListener('touchmove', function(event) {
        if (isDragging) {
            updateFill(event);
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    document.addEventListener('touchend', function() {
        isDragging = false;
    });

    function filterModule() {
        resetLinks();
        /*wait a tic before making sound to avoid js warnings*/
        setTimeout(() => {
            initAudioEngine();
            audioEngine.changePitch(550);
        }, 160);
        filterLink.classList.add('current-link');
        moduleInfoHeading.innerHTML = '';
        moduleInfoText.innerHTML = '';
        const moduleInfoHeadingText = 'Filter';
        const moduleInfoTextText = '' +
            'A filter is used to shape the overtones (harmonics) after the oscillator. <br> <br>' +
            'The filter cutoff determines the frequency at which the overtones are cut off. <br>' +
            '<br> ' +
            'A higher cutoff frequency will result in a sharper waveform. ' +
            'Filter Q determines the curve of the resulting cutoff.';
        typingAnimationEffect(moduleInfoHeading, moduleInfoHeadingText);
        typingAnimationEffect(moduleInfoText, moduleInfoTextText);
        interactiveModuleHeading.innerHTML = 'Interactive filter';
        interactiveModuleContent.innerHTML = `
           <sl-switch class="workshop-switch"">Oscillator On/Off</sl-switch>
            <sl-radio-group id="waveform-group" label="Select a waveform" name="waveform-group" value="sawtooth">
                <sl-radio-button name="waveform" value="sawtooth" checked>Sawtooth</sl-radio-button>
                <sl-radio-button name="waveform" value="sine">Sine</sl-radio-button>
                <sl-radio-button name="waveform" value="square">Square</sl-radio-button>
                <sl-radio-button name="waveform" value="triangle">Triangle</sl-radio-button>
            </sl-radio-group>
            `+ drawWaveformHTML() /*Programmatically draw content to avoid repetition*/ +`
            <sl-range id="filter-cutoff" label="Filter Cutoff (Hz)" min="30" max="5000" step="1" value="1000"></sl-range>    
            <sl-range id="filter-Q" label="Filter Q" min="0" max="30" step="0.1" value="1"></sl-range>
            <!--SVGS for waveforms-->
            `;
        /*connect audio controls*/
        const waveformGroup = document.getElementById('waveform-group');
        const filterCutoffSlider = document.querySelector('#filter-cutoff');
        const filterQ = document.querySelector('#filter-Q');
        const bigSwitch = document.querySelector('.workshop-switch');
        bigSwitch.addEventListener('sl-change', () => audioEngine.toggleVCA());
        filterCutoffSlider.addEventListener('input', () => audioEngine.changeFilterCutoff(filterCutoffSlider.value));
        filterQ.addEventListener('input', () => audioEngine.changeFilterQ(filterQ.value));
        waveformGroup.addEventListener('sl-change', function (event) {
            const currentValue = event.target.value;
            audioEngine.setWaveform(currentValue);
        });
        /*hide next module button*/
        nextModuleButton.style.display = 'none';
    }

    function nextModule() {
        const currentModule = moduleInfoHeading.innerHTML;
        if (currentModule === 'Introduction') {
            oscillatorModule();
        } else if (currentModule === 'Oscillator') {
            filterModule();
        }
    }

    function previousModule() {
        const currentModule = moduleInfoHeading.innerHTML;
        if (currentModule === 'Oscillator') {
            introductionModule();
        } else if (currentModule === 'Filter') {
            oscillatorModule();
        }
    }

    function resetLinks() {
        introductionLink.classList.remove('current-link');
        oscillatorLink.classList.remove('current-link');
        filterLink.classList.remove('current-link');
    }

    function startOscillator() {
        audioEngine.startOscillator();
    }

    function resetOscillator() {
        audioEngine.stopOscillator();
        startOscillator();
        audioEngine.triggerCloseVCAFast();
    }

    /*loads audio engine and starts oscillator silently*/
    function initAudioEngine() {
        if (audioEngine === null) {
            audioEngine = new AudioEngine(true);
            audioEngine.loadImpulseResponse('audio/impulse-response.wav').then(() => {
                if (audioEngine.debug) console.log('Impulse response loaded and convolver connected successfully.');
            });
            audioEngine.startOscillator();
            audioEngine.triggerCloseVCAFast();
        } else {
            resetOscillator();
        }
    }

    function bloop() {
        /*wait a tic before making sound to avoid js warnings*/
        setTimeout(() => {
            initAudioEngine();
            audioEngine.bloop();
        }, 130);
        interactiveModule.classList.add('flash');
        interactiveModule.addEventListener('animationend', () => {
            interactiveModule.classList.remove('flash');
        });
    }

    nextModuleButton.addEventListener('pointerdown', nextModule);
    previousModuleButton.addEventListener('pointerdown', previousModule);
    introductionLink.addEventListener('pointerdown', introductionModule);
    oscillatorLink.addEventListener('pointerdown', oscillatorModule);
    filterLink.addEventListener('pointerdown', filterModule);

    /* Initial module Load */
    introductionModule();

    /*draws waveforms in HTML*/
    function drawWaveformHTML() {
        return `
    <div class="waveforms-container">
      <svg class="waveform-icon active" fill="none" id="sawtooth" viewBox="0 0 241 139" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 104.58L120.487 36V104.58" stroke="#083745" stroke-linecap="round" stroke-width="15"/>
        <path d="M120.487 104.58L224.974 36V104.58" stroke="#083745" stroke-linecap="round" stroke-width="15"/>
      </svg>
      <svg class="waveform-icon" fill="none" id="sine" viewBox="0 0 241 139" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 105.136L24.647 105.072L25.294 104.974L25.9409 104.84L26.5879 104.672L27.2349 104.469L27.8819 104.232L28.5288 103.96L29.1758 103.655L29.8228 103.316L30.4698 102.943L31.1167 102.538L31.7637 102.1L32.4107 101.63L33.0577 101.129L33.7047 100.596L34.3516 100.033L34.9986 99.4394L35.6456 98.8166L36.2926 98.1649L36.9395 97.4851L37.5865 96.7777L38.2335 96.0435L38.8805 95.2831L39.5274 94.4974L40.1744 93.6871L40.8214 92.853L41.4684 91.996L42.1154 91.1168L42.7623 90.2164L43.4093 89.2956L44.0563 88.3554L44.7033 87.3966L45.3502 86.4203L45.9972 85.4273L46.6442 84.4187L47.2912 83.3955L47.9381 82.3586L48.5851 81.3091L49.2321 80.2481L49.8791 79.1765L50.5261 78.0954L51.173 77.006L51.82 75.9092L52.467 74.8062L53.114 73.698L53.7609 72.5858L54.4079 71.4706L55.0549 70.3535L55.7019 69.2357L56.3488 68.1182L56.9958 67.0021L57.6428 65.8886L58.2898 64.7788L58.9368 63.6737L59.5837 62.5744L60.2307 61.482L60.8777 60.3976L61.5247 59.3223L62.1716 58.2572L62.8186 57.2031L63.4656 56.1614L64.1126 55.1328L64.7596 54.1185L65.4065 53.1195L66.0535 52.1367L66.7005 51.1712L67.3475 50.2238L67.9944 49.2955L68.6414 48.3872L69.2884 47.4999L69.9354 46.6343L70.5823 45.7914L71.2293 44.9719L71.8763 44.1768L72.5233 43.4067L73.1702 42.6625L73.8172 41.9448L74.4642 41.2544L75.1112 40.592L75.7582 39.9581L76.4051 39.3535L77.0521 38.7788L77.6991 38.2344L78.3461 37.721L78.993 37.239L79.64 36.7889L80.287 36.3712L80.934 35.9862L81.5809 35.6345L82.2279 35.3162L82.8749 35.0317L83.5219 34.7814L84.1689 34.5653L84.8158 34.3839L85.4628 34.2372L86.1098 34.1253L86.7568 34.0485L87.4037 34.0067L88.0507 34L88.6977 34.0284L89.3447 34.092L89.9917 34.1905L90.6386 34.324L91.2856 34.4923L91.9326 34.6952L92.5796 34.9325L93.2265 35.204L93.8735 35.5095L94.5205 35.8486L95.1675 36.2209L95.8144 36.6262L96.4614 37.064L97.1084 37.5339L97.7554 38.0355L98.4024 38.5681L99.0493 39.1314L99.6963 39.7247L100.343 40.3475L100.99 40.9992L101.637 41.679L102.284 42.3864L102.931 43.1206L103.578 43.881L104.225 44.6667L104.872 45.477L105.519 46.3111L106.166 47.1681L106.813 48.0473L107.46 48.9477L108.107 49.8685L108.754 50.8087L109.401 51.7675L110.048 52.7438L110.695 53.7368L111.342 54.7454L111.989 55.7686L112.636 56.8055L113.283 57.855L113.93 58.916L114.577 59.9876L115.224 61.0687L115.871 62.1581L116.518 63.2549L117.165 64.3579L117.812 65.4661L118.459 66.5783L119.106 67.6935L119.753 68.8106L120.4 69.9284L121.047 71.0459L121.694 72.162L122.34 73.2755L122.987 74.3853L123.634 75.4904L124.281 76.5897L124.928 77.6821L125.575 78.7664L126.222 79.8418L126.869 80.9069L127.516 81.9609L128.163 83.0027L128.81 84.0313L129.457 85.0456L130.104 86.0446L130.751 87.0274L131.398 87.9929L132.045 88.9403L132.692 89.8686L133.339 90.7769L133.986 91.6642L134.633 92.5298L135.28 93.3727L135.927 94.1921L136.574 94.9873L137.221 95.7574L137.868 96.5016L138.515 97.2193L139.162 97.9097L139.809 98.5721L140.456 99.206L141.103 99.8106L141.75 100.385L142.397 100.93L143.044 101.443L143.691 101.925L144.338 102.375L144.985 102.793L145.632 103.178L146.279 103.53L146.926 103.848L147.573 104.132L148.22 104.383L148.867 104.599L149.514 104.78L150.16 104.927L150.807 105.039L151.454 105.116L152.101 105.157L152.748 105.164L153.395 105.136L154.042 105.072L154.689 104.974L155.336 104.84L155.983 104.672L156.63 104.469L157.277 104.232L157.924 103.96L158.571 103.655L159.218 103.316L159.865 102.943L160.512 102.538L161.159 102.1L161.806 101.63L162.453 101.129L163.1 100.596L163.747 100.033L164.394 99.4394L165.041 98.8166L165.688 98.1649L166.335 97.4851L166.982 96.7777L167.629 96.0435L168.276 95.2831L168.923 94.4974L169.57 93.6871L170.217 92.853L170.864 91.996L171.511 91.1168L172.158 90.2164L172.805 89.2956L173.452 88.3554L174.099 87.3966L174.746 86.4203L175.393 85.4273L176.04 84.4187L176.687 83.3955L177.334 82.3586L177.981 81.3091L178.628 80.2481L179.274 79.1765L179.921 78.0954L180.568 77.006L181.215 75.9092L181.862 74.8062L182.509 73.698L183.156 72.5858L183.803 71.4706L184.45 70.3535L185.097 69.2357L185.744 68.1182L186.391 67.0021L187.038 65.8886L187.685 64.7788L188.332 63.6737L188.979 62.5744L189.626 61.482L190.273 60.3976L190.92 59.3223L191.567 58.2572L192.214 57.2031L192.861 56.1614L193.508 55.1328L194.155 54.1185L194.802 53.1195L195.449 52.1367L196.096 51.1712L196.743 50.2238L197.39 49.2955L198.037 48.3872L198.684 47.4999L199.331 46.6343L199.978 45.7914L200.625 44.9719L201.272 44.1768L201.919 43.4067L202.566 42.6625L203.213 41.9448L203.86 41.2544L204.507 40.592L205.154 39.9581L205.801 39.3535L206.448 38.7788L207.094 38.2344L207.741 37.721L208.388 37.239L209.035 36.7889L209.682 36.3712L210.329 35.9862L210.976 35.6345L211.623 35.3162L212.27 35.0317L212.917 34.7814L213.564 34.5653L214.211 34.3839L214.858 34.2372L215.505 34.1253L216.152 34.0485L216.799 34.0067L217.446 34L218.093 34.0284L218.74 34.092" stroke="#083745" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="15"/>
      </svg>
      <svg class="waveform-icon" fill="none" id="square" viewBox="0 0 241 139" xmlns="http://www.w3.org/2000/svg">
        <path d="M120.697 102.698L120.697 38L185.395 38" stroke="#083745" stroke-linecap="round" stroke-width="15"/>
        <path d="M120.698 102.698H56V38" stroke="#083745" stroke-linecap="round" stroke-width="15"/>
        <path d="M120.697 38.0015L185.395 38.0015L185.395 102.699" stroke="#083745" stroke-linecap="round" stroke-width="15"/>
      </svg>
      <svg class="waveform-icon" fill="none" id="triangle" viewBox="0 0 241 139" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_620_420)">
          <path d="M29.1495 105.051L74.9006 39.0007L120.646 105.051" stroke="#083745" stroke-linecap="round" stroke-width="15"/>
          <path d="M121.02 105.051L166.771 39.0007L212.516 105.051" stroke="#083745" stroke-linecap="round" stroke-width="15"/>
        </g>
        <defs>
          <clipPath id="clip0_620_420">
            <rect fill="white" height="139" width="241"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  `;
    }

});

