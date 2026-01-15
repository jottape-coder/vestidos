// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// INTERSECTION OBSERVER FOR SCROLL REVEALS
// ===================================
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Only animate once
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with fade-in and fade-in-fast classes
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-fast');
    fadeElements.forEach(el => observer.observe(el));
});

// ===================================
// STICKY CTA BUTTON (OPTIONAL)
// ===================================
let lastScrollTop = 0;
const stickyThreshold = 800;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // You can add sticky CTA logic here if needed
    // For now, keeping it simple without sticky elements

    lastScrollTop = scrollTop;
});

// ===================================
// BUTTON CLICK TRACKING (OPTIONAL)
// ===================================
document.querySelectorAll('.btn-cta').forEach(button => {
    button.addEventListener('click', (e) => {
        // Add a subtle pulse effect on click
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);

        // You can add analytics tracking here
        console.log('CTA button clicked');
    });
});

// ===================================
// LAZY LOADING FOR IMAGES (PERFORMANCE)
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// ADD ENTRANCE ANIMATIONS STAGGER
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Stagger logic removed for faster display
});

// ===================================
// PRICING CARD HIGHLIGHT ON HOVER
// ===================================
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', () => {
        card.style.zIndex = '1';
    });
});

// ===================================
// FEATURE CARDS TILT EFFECT (SUBTLE)
// ===================================
document.querySelectorAll('.feature-card, .bonus-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===================================
// COUNTDOWN TIMER (OPTIONAL - FOR URGENCY)
// ===================================
function startCountdown(duration, element) {
    if (!element) return;

    let timer = duration;
    const interval = setInterval(() => {
        const hours = Math.floor(timer / 3600);
        const minutes = Math.floor((timer % 3600) / 60);
        const seconds = timer % 60;

        element.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (--timer < 0) {
            clearInterval(interval);
            element.textContent = '00:00:00';
        }
    }, 1000);
}

// Example usage (uncomment if you add a countdown element):
// const countdownElement = document.querySelector('.countdown-timer');
// if (countdownElement) {
//     startCountdown(24 * 60 * 60, countdownElement); // 24 hours
// }

// ===================================
// FAQ ACCORDION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle current FAQ
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
});

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c🎨 Landing Page de Moldes de Vestidos', 'font-size: 20px; font-weight: bold; color: #667EEA;');
console.log('%c✅ Todos os recursos carregados com sucesso!', 'font-size: 14px; color: #48BB78;');
