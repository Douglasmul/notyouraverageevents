const { useState, createElement: h } = React;

function ProfileDrawer({ user, users, onClose }) {
    const [activeTab, setActiveTab] = useState('profile');

    if (!user) return null;

    const getLeaderboard = () => {
        return [...users].sort((a, b) => b.points - a.points);
    };

    const getBadgeColor = (badge) => {
        const colors = {
            'Event Host': 'var(--cannabis-gold)',
            'Community Leader': 'var(--cannabis-green)',
            'Strain Expert': 'var(--cannabis-purple)',
            'Music Lover': 'var(--cannabis-orange)',
            'Art Enthusiast': '#e91e63',
            'Wellness Guru': '#4caf50',
            'Mindfulness Master': '#9c27b0'
        };
        return colors[badge] || 'var(--cannabis-green)';
    };

    return h('div', { 
        className: 'profile-drawer-overlay',
        onClick: onClose,
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'flex-end'
        }
    },
        h('div', {
            className: 'profile-drawer',
            onClick: (e) => e.stopPropagation(),
            style: {
                width: '400px',
                maxWidth: '90vw',
                height: '100%',
                background: 'var(--cannabis-bg-medium)',
                border: '3px solid var(--cannabis-green)',
                borderRight: 'none',
                borderTopLeftRadius: '20px',
                borderBottomLeftRadius: '20px',
                padding: '2rem',
                overflowY: 'auto',
                animation: 'slideInRight 0.3s ease-out',
                position: 'relative'
            }
        },
            // Close Button
            h('button', {
                onClick: onClose,
                style: {
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    padding: '0.5rem'
                }
            }, '×'),

            // Header
            h('div', {
                style: {
                    textAlign: 'center',
                    marginBottom: '2rem',
                    paddingTop: '2rem'
                }
            },
                h('div', {
                    className: 'user-avatar',
                    style: {
                        width: '120px',
                        height: '120px',
                        background: 'linear-gradient(45deg, var(--cannabis-green), var(--cannabis-dark-green))',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '4rem',
                        margin: '0 auto 1rem',
                        border: '4px solid var(--cannabis-gold)',
                        animation: 'leafGlow 4s infinite ease-in-out'
                    }
                }, user.avatar),
                
                h('h2', {
                    className: 'glow-text',
                    style: { margin: '0 0 0.5rem 0', color: 'white' }
                }, user.name),
                
                h('div', {
                    style: {
                        color: 'var(--cannabis-green)',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem'
                    }
                }, `${user.engagementLevel} • ${user.points} Points`),
                
                h('div', {
                    style: {
                        color: '#ccc',
                        fontSize: '0.9rem'
                    }
                }, `Last RSVP: ${user.lastRSVP}`)
            ),

            // Tab Navigation
            h('div', {
                style: {
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    justifyContent: 'center'
                }
            },
                ['profile', 'leaderboard'].map(tab =>
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
                        tab === 'profile' ? '👤 Profile' : '🏆 Leaderboard'
                    )
                )
            ),

            // Profile Tab
            activeTab === 'profile' && h('div', null,
                // Favorite Strains
                h('div', {
                    style: {
                        background: 'var(--cannabis-bg-dark)',
                        padding: '1.5rem',
                        borderRadius: '15px',
                        marginBottom: '1.5rem',
                        border: '2px solid var(--cannabis-green)'
                    }
                },
                    h('h3', {
                        style: {
                            color: 'var(--cannabis-green)',
                            marginBottom: '1rem',
                            textAlign: 'center'
                        }
                    }, '🌿 Favorite Strains'),
                    
                    h('div', {
                        style: {
                            display: 'grid',
                            gap: '0.8rem'
                        }
                    },
                        user.favoriteStrains.map(strain =>
                            h('div', {
                                key: strain,
                                style: {
                                    background: 'linear-gradient(45deg, var(--cannabis-green), var(--cannabis-dark-green))',
                                    color: 'white',
                                    padding: '0.8rem',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    border: '2px solid var(--cannabis-gold)',
                                    animation: 'leafGlow 5s infinite ease-in-out'
                                }
                            }, `🌱 ${strain}`)
                        )
                    )
                ),

                // Badges
                h('div', {
                    style: {
                        background: 'var(--cannabis-bg-dark)',
                        padding: '1.5rem',
                        borderRadius: '15px',
                        marginBottom: '1.5rem',
                        border: '2px solid var(--cannabis-gold)'
                    }
                },
                    h('h3', {
                        style: {
                            color: 'var(--cannabis-gold)',
                            marginBottom: '1rem',
                            textAlign: 'center'
                        }
                    }, '🏆 Achievement Badges'),
                    
                    h('div', {
                        style: {
                            display: 'grid',
                            gap: '0.5rem'
                        }
                    },
                        user.badges.map(badge =>
                            h('div', {
                                key: badge,
                                style: {
                                    background: `linear-gradient(45deg, ${getBadgeColor(badge)}, ${getBadgeColor(badge)}dd)`,
                                    color: 'white',
                                    padding: '0.6rem',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                }
                            }, `⭐ ${badge}`)
                        )
                    )
                ),

                // Activity Stats
                h('div', {
                    style: {
                        background: 'var(--cannabis-bg-dark)',
                        padding: '1.5rem',
                        borderRadius: '15px',
                        border: '2px solid var(--cannabis-purple)'
                    }
                },
                    h('h3', {
                        style: {
                            color: 'var(--cannabis-purple)',
                            marginBottom: '1rem',
                            textAlign: 'center'
                        }
                    }, '📊 Activity Stats'),
                    
                    h('div', {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem'
                        }
                    },
                        h('div', {
                            style: {
                                textAlign: 'center',
                                background: 'var(--cannabis-bg-medium)',
                                padding: '1rem',
                                borderRadius: '10px',
                                border: '1px solid var(--cannabis-green)'
                            }
                        },
                            h('div', {
                                style: {
                                    fontSize: '2rem',
                                    color: 'var(--cannabis-green)',
                                    fontWeight: 'bold'
                                }
                            }, Math.floor(Math.random() * 20) + 5),
                            h('div', {
                                style: { color: '#ccc', fontSize: '0.8rem' }
                            }, 'Events Attended')
                        ),
                        
                        h('div', {
                            style: {
                                textAlign: 'center',
                                background: 'var(--cannabis-bg-medium)',
                                padding: '1rem',
                                borderRadius: '10px',
                                border: '1px solid var(--cannabis-gold)'
                            }
                        },
                            h('div', {
                                style: {
                                    fontSize: '2rem',
                                    color: 'var(--cannabis-gold)',
                                    fontWeight: 'bold'
                                }
                            }, Math.floor(Math.random() * 50) + 10),
                            h('div', {
                                style: { color: '#ccc', fontSize: '0.8rem' }
                            }, 'Comments Posted')
                        ),
                        
                        h('div', {
                            style: {
                                textAlign: 'center',
                                background: 'var(--cannabis-bg-medium)',
                                padding: '1rem',
                                borderRadius: '10px',
                                border: '1px solid var(--cannabis-purple)'
                            }
                        },
                            h('div', {
                                style: {
                                    fontSize: '2rem',
                                    color: 'var(--cannabis-purple)',
                                    fontWeight: 'bold'
                                }
                            }, Math.floor(Math.random() * 30) + 5),
                            h('div', {
                                style: { color: '#ccc', fontSize: '0.8rem' }
                            }, 'Events Liked')
                        ),
                        
                        h('div', {
                            style: {
                                textAlign: 'center',
                                background: 'var(--cannabis-bg-medium)',
                                padding: '1rem',
                                borderRadius: '10px',
                                border: '1px solid var(--cannabis-orange)'
                            }
                        },
                            h('div', {
                                style: {
                                    fontSize: '2rem',
                                    color: 'var(--cannabis-orange)',
                                    fontWeight: 'bold'
                                }
                            }, Math.floor(Math.random() * 15) + 3),
                            h('div', {
                                style: { color: '#ccc', fontSize: '0.8rem' }
                            }, 'Friends Made')
                        )
                    )
                )
            ),

            // Leaderboard Tab
            activeTab === 'leaderboard' && h('div', null,
                h('div', {
                    style: {
                        background: 'var(--cannabis-bg-dark)',
                        padding: '1.5rem',
                        borderRadius: '15px',
                        border: '2px solid var(--cannabis-gold)'
                    }
                },
                    h('h3', {
                        style: {
                            color: 'var(--cannabis-gold)',
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }
                    }, '🏆 Community Leaderboard'),
                    
                    h('div', {
                        style: { display: 'grid', gap: '1rem' }
                    },
                        getLeaderboard().map((member, index) =>
                            h('div', {
                                key: member.id,
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    background: member.id === user.id 
                                        ? 'linear-gradient(45deg, var(--cannabis-green), var(--cannabis-dark-green))'
                                        : 'var(--cannabis-bg-medium)',
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    border: index === 0 
                                        ? '2px solid var(--cannabis-gold)' 
                                        : index === 1 
                                            ? '2px solid #c0c0c0'
                                            : index === 2
                                                ? '2px solid #cd7f32'
                                                : '2px solid rgba(139, 195, 74, 0.3)',
                                    animation: member.id === user.id ? 'leafGlow 3s infinite ease-in-out' : 'none'
                                }
                            },
                                h('div', {
                                    style: {
                                        fontSize: '2rem',
                                        minWidth: '40px',
                                        textAlign: 'center'
                                    }
                                }, 
                                    index === 0 ? '🥇' :
                                    index === 1 ? '🥈' :
                                    index === 2 ? '🥉' :
                                    `#${index + 1}`
                                ),
                                
                                h('div', {
                                    style: {
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(45deg, var(--cannabis-green), var(--cannabis-dark-green))',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        border: '2px solid var(--cannabis-gold)'
                                    }
                                }, member.avatar),
                                
                                h('div', { style: { flex: 1 } },
                                    h('div', {
                                        style: {
                                            color: 'white',
                                            fontWeight: 'bold',
                                            marginBottom: '0.2rem'
                                        }
                                    }, member.name),
                                    h('div', {
                                        style: {
                                            color: 'var(--cannabis-green)',
                                            fontSize: '0.9rem'
                                        }
                                    }, member.engagementLevel)
                                ),
                                
                                h('div', {
                                    style: {
                                        textAlign: 'right',
                                        color: 'var(--cannabis-gold)',
                                        fontWeight: 'bold'
                                    }
                                },
                                    h('div', null, `${member.points}`),
                                    h('div', {
                                        style: {
                                            fontSize: '0.7rem',
                                            color: '#ccc'
                                        }
                                    }, 'points')
                                )
                            )
                        )
                    )
                )
            ),

            // Cannabis leaf decorations
            h('div', {
                style: {
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    fontSize: '3rem',
                    opacity: 0.1,
                    animation: 'leafFloat 5s infinite ease-in-out'
                }
            }, '🌿'),
            
            h('div', {
                style: {
                    position: 'absolute',
                    top: '100px',
                    right: '20px',
                    fontSize: '2rem',
                    opacity: 0.1,
                    animation: 'leafFloat 7s infinite ease-in-out reverse'
                }
            }, '🍃')
        ),

        // Add CSS for drawer animation
        h('style', null, `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                }
                to {
                    transform: translateX(0);
                }
            }
        `)
    );
}

// Make ProfileDrawer available globally
window.ProfileDrawer = ProfileDrawer;