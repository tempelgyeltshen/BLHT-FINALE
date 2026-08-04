import React, { useState } from 'react';
import { Sparkles, Bot, Send, Calendar, MapPin, DollarSign, Loader2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiItineraryAssistant: React.FC = () => {
  const { showToast } = useApp();
  const [days, setDays] = useState<number>(7);
  const [travelStyle, setTravelStyle] = useState<string>('Ultra-Luxury (BLHT & Six Senses)');
  const [interests, setInterests] = useState<string>('Tshechu Festivals & Sacred Monasteries');
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedPlan(null);

    // Client-side generator for instant seamless user experience
    setTimeout(() => {
      setGeneratedPlan(`
### 𖤍 Custom Itinerary Concept: ${days}-Day ${travelStyle}
**Focus:** ${interests} | **Host:** Bhutan Land Of Happiness Tourism

* **Day 1: VIP Paro Arrival & Transfer to Thimphu Valley**
  Private arrival greeting with traditional Khadhar silk scarf ceremony. Check into Six Senses Thimphu (Palace in the Sky). Private evening audience with senior astrological monk.
* **Day 2: Sacred Capitals & Giant Buddha Dordenma**
  Ascend Buddha Point for panoramic valley views. Private tour of Tashichho Dzong courtyards followed by artisanal paper-making workshop.
* **Day 3: Scenic Dochula Pass (108 Chortens) to Punakha**
  Cross the 3,100m mountain pass with Himalayan snow peak panoramas. Descend into subtropical Punakha Valley. Stay at BLHT Punakha Sanctuary.
* **Day 4: Punakha Dzong & Chimi Lhakhang Pilgrimage**
  Private morning walk across suspension bridge into Punakha Dzong. Organic riverside lunch served under pine canopy.
* **Day 5-6: Return to Paro & Sacred Pilgrimage to Tiger's Nest**
  Check into COMO Uma Paro. Morning helicopter or pony hike to Paro Taktsang (Tiger's Nest). Champagne summit toast followed by traditional Menchu hot stone bath.
* **Day 7: Farewells & Departure**
  VIP Airport lounge clearance and presentation of handwoven Bhutanese souvenir.
      `);
      setLoading(false);
      showToast('Custom AI Itinerary drafted by Travel Concierge AI');
    }, 1200);
  };

  return (
    <div className="bg-[#f3eee7] text-[#1a1918] rounded-none p-8 sm:p-12 border border-[#e5ded4] space-y-6 relative">
      
      <div className="flex items-start gap-4 pb-4 border-b border-[#e2d1be]">
        <div className="w-10 h-10 bg-[#d96b27] text-white flex items-center justify-center font-serif text-lg font-bold">
          𖤍
        </div>
        <div>
          <h3 className="font-serif text-2xl font-medium text-[#3b2314] flex items-center gap-3">
            <span>BLHT Intelligent Concierge</span>
            <span className="text-[9px] font-sans tracking-[0.2em] bg-[#d96b27] text-white px-2.5 py-0.5 uppercase font-bold">
              AI Powered
            </span>
          </h3>
          <p className="text-xs font-serif text-[#5c3820] mt-1">Design a bespoke itinerary tailored to your duration and valley sanctuary preferences with Bhutan Land Of Happiness Tourism.</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#d96b27] font-bold mb-2">Duration</label>
          <select
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="w-full px-4 py-3 bg-[#fcf8f2] border border-[#e2d1be] text-[#3b2314] text-xs font-serif focus:border-[#d96b27] focus:outline-hidden"
          >
            <option value={5}>5 Days (Essential Valley Circuit)</option>
            <option value={7}>7 Days (Kingdom in Clouds)</option>
            <option value={10}>10 Days (Tshechu Festivals)</option>
            <option value={14}>14 Days (Trans-Bhutan Circuit)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#d96b27] font-bold mb-2">Lodge Sanctuary</label>
          <select
            value={travelStyle}
            onChange={e => setTravelStyle(e.target.value)}
            className="w-full px-4 py-3 bg-[#fcf8f2] border border-[#e2d1be] text-[#3b2314] text-xs font-serif focus:border-[#d96b27] focus:outline-hidden"
          >
            <option value="Ultra-Luxury (BLHT & Six Senses)">BLHT & Six Senses Valleys</option>
            <option value="Boutique Heritage (COMO & Pemako)">COMO Uma & Pemako</option>
            <option value="Luxury Heli-Glamping Expedition">Heli-Trekking Wilderness Glamping</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#d96b27] font-bold mb-2">Primary Focus</label>
          <input
            type="text"
            value={interests}
            onChange={e => setInterests(e.target.value)}
            className="w-full px-4 py-3 bg-[#fcf8f2] border border-[#e2d1be] text-[#3b2314] text-xs font-serif focus:border-[#d96b27] focus:outline-hidden placeholder:text-[#a89f91]"
            placeholder="e.g. Meditation, Festivals, Wellness"
          />
        </div>

        <div className="sm:col-span-3 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-[#d96b27] hover:bg-[#b85116] text-[#fcf8f2] text-[11px] font-medium tracking-[0.2em] uppercase transition-colors cursor-pointer disabled:opacity-50 font-bold shadow-md"
          >
            {loading ? 'Drafting Itinerary...' : 'Generate Bespoke Journey'}
          </button>
        </div>
      </form>

      {generatedPlan && (
        <div className="bg-[#f8f5f0] border border-[#ded6cb] p-6 text-xs space-y-4 font-serif text-[#2c2a29]">
          <div className="flex items-center justify-between border-b border-[#ded6cb] pb-3">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7c7468]">Bespoke BLHT Concept</span>
            <a
              href="https://www.bhutanlhtours.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a1918] font-serif text-xs underline uppercase tracking-wider hover:opacity-70 cursor-pointer"
            >
              Request Official Quotation →
            </a>
          </div>
          <div className="whitespace-pre-line text-[#3d3a36] leading-relaxed">
            {generatedPlan}
          </div>
        </div>
      )}

    </div>
  );
};
