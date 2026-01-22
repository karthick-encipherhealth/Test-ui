/**
 * ============================================
 * Three.js Scene Setup - Animated Background
 * ============================================
 */

let scene, camera, renderer;
let particles, particleSystem;
let mouse = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };

// Initialize Three.js scene
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particle system
    createParticleSystem();
    
    // Create grid geometry
    createGrid();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Handle mouse movement
    document.addEventListener('mousemove', onMouseMove);
    
    // Start animation loop
    animate();
}

/**
 * Create particle system for background animation
 */
function createParticleSystem() {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0x00d4ff); // Blue
    const color2 = new THREE.Color(0x00ff88); // Green
    const color3 = new THREE.Color(0x8b5cf6); // Purple
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Random positions in a sphere
        const radius = 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
        
        // Random colors
        const colorChoice = Math.random();
        let color;
        if (colorChoice < 0.33) {
            color = color1;
        } else if (colorChoice < 0.66) {
            color = color2;
        } else {
            color = color3;
        }
        
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

/**
 * Create grid geometry for abstract background
 */
function createGrid() {
    const gridHelper = new THREE.GridHelper(20, 20, 0x2a2a2a, 0x1a1a1a);
    scene.add(gridHelper);
    
    // Add rotating wireframe geometry
    const geometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    
    const torus = new THREE.Mesh(geometry, material);
    torus.position.z = -5;
    scene.add(torus);
    
    // Store for animation
    scene.userData.torus = torus;
}

/**
 * Animation loop
 */
function animate() {
    requestAnimationFrame(animate);
    
    // Smooth mouse interpolation
    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;
    
    // Rotate particle system
    if (particleSystem) {
        particleSystem.rotation.x += 0.0005;
        particleSystem.rotation.y += 0.001;
        
        // Add mouse interaction
        particleSystem.rotation.y += mouse.x * 0.0001;
        particleSystem.rotation.x += mouse.y * 0.0001;
    }
    
    // Rotate torus
    if (scene.userData.torus) {
        scene.userData.torus.rotation.x += 0.01;
        scene.userData.torus.rotation.y += 0.015;
    }
    
    // Camera movement based on mouse
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

/**
 * Handle window resize
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Handle mouse movement
 */
function onMouseMove(event) {
    targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = (event.clientY / window.innerHeight) * 2 - 1;
}

/**
 * ============================================
 * Smooth Scroll Animations
 * ============================================
 */

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all animated elements
function initScrollAnimations() {
    // Section titles
    document.querySelectorAll('.section-title').forEach(el => {
        observer.observe(el);
    });
    
    // About text
    document.querySelectorAll('.about-text').forEach(el => {
        observer.observe(el);
    });
    
    // Skill cards
    document.querySelectorAll('.skill-card').forEach((el, index) => {
        setTimeout(() => {
            observer.observe(el);
        }, index * 50);
    });
    
    // Project cards
    document.querySelectorAll('.project-card').forEach((el, index) => {
        setTimeout(() => {
            observer.observe(el);
        }, index * 100);
    });
    
    // Timeline items
    document.querySelectorAll('.timeline-item').forEach((el, index) => {
        setTimeout(() => {
            observer.observe(el);
        }, index * 150);
    });
    
    // Contact links
    document.querySelectorAll('.contact-link').forEach((el, index) => {
        setTimeout(() => {
            observer.observe(el);
        }, index * 100);
    });
}

/**
 * ============================================
 * Navigation Functionality
 * ============================================
 */

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * ============================================
 * Skill Card Interactions
 * ============================================
 */

function initSkillInteractions() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add glow effect
            card.style.boxShadow = '0 10px 40px rgba(0, 212, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });
}

/**
 * ============================================
 * Parallax Effect for Hero Section
 * ============================================
 */

function initParallax() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${rate}px)`;
            hero.style.opacity = 1 - scrolled / window.innerHeight;
        }
    });
}

/**
 * ============================================
 * Initialize Everything
 * ============================================
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js
    if (typeof THREE !== 'undefined') {
        initThreeJS();
    } else {
        console.error('Three.js library not loaded');
    }
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize skill interactions
    initSkillInteractions();
    
    // Initialize parallax
    initParallax();
    
    // Add smooth page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

/**
 * ============================================
 * Performance Optimization
 * ============================================
 */

// Throttle scroll events for better performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll-heavy functions
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations are handled by IntersectionObserver
    // which is already optimized
}, 16)); // ~60fps

