import { useCallback, useRef } from 'react';

// Single shared AudioContext instance
let sharedAudioContext: AudioContext | null = null;

const getSharedAudioContext = (): AudioContext => {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return sharedAudioContext;
};

export const useCelebrationSound = () => {
  const hasPlayedRef = useRef(false);

  const playTadah = useCallback(async () => {
    // Prevent double-play
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    
    // Reset after a short delay
    setTimeout(() => {
      hasPlayedRef.current = false;
    }, 1000);

    try {
      const audioContext = getSharedAudioContext();
      
      // Resume AudioContext if suspended (required for iOS/mobile)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const playNote = (frequency: number, startTime: number, duration: number, type: OscillatorType = 'sine') => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioContext.currentTime;
      
      // Fanfare "TA-DAH!" pattern
      playNote(523.25, now, 0.15, 'square');        // C5
      playNote(659.25, now + 0.15, 0.15, 'square'); // E5
      playNote(783.99, now + 0.3, 0.5, 'square');   // G5 (held longer)
      playNote(1046.5, now + 0.3, 0.5, 'sine');     // C6 (harmony)
      
      // Sparkle effect
      for (let i = 0; i < 5; i++) {
        playNote(1500 + Math.random() * 1000, now + 0.5 + i * 0.1, 0.1, 'sine');
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  }, []);

  return { playTadah };
};

// Function to unlock audio on first user interaction (call this on touch/click)
export const unlockAudio = async () => {
  try {
    const audioContext = getSharedAudioContext();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    // Play a silent sound to fully unlock on iOS
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.001);
  } catch (e) {
    // Ignore errors
  }
};
