// 🌿 Enhanced Immersive Cannabis Events Platform

// Enhanced Navigation System
function initializeImmersiveNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            navButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Add celebration effect
            createCelebrationBurst(btn);
            
            // Get view to show
            const view = btn.dataset.view;
            showView(view);
            
            // Add haptic feedback simulation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
        
        // Add hover effects
        btn.addEventListener('mouseenter', () => {
            createSparkleEffect(btn);
        });
    });
}

// Enhanced View Management
function showView(viewName) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
        view.style.animation = 'fadeOut 0.3s ease-out';
    });
    
    // Show target view with animation
    setTimeout(() => {
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
            targetView.style.animation = 'fadeInUp 0.5s ease-out';
        }
    }, 300);
}

// Enhanced Event Cards Creation
function createImmersiveEventCard(event, index) {
    const card = document.createElement('div');
    card.className = 'immersive-event-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const cannabisFriendly = event.cannabisFriendly || event.title.toLowerCase().includes('cannabis');
    
    card.innerHTML = `
        <div class="event-card-background"></div>
        <div class="event-card-content">
            ${cannabisFriendly ? '<div class="cannabis-indicator">🌿</div>' : ''}
            
            <div class="event-header">
                <div class="event-info">
                    <h3 class="event-title ${cannabisFriendly ? 'cannabis-title' : ''}">${event.title}</h3>
                    <div class="event-badges">
                        <span class="category-badge category-${event.category}">${event.category}</span>
                        ${cannabisFriendly ? '<span class="cannabis-badge">🌿 Cannabis Friendly</span>' : ''}
                    </div>
                    <div class="event-date">📅 ${event.date}</div>
                </div>
                <div class="event-poster-badge">🌿</div>
            </div>
            
            <div class="event-description">${event.description}</div>
            
            <div class="event-venue">
                <div class="venue-name">📍 ${event.venue?.name || event.venue || 'Venue TBA'}</div>
                <div class="venue-address">${event.venue?.address || event.address || 'Address TBA'}</div>
                ${event.venue?.amenities ? `<div class="venue-amenities">✨ ${Array.isArray(event.venue.amenities) ? event.venue.amenities.join(', ') : event.venue.amenities}</div>` : ''}
            </div>
            
            <div class="event-actions">
                <button class="action-btn rsvp-btn" onclick="handleEnhancedRSVP('${event.title}', this)">
                    <span class="btn-icon">🎉</span>
                    <span class="btn-text">RSVP (${event.rsvpCount || 0})</span>
                    <div class="btn-glow"></div>
                </button>
                <button class="action-btn like-btn" onclick="handleEnhancedLike('${event.title}', this)">
                    <span class="btn-icon">🤍</span>
                    <span class="btn-text">Like (${event.likeCount || 0})</span>
                    <div class="btn-glow"></div>
                </button>
                <button class="action-btn comment-btn" onclick="showEventComments('${event.title}')">
                    <span class="btn-icon">💬</span>
                    <span class="btn-text">Comments (${event.commentCount || 0})</span>
                    <div class="btn-glow"></div>
                </button>
            </div>
            
            <div class="swipe-hint">
                <span class="hint-text">👈 Swipe left to like • Swipe right to RSVP 👉</span>
            </div>
        </div>
        
        <div class="card-particles"></div>
    `;
    
    // Add swipe functionality
    addSwipeGestures(card, event);
    
    // Add click to expand
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.action-btn')) {
            expandEventCard(card, event);
        }
    });
    
    return card;
}

// Enhanced RSVP Function
function handleEnhancedRSVP(eventTitle, button) {
    const currentCount = parseInt(button.querySelector('.btn-text').textContent.match(/\d+/)?.[0] || 0);
    
    // Immediate visual feedback
    button.style.animation = 'rsvpSuccess 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    button.querySelector('.btn-text').textContent = `Joining... (${currentCount + 1})`;
    button.style.background = 'linear-gradient(45deg, var(--cannabis-gold), var(--cannabis-orange))';
    
    // Create celebration effects
    createFloatingEmoji('🎉', button);
    createConfettiBurst(button);
    createCelebrationBurst(button);
    
    // Dispatch custom event for mascot reaction
    document.dispatchEvent(new CustomEvent('rsvp-success', { 
        detail: { eventTitle, button } 
    }));
    
    // Show success notification
    showImmersiveNotification(`🎉 You're going to ${eventTitle}! See you there! 🌿`, 'success');
    
    // Update button state after animation
    setTimeout(() => {
        button.querySelector('.btn-text').textContent = `✅ Going (${currentCount + 1})`;
        button.style.background = 'linear-gradient(45deg, var(--cannabis-green), var(--cannabis-dark-green))';
        button.style.animation = '';
    }, 1200);
}

