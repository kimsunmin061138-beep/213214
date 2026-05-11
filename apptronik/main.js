document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-text').forEach(el => {
        revealObserver.observe(el);
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero Reveal & Typing Animation
    const heroTitle = document.querySelector('#hero h1');
    const fullText = "지능의 미래";
    
    if (heroTitle) {
        heroTitle.textContent = ''; // Clear for typing
        let i = 0;
        
        const typeEffect = () => {
            if (i < fullText.length) {
                heroTitle.textContent += fullText.charAt(i);
                i++;
                setTimeout(typeEffect, 150);
            } else {
                heroTitle.classList.add('active');
                // Show other elements after typing
                document.querySelectorAll('#hero .reveal-text:not(h1)').forEach(el => {
                    el.classList.add('active');
                });
            }
        };
        
        setTimeout(typeEffect, 500);
    }

    // Mouse Responsive Parallax Effect
    const hero = document.getElementById('hero');
    const heroImg = document.querySelector('.hero-img');
    const detailContainer = document.querySelector('.viewer-container');
    const detailImg = document.querySelector('.detail-img');

    function applyParallax(e, container, image, intensity = 20) {
        if (!container || !image) return;
        
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        image.style.transform = `scale(1.1) translate(${x * intensity}px, ${y * intensity}px)`;
    }

    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            applyParallax(e, hero, heroImg, 30);
        });
    }

    if (detailContainer) {
        detailContainer.addEventListener('mousemove', (e) => {
            applyParallax(e, detailContainer, detailImg, 40);
        });
        
        detailContainer.addEventListener('mouseleave', () => {
            detailImg.style.transform = 'scale(1) translate(0, 0)';
        });
    }

    // Magnetic Buttons
    const buttons = document.querySelectorAll('.primary-btn, .secondary-btn, .cta-button');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            btn.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
});
