window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// Synchronize paired videos in Phase 2
function synchronizeVideoPairs() {
    const pairs = [
        ['phase2-video3', 'phase2-video4'],
        ['phase2-video5', 'phase2-video6'],
        ['phase2-video7', 'phase2-video8']
    ];

    pairs.forEach(pair => {
        const video1 = document.getElementById(pair[0]);
        const video2 = document.getElementById(pair[1]);

        if (!video1 || !video2) return;

        let isPaused = false;

        // When either video ends, pause both and restart together
        function handleVideoEnd(e) {
            if (isPaused) return;

            isPaused = true;
            video1.pause();
            video2.pause();

            // Wait a bit, then restart both videos together
            setTimeout(() => {
                video1.currentTime = 0;
                video2.currentTime = 0;

                Promise.all([
                    video1.play(),
                    video2.play()
                ]).then(() => {
                    isPaused = false;
                }).catch(err => {
                    console.log('Autoplay prevented:', err);
                    isPaused = false;
                });
            }, 100);
        }

        video1.addEventListener('ended', handleVideoEnd);
        video2.addEventListener('ended', handleVideoEnd);

        // Ensure both videos start together
        video1.addEventListener('loadedmetadata', () => {
            video1.currentTime = 0;
        });
        video2.addEventListener('loadedmetadata', () => {
            video2.currentTime = 0;
        });
    });
}

// Match video heights
function matchVideoHeights() {
    // Match Phase 3 video 10 height to video 9
    const video9 = document.getElementById('phase3-video9');
    const video10 = document.getElementById('phase3-video10');

    function setVideo10Height() {
        if (video9 && video10) {
            const height9 = video9.offsetHeight;
            video10.style.height = height9 + 'px';
            video10.style.width = 'auto';
        }
    }

    if (video9 && video10) {
        // Wait for video 9 metadata to load
        video9.addEventListener('loadedmetadata', setVideo10Height);

        // Also wait for video 10 metadata
        video10.addEventListener('loadedmetadata', setVideo10Height);

        // In case metadata is already loaded
        if (video9.readyState >= 1) {
            setVideo10Height();
        }

        // Extra check after a short delay
        setTimeout(setVideo10Height, 100);
    }

    // Match hero video height to image
    const heroImage = document.querySelector('.hero.teaser .image img');
    const heroVideo = document.getElementById('hero-video');

    if (heroImage && heroVideo) {
        // Wait for image to load
        if (heroImage.complete) {
            const imageHeight = heroImage.offsetHeight;
            heroVideo.style.height = imageHeight + 'px';
        } else {
            heroImage.addEventListener('load', function() {
                const imageHeight = heroImage.offsetHeight;
                heroVideo.style.height = imageHeight + 'px';
            });
        }
    }
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    bulmaSlider.attach();

    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

    // Match video heights
    matchVideoHeights();

    // Re-match on window resize
    window.addEventListener('resize', matchVideoHeights);

    // Synchronize Phase 2 video pairs
    synchronizeVideoPairs();

})
