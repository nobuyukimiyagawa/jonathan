document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active'); // Add active class to button too
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            nav.classList.remove('active'); // Close menu on click

            // Reset hamburger icon
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Effect for Header
    const header = document.querySelector('.site-header');
    const mainHero = document.querySelector('.hero'); // Check for index hero

    window.addEventListener('scroll', () => {
        let threshold = 100; // Default for subpages
        if (mainHero) {
            threshold = window.innerHeight * 0.8; // Index page behavior
        }

        if (window.scrollY > threshold) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // Hero Video Slider
    const heroVideos = document.querySelectorAll('.hero-video');
    if (heroVideos.length > 0) {
        let currentVideoIndex = 0;

        setInterval(() => {
            // Remove active class from current
            heroVideos[currentVideoIndex].classList.remove('active');

            // Calculate next index
            currentVideoIndex = (currentVideoIndex + 1) % heroVideos.length;

            // Add active class to next
            heroVideos[currentVideoIndex].classList.add('active');
        }, 7000); // Switch every 7 seconds
    }
});

// Fix for Safari Back/Forward Cache (BFCache)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        document.querySelectorAll('.fade-in-section').forEach(section => {
            section.classList.add('is-visible');
        });
    }
});
