import React from 'react';
import { GlassCard, Button } from '../../components/UI';

export const ComplaintsSystem = () => (
  <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex gap-6">
    <GlassCard className="w-1/3 flex flex-col p-0 overflow-hidden">
      <div className="p-4 border-b border-white/10 font-bold">Open Tickets</div>
      <div className="flex-1 overflow-y-auto">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 ${i === 1 ? 'bg-white/5 border-l-2 border-l-primary' : ''}`}>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-sm">Ticket #{1000+i}</span>
              <span className="text-xs text-red-400">High</span>
            </div>
            <div className="text-sm text-white/70 truncate">Driver was very rude and...</div>
            <div className="text-xs text-white/40 mt-2">2 hours ago</div>
          </div>
        ))}
      </div>
    </GlassCard>
    <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <div className="font-bold">Ticket #1001</div>
          <div className="text-sm text-white/50">Reported by: Passenger Aathi</div>
        </div>
        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">Open</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        <div className="bg-white/5 p-3 rounded-xl rounded-tl-none max-w-[80%] self-start text-sm">
          The driver was very rude and drove recklessly. I felt unsafe.
        </div>
        <div className="bg-primary/20 text-primary p-3 rounded-xl rounded-tr-none max-w-[80%] self-end text-sm">
          We apologize for the experience. We are investigating this immediately.
        </div>
      </div>
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input type="text" placeholder="Type a reply..." className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        <Button className="py-2 px-6">Send</Button>
      </div>
    </GlassCard>
  </div>
);
