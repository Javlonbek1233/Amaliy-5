export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Room {
  id: string;
  name: string;
  pricePerNight: number;
  description: string;
  capacity: number;
  spacesCount_360: string[]; // List of 360 preview views (e.g. ["Bedroom Suite", "Zen Enclosure", "Control Center"])
}

export interface Review {
  id: string;
  hotelId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  vibe: "Galactic Orbital" | "Deep Ocean" | "Cyberpunk Neon" | "Martian Bio-Dome" | "Glacial Aurora" | "Sky Pod Aerial";
  description: string;
  location: string;
  coordinates: Coordinates;
  pricePerNight: number;
  images: string[];
  rating: number;
  reviewsCount: number;
  amenities: string[];
  rooms: Room[];
  priceComparison: {
    direct: number;
    orbitTravel: number;
    galacticExpedia: number;
  };
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface ItineraryItem {
  day: number;
  title: string;
  activities: string[];
}

export interface TripPlan {
  id: string;
  userId: string;
  destination: string;
  duration: number;
  budget: string;
  hotelsMatched: string[];
  itinerary: ItineraryItem[];
  createdAt: string;
}