// Enhanced Like Function
function handleEnhancedLike(eventTitle, button) {
    const isLiked = button.classList.contains('liked');
    const currentCount = parseInt(button.querySelector('.btn-text').textContent.match(/\d+/)?.[0] || 0);
    
    button.style.animation = 'heartBeat 0.6s ease-out';
    
    if (!isLiked) {
        button.classList.add('liked');
        button.querySelector('.btn-icon').textContent = '💚';
        button.querySelector('.btn-text').textContent = `Liked (${currentCount + 1})`;
        button.style.background = 'linear-gradient(45deg, var(--cannabis-gold), var(--cannabis-orange))';
        
        // Create heart burst effect
        createFloatingEmoji('💚', button);
        createHeartBurst(button);
        
        // Dispatch custom event for mascot reaction
        document.dispatchEvent(new CustomEvent('like-success', { 
            detail: { eventTitle, button } 
        }));
        
        showImmersiveNotification(`💚 You liked ${eventTitle}!`, 'success');
    } else {
        button.classList.remove('liked');
        button.querySelector('.btn-icon').textContent = '🤍';
        button.querySelector('.btn-text').textContent = `Like (${currentCount - 1})`;
        button.style.background = 'linear-gradient(45deg, var(--cannabis-purple), #673ab7)';
    }
    
    setTimeout(() => {
        button.style.animation = '';
    }, 600);
}

// Swipe Gestures for Mobile
function addSwipeGestures(card, event) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    card.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    card.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(card, event);
    });
    
    function handleSwipe(card, event) {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - Like
                handleEnhancedLike(event.title, card.querySelector('.like-btn'));
                card.style.animation = 'swipeLeft 0.5s ease-out';
            } else {
                // Swipe right - RSVP
                handleEnhancedRSVP(event.title, card.querySelector('.rsvp-btn'));
                card.style.animation = 'swipeRight 0.5s ease-out';
            }
            
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        }
    }
}

// Celebration Effects
function createCelebrationBurst(element) {
    const particles = ['🎉', '✨', '🌿', '💫', '⭐'];
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'celebration-particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 1000;
            animation: particleBurst 1s ease-out forwards;
            left: ${element.offsetLeft + element.offsetWidth / 2}px;
            top: ${element.offsetTop + element.offsetHeight / 2}px;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

function createConfettiBurst(element) {
    const colors = ['var(--cannabis-green)', 'var(--cannabis-gold)', 'var(--cannabis-orange)', 'var(--cannabis-purple)'];
    
    for (let i = 0; i < 12; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            pointer-events: none;
            z-index: 1000;
            animation: confettiFall 1.5s ease-out forwards;
            left: ${element.offsetLeft + element.offsetWidth / 2}px;
            top: ${element.offsetTop}px;
            transform: translateX(-50%);
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 1500);
    }
}

function createHeartBurst(element) {
    const hearts = ['💚', '💛', '🧡', '💜'];
    
    for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
            position: absolute;
            font-size: 1.2rem;
            pointer-events: none;
            z-index: 1000;
            animation: heartFloat 1.2s ease-out forwards;
            left: ${element.offsetLeft + element.offsetWidth / 2}px;
            top: ${element.offsetTop}px;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 1200);
    }
}

function createSparkleEffect(element) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-effect';
    sparkle.textContent = '✨';
    sparkle.style.cssText = `
        position: absolute;
        font-size: 1rem;
        pointer-events: none;
        z-index: 1000;
        animation: sparkleGlow 0.8s ease-out forwards;
        left: ${element.offsetLeft + Math.random() * element.offsetWidth}px;
        top: ${element.offsetTop + Math.random() * element.offsetHeight}px;
    `;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 800);
}

