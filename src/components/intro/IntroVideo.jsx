'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';

export function IntroVideo({ onComplete }) {
    const [showEnterButton, setShowEnterButton] = useState(true);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const videoRef = useRef(null);
    const router = useRouter();

    // Preload home page resources
    useEffect(() => {
        const preloadResources = () => {
            // Preload critical images
            const criticalImages = [
                '/images/logo_wbg.png',
                '/images/hero-bg.jpg',
                // Add other critical images
            ];

            criticalImages.forEach(src => {
                const img = new Image();
                img.src = src;
            });

            // Preload home page route
            router.prefetch('/en');
        };

        preloadResources();
    }, [router]);

    const handleEnterClick = () => {
        setShowEnterButton(false);
        setIsVideoPlaying(true);

        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleVideoEnd = () => {
        setIsTransitioning(true);

        // Smooth transition to home page
        setTimeout(() => {
            if (onComplete) {
                onComplete();
            } else {
                router.push('/en');
            }
        }, 500);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && showEnterButton) {
            handleEnterClick();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [showEnterButton]);

    return (
        <div className={`fixed inset-0 z-50 bg-black transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}>
            {/* Video Element */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
                onEnded={handleVideoEnd}
                preload="metadata"
            >
                <source src="/videos/Luxury_Fashion_Store_Logo_Reveal.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Enter Button Overlay */}
            {showEnterButton && (
                <div className="absolute inset-0 bg-[var(--background)]/80 flex items-center justify-center">
                    <button
                        onClick={handleEnterClick}
                        className="
      group relative flex flex-col items-center justify-center
      px-10 py-6 rounded-xl
      bg-[var(--main-color)]/90 hover:bg-[var(--main-color-hover)]
      text-[var(--text-white)]
      transition-all duration-300 ease-out
      transform hover:scale-105 active:scale-95
      shadow-md hover:shadow-xl
    "
                        aria-label="Start video and enter site"
                    >
                        <p
                            className="
        text-[var(--text-white)]
        text-4xl sm:text-5xl md:text-6xl
        font-heading uppercase tracking-[0.2em]
        transition-all duration-300
        group-hover:tracking-[0.3em]
      "
                        >
                            Enter
                        </p>
                    </button>
                </div>


            )}

            {/* Loading indicator for video */}
            {isVideoPlaying && !isTransitioning && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
            )}
        </div>
    );
}