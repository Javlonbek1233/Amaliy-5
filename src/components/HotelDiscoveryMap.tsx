import React, { useEffect, useRef, useState } from "react";
import { Hotel } from "../types";
import { Compass, Globe, Navigation, Target } from "lucide-react";

interface HotelDiscoveryMapProps {
  hotels: Hotel[];
  selectedHotelId: string | null;
  onSelectHotel: (hotelId: string) => void;
}

export default function HotelDiscoveryMap({
  hotels,
  selectedHotelId,
  onSelectHotel,
}: HotelDiscoveryMapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredHotel, setHoveredHotel] = useState<Hotel | null>(null);
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Rotation animation for orbital tracing lines
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setOrbitAngle((prev) => (prev + 0.4) % 360);
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Project lat/lng to canvas coordinate helper
  const getCanvasCoords = (lat: number, lng: number, width: number, height: number) => {
    // Normalizing a fictional Mercator projection centered on the canvas view
    // Tokyo (lat:35.6, lng:139.7), Tromso (lat:69.6, lng:19.0), Swiss (lat:46, lng:7.7) etc.
    const x = ((lng + 180) * (width / 360)) % width;
    const y = ((90 - lat) * (height / 180)) % height;
    return { x, y };
  };

  // Redraw map on state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background with soft space gradients
    ctx.clearRect(0, 0, width, height);
    
    // Draw Cybernetic Gridlines
    ctx.strokeStyle = "rgba(14, 165, 233, 0.04)";
    ctx.lineWidth = 1;
    const step = 20;
    for (let i = 0; i < width; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 0; j < height; j += step) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

    // Draw stylized dotted continents outline
    ctx.fillStyle = "rgba(74, 85, 104, 0.12)";
    ctx.strokeStyle = "rgba(74, 85, 104, 0.2)";
    ctx.lineWidth = 1.5;
    
    // Draw decorative latitude / longitude circular rings
    ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.35, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(99, 102, 241, 0.03)";
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    // Trace Orbital flight paths of Aetheria (low Earth orbit resort)
    const orbitalRad = Math.min(width, height) * 0.38;
    ctx.strokeStyle = "rgba(234, 179, 8, 0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 8]);
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, orbitalRad, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dashed state

    // Orbit coordinates for actual live hotel rotation
    const radAngle = (orbitAngle * Math.PI) / 180;
    const orbX = width / 2 + Math.cos(radAngle) * orbitalRad;
    const orbY = height / 2 + Math.sin(radAngle) * orbitalRad;

    // Save orbital resort dynamic projected location for interaction
    const spaceHotelIdx = hotels.findIndex(h => h.id === "aetheria-orbit");
    if (spaceHotelIdx !== -1) {
      hotels[spaceHotelIdx].coordinates = {
        lat: 90 - (orbY / height) * 180,
        lng: (orbX / width) * 360 - 180
      };
    }

    // Dynamic rendering of each hotel pin
    hotels.forEach((hotel) => {
      const isSelected = hotel.id === selectedHotelId;
      const isHovered = hotel.id === hoveredHotel?.id;
      const { x, y } = getCanvasCoords(hotel.coordinates.lat, hotel.coordinates.lng, width, height);

      // Pulse waves around active/hovered hotel coordinates
      if (isSelected || isHovered) {
        ctx.strokeStyle = "rgba(212, 175, 55, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 12 + Math.sin(Date.now() / 150) * 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Pin CORE glowing circle
      const mainGrad = ctx.createRadialGradient(x, y, 1, x, y, 8);
      if (hotel.id === "aetheria-orbit") {
        mainGrad.addColorStop(0, "#D4AF37"); // Gold
        mainGrad.addColorStop(1, "rgba(212, 175, 55, 0.2)");
      } else {
        mainGrad.addColorStop(0, "#D4AF37"); // Gold
        mainGrad.addColorStop(1, "rgba(212, 175, 55, 0.1)");
      }

      ctx.fillStyle = mainGrad;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Outer rings
      ctx.strokeStyle = "rgba(212, 175, 55, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.stroke();

      // Mini text overlays on critical highlights
      if (isSelected || isHovered) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Inter, sans-serif";
        ctx.fillText(hotel.name, x + 12, y + 3);
        ctx.fillStyle = "#D4AF37";
        ctx.font = "8px JetBrains Mono, monospace";
        ctx.fillText(`${hotel.location} • $${hotel.pricePerNight}`, x + 12, y + 14);
      }
    });

    // Draw directional telemetry scopes
    ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(15, 15);
    ctx.lineTo(40, 15);
    ctx.moveTo(15, 15);
    ctx.lineTo(15, 40);
    ctx.stroke();
  }, [hotels, selectedHotelId, hoveredHotel, orbitAngle]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found: Hotel | null = null;
    hotels.forEach((hotel) => {
      const coords = getCanvasCoords(hotel.coordinates.lat, hotel.coordinates.lng, canvas.width, canvas.height);
      const dist = Math.hypot(coords.x - x, coords.y - y);
      if (dist < 12) {
        found = hotel;
      }
    });
    setHoveredHotel(found);
  };

  const handleMouseClick = () => {
    if (hoveredHotel) {
      onSelectHotel(hoveredHotel.id);
    }
  };

  return (
    <div id="hotel-discovery-map-container" className="relative h-full w-full rounded-[32px] border border-white/5 bg-[#050505]/40 p-1 backdrop-blur-md">
      {/* Scope Overlay info */}
      <div id="telemetry-bar" className="absolute top-4 left-4 z-10 flex flex-col gap-1 rounded-[20px] bg-[#050505]/95 p-3 text-[10px] text-[#D4AF37] border border-white/10 backdrop-blur-sm">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-white">
          <Globe className="h-3.5 w-3.5 text-[#D4AF37] animate-pulse" /> STAYFINDER X GPS
        </span>
        <span className="text-white/40 font-mono">GRID: CLS_83_TRX</span>
        <span className="text-white/40 font-mono flex items-center gap-1">
          <Target className="h-2.5 w-2.5 text-[#D4AF37]" /> SYNC: STABLE REAL-TIME
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={680}
        height={320}
        className="h-full w-full cursor-pointer rounded-[32px] bg-[#050505]/70"
        onMouseMove={handleMouseMove}
        onClick={handleMouseClick}
      />

      <div id="map-instructions" className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider text-white/40 bg-[#050505]/95 px-4 py-2 rounded-full border border-white/10">
        <Compass className="h-3.5 w-3.5 text-[#D4AF37] animate-[spin_8s_linear_infinite]" />
        <span>Hover pins to highlight • Click to target and view details</span>
      </div>
    </div>
  );
}