// Immersive Notification System
function showImmersiveNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `immersive-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">🌿</div>
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, var(--cannabis-green), var(--cannabis-dark-green));
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        box-shadow: 0 10px 30px rgba(139, 195, 74, 0.6);
        z-index: 2000;
        animation: notificationSlide 3s ease-out forwards;
        max-width: 90vw;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// Enhanced Tab Functionality
function initializeImmersiveTabs() {
    const tabs = document.querySelectorAll('.immersive-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Create sparkle effect
            createSparkleEffect(tab);
            
            // Filter events based on tab
            const filter = tab.dataset.filter;
            filterImmersiveEvents(filter);
        });
    });
}

function filterImmersiveEvents(filter) {
    // This would connect to the actual event filtering logic
    console.log(`Filtering events by: ${filter}`);
    
    // Add loading animation
    const container = document.getElementById('immersive-events-list');
    container.style.opacity = '0.5';
    container.style.filter = 'blur(2px)';
    
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.filter = 'blur(0px)';
        container.style.animation = 'fadeInUp 0.5s ease-out';
    }, 300);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeImmersiveNavigation();
    initializeImmersiveTabs();
    initializeMascot();
    initializeInteractiveHashtags();
    
    // Add dynamic background elements
    createDynamicLeaves();
    createFloatingHashtags();
    
    console.log('🌿 Immersive Cannabis Events Platform Initialized!');
});

// Cannabis Mascot Interactions
function initializeMascot() {
    const mascot = document.getElementById('cannabis-mascot');
    const speechBubble = document.getElementById('mascot-speech');
    
    if (!mascot || !speechBubble) return;
    
    const messages = [
        "Welcome to the party! 🎉",
        "Ready to roll? 🌿",
        "Let's get this event started! 🔥",
        "Join the green community! 💚",
        "420 friendly vibes! ✨",
        "Spark up some fun! ⚡",
        "Green times ahead! 🌱"
    ];
    
    let messageIndex = 0;
    
    // Click to cycle through messages
    mascot.addEventListener('click', () => {
        messageIndex = (messageIndex + 1) % messages.length;
        speechBubble.querySelector('.speech-text').textContent = messages[messageIndex];
        
        // Add celebration effect
        createCelebrationBurst(mascot);
        
        // Make mascot wave and speak
        mascot.classList.add('speaking');
        setTimeout(() => {
            mascot.classList.remove('speaking');
        }, 3000);
        
        // Add sparkle effect
        createSparkleEffect(mascot);
    });
    
    // React to RSVP events
    document.addEventListener('rsvp-success', (e) => {
        const celebrationMessages = [
            "Awesome! See you there! 🎊",
            "Party time! 🎉",
            "You're in! Let's celebrate! 🌿",
            "Green light for fun! 💚"
        ];
        
        speechBubble.querySelector('.speech-text').textContent = 
            celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
        
        mascot.classList.add('speaking');
        setTimeout(() => {
            mascot.classList.remove('speaking');
        }, 3000);
        
        // Add multiple celebration effects
        createCelebrationBurst(mascot);
        createConfettiBurst(mascot);
    });
    
    // React to like events
    document.addEventListener('like-success', (e) => {
        speechBubble.querySelector('.speech-text').textContent = "Spreading the love! 💚";
        createHeartBurst(mascot);
    });
    
    // Auto-rotate messages every 10 seconds
    setInterval(() => {
        if (!mascot.classList.contains('speaking')) {
            messageIndex = (messageIndex + 1) % messages.length;
            speechBubble.querySelector('.speech-text').textContent = messages[messageIndex];
        }
    }, 10000);
}

// Initialize interactive hashtags
function initializeInteractiveHashtags() {
    const staticHashtags = document.querySelectorAll('.interactive-hashtag');
    
    staticHashtags.forEach(hashtag => {
        hashtag.addEventListener('click', () => {
            const filter = hashtag.dataset.filter;
            filterEventsByHashtag(filter);
            createCelebrationBurst(hashtag);
            hashtag.style.animation = 'hashtagClick 0.5s ease-out';
            
            setTimeout(() => {
                hashtag.style.animation = '';
            }, 500);
        });
        
        hashtag.addEventListener('mouseenter', () => {
            hashtag.style.cursor = 'pointer';
            hashtag.style.transform = 'scale(1.2)';
            hashtag.style.textShadow = '0 0 20px var(--cannabis-green)';
        });
        
        hashtag.addEventListener('mouseleave', () => {
            hashtag.style.transform = 'scale(1)';
            hashtag.style.textShadow = 'none';
        });
    });
}

// Dynamic Background Elements
function createDynamicLeaves() {
    const background = document.querySelector('.floating-cannabis-leaves');
    
    setInterval(() => {
        const leaf = document.createElement('div');
        leaf.className = 'dynamic-leaf';
        leaf.textContent = Math.random() > 0.5 ? '🌿' : '🍃';
        leaf.style.cssText = `
            position: absolute;
            font-size: ${2 + Math.random() * 2}rem;
            left: -50px;
            top: ${Math.random() * 100}%;
            animation: leafDrift ${10 + Math.random() * 10}s linear forwards;
            opacity: ${0.1 + Math.random() * 0.2};
            z-index: -1;
        `;
        
        background.appendChild(leaf);
        
        setTimeout(() => leaf.remove(), 20000);
    }, 3000);
}

function createFloatingHashtags() {
    const hashtags = [
        { text: '#420Events', filter: '420events' },
        { text: '#CannabisLife', filter: 'cannabis' },
        { text: '#GreenCommunity', filter: 'community' },
        { text: '#WeedLife', filter: 'cannabis' },
        { text: '#420Friendly', filter: '420events' },
        { text: '#CannabisCulture', filter: 'cannabis' }
    ];
    
    setInterval(() => {
        const randomHashtag = hashtags[Math.floor(Math.random() * hashtags.length)];
        const hashtag = document.createElement('div');
        hashtag.className = 'floating-hashtag interactive-hashtag';
        hashtag.textContent = randomHashtag.text;
        hashtag.dataset.filter = randomHashtag.filter;
        hashtag.style.cssText = `
            position: fixed;
            color: var(--cannabis-green);
            font-weight: bold;
            font-size: 1rem;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: hashtagRise ${8 + Math.random() * 4}s linear forwards;
            opacity: 0.3;
            z-index: 1;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        // Add click handler for filtering
        hashtag.addEventListener('click', () => {
            filterEventsByHashtag(randomHashtag.filter);
            createCelebrationBurst(hashtag);
            hashtag.style.animation = 'hashtagClick 0.5s ease-out';
        });
        
        hashtag.addEventListener('mouseenter', () => {
            hashtag.style.transform = 'scale(1.2)';
            hashtag.style.opacity = '0.8';
            hashtag.style.textShadow = '0 0 15px var(--cannabis-green)';
        });
        
        hashtag.addEventListener('mouseleave', () => {
            hashtag.style.transform = 'scale(1)';
            hashtag.style.opacity = '0.3';
            hashtag.style.textShadow = 'none';
        });
        
        document.body.appendChild(hashtag);
        
        setTimeout(() => hashtag.remove(), 12000);
    }, 5000);
}

