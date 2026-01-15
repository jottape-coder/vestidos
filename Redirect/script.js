// =============================================
// ANIMAÇÕES DE SCROLL - Intersection Observer
// =============================================

/**
 * Configura o Intersection Observer para animar elementos ao entrar na viewport
 */
function initScrollAnimations() {
    // Seleciona todos os elementos com a classe fade-in-up
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    // Configurações do observer
    const observerOptions = {
        threshold: 0.1, // Elemento precisa estar 10% visível
        rootMargin: '0px 0px -50px 0px' // Margem para ativar antes
    };
    
    // Callback quando elemento entra/sai da viewport
    const observerCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Adiciona delay progressivo baseado na ordem
                const delay = index * 0.1; // 0.1s entre cada elemento
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 1000);
                
                // Para de observar o elemento após animar
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Cria o observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observa cada elemento
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// =============================================
// ANIMAÇÃO DOS BOTÕES CTA
// =============================================

/**
 * Adiciona efeitos interativos aos botões CTA
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.cta-button');
    
    buttons.forEach(button => {
        // Efeito de ripple ao clicar
        button.addEventListener('click', function(e) {
            // Cria elemento de ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            // Remove ripple após animação
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// =============================================
// SCROLL SUAVE PARA LINKS
// =============================================

/**
 * Implementa scroll suave para links âncora
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Ignora links vazios
            if (targetId === '#') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// =============================================
// ADICIONA ESTILO CSS PARA RIPPLE
// =============================================

/**
 * Injeta CSS para o efeito ripple dinamicamente
 */
function injectRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .cta-button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// =============================================
// LAZY LOADING DE IMAGENS
// =============================================

/**
 * Implementa lazy loading para imagens
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores antigos
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// =============================================
// CONTADOR DE TEMPO (OPCIONAL)
// =============================================

/**
 * Adiciona contador de tempo de urgência (opcional)
 */
function initUrgencyTimer() {
    const urgencyText = document.querySelector('.urgency-text');
    
    if (urgencyText) {
        // Timer de 15 minutos
        let timeInSeconds = 15 * 60;
        
        const updateTimer = () => {
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = timeInSeconds % 60;
            
            const originalText = urgencyText.textContent;
            
            // Adiciona timer ao texto se houver tempo restante
            if (timeInSeconds > 0) {
                timeInSeconds--;
                setTimeout(updateTimer, 1000);
            }
        };
        
        // Descomente para ativar o timer
        // updateTimer();
    }
}

// =============================================
// INICIALIZAÇÃO
// =============================================

/**
 * Inicializa todas as funcionalidades quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
    // Injeta estilos do ripple
    injectRippleStyles();
    
    // Inicializa animações
    initScrollAnimations();
    
    // Inicializa efeitos de botão
    initButtonEffects();
    
    // Inicializa scroll suave
    initSmoothScroll();
    
    // Inicializa lazy loading
    initLazyLoading();
    
    // Inicializa timer de urgência (opcional)
    // initUrgencyTimer();
    
    console.log('✅ Site carregado com sucesso!');
});

// =============================================
// PERFORMANCE: DEBOUNCE PARA SCROLL
// =============================================

/**
 * Função utilitária debounce para otimizar eventos de scroll
 */
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
