const block = document.getElementById('block');
const fill = document.getElementById('fill');
const pitchValue = document.getElementById('pitch-value');

let isDragging = false;

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
