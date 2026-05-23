import React, { useState } from "react";
import { Hotel, Room, Booking } from "../types";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Calendar, CreditCard, Loader2, Sparkles, CheckCircle, ArrowRight, ShieldCheck, DollarSign } from "lucide-react";

interface BookingSystemProps {
  hotel: Hotel;
  selectedRoom: Room | null;
  userId: string;
  userEmail: string;
  onBookingComplete: (newBooking: Booking) => void;
}

export default function BookingSystem({
  hotel,
  selectedRoom,
  userId,
  userEmail,
  onBookingComplete,
}: BookingSystemProps) {
  const room = selectedRoom || hotel.rooms[0];

  const [checkIn, setCheckIn] = useState<string>("2026-06-15");
  const [checkOut, setCheckOut] = useState<string>("2026-06-18");
  const [guests, setGuests] = useState<number>(2);

  const [checkingOut, setCheckingOut] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate days difference
  const date1 = new Date(checkIn);
  const date2 = new Date(checkOut);
  const durationDays = Math.max(1, Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)) || 1);
  const totalPrice = room.pricePerNight * durationDays;

  const handleCheckoutPayment = async () => {
    setCheckingOut(true);
    setError(null);

    const bookingId = "bk_" + Math.random().toString(36).substr(2, 9).toUpperCase();

    // 1. Invoke mock Stripe backend proxy for luxury telemetry check out
    const payload = {
      bookingId,
      hotelName: hotel.name,
      roomType: room.name,
      totalPrice,
      email: userEmail || "pioneer@stayfinderx.ai"
    };

    try {
      const stripeRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!stripeRes.ok) {
        throw new Error("Stripe terminal offline.");
      }

      const stripeSession = await stripeRes.json();

      // 2. Persist booking transaction to official Cloud Firestore database!
      const bookingRecord: Booking = {
        id: bookingId,
        userId: userId || "anonymous_pioneer",
        hotelId: hotel.id,
        hotelName: hotel.name,
        roomType: room.name,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        status: "confirmed",
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, "bookings", bookingId), bookingRecord);
      } catch (fsErr) {
        // Log formatted diagnostics error as required by Firebase integration skill
        handleFirestoreError(fsErr, OperationType.WRITE, `bookings/${bookingId}`);
      }

      // 3. Callback to parent state & render molecular receipt
      onBookingComplete(bookingRecord);
      setReceipt({
        booking: bookingRecord,
        stripe: stripeSession
      });
    } catch (err: any) {
      console.error(err);
      setError("Payment network failed. Check security permissions and try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div id="booking-system-wrapper" className="flex flex-col gap-5 p-6 glass rounded-[32px]">
      {receipt ? (
        /* Dynamic Receipt Panel - Immersive UI Success */
        <div id="receipt-success" className="flex flex-col gap-4 text-center py-6">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] flex items-center justify-center animate-pulse">
              <CheckCircle className="h-6 w-6 text-[#D4AF37]" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">Biometrics Verified</span>
            <h4 className="serif text-xl font-medium text-white mt-1">Stellar Passage Confirmed</h4>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              Reserving stay for {receipt.booking.hotelName} ({receipt.booking.roomType}).
            </p>
          </div>

          <div className="border-t border-dashed border-white/10 my-2"></div>

          {/* Molecular details list */}
          <div className="flex flex-col gap-2 bg-[#050505]/80 p-4 rounded-[20px] text-left border border-white/5 font-mono text-[10px] text-white/50">
            <div className="flex justify-between">
              <span>RESERVATION_ID:</span>
              <span className="text-white">{receipt.booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span>CHECK_IN_CYCLE:</span>
              <span className="text-[#D4AF37]">{receipt.booking.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span>STAY_LENGTH:</span>
              <span className="text-[#D4AF37]">{durationDays} Night(s)</span>
            </div>
            <div className="border-t border-white/5 my-1.5"></div>
            <div className="flex justify-between text-xs font-bold">
              <span>TOTAL_TRANSFERRED:</span>
              <span className="text-[#D4AF37]">${receipt.booking.totalPrice} USD</span>
            </div>
            <div className="flex justify-between text-[9px] text-white/30 mt-1">
              <span>STRIPE_TRANSACTION:</span>
              <span>{receipt.stripe.transactionId}</span>
            </div>
            <div className="flex justify-between text-[9px] text-white/30">
              <span>QUANTUM_AUTH_CODE:</span>
              <span>{receipt.stripe.authCode}</span>
            </div>
          </div>

          <span className="text-[9px] text-white/40 font-mono mt-1 flex items-center gap-1 justify-center">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Digital receipt securely committed to official Firestore logs network.
          </span>
          
          <button
            onClick={() => setReceipt(null)}
            className="mt-3 py-2 text-xs bg-[#050505] text-[#D4AF37] font-semibold font-sans border border-white/10 rounded-full hover:bg-white hover:text-black hover:border-transparent transition-all cursor-pointer"
          >
            Book Another Passage
          </button>
        </div>
      ) : (
        /* Reservation form and interactive price index comparisons */
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Sparkles className="h-3 w-3 animate-pulse text-[#D4AF37]" /> INSTANT RESERVATION PORTAL
            </span>
            <h3 className="serif text-xl font-medium text-white tracking-tight mt-1">
              Lock In Your Passage
            </h3>
          </div>

          <div className="border-t border-white/5 my-1"></div>

          {/* Core inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Check-In</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-4 py-2 bg-[#050505]/80 border border-white/10 rounded-full text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Check-Out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-4 py-2 bg-[#050505]/80 border border-white/10 rounded-full text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 font-sans">
            <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Pioneer Guests count</label>
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-[#050505]/80 border border-white/10 rounded-full text-white text-xs focus:outline-none"
            >
              <option value="1">1 Spacefarer</option>
              <option value="2">2 Spacefarers</option>
              <option value="3">3 Spacefarers</option>
              <option value="4">4 Spacefarers</option>
            </select>
          </div>

          {/* Pricing Indexes comparison metrics */}
          <div className="flex flex-col gap-2.5 bg-[#050505]/60 p-4 rounded-[20px] border border-white/5 font-mono text-[10px] text-white/50">
            <span className="text-[9px] uppercase font-bold text-[#D4AF37] tracking-wider">StayFinder X Pricing Index Comp</span>
            <div className="flex justify-between items-center text-xs font-bold text-[#D4AF37] border-b border-white/5 pb-1.5">
              <span>Direct Link booking:</span>
              <span className="flex items-center"><DollarSign className="h-3 w-3" /> {totalPrice} Total</span>
            </div>
            <div className="flex justify-between items-center">
              <span>OrbitTravel Index:</span>
              <span className="line-through flex items-center text-white/30"><DollarSign className="h-2.5 w-2.5" /> {(hotel.priceComparison.orbitTravel * durationDays)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Galactic Expedia rate:</span>
              <span className="line-through flex items-center text-white/30"><DollarSign className="h-2.5 w-2.5" /> {(hotel.priceComparison.galacticExpedia * durationDays)}</span>
            </div>
            <div className="text-[8px] text-[#D4AF37] font-medium tracking-wide">
              * Lowest rates auto-asserted by StayFinder X index.
            </div>
          </div>

          {error && <p className="text-[10px] text-red-400 font-mono">{error}</p>}

          <button
            onClick={handleCheckoutPayment}
            disabled={checkingOut}
            className="w-full py-3 bg-[#D4AF37] hover:bg-white text-black font-sans font-bold uppercase tracking-widest rounded-full text-xs flex items-center justify-center gap-1.5 transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            {checkingOut ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Interfacing stripe node...
              </>
            ) : (
              <>
                <CreditCard className="h-3.5 w-3.5" />
                Complete Passage Checkout
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
