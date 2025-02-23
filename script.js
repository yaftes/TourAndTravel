document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');

    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navContainer.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navContainer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navContainer.classList.remove('active');
        }
    });

    // Close menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileMenuBtn.classList.remove('active');
            navContainer.classList.remove('active');
        }
    });

    // Slider functionality
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    let currentSlide = 0;
    const slideCount = slides.length;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
        
        // Update active state
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });

        // Reset and start progress
        resetProgress();
        startProgress();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Modify the auto-slide behavior to go back and forth
    let isForward = true;
    function autoSlide() {
        if (isForward) {
            if (currentSlide >= slideCount - 1) {
                isForward = false;
                currentSlide--;
            } else {
                currentSlide++;
            }
        } else {
            if (currentSlide <= 0) {
                isForward = true;
                currentSlide++;
            } else {
                currentSlide--;
            }
        }
        goToSlide(currentSlide);
    }

    // Update timing
    let slideInterval = setInterval(autoSlide, 2000);

    // Add after slider initialization
    let progressBar = document.querySelector('.progress');

    function startProgress() {
        progressBar.style.width = '0';
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 50);
    }

    function resetProgress() {
        progressBar.style.width = '0';
        progressBar.style.transition = 'none';
        setTimeout(() => {
            progressBar.style.transition = 'width 2s linear';
        }, 50);
    }

    // Update mouse events
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
        progressBar.style.width = progressBar.offsetWidth + 'px';
    });

    slider.addEventListener('mouseleave', () => {
        const remainingTime = (2000 * parseInt(progressBar.style.width)) / 100;
        progressBar.style.width = '100%';
        progressBar.style.transition = `width ${remainingTime}ms linear`;
        slideInterval = setInterval(autoSlide, 2000);
    });

    // Start progress on load
    startProgress();

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            nextSlide();
        } else if (touchEndX - touchStartX > 50) {
            prevSlide();
        }
    });

    // Add this to handle navbar visibility
    let lastScrollTop = 0;
    let navbar = document.querySelector('.navbar');
    let scrollThreshold = 100; // Only start hiding after scrolling 100px

    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > scrollThreshold) { // Only apply after scrolling down 100px
            if (currentScroll > lastScrollTop) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            // At the top - always show navbar
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScroll;
    });

    // Get all sections
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('nav a');

    // Update active nav item on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-container').classList.remove('active');
            document.querySelector('.mobile-menu-btn').classList.remove('active');
        });
    });
}); 