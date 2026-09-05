import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, X, Radio } from 'lucide-react';

export default function AudioPlayerBar({ order, isPlaying, onTogglePlay, onClose }) {
  const [speechSynth, setSpeechSynth] = useState(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSynth(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    if (!speechSynth) return;

    if (isPlaying) {
      speechSynth.cancel(); // Reset any previous speech
      const textToRead = `${order.title}. ${order.executiveSummary}. Immediate action required: ${order.nextAction.title}. Deadline: ${order.nextAction.deadline}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        onTogglePlay(false);
      };
      speechSynth.speak(utterance);
    } else {
      speechSynth.cancel();
    }

    return () => {
      if (speechSynth) speechSynth.cancel();
    };
  }, [isPlaying, order, speechSynth]);

  if (!isPlaying) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl p-3.5 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold animate-pulse shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <h4 className="text-xs font-bold text-slate-100">Audio Explainer Active</h4>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-[200px]">{order.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTogglePlay(!isPlaying)}
            className="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
