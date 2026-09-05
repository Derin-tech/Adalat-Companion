import { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Square } from 'lucide-react';

interface Props {
  textToRead: string;
  lang?: string;
  darkMode?: boolean;
}

export default function VoicePlayer({ textToRead, lang = 'en' }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!supported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const langMap: Record<string, string> = {
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      bn: 'bn-IN',
      ml: 'ml-IN',
      en: 'en-IN'
    };
    const targetLang = langMap[lang] || 'en-IN';
    const voice = voices.find(v => v.lang.includes(targetLang) || v.lang.includes(lang) || v.lang.includes('en'));
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (supported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const cycleSpeed = () => {
    const nextRate = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : rate === 1.5 ? 0.8 : 1;
    setRate(nextRate);
    if (isPlaying) {
      handleStop();
    }
  };

  if (!supported) return null;

  return (
    <div className="inline-flex items-center gap-2 p-1 px-3 rounded border border-slate-300 bg-white text-slate-800 text-xs font-bold shadow-sm">
      <Volume2 size={16} className="text-blue-900" />
      <span>{isPlaying ? 'Reading Aloud...' : isPaused ? 'Paused' : 'Audio Narration'}</span>

      {!isPlaying ? (
        <button
          onClick={handlePlay}
          className="p-1 rounded bg-blue-900 hover:bg-slate-900 text-white transition-colors"
          title="Play Audio Narration"
        >
          <Play size={12} className="fill-current" />
        </button>
      ) : (
        <button
          onClick={handlePause}
          className="p-1 rounded bg-amber-600 hover:bg-amber-700 text-white transition-colors"
          title="Pause Narration"
        >
          <Pause size={12} className="fill-current" />
        </button>
      )}

      {(isPlaying || isPaused) && (
        <button
          onClick={handleStop}
          className="p-1 rounded bg-rose-600 hover:bg-rose-700 text-white transition-colors"
          title="Stop"
        >
          <Square size={10} className="fill-current" />
        </button>
      )}

      <button
        onClick={cycleSpeed}
        className="px-1.5 py-0.5 text-[10px] font-bold rounded border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800"
        title="Change Speed"
      >
        {rate}x
      </button>
    </div>
  );
}
