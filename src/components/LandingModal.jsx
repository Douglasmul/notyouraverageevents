const { useState, useEffect, createElement: h } = React;

function LandingModal({ events, onClose, onRSVP }) {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [showRSVPConfirm, setShowRSVPConfirm] = useState(false);

    // Get the next upcoming cannabis-friendly event
    const getNextEvent = () => {
        const now = new Date();
        const upcomingEvents = events
            .filter(event => event.cannabisFriendly && new Date(event.date) > now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return upcomingEvents[0] || events.find(e => e.cannabisFriendly) || events[0];
    };

    const nextEvent = getNextEvent();

    useEffect(() => {
        if (!nextEvent) return;

        const updateCountdown = () => {
            const now = new Date().getTime();
            const eventTime = new Date(nextEvent.date).getTime();
            const distance = eventTime - now;

            if (distance > 0) {
                setCountdown({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [nextEvent]);

    const handleRSVP = () => {
        onRSVP(nextEvent.title, 'going');
        setShowRSVPConfirm(true);
        setTimeout(() => setShowRSVPConfirm(false), 2000);
    };

    const shareEvent = (platform) => {
        const eventUrl = encodeURIComponent(window.location.href);
        const eventText = encodeURIComponent(`Join me at ${nextEvent?.title} - A 420-friendly event! 🌿`);
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${eventText}&url=${eventUrl}`,
            instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing
            whatsapp: `https://wa.me/?text=${eventText} ${eventUrl}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    if (!nextEvent) return null;

    return h('div', { className: 'cannabis-modal', onClick: onClose },
        h('div', { 
            className: 'cannabis-modal-content',
            onClick: (e) => e.stopPropagation()
        },
            h('button', { 
                className: 'close-btn',
                onClick: onClose,
                style: {
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    padding: '0.5rem'
                }
            }, '×'),

            // Featured Image
            h('div', { 
                className: 'featured-image-container',
                style: {
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    position: 'relative'
                }
            },
                h('img', {
                    src: 'assets/event-flyer.svg',
                    alt: 'Featured Event Flyer',
                    style: {
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '15px',
                        border: '3px solid var(--cannabis-green)',
                        boxShadow: '0 0 30px rgba(139, 195, 74, 0.5)',
                        animation: 'leafGlow 3s infinite ease-in-out'
                    },
                    onError: (e) => e.target.style.display = 'none'
                })
            ),

            // Event Title
            h('h2', { 
                className: 'glow-text',
                style: { textAlign: 'center', color: 'white', marginBottom: '1rem' }
            }, 
                h('span', { className: 'cannabis-icon' }, '🎉'), 
                ' Next Cannabis-Friendly Event'
            ),

            h('h3', {
                style: { 
                    textAlign: 'center', 
                    color: 'var(--cannabis-green)', 
                    marginBottom: '1.5rem',
                    fontSize: '1.5rem'
                }
            }, nextEvent.title),

            // Countdown Timer
            h('div', { className: 'countdown-timer' },
                h('div', { style: { marginBottom: '0.5rem' } }, '🕒 Event Starts In:'),
                h('div', { className: 'countdown-numbers' },
                    h('div', { className: 'countdown-unit' },
                        h('div', { className: 'countdown-value' }, countdown.days),
                        h('div', { className: 'countdown-label' }, 'Days')
                    ),
                    h('div', { className: 'countdown-unit' },
                        h('div', { className: 'countdown-value' }, countdown.hours),
                        h('div', { className: 'countdown-label' }, 'Hours')
                    ),
                    h('div', { className: 'countdown-unit' },
                        h('div', { className: 'countdown-value' }, countdown.minutes),
                        h('div', { className: 'countdown-label' }, 'Minutes')
                    ),
                    h('div', { className: 'countdown-unit' },
                        h('div', { className: 'countdown-value' }, countdown.seconds),
                        h('div', { className: 'countdown-label' }, 'Seconds')
                    )
                )
            ),

            // Event Details
            h('div', {
                style: {
                    background: 'var(--cannabis-bg-light)',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    margin: '1rem 0',
                    border: '2px solid var(--cannabis-green)'
                }
            },
                h('div', { style: { marginBottom: '1rem', color: 'white' } },
                    h('strong', { style: { color: 'var(--cannabis-green)' } }, '📅 Date: '),
                    new Date(nextEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                ),
                nextEvent.venue && h('div', { style: { marginBottom: '1rem', color: 'white' } },
                    h('strong', { style: { color: 'var(--cannabis-green)' } }, '📍 Venue: '),
                    nextEvent.venue.name
                ),
                h('div', { style: { marginBottom: '1rem', color: 'white' } },
                    h('strong', { style: { color: 'var(--cannabis-green)' } }, '📝 Description: '),
                    nextEvent.description
                ),
                nextEvent.cannabisFriendly && h('div', {
                    style: {
                        background: 'rgba(139, 195, 74, 0.2)',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '2px solid var(--cannabis-green)',
                        textAlign: 'center',
                        marginTop: '1rem'
                    }
                },
                    h('span', { 
                        style: { 
                            fontSize: '1.2rem', 
                            color: 'var(--cannabis-green)',
                            fontWeight: 'bold'
                        } 
                    }, '🌿 Cannabis Friendly Event'),
                    h('p', { 
                        style: { 
                            margin: '0.5rem 0 0 0', 
                            color: '#ccc',
                            fontSize: '0.9rem'
                        } 
                    }, 'This event welcomes cannabis consumption in accordance with local laws.')
                )
            ),

            // Call-to-Action Buttons
            h('div', { 
                style: { 
                    display: 'flex', 
                    gap: '1rem', 
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '1.5rem'
                } 
            },
                h('button', {
                    className: 'cannabis-btn',
                    onClick: handleRSVP,
                    style: {
                        fontSize: '1.1rem',
                        padding: '1rem 2rem',
                        background: showRSVPConfirm 
                            ? 'linear-gradient(45deg, var(--cannabis-gold), var(--cannabis-orange))'
                            : 'linear-gradient(45deg, var(--cannabis-green), var(--cannabis-dark-green))'
                    }
                }, showRSVPConfirm ? '✅ You\'re Going!' : '🎉 Join the Party!'),
                
                h('button', {
                    className: 'cannabis-btn',
                    onClick: onClose,
                    style: {
                        background: 'linear-gradient(45deg, var(--cannabis-purple), #673ab7)',
                        border: '2px solid var(--cannabis-orange)'
                    }
                }, '🌿 Explore More Events')
            ),

            // Social Share Buttons
            h('div', { className: 'social-share' },
                h('h4', { 
                    style: { 
                        width: '100%', 
                        textAlign: 'center', 
                        color: 'var(--cannabis-green)',
                        marginBottom: '1rem'
                    } 
                }, '🔗 Share with Friends'),
                
                h('button', {
                    className: 'social-btn facebook',
                    onClick: () => shareEvent('facebook')
                }, '📘 Facebook'),
                
                h('button', {
                    className: 'social-btn twitter',
                    onClick: () => shareEvent('twitter')
                }, '🐦 Twitter'),
                
                h('button', {
                    className: 'social-btn instagram',
                    onClick: () => shareEvent('instagram')
                }, '📸 Instagram'),
                
                h('button', {
                    className: 'social-btn whatsapp',
                    onClick: () => shareEvent('whatsapp')
                }, '💬 WhatsApp')
            ),

            // Cannabis leaf decorations
            h('div', {
                style: {
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    fontSize: '2rem',
                    animation: 'leafFloat 3s infinite ease-in-out'
                }
            }, '🌿'),
            h('div', {
                style: {
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    fontSize: '2rem',
                    animation: 'leafFloat 4s infinite ease-in-out reverse'
                }
            }, '🍃')
        )
    );
}

// Make LandingModal available globally
window.LandingModal = LandingModal;