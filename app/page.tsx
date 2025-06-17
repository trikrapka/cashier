'use client'; // This must be the very first line

import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Configuration ---
// CORRECTED PATH: The path should start with '/' and point to the filename
// in your `public` directory.
const SOUND_FILE_PATH = '/applepay.mp3';

const BANKNOTE_ANIMATION_DURATION = 2000;
const CONFETTI_ANIMATION_DURATION = 1000;

// --- TypeScript Type Definitions ---
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

// --- Main Page Component ---
export default function UltimateButtonPage() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [banknotes, setBanknotes] = useState<Banknote[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Set up the audio player on the client side
  useEffect(() => {
    audioRef.current = new Audio(SOUND_FILE_PATH);
    audioRef.current.preload = 'auto';
  }, []);

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
    setConfetti(prev => [...prev, ...newConfetti]);
    setTimeout(() => setConfetti([]), CONFETTI_ANIMATION_DURATION);

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
                    background-color: #020617; color: white; display: flex;
                    align-items: center; justify-content: center;
                    height: 100vh; width: 100vw; overflow: hidden;
                }
                .total-display {
                    position: absolute; top: 24px; left: 24px;
                    background-color: #1e293b; padding: 12px 20px;
                    border-radius: 8px; font-size: 18px; font-weight: bold;
                    color: #e2e8f0; z-index: 30;
                }
                .update-button {
                    background-color: #2563eb; color: white; font-weight: bold;
                    padding: 16px 48px; border-radius: 12px; font-size: 24px;
                    border: none; cursor: pointer; transition: all 0.2s ease;
                    z-index: 10; box-shadow: 0 0 25px rgba(59, 130, 246, 0.7), 0 0 45px rgba(59, 130, 246, 0.4);
                }
                .update-button:hover { background-color: #3b82f6; }
                .update-button:active { transform: scale(0.95); }
                @keyframes fade-out-and-up { to { opacity: 0; transform: scale(0.5) translateY(-60px); } }
                .animate-confetti { animation: fade-out-and-up ${CONFETTI_ANIMATION_DURATION}ms ease-out forwards; }
                .banknote {
                    position: fixed; width: 150px; height: 70px;
                    background-color: #2E8540; border: 2px solid #145A32;
                    color: #fff; display: flex; align-items: center;
                    justify-content: center; font-size: 24px; font-weight: bold;
                    border-radius: 8px; z-index: 20; transform: translate(-50%, -50%);
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
          <button ref={buttonRef} onClick={handleUpdateClick} className="update-button">Update</button>
        </main>
      </>
  );
}