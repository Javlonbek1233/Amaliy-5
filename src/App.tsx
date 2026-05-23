import React, { useState, useEffect } from "react";
import { FUTURISTIC_HOTELS } from "./data";
import { Hotel, Room, Booking, Review, TripPlan } from "./types";
import { db, auth } from "./firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";

import HotelDiscoveryMap from "./components/HotelDiscoveryMap";
import RoomShowcase from "./components/RoomShowcase";
import AiTripPlanner from "./components/AiTripPlanner";
import BookingSystem from "./components/BookingSystem";

import {
  Compass,
  Star,
  MapPin,
  Layers,
  Sparkles,
  User,
  LogOut,
  Search,
  Bookmark,
  PlusCircle,
  ShieldCheck,
  PlaneTakeoff,
  Award,
  Database,
  Loader2
} from "lucide-react";

export default function App() {
  const [hotels, setHotels] = useState<Hotel[]>(FUTURISTIC_HOTELS);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(FUTURISTIC_HOTELS[0]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(FUTURISTIC_HOTELS[0].rooms[0]);
  const [activeTab, setActiveTab] = useState<"explore" | "ai-planner" | "my-bookings">("explore");
  
  // Filtering states
  const [vibeFilter, setVibeFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Firebase Auth states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("xasanboyshixnazorov@gmail.com"); // Custom user pre-filled email
  const [userId, setUserId] = useState<string>("pioneer_x_sh");

  // Local storage backup & Firestore synced bookings
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);

  // Review states for current selected hotel
  const [reviewsList, setReviewsList] = useState<Review[]>([
    {
      id: "rev-1",
      hotelId: "aetheria-orbit",
      userId: "usr-alpha",
      userName: "Nora Vance [ORBITAL PILOT]",
      rating: 5,
      comment: "Floating 400km above the clouds is truly transcendent. The gravity spa loops made zero-G living so comforting. Highly recommended!",
      createdAt: "2026-05-20"
    },
    {
      id: "rev-2",
      hotelId: "neo-shibuya",
      userId: "usr-beta",
      userName: "Kaito Chen",
      rating: 4.8,
      comment: "The cyberpunk vibes here are legendary. Hovercab dropped me straight at the high-rise suite. Synced my brain sleepwaves perfectly.",
      createdAt: "2026-05-18"
    }
  ]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  // Auto-authentication state detection
  useEffect(() => {
    // Attempt standard sign-in if no auth state exists
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setUserId(user.uid);
        if (user.email) setUserEmail(user.email);
      } else {
        // Automatically tie an anonymous session for instant access without onboarding hurdles
        signInAnonymously(auth).catch(err => console.log("Auth Simulation Active"));
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch reservations from Firestore dynamically whenever the tab focus changes
  useEffect(() => {
    if (!userId) return;

    const fetchReservations = async () => {
      setLoadingBookings(true);
      try {
        const bookingsRef = collection(db, "bookings");
        // Secure Query enforcing (Pillar 8: Secure query limits)
        const q = query(bookingsRef, where("userId", "==", userId));
        const snap = await getDocs(q);
        const docsList: Booking[] = [];
        snap.forEach((doc) => {
          docsList.push(doc.data() as Booking);
        });
        setBookingHistory(docsList);
      } catch (err) {
        console.warn("Using offline / fallback persistence structures.");
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchReservations();
  }, [userId, activeTab]);

  const handleSelectHotel = (hotelId: string) => {
    const found = hotels.find(h => h.id === hotelId);
    if (found) {
      setSelectedHotel(found);
      setSelectedRoom(found.rooms[0] || null);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedHotel) return;

    const reviewId = "rev_" + Math.random().toString(36).substr(2, 9);
    const reviewData: Review = {
      id: reviewId,
      hotelId: selectedHotel.id,
      userId: userId || "guest_pioneer",
      userName: userEmail.split("@")[0].toUpperCase() + " [TRAVELER]",
      rating: newRating,
      comment: newComment,
      createdAt: new Date().toISOString().split("T")[0]
    };

    // Save locally
    setReviewsList(prev => [reviewData, ...prev]);

    // Save to Firestore reviews list
    try {
      await addDoc(collection(db, "reviews"), reviewData);
    } catch (fsErr) {
      console.warn("Stored review locally.");
    }

    setNewComment("");
  };

  const handleNewBookingComplete = (booking: Booking) => {
    setBookingHistory(prev => [booking, ...prev]);
  };

  // List of vibe categories to filter
  const vibeCategories = ["All", "Galactic Orbital", "Deep Ocean", "Cyberpunk Neon", "Martian Bio-Dome", "Glacial Aurora", "Sky Pod Aerial"];

  const filteredHotels = hotels.filter((hotel) => {
    const matchesVibe = vibeFilter === "All" || hotel.vibe === vibeFilter;
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVibe && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden relative">
      
      {/* Immersive Gold Glow & Spatial Stars Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-900/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/8 right-1/4 w-[500px] h-[500px] bg-yellow-950/5 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-40 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* StayFinder X Top Navigation Bar conforming to Immersive UI */}
      <header className="relative z-10 border-b border-white/5 bg-[#050505] sticky top-0 px-6 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Immersive Rotating Gold Badge Logo */}
          <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] flex items-center justify-center animate-[spin_12s_linear_infinite] relative">
            <div className="w-4 h-4 bg-[#D4AF37] rounded-sm rotate-45"></div>
          </div>
          <div>
            <h1 className="text-md sm:text-xl font-bold tracking-tighter uppercase text-white font-display">
              STAYFINDER<span className="text-[#D4AF37]">X</span>
            </h1>
            <span className="text-[8px] font-mono text-[#D4AF37] uppercase tracking-widest block -mt-0.5">Ultra-Premium Network active</span>
          </div>
        </div>

        {/* Global luxury tab nodes */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest">
          <button
            onClick={() => setActiveTab("explore")}
            className={`cursor-pointer transition-all ${
              activeTab === "explore" ? "text-white border-b-2 border-[#D4AF37] pb-2 font-semibold" : "text-white/60 hover:text-white"
            }`}
          >
            Explore Resorts
          </button>
          <button
            onClick={() => setActiveTab("ai-planner")}
            className={`cursor-pointer transition-all ${
              activeTab === "ai-planner" ? "text-white border-b-2 border-[#D4AF37] pb-2 font-semibold" : "text-white/60 hover:text-white"
            }`}
          >
            AI Trip Planner
          </button>
          <button
            onClick={() => setActiveTab("my-bookings")}
            className={`cursor-pointer transition-all ${
              activeTab === "my-bookings" ? "text-white border-b-2 border-[#D4AF37] pb-2 font-semibold" : "text-white/60 hover:text-white"
            }`}
          >
            My Bookings ({bookingHistory.length})
          </button>
        </nav>

        {/* User Telemetry Profile Box in Immersive Design */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest font-mono">AI Personal Assistant</span>
            <span className="text-xs text-white/80 font-sans">Welcome, Alexander</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B732A] p-[1px]">
            <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <User className="h-4 w-4 text-[#D4AF37]" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Visual Header Banner (Welcome & Status) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-4">
        {/* Mobile Nav Drawer */}
        <div className="flex md:hidden items-center justify-center gap-4 p-1 rounded-xl mb-6 glass">
          <button
            onClick={() => setActiveTab("explore")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-medium uppercase tracking-wider transition-all flex-1 ${
              activeTab === "explore" ? "bg-[#D4AF37] text-black font-semibold" : "text-white/60"
            }`}
          >
            Resorts
          </button>
          <button
            onClick={() => setActiveTab("ai-planner")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-medium uppercase tracking-wider transition-all flex-1 ${
              activeTab === "ai-planner" ? "bg-[#D4AF37] text-black font-semibold" : "text-white/60"
            }`}
          >
            AI Planner
          </button>
          <button
            onClick={() => setActiveTab("my-bookings")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-medium uppercase tracking-wider transition-all flex-1 ${
              activeTab === "my-bookings" ? "bg-[#D4AF37] text-black font-semibold" : "text-white/60"
            }`}
          >
            Bookings ({bookingHistory.length})
          </button>
        </div>

        {/* Welcome Pitch badge */}
        <div id="welcome-telemetry-badge" className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full mb-6">
          <Sparkles className="h-3.5 w-3.5 text-[#D4AF37] animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
            STRIPE PRIVATE OVERLAY & REAL-TIME CLOUD FIRESTORE SYNCHRONIZED
          </span>
        </div>

        {/* Bold Title */}
        <div className="flex flex-col gap-1 md:flex-row md:items-end justify-between">
          <div>
            <h2 className="text-4xl sm:text-6xl font-display text-white tracking-tight font-light leading-none">
              StayFinder <strong className="serif italic text-[#D4AF37] font-normal">X</strong>
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-3 max-w-2xl leading-relaxed">
              Unlock vertical luxury with floor-to-ceiling smart glass, autonomous butler service, and gravity-defying architecture across orbital space stations & underwater geodesic oases.
            </p>
          </div>
        </div>
      </div>

      {/* Main Tab Panels Router */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pb-16">
        
        {/* TAB 1: EXPLORE & BOOKINGS (Cinematic Hotel Galleries & Maps) */}
        {activeTab === "explore" && (
          <div id="explore-resorts-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-5 animate-fadeIn">
            
            {/* Left Sidebar Layout - Hotel list cards & filters (cols-5) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Search & Vibe Filters - Conforming to Immersive Glass Container */}
              <div className="glass p-6 rounded-[32px] flex flex-col gap-4">
                <div className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span> Search Query Radar
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search coordinates or destinations..."
                    className="w-full bg-[#050505]/80 border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]/50 font-sans"
                  />
                  <Search className="absolute right-4 top-2.5 h-3.5 w-3.5 text-white/40" />
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <span className="text-[10px] uppercase text-white/40 tracking-widest font-mono font-medium">Destination Type</span>
                  <div className="flex flex-wrap gap-1.5">
                    {vibeCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setVibeFilter(cat)}
                        className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-sans rounded-full border text-center cursor-pointer transition-all duration-300 ${
                          vibeFilter === cat
                            ? "bg-[#D4AF37] border-transparent text-black font-semibold shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                            : "bg-white/5 border-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic hotel item list with Glass styling */}
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
                {filteredHotels.length > 0 ? (
                  filteredHotels.map((hotel) => {
                    const isSelected = selectedHotel?.id === hotel.id;
                    return (
                      <div
                        key={hotel.id}
                        onClick={() => {
                          setSelectedHotel(hotel);
                          setSelectedRoom(hotel.rooms[0] || null);
                        }}
                        className={`group relative flex gap-4 p-4 rounded-[24px] cursor-pointer border transition-all duration-300 ${
                          isSelected
                            ? "bg-white/5 border-[#D4AF37]/80 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                            : "glass hover:bg-white/5 hover:border-white/15"
                        }`}
                      >
                        {/* Hotel Profile Image thumbnail rounded */}
                        <div className="w-16 h-16 rounded-[16px] overflow-hidden shrink-0 border border-white/10 relative">
                          <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[7px] font-mono text-[#D4AF37] uppercase font-bold">
                            {hotel.vibe.split(" ")[0]}
                          </div>
                        </div>

                        {/* Summary Description info */}
                        <div className="flex flex-col justify-between flex-1 py-0.5">
                          <div>
                            <span className="text-[9px] font-mono text-white/40 flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5 text-[#D4AF37]" /> {hotel.location}
                            </span>
                            <h4 className="text-sm font-sans font-medium text-white group-hover:text-[#D4AF37] transition-colors mt-0.5">
                              {hotel.name}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between mt-1">
                            <span className="flex items-center gap-0.5 text-[10px] text-[#D4AF37]">
                              <Star className="h-2.5 w-2.5 fill-current text-[#D4AF37]" /> {hotel.rating}
                            </span>
                            <span className="text-xs text-[#D4AF37] font-mono font-bold">
                              ${hotel.pricePerNight} <span className="text-[10px] text-white/40 font-normal">/ cycl</span>
                            </span>
                          </div>
                        </div>

                        {/* Floating gold arrow accent for elite signature */}
                        {isSelected && (
                          <div className="absolute top-1/2 -track-y-1/2 right-0 w-1.5 h-8 bg-[#D4AF37] rounded-l-full"></div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-white/40 text-center font-mono py-8">No targeted properties match parameters.</p>
                )}
              </div>
            </div>

            {/* Right Display Layout - Room preview and map discovery (cols-8) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {selectedHotel ? (
                <>
                  {/* Hero gallery section in Obsidian luxury style */}
                  <div className="relative h-72 sm:h-96 rounded-[40px] overflow-hidden border border-white/10 shadow-2xl select-none group">
                    <img
                      src={selectedHotel.images[0]}
                      alt={selectedHotel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Shadow gradient-overlay */}
                    <div className="absolute inset-0 gradient-overlay"></div>

                    {/* Meta labels */}
                    <div className="absolute top-8 left-8 flex gap-3">
                      <div className="glass px-4 py-2 rounded-full text-xs flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></div> 
                        360° SPATIAL HUD
                      </div>
                      <div className="glass px-4 py-2 rounded-full text-xs uppercase text-[#D4AF37] font-mono font-bold">
                        ULTRA-PREMIUM HABITAT
                      </div>
                    </div>

                    {/* Meta info floating with Playfair serif fonts */}
                    <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
                      <div>
                        <div className="text-[10px] text-[#D4AF37] uppercase font-bold font-mono tracking-widest">
                          LOCATION INSIGHT • {selectedHotel.vibe.toUpperCase()}
                        </div>
                        <h3 className="serif text-3xl sm:text-5xl text-white mt-1.5 font-light tracking-tight">
                          {selectedHotel.name}
                        </h3>
                        <p className="text-sm text-white/70 mt-3 max-w-xl leading-relaxed">
                          {selectedHotel.description}
                        </p>
                      </div>

                      <div className="shrink-0 flex md:flex-col gap-2 items-start md:items-end text-left md:text-right">
                        <span className="text-[10px] uppercase text-white/40 tracking-widest font-mono">BASE PRICE</span>
                        <span className="text-2xl font-mono text-[#D4AF37] font-bold bg-[#050505]/80 px-4 py-1.5 rounded-full border border-white/5 flex items-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                          ${selectedHotel.pricePerNight} <span className="text-xs text-white/40 font-normal ml-1">/ cycle</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive tracking map dashboard overlay */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64 sm:h-auto">
                      <HotelDiscoveryMap
                        hotels={hotels}
                        selectedHotelId={selectedHotel.id}
                        onSelectHotel={handleSelectHotel}
                      />
                    </div>

                    {/* Booking System Drawer integration */}
                    <div>
                      <BookingSystem
                        hotel={selectedHotel}
                        selectedRoom={selectedRoom}
                        userId={userId}
                        userEmail={userEmail}
                        onBookingComplete={handleNewBookingComplete}
                      />
                    </div>
                  </div>

                  {/* Amenities Matrix lists */}
                  <div className="p-6 glass rounded-[32px]">
                    <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">Integrated Biosphere Amenities</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      {selectedHotel.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-white/80 font-sans">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"></span>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 360° virtual preview center */}
                  <RoomShowcase
                    rooms={selectedHotel.rooms}
                    selectedRoom={selectedRoom}
                    onSelectRoom={setSelectedRoom}
                    hotelVibe={selectedHotel.vibe}
                  />

                  {/* Travel Review Board */}
                  <div className="p-6 glass rounded-[32px] mt-4 flex flex-col gap-5">
                    <div>
                      <h4 className="serif text-xl text-white font-medium tracking-tight">Traveler Logs</h4>
                      <p className="text-[10px] text-[#D4AF37] font-mono mt-0.5 tracking-wider uppercase">AUTHENTIC RETREAT REVIEWS FROM COMMITTED SPACEFARERS</p>
                    </div>

                    <div className="flex flex-col gap-4 max-h-[250px] overflow-y-auto pr-1">
                      {reviewsList
                        .filter(r => r.hotelId === selectedHotel.id)
                        .map((rev) => (
                          <div key={rev.id} className="p-4 bg-[#050505]/60 rounded-[20px] border border-white/5 flex flex-col gap-2">
                            <div className="flex justify-between items-center text-[10px] text-white/40 uppercase font-mono tracking-wider">
                              <span>LOGGED BY: {rev.userName}</span>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-0.5 text-[#D4AF37]">
                                  <Star className="h-3 w-3 fill-current text-[#D4AF37]" /> {rev.rating}
                                </span>
                                <span>{rev.createdAt}</span>
                              </div>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed font-sans">
                              {rev.comment}
                            </p>
                          </div>
                      ))}
                    </div>

                    {/* Write comment input Form - Styled Membership Form */}
                    <form onSubmit={handleAddReview} className="border-t border-white/5 pt-4 flex flex-col gap-3">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Write a Travel Log Review:</span>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your luxury experience here..."
                          className="flex-1 px-4 py-2 text-xs bg-[#050505]/80 border border-white/10 rounded-full text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                        <div className="flex items-center justify-between sm:justify-start gap-3 shrink-0">
                          {/* Rating selector */}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewRating(star)}
                                className={`p-1 cursor-pointer transition-colors ${
                                  newRating >= star ? "text-[#D4AF37]" : "text-white/20"
                                }`}
                              >
                                <Star className="h-3.5 w-3.5 fill-current" />
                              </button>
                            ))}
                          </div>
                          
                          <button
                            type="submit"
                            className="bg-[#D4AF37] hover:bg-white text-black font-bold font-sans uppercase tracking-wider text-[10px] px-5 py-2 rounded-full cursor-pointer transition-colors shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                          >
                            Submit Log
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-16 text-center text-slate-500">
                  <Compass className="h-12 w-12 text-slate-800 animate-pulse" />
                  <p className="text-xs mt-2">Pick a luxury resort from the radar map to start discovery previews.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AI TRIP PLANNER */}
        {activeTab === "ai-planner" && (
          <div id="ai-planner-panel" className="mt-5 animate-fadeIn">
            <AiTripPlanner
              hotels={hotels}
              userId={userId}
              onInstantBookPlan={(hotelId, roomType, totalPrice, days) => {
                const hotel = hotels.find(h => h.id === hotelId);
                const bookingId = "bk_" + Math.random().toString(36).substr(2, 9).toUpperCase();
                const bookingRecord: Booking = {
                  id: bookingId,
                  userId,
                  hotelId,
                  hotelName: hotel?.name || "StayFinder X Hotel",
                  roomType,
                  checkIn: "2026-06-15",
                  checkOut: "2026-06-18",
                  guests: 2,
                  totalPrice,
                  status: "confirmed",
                  createdAt: new Date().toISOString()
                };
                setBookingHistory(prev => [bookingRecord, ...prev]);
              }}
            />
          </div>
        )}

        {/* TAB 3: BOOKING HISTORY LIST */}
        {activeTab === "my-bookings" && (
          <div id="booking-history-panel" className="mt-5 flex flex-col gap-6 animate-fadeIn">
            <div className="p-6 glass rounded-[32px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="serif text-xl text-white font-medium">Your Registered Passages</h3>
                <p className="text-xs text-white/50 mt-1">
                  Active reservations stored in real-time Cloud Firestore database securely.
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-4 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
                <Database className="h-3.5 w-3.5" /> SECURE FIRESTORE SYNCED
              </div>
            </div>

            {loadingBookings ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/40">
                <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
                <span className="text-xs mt-3 font-mono uppercase tracking-widest text-[#D4AF37]">Syncing credentials...</span>
              </div>
            ) : bookingHistory.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {bookingHistory.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-6 rounded-[28px] glass flex flex-col sm:flex-row justify-between gap-4 relative overflow-hidden group hover:border-[#D4AF37]/40 transition-all duration-300"
                  >
                    <div className="flex flex-col gap-3">
                      <div>
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">RESERVATION CODE: {booking.id}</span>
                        <h4 className="serif text-lg text-white font-medium mt-1">{booking.hotelName}</h4>
                        <span className="text-[10px] text-[#D4AF37] font-mono mt-0.5 block uppercase tracking-wider">{booking.roomType}</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-white/70 font-sans mt-2">
                        <div>
                          <span className="text-[9px] text-white/40 block uppercase font-mono tracking-wider">Check-in</span>
                          <span className="text-white text-xs font-semibold">{booking.checkIn}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-white/40 block uppercase font-mono tracking-wider">Check-out</span>
                          <span className="text-white text-xs font-semibold">{booking.checkOut}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-white/40 block uppercase font-mono tracking-wider">Guests</span>
                          <span className="text-white text-xs font-semibold">{booking.guests} Pax</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-start sm:items-end">
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] uppercase tracking-wider font-mono border border-[#D4AF37]/20">
                        {booking.status}
                      </span>
                      <span className="text-base font-mono text-white font-bold bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1.5 rounded-full mt-3 sm:mt-0">
                        ${booking.totalPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-20 text-center glass rounded-[32px]">
                <Database className="h-10 w-10 text-white/20 mb-3" />
                <p className="text-xs text-white/40 font-mono uppercase tracking-widest">No active passages booked. Visit explores or use AI planner.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Styled Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#050505] py-10 px-8 max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 text-[10px] uppercase tracking-widest text-white/40 font-mono">
        <div>
          <span>© 2026 StayFinder X Inc. All system nodes synchronized.</span>
        </div>
        <div className="flex items-center gap-6">
          <span>LATENCY: 0.14ms</span>
          <span>NETWORK: SECURE FIRESTORE (DB_ENTERPRISE)</span>
          <span>CURRENCY: USD STANDARD</span>
        </div>
      </footer>
    </div>
  );
}
