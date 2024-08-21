function scrollToSection(sectionID) {
    const section = document.getElementById(sectionID);
    const y = section.getBoundingClientRect().top;
    window.scrollTo({top: y, behavior: 'smooth'});
}


//Scroll to the top of the document for the back to top button
function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Toggle the visibility of the back to top button and scroll down button
function toggleVisibility(button, intialDisplayBoolean) {
    const scrollThreshold = 100;
    let shouldShowButton;
    if (intialDisplayBoolean) {
        shouldShowButton = document.body.scrollTop <= scrollThreshold && document.documentElement.scrollTop <= scrollThreshold;
    } else {
        shouldShowButton = document.body.scrollTop > scrollThreshold || document.documentElement.scrollTop > scrollThreshold;
    }
    if (shouldShowButton) {
        button.style.opacity = "1";           // Set opacity to fully visible
        button.style.pointerEvents = "auto";  // Make button clickable
    } else {
        button.style.opacity = "0";           // Fade out button
        button.style.pointerEvents = "none";  // Make button un-clickable
    }
}

const eventDetails = [{
    title: "Come and try evening",
    date: "January 15",
    description: "Please join us for a beginner-friendly hands on session, we will have a collection of our staff and volunteers present, happy to give guidance and answer any questions you have. The focus will be on having fun and experimenting. Come and play with our catalogue of synthesizers!"
}, {
    title: "Suzanne Ciani - In Conversation",
    date: "February 3",
    description: "A performance and Q&A session with Suzanne Ciani, a renowned international composer and performer. Pushing the boundaries of what is possible with electronic music."
}, {
    title: "Intermediate Class",
    date: "February 9",
    description: "For those members who have some experience with synthesizers or who have previously attended some classes. A similar semi-supervised session, our staff and volunteers will help you with anything you would like to work on."
}]


// Initialize the wave background and audio engine when the document is loaded
document.addEventListener('DOMContentLoaded', () => {

    /*add event listener for hamburger menu*/
    const hamburgerMenu = document.querySelector('.mobile-nav-button');
    hamburgerMenu.addEventListener('click', () => {
        const mobileNav = document.querySelector('.mobile-nav');
        mobileNav.classList.toggle('menu-open');
    });
    const waveBackground = new WaveBackgroundGenerator('.wave-container');
    waveBackground.animateWave();
    // if window is resized, reposition the wave
    document.addEventListener('resize', () => {
        waveBackground.updateViewport(); // Update viewport dimensions and redraw paths (maybe not working since refactor)
    });
    // Set references to buttons to hide/show them when scrolling
    const scrollDownButton = document.getElementById('scroll-down-button');
    const backToTopButton = document.getElementById('back-to-top-button');
    // Event listener for scroll events
    window.onscroll = function () {
        toggleVisibility(backToTopButton, false);
        toggleVisibility(scrollDownButton, true);
    };
    const eventCards = document.querySelectorAll('.event-card-short');
    const eventDetailsTitle = document.getElementById('event-details-title');
    const eventDetailsDate = document.getElementById('event-details-date');
    const eventDescription = document.getElementById('event-description');
    eventCards.forEach((eventCard, index) => {
        eventCard.addEventListener('click', () => {
            eventCards.forEach(card => card.classList.remove('active'));
            eventCard.classList.toggle('active');
            eventDetailsTitle.innerText = eventDetails[index].title;
            eventDetailsDate.innerText = eventDetails[index].date;
            eventDescription.innerText = eventDetails[index].description;
        });
    });
});

