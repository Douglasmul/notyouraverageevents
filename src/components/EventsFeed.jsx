const { useState, useRef, createElement: h } = React;

function EventsFeed({ events, onRSVP, onLike, users }) {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [dragStart, setDragStart] = useState(null);
    const [comments, setComments] = useState({});
    const feedRef = useRef(null);

    const filterEvents = (type) => {
        const now = new Date();
        switch (type) {
            case 'upcoming':
                return events.filter(event => new Date(event.date) >= now);
            case 'trending':
                return events.filter(event => (event.likes || 0) > 0 || (event.rsvpCount || 0) > 0);
            case 'past':
                return events.filter(event => new Date(event.date) < now);
            default:
                return events;
        }
    };

    const filteredEvents = filterEvents(activeTab);

    const handleComment = (eventTitle, comment) => {
        if (!comment.trim()) return;
        
        setComments(prev => ({
            ...prev,
            [eventTitle]: [
                ...(prev[eventTitle] || []),
                {
                    id: Date.now(),
                    text: comment,
                    user: users[Math.floor(Math.random() * users.length)],
                    timestamp: new Date()
                }
            ]
        }));
    };

    const getTopPosters = () => {
        return users.sort((a, b) => b.points - a.points).slice(0, 3);
    };

    const EventCard = ({ event, index }) => {
        const [showComments, setShowComments] = useState(false);
        const [newComment, setNewComment] = useState('');
        const [currentImageIndex, setCurrentImageIndex] = useState(0);
        const [touchStart, setTouchStart] = useState(null);
        const [touchEnd, setTouchEnd] = useState(null);

        const eventComments = comments[event.title] || [];
        const isLiked = event.isLiked || false;
        const likeCount = event.likes || Math.floor(Math.random() * 15) + 1;
        const rsvpCount = event.rsvpCount || Math.floor(Math.random() * 25) + 5;

        const handleSwipe = () => {
            if (!touchStart || !touchEnd) return;
            const distance = touchStart - touchEnd;
            const isLeftSwipe = distance > 50;
            const isRightSwipe = distance < -50;

            if (isLeftSwipe) {
                onLike(event.title);
            } else if (isRightSwipe) {
                onRSVP(event.title, 'going');
            }
        };

        return h('div', {
            className: `event-card ${event.cannabisFriendly ? 'cannabis-friendly' : ''}`,
            style: {
                background: event.cannabisFriendly 
                    ? 'linear-gradient(135deg, var(--cannabis-bg-medium) 0%, #2a3d2a 100%)'
                    : 'var(--cannabis-bg-medium)',
                border: event.cannabisFriendly 
                    ? '2px solid var(--cannabis-green)'
                    : '2px solid #444',
                borderRadius: '20px',
                padding: '1.5rem',
                margin: '1rem 0',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
            },
            onTouchStart: (e) => setTouchStart(e.targetTouches[0].clientX),
            onTouchMove: (e) => setTouchEnd(e.targetTouches[0].clientX),
            onTouchEnd: handleSwipe
        },
            // Cannabis leaf animation for cannabis-friendly events
            event.cannabisFriendly && h('div', {
                style: {
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '2rem',
                    animation: 'leafFloat 3s infinite ease-in-out',
                    opacity: 0.3
                }
            }, '🌿'),

            // Event Header
            h('div', {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                }
            },
                h('div', { style: { flex: 1 } },
                    h('h3', {
                        style: {
                            color: event.cannabisFriendly ? 'var(--cannabis-green)' : 'white',
                            margin: '0 0 0.5rem 0',
                            fontSize: '1.3rem',
                            fontWeight: 'bold'
                        }
                    }, event.title),
                    
                    h('div', {
                        style: {
                            display: 'flex',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                            marginBottom: '0.5rem'
                        }
                    },
                        h('span', {
                            className: `category-badge category-${event.category}`,
                            style: {
                                background: 'var(--cannabis-purple)',
                                color: 'white',
                                padding: '0.2rem 0.8rem',
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                            }
                        }, event.category),
                        
                        event.cannabisFriendly && h('span', {
                            className: 'cannabis-indicator',
                            style: {
                                background: 'var(--cannabis-green)',
                                color: 'white',
                                padding: '0.2rem 0.8rem',
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                animation: 'leafGlow 3s infinite ease-in-out'
                            }
                        }, '🌿 Cannabis Friendly')
                    ),
                    
                    h('div', {
                        style: { color: '#ccc', fontSize: '0.9rem' }
                    }, 
                        '📅 ', new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                        })
                    )
                ),
                
                // Guest Badge for Top Poster
                users.slice(0, 1).map(user => 
                    h('div', {
                        key: user.id,
                        style: {
                            background: 'linear-gradient(45deg, var(--cannabis-gold), var(--cannabis-orange))',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            animation: 'leafGlow 4s infinite ease-in-out',
                            border: '2px solid var(--cannabis-green)'
                        },
                        title: `Top Poster: ${user.name}`
                    }, user.avatar)
                )
            ),

            // Event Description
            h('p', {
                style: {
                    color: '#ddd',
                    lineHeight: '1.5',
                    marginBottom: '1rem'
                }
            }, event.description),

            // Venue Info
            event.venue && h('div', {
                style: {
                    background: 'rgba(139, 195, 74, 0.1)',
                    padding: '0.8rem',
                    borderRadius: '10px',
                    marginBottom: '1rem',
                    border: '1px solid rgba(139, 195, 74, 0.3)'
                }
            },
                h('div', {
                    style: { color: 'var(--cannabis-green)', fontWeight: 'bold', marginBottom: '0.3rem' }
                }, '📍 ' + event.venue.name),
                h('div', {
                    style: { color: '#ccc', fontSize: '0.9rem' }
                }, event.venue.address),
                event.venue.amenities && h('div', {
                    style: { color: '#aaa', fontSize: '0.8rem', marginTop: '0.3rem' }
                }, '✨ ' + event.venue.amenities.join(', '))
            ),

            // Action Buttons
            h('div', {
                style: {
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap'
                }
            },
                h('button', {
                    className: 'cannabis-btn',
                    onClick: () => onRSVP(event.title, 'going'),
                    style: {
                        background: 'linear-gradient(45deg, var(--cannabis-green), var(--cannabis-dark-green))',
                        border: '2px solid var(--cannabis-gold)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem'
                    }
                }, `🎉 RSVP (${rsvpCount})`),
                
                h('button', {
                    className: 'cannabis-btn',
                    onClick: () => onLike(event.title),
                    style: {
                        background: isLiked 
                            ? 'linear-gradient(45deg, var(--cannabis-gold), var(--cannabis-orange))'
                            : 'linear-gradient(45deg, var(--cannabis-purple), #673ab7)',
                        border: '2px solid var(--cannabis-green)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem'
                    }
                }, `${isLiked ? '💚' : '🤍'} Like (${likeCount})`),
                
                h('button', {
                    className: 'cannabis-btn',
                    onClick: () => setShowComments(!showComments),
                    style: {
                        background: 'linear-gradient(45deg, #666, #555)',
                        border: '2px solid var(--cannabis-green)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem'
                    }
                }, `💬 Comments (${eventComments.length})`)
            ),

            // Comments Section
            showComments && h('div', {
                style: {
                    background: 'var(--cannabis-bg-dark)',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--cannabis-green)'
                }
            },
                h('h4', {
                    style: { color: 'var(--cannabis-green)', marginBottom: '1rem' }
                }, '💬 Comments'),
                
                // Comment Input
                h('div', {
                    style: { display: 'flex', gap: '0.5rem', marginBottom: '1rem' }
                },
                    h('input', {
                        type: 'text',
                        placeholder: 'Add a comment...',
                        value: newComment,
                        onChange: (e) => setNewComment(e.target.value),
                        style: {
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '20px',
                            border: '1px solid var(--cannabis-green)',
                            background: 'var(--cannabis-bg-medium)',
                            color: 'white'
                        }
                    }),
                    h('button', {
                        onClick: () => {
                            handleComment(event.title, newComment);
                            setNewComment('');
                        },
                        style: {
                            background: 'var(--cannabis-green)',
                            border: 'none',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            cursor: 'pointer'
                        }
                    }, '🌿 Post')
                ),
                
                // Comments List
                eventComments.map(comment =>
                    h('div', {
                        key: comment.id,
                        style: {
                            background: 'var(--cannabis-bg-medium)',
                            padding: '0.8rem',
                            borderRadius: '10px',
                            marginBottom: '0.5rem',
                            border: '1px solid rgba(139, 195, 74, 0.2)'
                        }
                    },
                        h('div', {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.3rem'
                            }
                        },
                            h('span', {
                                style: { fontSize: '1.2rem' }
                            }, comment.user.avatar),
                            h('strong', {
                                style: { color: 'var(--cannabis-green)' }
                            }, comment.user.name),
                            h('span', {
                                style: { color: '#888', fontSize: '0.8rem' }
                            }, comment.timestamp.toLocaleTimeString())
                        ),
                        h('p', {
                            style: { color: '#ddd', margin: 0 }
                        }, comment.text)
                    )
                )
            ),

            // Swipe Instructions
            h('div', {
                style: {
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#666',
                    fontSize: '0.7rem',
                    textAlign: 'center'
                }
            }, '👈 Swipe left to like • Swipe right to RSVP 👉')
        );
    };

    return h('div', { className: 'events-feed' },
        // Feed Header
        h('div', {
            style: {
                background: 'var(--cannabis-bg-medium)',
                padding: '1rem',
                borderRadius: '15px',
                marginBottom: '1.5rem',
                border: '2px solid var(--cannabis-green)'
            }
        },
            h('h2', {
                className: 'glow-text',
                style: { textAlign: 'center', margin: '0 0 1rem 0' }
            }, '🌿 Events Feed'),
            
            // Tab Navigation
            h('div', {
                style: {
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }
            },
                ['upcoming', 'trending', 'past'].map(tab =>
                    h('button', {
                        key: tab,
                        onClick: () => setActiveTab(tab),
                        style: {
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: '2px solid var(--cannabis-green)',
                            background: activeTab === tab 
                                ? 'var(--cannabis-green)' 
                                : 'transparent',
                            color: activeTab === tab ? 'white' : 'var(--cannabis-green)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'capitalize',
                            fontWeight: 'bold'
                        }
                    }, 
                        tab === 'upcoming' ? '🔮 ' + tab :
                        tab === 'trending' ? '🔥 ' + tab :
                        '📚 ' + tab
                    )
                )
            )
        ),

        // Top Posters Section
        h('div', {
            style: {
                background: 'var(--cannabis-bg-medium)',
                padding: '1rem',
                borderRadius: '15px',
                marginBottom: '1.5rem',
                border: '2px solid var(--cannabis-gold)'
            }
        },
            h('h3', {
                style: { 
                    color: 'var(--cannabis-gold)', 
                    textAlign: 'center',
                    margin: '0 0 1rem 0'
                }
            }, '🏆 Top Community Members'),
            h('div', {
                style: {
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }
            },
                getTopPosters().map((user, index) =>
                    h('div', {
                        key: user.id,
                        style: {
                            textAlign: 'center',
                            background: 'var(--cannabis-bg-dark)',
                            padding: '1rem',
                            borderRadius: '15px',
                            border: index === 0 ? '2px solid var(--cannabis-gold)' : '2px solid var(--cannabis-green)',
                            minWidth: '120px'
                        }
                    },
                        h('div', {
                            style: {
                                fontSize: '2rem',
                                marginBottom: '0.5rem'
                            }
                        }, user.avatar),
                        h('div', {
                            style: {
                                color: 'var(--cannabis-green)',
                                fontWeight: 'bold',
                                marginBottom: '0.3rem'
                            }
                        }, user.name),
                        h('div', {
                            style: {
                                color: 'var(--cannabis-gold)',
                                fontSize: '0.8rem',
                                marginBottom: '0.3rem'
                            }
                        }, `${user.points} points`),
                        h('div', {
                            style: {
                                color: '#ccc',
                                fontSize: '0.7rem'
                            }
                        }, user.engagementLevel)
                    )
                )
            )
        ),

        // Events List
        h('div', { ref: feedRef },
            filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => 
                    h(EventCard, { key: event.title, event, index })
                )
            ) : (
                h('div', {
                    style: {
                        textAlign: 'center',
                        padding: '3rem',
                        color: '#666'
                    }
                },
                    h('div', { style: { fontSize: '4rem', marginBottom: '1rem' } }, '🌿'),
                    h('h3', null, 'No events found'),
                    h('p', null, 'Check back later for more cannabis-friendly events!')
                )
            )
        ),

        // Add CSS for animations
        h('style', null, `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .event-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(139, 195, 74, 0.3);
            }
        `)
    );
}

// Make EventsFeed available globally
window.EventsFeed = EventsFeed;