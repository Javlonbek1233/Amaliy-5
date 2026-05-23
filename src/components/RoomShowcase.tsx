import React, { useState, useRef } from "react";
import { Room } from "../types";
import { Maximize2, MoveHorizontal, Sparkles, User, ZoomIn } from "lucide-react";

interface RoomShowcaseProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  hotelVibe: string;
}

export default function RoomShowcase({
  rooms,
  selectedRoom,
  onSelectRoom,
  hotelVibe,
}: RoomShowcaseProps) {
  const [activeSpace, setActiveSpace] = useState<string>("");
  const [panX, setPanX] = useState<number>(0);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const [lastNotification, setLastNotification] = useState<string>("Click and drag horizontally to look around the lounge.");

  // If no room is selected, default to the first one
  const currentRoom = selectedRoom || rooms[0];

  // Set default active 360 space if not set
  React.useEffect(() => {
    if (currentRoom && currentRoom.spacesCount_360.length > 0) {
      setActiveSpace(currentRoom.spacesCount_360[0]);
    }
  }, [currentRoom]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startX.current = e.clientX - panX;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const newPan = e.clientX - startX.current;
    // Constrain panning bounds to wrap around or bounce
    const constrainedPan = Math.max(-180, Math.min(180, newPan));
    setPanX(constrainedPan);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Holographic annotation descriptors based on vibe
  const getSpecsForVibe = (vibe: string, space: string) => {
    if (vibe === "Galactic Orbital") {
      return [
        { label: "Magnetic Gravity Anchor", x: -80, y: 110, text: "Maintains standard g-force alignment during sleep." },
        { label: "High-Radiation Quartz Dome", x: 60, y: 40, text: "Multi-layered protective glass filter with HUD planetary alerts." },
        { label: "Zero-G Pod Controller", x: 140, y: 150, text: "Biometric monitoring with automated nitrogen air adjustment." }
      ];
    } else if (vibe === "Deep Ocean") {
      return [
        { label: "Atmospheric Scrubber Unit", x: -100, y: 130, text: "Constantly cycles pristine high-oxygen air 500m undersea." },
        { label: "Sonar Biological Scanner", x: 40, y: 50, text: "Tracks deep-sea abyssal life in real-time." },
        { label: "Volcanic Geothermal Heat Rail", x: 120, y: 170, text: "Independently heats rooms to optimal temperatures." }
      ];
    } else if (vibe === "Cyberpunk Neon") {
      return [
        { label: "Neural sleep Interface Link", x: -50, y: 80, text: "Syncs directly with neural-link bands to adjust REM sleep." },
        { label: "Tokyo Neon Projection Shield", x: 80, y: 40, text: "Shuts out blinding cityscape glares with smart liquid opacity." },
        { label: "Synth-Liquidity Bar", x: 150, y: 160, text: "Prepares customized functional beverages at midnight." }
      ];
    }
    // Generic
    return [
      { label: "Comfort Control Matrix", x: -60, y: 90, text: "Atmosphere adjustors and custom climate settings." },
      { label: "Quantum Privacy Glass", x: 90, y: 50, text: "Transforms glass opacity from transparent to cosmic void mode." }
    ];
  };

  const specs = getSpecsForVibe(hotelVibe, activeSpace);

  return (
    <div id="room-showcase-container" className="flex flex-col gap-6 rounded-[32px] glass p-6">
      {/* Target Heading */}
      <div id="room-selection-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5 font-mono">
            <Sparkles className="h-3 w-3 animate-pulse text-[#D4AF37]" /> CONFIGURABLE SUITES SHOWCASE
          </span>
          <h3 className="serif text-xl font-medium text-white tracking-tight mt-1">
            Choose Your Private Habitat
          </h3>
        </div>
        {/* Tab switchers */}
        <div id="room-tabs" className="flex items-center gap-2 p-1.5 bg-[#050505]/80 rounded-full border border-white/5">
          {rooms.map((room) => {
            const isSel = room.id === currentRoom.id;
            return (
              <button
                key={room.id}
                id={`room-tab-${room.id}`}
                onClick={() => {
                  onSelectRoom(room);
                  if (room.spacesCount_360.length > 0) setActiveSpace(room.spacesCount_360[0]);
                }}
                className={`px-4 py-1.5 text-xs rounded-full font-sans uppercase tracking-wider font-semibold transition-all duration-300 cursor-pointer ${
                  isSel
                    ? "bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {room.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main split display: Description and 360 previewer */}
      <div id="room-preview-layout" className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Room Stats Description */}
        <div id="room-info" className="lg:col-span-2 flex flex-col justify-between p-5 bg-[#050505]/60 rounded-[24px] border border-white/5">
          <div className="flex flex-col gap-3">
            <h4 className="serif text-lg font-medium text-[#D4AF37]">{currentRoom.name}</h4>
            <p className="text-xs text-white/75 leading-relaxed font-sans">
              {currentRoom.description}
            </p>
            
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <User className="h-3.5 w-3.5 text-[#D4AF37]" /> Max Guests: {currentRoom.capacity}
              </span>
              <span className="text-xs text-[#D4AF37] font-mono font-bold tracking-wide">
                ${currentRoom.pricePerNight} / microcycle
              </span>
            </div>
          </div>

          <div className="border-t border-white/5 my-4"></div>

          {/* Panoramic Sub-selection locations */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              360° Cam Placement Feed:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentRoom.spacesCount_360.map((space) => (
                <button
                  key={space}
                  onClick={() => setActiveSpace(space)}
                  className={`px-3 py-1 text-[10px] font-mono rounded-full border cursor-pointer transition-all ${
                    activeSpace === space
                      ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]"
                      : "bg-[#050505]/80 border-white/5 text-white/40 hover:text-white"
                  }`}
                >
                  {space}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 360 virtual viewer screen */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <div
            id="vr-360-viewport"
            className="relative h-64 rounded-[24px] border border-white/5 overflow-hidden bg-[#050505] cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Immersive Panoramic Dynamic Space Layer */}
            <div
              id="panorama-canvas"
              className="absolute inset-0 w-[250%] h-full opacity-80 pointer-events-none transition-transform duration-100"
              style={{
                transform: `translateX(${-30 + panX / 6}%)`,
                background:
                  hotelVibe === "Galactic Orbital"
                    ? "radial-gradient(circle at 30% 20%, #1e1b4b 5%, #03001e 40%, #7303c0 75%, #ec38bc 100%)"
                    : hotelVibe === "Deep Ocean"
                    ? "radial-gradient(circle at 40% 30%, #0c4a6e 0%, #082f49 40%, #020617 80%, #0e7490 100%)"
                    : "radial-gradient(circle at 50% 50%, #180026 0%, #11001c 40%, #050005 80%, #ec4899 100%)",
              }}
            >
              {/* Dynamic decorative stars and gridlines projected in background */}
              <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] [background-position:0_0]"></div>
              
              {/* Cosmic glowing shapes to simulate futuristic luxury furnishings */}
              <div className="absolute left-[20%] top-[40%] w-72 h-16 bg-sky-500/20 rounded-full blur-2xl font-mono text-[8px] text-white"></div>
              <div className="absolute left-[45%] top-[10%] w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <div className="absolute left-[70%] top-[30%] w-80 h-28 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Simulated Virtual Room furniture wireframe overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-4">
              <div className="flex justify-between items-center text-[10px] text-white/40 font-mono">
                <span className="flex items-center gap-1 uppercase tracking-wider">
                  <Maximize2 className="h-3 w-3 text-[#D4AF37]" /> CAM: {activeSpace.toUpperCase()}
                </span>
                <span className="flex items-center gap-1 border border-white/5 bg-[#050505]/95 rounded-full px-3 py-1 text-[#D4AF37] tracking-wider">
                  <MoveHorizontal className="h-3 w-3 animate-pulse text-[#D4AF37]" /> PAN_ANGLE: {Math.round(panX)}°
                </span>
              </div>
            </div>

            {/* Target Holographic Hotspots floating according to panX */}
            {specs.map((spec, idx) => {
              const projectedX = 50 + (spec.x + panX / 2.2);
              const isVisible = projectedX > 5 && projectedX < 95;

              if (!isVisible) return null;

              return (
                <div
                  key={idx}
                  className="absolute pointer-events-auto group"
                  style={{ left: `${projectedX}%`, top: `${spec.y}px` }}
                >
                  {/* Glowing core pin */}
                  <div className="relative flex items-center justify-center cursor-help">
                    <span className="absolute inline-flex h-3.5 w-3.5 rounded-full bg-[#D4AF37] opacity-75 animate-ping"></span>
                    <span className="relative rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                    
                    {/* Tooltip Overlay */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 scale-0 origin-bottom group-hover:scale-100 transition-all duration-300 p-3 rounded-[16px] bg-[#050505]/95 border border-white/10 shadow-xl pointer-events-none z-30">
                      <span className="block text-[10px] font-bold text-[#D4AF37] font-mono leading-none mb-1 uppercase tracking-wider">
                        {spec.label}
                      </span>
                      <p className="text-[10px] text-white/70 leading-normal">
                        {spec.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <span
            id="vr-spec-guide"
            onClick={() => setLastNotification("Drag and look for holographic glowing specs to adjust atmospheric pods.")}
            className="text-[10px] text-white/40 font-mono flex items-center gap-1.5 bg-[#050505]/40 p-3 rounded-full justify-center mt-1 text-center border border-white/5 cursor-pointer"
          >
            <ZoomIn className="h-3 w-3 text-[#D4AF37]" /> {lastNotification}
          </span>
        </div>
      </div>
    </div>
  );
}
