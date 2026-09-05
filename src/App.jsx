import React, { useState } from 'react';
import Header from './components/Header';
import DisclaimerBanner from './components/DisclaimerBanner';
import PresetSelector from './components/PresetSelector';
import CourtOrderViewer from './components/CourtOrderViewer';
import PlainExplainerViewer from './components/PlainExplainerViewer';
import GlossaryModal from './components/GlossaryModal';
import UploadModal from './components/UploadModal';
import AudioPlayerBar from './components/AudioPlayerBar';
import { SAMPLE_ORDERS } from './data/sampleOrders';
import { ShieldCheck, BookOpen, ExternalLink, Scale, Sparkles } from 'lucide-react';

export default function App() {
  const [customOrders, setCustomOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(SAMPLE_ORDERS[0].id);
  const [activeParagraphId, setActiveParagraphId] = useState(SAMPLE_ORDERS[0].paragraphs[0].id);
  const [selectedLang, setSelectedLang] = useState('en');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [glossaryTerm, setGlossaryTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const allOrders = [...SAMPLE_ORDERS, ...customOrders];
  const activeOrder = allOrders.find(o => o.id === activeOrderId) || allOrders[0];

  const handleSelectOrder = (orderId) => {
    setActiveOrderId(orderId);
    const selected = allOrders.find(o => o.id === orderId);
    if (selected && selected.paragraphs.length > 0) {
      setActiveParagraphId(selected.paragraphs[0].id);
    }
  };

  const handleCustomUpload = (newOrder) => {
    setCustomOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    if (newOrder.paragraphs.length > 0) {
      setActiveParagraphId(newOrder.paragraphs[0].id);
    }
  };

  const handleOpenGlossary = (term = '') => {
    setGlossaryTerm(term);
    setIsGlossaryOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">

      {/* 1. Top Header */}
      <Header
        onOpenUpload={() => setIsUploadOpen(true)}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        isPlayingAudio={isPlayingAudio}
        toggleAudio={() => setIsPlayingAudio(!isPlayingAudio)}
        onOpenGlossary={() => handleOpenGlossary()}
      />

      {/* 2. Educational & Legal Disclaimer Bar */}
      <DisclaimerBanner />

      {/* 3. Demo Scenario Selector Bar */}
      <PresetSelector
        sampleOrders={allOrders}
        activeOrderId={activeOrderId}
        onSelectOrder={handleSelectOrder}
      />

      {/* 4. Main Dual-Pane Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[680px]">

        {/* Left Pane: Original Court Document */}
        <CourtOrderViewer
          order={activeOrder}
          activeParagraphId={activeParagraphId}
          setActiveParagraphId={setActiveParagraphId}
          onOpenGlossary={handleOpenGlossary}
        />

        {/* Right Pane: Source-Verified Plain Language Explainer */}
        <PlainExplainerViewer
          order={activeOrder}
          activeParagraphId={activeParagraphId}
          setActiveParagraphId={setActiveParagraphId}
          selectedLang={selectedLang}
          onOpenGlossary={handleOpenGlossary}
        />

      </main>

      {/* 5. Empirical Impact Footbar */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Adalat Companion • Bridging the Legal Readability Gap in India</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>
              <strong>84.5%</strong> citizens find legal texts difficult (DAKSH / SARAL 2025)
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Source-Grounded Architecture</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-amber-400/90 font-medium">Self-Represented Litigant First</span>
          </div>
        </div>
      </footer>

      {/* 6. Modals & Audio Player */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        highlightTerm={glossaryTerm}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onCustomUpload={handleCustomUpload}
      />

      <AudioPlayerBar
        order={activeOrder}
        isPlaying={isPlayingAudio}
        onTogglePlay={setIsPlayingAudio}
        onClose={() => setIsPlayingAudio(false)}
      />

    </div>
  );
}
