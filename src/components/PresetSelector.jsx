import React from 'react';
import { FileCode, Sparkles, ChevronRight, Layers } from 'lucide-react';

export default function PresetSelector({ sampleOrders, activeOrderId, onSelectOrder }) {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Demo Scenarios (5 Key Court Order Types)
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Select an example to see real-time source alignment
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {sampleOrders.map((order, idx) => {
            const isActive = order.id === activeOrderId;
            return (
              <button
                key={order.id}
                onClick={() => onSelectOrder(order.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-md shadow-amber-500/10'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}>
                  {idx + 1}
                </span>
                <div className="text-left">
                  <div className="font-semibold text-slate-200">{order.category}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{order.title}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