// Hashtag filtering function
function filterEventsByHashtag(filter) {
    showImmersiveNotification(`🏷️ Filtering events by ${filter}! 🌿`, 'info');
    
    // Add visual feedback to show filtering is active
    const eventsContainer = document.getElementById('immersive-events-list');
    if (eventsContainer) {
        eventsContainer.style.animation = 'filterPulse 0.5s ease-out';
        setTimeout(() => {
            eventsContainer.style.animation = '';
        }, 500);
    }
    
    // Here you would implement actual filtering logic
    // For now, we'll just show a notification
    console.log(`Filtering events by: ${filter}`);
}

// CSS Animations (to be added to CSS file)
const additionalAnimations = `
@keyframes particleBurst {
    0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1) rotate(360deg) translateY(-100px); opacity: 0; }
}

@keyframes confettiFall {
    0% { transform: translateX(-50%) rotate(0deg); opacity: 1; }
    100% { transform: translateX(-50%) rotate(720deg) translateY(100px); opacity: 0; }
}

@keyframes heartFloat {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    50% { transform: translate(-50%, -50%) scale(1.2); }
    100% { transform: translate(-50%, -50%) scale(0) translateY(-50px); opacity: 0; }
}

@keyframes sparkleGlow {
    0% { transform: scale(0) rotate(0deg); opacity: 1; }
    50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
    100% { transform: scale(0) rotate(360deg); opacity: 0; }
}

@keyframes notificationSlide {
    0% { top: -100px; opacity: 0; }
    10%, 90% { top: 2rem; opacity: 1; }
    100% { top: -100px; opacity: 0; }
}

@keyframes leafDrift {
    0% { transform: translateX(0) rotate(0deg); }
    100% { transform: translateX(calc(100vw + 100px)) rotate(360deg); }
}

@keyframes hashtagRise {
    0% { top: 100%; opacity: 0.3; }
    50% { opacity: 0.6; }
    100% { top: -50px; opacity: 0; }
}

@keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
}

@keyframes swipeLeft {
    0% { transform: translateX(0) rotate(0deg); }
    100% { transform: translateX(-20px) rotate(-5deg); }
}

@keyframes swipeRight {
    0% { transform: translateX(0) rotate(0deg); }
    100% { transform: translateX(20px) rotate(5deg); }
}

@keyframes rsvpSuccess {
    0% { transform: scale(1); }
    50% { transform: scale(1.1) rotate(5deg); }
    100% { transform: scale(1) rotate(0deg); }
}

@keyframes heartBeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}
`;