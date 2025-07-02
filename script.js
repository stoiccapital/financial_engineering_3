// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('nav__toggle--active');
        navMenu.classList.toggle('nav__menu--active');
    });
    
    // Close menu when clicking on a nav link (mobile)
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('nav__toggle--active');
            navMenu.classList.remove('nav__menu--active');
        });
    });
    
    // Close menu when clicking outside (mobile)
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('nav__menu--active')) {
            navToggle.classList.remove('nav__toggle--active');
            navMenu.classList.remove('nav__menu--active');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('nav__toggle--active');
            navMenu.classList.remove('nav__menu--active');
        }
    });
}); 