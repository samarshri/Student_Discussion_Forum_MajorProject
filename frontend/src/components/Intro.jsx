import React, { useEffect, useState } from 'react';
import './Intro.css';

const Intro = ({ onComplete }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 2.5 seconds
        const timer = setTimeout(() => {
            setFadeOut(true);
        }, 2500);

        // Notify parent onComplete after transition finishes (total 3.3s)
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 3300);

        return () => {
            clearTimeout(timer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className={`intro-container ${fadeOut ? 'intro-fade-out' : ''}`}>
            <div className="intro-content">
                <div className="intro-icon">
                    <i className="bi bi-mortarboard-fill"></i>
                </div>
                <h1 className="intro-title">Student Discussion Forum</h1>
                <p className="intro-subtitle">A Web-based Platform for Academic Collaboration</p>

                <div className="loading-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>
        </div>
    );
};

export default Intro;
