'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

const SOUND_FILE_PATH = '/applepay.mp3';

const BANKNOTE_ANIMATION_DURATION = 2000;
const CONFETTI_ANIMATION_DURATION = 1000;
const GIF_APPEARANCE_TARGET = 10000; // The amount at which the GIF appears

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface Banknote {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotation: number;
}

export default function UltimateButtonPage() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [banknotes, setBanknotes] = useState<Banknote[]>([]);
  const [showGif, setShowGif] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  
  useEffect(() => {
    audioRef.current = new Audio(SOUND_FILE_PATH);
    audioRef.current.preload = 'auto';
  }, []);

  useEffect(() => {
    if (totalAmount >= GIF_APPEARANCE_TARGET) {
      setShowGif(true);
    }
  }, [totalAmount]);


  const handleUpdateClick = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
    setTotalAmount(prev => prev + 100);

    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    const colors = ['#3b82f6', '#60a5fa', '#ffffff', '#93c5fd'];
    const newConfetti: ConfettiPiece[] = Array.from({ length: 20 }).map(() => ({
      id: Math.random(),
      x: startX + (Math.random() - 0.5) * 150,
      y: startY + (Math.random() - 0.5) * 150,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    //setConfetti(prev => [...prev, ...newConfetti]);
    //setTimeout(() => setConfetti([]), CONFETTI_ANIMATION_DURATION);

    const newBanknote: Banknote = {
      id: Math.random(),
      startX: startX, startY: startY,
      endX: (Math.random() - 0.5) * (window.innerWidth * 0.8),
      endY: -window.innerHeight,
      rotation: (Math.random() - 0.5) * 720,
    };
    setBanknotes(prev => [...prev, newBanknote]);

    setTimeout(() => {
      setBanknotes(prev => prev.filter(note => note.id !== newBanknote.id));
    }, BANKNOTE_ANIMATION_DURATION);

  }, []);

  return (
      <>
        <style>{`
                body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
                .page-container {
                    background-color: #020617;
                    background-image: radial-gradient(at 20% 80%, hsla(217, 78%, 20%, 1) 0px, transparent 50%),
                                      radial-gradient(at 80% 10%, hsla(283, 78%, 25%, 1) 0px, transparent 50%);
                    color: white; display: flex;
                    align-items: center; justify-content: center;
                    height: 100vh; width: 100vw; overflow: hidden;
                    position: relative;
                }
                .total-display {
                    position: absolute; top: 24px; left: 24px;
                    background-color: rgba(30, 41, 59, 0.7);
                    backdrop-filter: blur(5px);
                    padding: 12px 20px;
                    border-radius: 12px; font-size: 18px; font-weight: bold;
                    color: #e2e8f0; z-index: 30;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .update-button {
                    background-color: rgba(37, 99, 235, 0.5);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: white; font-weight: bold;
                    padding: 16px 48px; border-radius: 16px;
                    font-size: 24px; cursor: pointer;
                    transition: all 0.2s ease-out;
                    z-index: 10;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37),
                                0 0 25px rgba(59, 130, 246, 0.4);
                }
                .update-button:hover {
                    background-color: rgba(59, 130, 246, 0.6);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37),
                                0 0 35px rgba(59, 130, 246, 0.6);
                }
                .update-button:active { transform: scale(0.96); }

                /* --- ✨ CSS for the Celebration GIF --- */
                .celebration-gif {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 200px; /* Width on desktop */
                    height: auto;
                    z-index: 1000; /* Ensures it's on top of other elements */
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                    animation: fade-in 0.5s ease-in-out;
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }

                /* Responsive size for mobile */
                @media (max-width: 768px) {
                    .celebration-gif {
                        width: 120px; /* Smaller width on mobile */
                        bottom: 15px;
                        right: 15px;
                    }
                }

                /* --- Animations --- */
                @keyframes fade-out-and-up { to { opacity: 0; transform: scale(0.5) translateY(-60px); } }
                .animate-confetti { animation: fade-out-and-up ${CONFETTI_ANIMATION_DURATION}ms ease-out forwards; }
                .banknote {
                    position: fixed; width: 150px; height: 70px;
                    background-color: #2E8540; border: 2px solid #145A32;
                    color: #fff; display: flex; align-items: center;
                    justify-content: center; font-size: 24px; font-weight: bold;
                    border-radius: 8px; z-index: 0; transform: translate(-50%, -50%);
                }
                @keyframes fly-away {
                    0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
                    100% { transform: translate(var(--end-x), var(--end-y)) rotate(var(--end-rot)); opacity: 0; }
                }
                .animate-fly-away { animation: fly-away ${BANKNOTE_ANIMATION_DURATION}ms ease-out forwards; }
            `}</style>

        <main className="page-container">
          {confetti.map((piece) => (
              <div key={piece.id} className="animate-confetti"
                   style={{
                     position: 'absolute', left: piece.x, top: piece.y,
                     width: '10px', height: '10px',
                     borderRadius: '50%', backgroundColor: piece.color,
                   }}
              />
          ))}
          {banknotes.map((note) => (
              <div key={note.id} className="banknote animate-fly-away"
                   style={{
                     left: `${note.startX}px`, top: `${note.startY}px`,
                     '--end-x': `${note.endX}px`, '--end-y': `${note.endY}px`,
                     '--end-rot': `${note.rotation}deg`,
                   } as React.CSSProperties}
              >$100</div>
          ))}

          <div className="total-display"><h2>Total: ${totalAmount}</h2></div>
          <button ref={buttonRef} onClick={handleUpdateClick} className="update-button">
            Update
          </button>

          {showGif && (
              <img
                  src="/scroodge.gif"
                  alt="Celebration"
                  className="celebration-gif"
              />
          )}
        </main>
      </>
  );
}