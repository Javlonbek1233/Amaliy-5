import React, { useState } from "react";
import { ItineraryItem, Hotel, Booking } from "../types";
import { Sparkles, Compass, AlertCircle, PlaneTakeoff, Loader2, Calendar, ShieldCheck, Check } from "lucide-react";

interface AiTripPlannerProps {
  hotels: Hotel[];
  userId: string;
  onInstantBookPlan: (hotelId: string, roomType: string, cost: number, days: number) => void;
}

export default function AiTripPlanner({
  hotels,
  userId,
  onInstantBookPlan,
}: AiTripPlannerProps) {
  const [destination, setDestination] = useState<string>("Orbit & Shibuya Neon Crawl");
  const [days, setDays] = useState<number>(3);
  const [budget, setBudget] = useState<string>("Elite Platinum");
  const [interests, setInterests] = useState<string>("Gravity wellness, molecular dining, cybernetic recovery");
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<any | null>(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    setItinerary(null);
    setBookingSuccessMsg(null);

    const payload = {
      destination,
      days,
      budget,
      designTheme: "Space stations, deep-sea research, luxury cloud spikes",
      travelerNeeds: interests
    };

    try {
      const response = await fetch("/api/gemini/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Quantum gateway timed out.");
      }

      const data = await response.json();
      setItinerary(data);
    } catch (err: any) {
      setError("Unable to process spatial trip parameters. Please check your system link.");
    } finally {
      setLoading(false);
    }
  };

  const executeInstantBooking = (hotelId: string) => {
    const hotel = hotels.find(h => h.id === hotelId);
    if (!hotel) return;

    // Use standard rooms
    const targetRoom = hotel.rooms[0] || { name: "Suite Room", pricePerNight: hotel.pricePerNight };
    const totalPrice = targetRoom.pricePerNight * days;

    onInstantBookPlan(hotelId, targetRoom.name, totalPrice, days);
    setBookingSuccessMsg(`Luxury booking successfully processed for ${hotel.name}!`);
    setTimeout(() => setBookingSuccessMsg(null), 6000);
  };

  return (
    <div id="ai-trip-planner-module" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Parameter inputs control panel (cols-4) */}
      <div className="lg:col-span-4 flex flex-col gap-4 p-6 glass rounded-[32px]">
        <div>
          <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1 font-mono">
            <Sparkles className="h-3 w-3 animate-pulse text-[#D4AF37]" /> SPACE INTEL TRIP FORGING
          </span>
          <h3 className="serif text-xl font-medium text-white tracking-tight mt-1">
            Custom AI Itinerary
          </h3>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">
            Formulate a fully contextualized multi-night blueprint powered by Gemini AI.
          </p>
        </div>

        <div className="border-t border-white/5 my-1"></div>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          {/* Destination Focus */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Target Orbit/Metropolis Focus</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Orbital Station and Tokyo"
              className="w-full px-4 py-2 text-xs bg-[#050505]/80 border border-white/10 rounded-full text-white font-sans focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Days */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Stay Duration (microcycles)</label>
            <input
              type="number"
              min={1}
              max={7}
              value={days}
              onChange={(e) => setDays(Math.min(7, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-2 text-xs bg-[#050505]/80 border border-white/10 rounded-full text-white font-mono focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Budget Grade */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Global Budget Grade</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-2 text-xs bg-[#050505]/80 border border-white/10 rounded-full text-white font-sans focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="Elite Platinum">Elite Platinum ($10,000+ per cycle)</option>
              <option value="Imperial Gold">Imperial Gold ($5,000+ per cycle)</option>
              <option value="Silicon Core">Silicon Core ($2,000+ per cycle)</option>
            </select>
          </div>

          {/* Custom Interests / Needs */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Specialized Desires & Wellness</label>
            <textarea
              rows={3}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. zero-g swimming, anti-aging spas, cybernetic dining"
              className="w-full px-4 py-2.5 text-xs bg-[#050505]/80 border border-white/10 rounded-[20px] text-white font-sans focus:outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#D4AF37] hover:bg-white text-black font-sans font-bold uppercase tracking-widest rounded-full text-xs flex items-center justify-center gap-1.5 transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Forging Quantum Blueprint...
              </>
            ) : (
              <>
                <PlaneTakeoff className="h-3.5 w-3.5" />
                Forge AI Stay Itinerary
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual output screens (cols-8) */}
      <div className="lg:col-span-8 flex flex-col min-h-64 p-6 glass rounded-[32px] justify-center">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-12 w-12 rounded-full border-2 border-[#D4AF37]/20 animate-ping"></span>
              <Compass className="h-8 w-8 text-[#D4AF37] animate-[spin_5s_linear_infinite]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-sans font-medium text-white animate-pulse">Syncing Orbital Spaceports & Deep Sea Domes</span>
              <p className="text-[10px] text-white/40 font-mono tracking-widest">ALIGNING MAG-LEV CONDUITS • PARSING GEODESIC BIOSHAPES</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-8 text-center text-red-400">
            <AlertCircle className="h-8 w-8" />
            <p className="text-xs font-mono">{error}</p>
          </div>
        )}

        {!loading && !error && !itinerary && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-white/30">
            <Calendar className="h-10 w-10 text-white/10" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">No itinerary generated. Specify stay details & forge flight plans.</span>
          </div>
        )}

        {/* Saved Success Notification */}
        {bookingSuccessMsg && (
          <div className="mb-4 flex items-center gap-2.5 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-xs">
            <ShieldCheck className="h-4.5 w-4.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px] font-mono">{bookingSuccessMsg}</span>
          </div>
        )}

        {!loading && itinerary && (
          <div className="flex flex-col gap-6">
            {/* Itinerary Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
              <div>
                <span className="text-[9px] font-mono uppercase text-white/40 tracking-widest">Target Area:</span>
                <h4 className="serif text-2xl text-white font-medium tracking-tight mt-0.5">{itinerary.destination}</h4>
                <p className="text-[10px] text-[#D4AF37] font-mono mt-1 tracking-wider uppercase">DURATION: {itinerary.duration} NIGHTS • BUDGET LEVEL: {itinerary.budget.toUpperCase()}</p>
              </div>
            </div>

            {/* Day by Day custom collapse */}
            <div className="flex flex-col gap-4">
              {itinerary.itinerary?.map((dayPlan: ItineraryItem) => (
                <div key={dayPlan.day} className="flex gap-4 p-4 rounded-[20px] bg-[#050505]/60 border border-white/5">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[11px] font-mono text-[#D4AF37] font-bold shrink-0">
                    D0{dayPlan.day}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="serif text-sm font-medium text-white">{dayPlan.title}</span>
                    <ul className="flex flex-col gap-1.5 list-disc pl-4 text-xs text-white/60 leading-relaxed font-sans">
                      {dayPlan.activities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Matched system hotels suggestion links */}
            {itinerary.hotelsMatched?.length > 0 && (
              <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Matched StayFinder Hotel Modules:</span>
                <div className="flex flex-wrap gap-4">
                  {itinerary.hotelsMatched.map((matchId: string) => {
                    const matchHotel = hotels.find(h => h.id === matchId);
                    if (!matchHotel) return null;
                    return (
                      <div
                        key={matchId}
                        className="flex items-center justify-between gap-4 p-3.5 rounded-[20px] glass w-full sm:w-72"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-sans font-medium text-white">{matchHotel.name}</span>
                          <span className="text-[10px] text-[#D4AF37] font-mono font-bold mt-0.5">${matchHotel.pricePerNight} / cycle</span>
                        </div>
                        <button
                          onClick={() => executeInstantBooking(matchHotel.id)}
                          className="px-4 py-1.5 text-[10px] bg-[#D4AF37] hover:bg-white text-black font-semibold uppercase tracking-wider font-mono rounded-full transition-all cursor-pointer shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                        >
                          Book Stay
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
