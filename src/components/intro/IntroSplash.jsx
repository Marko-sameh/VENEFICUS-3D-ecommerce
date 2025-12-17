'use client';

import { useState, useEffect } from 'react';
import { IntroVideo } from './IntroVideo';

export function IntroSplash({ children }) {
    const [showIntro, setShowIntro] = useState(true);
    const [hasSeenIntro, setHasSeenIntro] = useState(false);

    useEffect(() => {
        // Check if user has already seen the intro in this session
        const seenIntro = sessionStorage.getItem('veneficus-intro-seen');
        if (seenIntro) {
            setShowIntro(false);
            setHasSeenIntro(true);
        }
    }, []);

    const handleIntroComplete = () => {
        // Mark intro as seen for this session
        sessionStorage.setItem('veneficus-intro-seen', 'true');
        setShowIntro(false);
        setHasSeenIntro(true);
    };

    // Show intro video if not seen yet
    if (showIntro && !hasSeenIntro) {
        return <IntroVideo onComplete={handleIntroComplete} />;
    }

    // Show main content after intro
    return <>{children}</>;
}