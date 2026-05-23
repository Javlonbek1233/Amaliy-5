import { Hotel } from "./types";

export const FUTURISTIC_HOTELS: Hotel[] = [
  {
    id: "aetheria-orbit",
    name: "Aetheria Orbital Resort",
    vibe: "Galactic Orbital",
    description: "Suspended in Low Earth Orbit, Aetheria offers an unprecedented luxury stay overlooking the glowing blue arches of Earth. Indulge in gravitational wellness pods, fine celestial dining, and guided spacewalks.",
    location: "Low Earth Orbit (Station Altitude 420km)",
    coordinates: { lat: 20.0, lng: 10.0 }, // Shown in our customizable discovery map
    pricePerNight: 12500,
    images: ["/src/assets/images/space_resort_1779539128163.png"],
    rating: 4.95,
    reviewsCount: 312,
    amenities: [
      "Zero-Gravity Hydrotherapy Spa",
      "Stellar Observation Observatory",
      "EVA Spacewalk Suit Rental",
      "Artificial Gravity Bedrooms (0.8g)",
      "Holographic Gym and Virtual Golf",
      "Micrometeorite Shield Shielding"
    ],
    priceComparison: {
      direct: 12500,
      orbitTravel: 13900,
      galacticExpedia: 14200
    },
    rooms: [
      {
        id: "space-aurora",
        name: "Aurora Observation Pod",
        pricePerNight: 12500,
        description: "Elegant 180° glass canopy suite with adjustable artificial gravity (0.1g to 1.0g). Includes zero-G sleep suspension and real-time cosmic storm alerts.",
        capacity: 2,
        spacesCount_360: ["Aurora Glass Bedroom", "Gravity-Control Bathroom", "Command Console Desk Area"]
      },
      {
        id: "space-cosmos",
        name: "Grand Cosmos Penthouse",
        pricePerNight: 28000,
        description: "The ultimate orbital retreat. Features private spatial launch docks, a multi-tier gravity wheel, and a 360-degree glass ceiling.",
        capacity: 4,
        spacesCount_360: ["Celestial Grand Bed", "Infinity Gravity Tub Room", "Space Observation Lounge"]
      }
    ]
  },
  {
    id: "oceanus-deep",
    name: "Oceanus Undersea Sanctuary",
    vibe: "Deep Ocean",
    description: "Located 500 meters beneath the surface in the Mariana Trench, Oceanus is a fully pressurized hyper-crystalline biosphere displaying stunning marine ecosystems and volcanic vent spas.",
    location: "Mariana Trench, Pacific Ocean",
    coordinates: { lat: 11.3493, lng: 142.1996 },
    pricePerNight: 4800,
    images: ["/src/assets/images/underwater_hotel_1779539151692.png"],
    rating: 4.89,
    reviewsCount: 198,
    amenities: [
      "Sub-aquatic Hydrothermal Pools",
      "Holographic Coral Atrium",
      "Bioluminescent Fine Dining",
      "Submersible Trench Tours",
      "Pressurized Hyper-baric Air Refresh",
      "Deep Ocean Algae Spa Facials"
    ],
    priceComparison: {
      direct: 4800,
      orbitTravel: 5120,
      galacticExpedia: 5300
    },
    rooms: [
      {
        id: "ocean-trench",
        name: "Mariana Glass Dome",
        pricePerNight: 4800,
        description: "Enclosed under high-tension reinforced quartz, watch abyssal creatures float by the high-pressure lounge from your state-of-the-art bed.",
        capacity: 2,
        spacesCount_360: ["Quartz Glass Dome Bedroom", "Marine Observation Dock", "Abyssal Living Suite"]
      },
      {
        id: "ocean-emperor",
        name: "Neptune Sovereign Suite",
        pricePerNight: 9500,
        description: "Spaciously crafted undersea apartment utilizing smart walls that track passing marine species, featuring a private sub-dock for private submersibles.",
        capacity: 4,
        spacesCount_360: ["Neptune Master Suite", "Private Submersible Sub-dock", "Fluorescent Biological Garden"]
      }
    ]
  },
  {
    id: "neo-shibuya",
    name: "Shibuya Neo-Cloud Tower",
    vibe: "Cyberpunk Neon",
    description: "Soaring 150 levels above Tokyo's cybernetic cloud deck, this premium tower infuses tactical cyberpunk architecture with cybernetic sleep recovery and high-speed hovercraft ports.",
    location: "Shibuya, Tokyo, Japan",
    coordinates: { lat: 35.6580, lng: 139.7016 },
    pricePerNight: 2200,
    images: ["/src/assets/images/cyberpunk_hotel_1779539180327.png"],
    rating: 4.91,
    reviewsCount: 842,
    amenities: [
      "Holographic KI Concierge",
      "Neural-Link Sleep Sync",
      "Vertigo Glass Observation Onsen",
      "Aerocar Hover-pad Transfer",
      "Hacks and Cybernetic Security Grids",
      "Synthetic Ramen Craft Bistro"
    ],
    priceComparison: {
      direct: 2200,
      orbitTravel: 2450,
      galacticExpedia: 2380
    },
    rooms: [
      {
        id: "cyber-pod",
        name: "Neon Sleep Matrix",
        pricePerNight: 2200,
        description: "Ergonomically sound unit embedded with custom neural-wave controllers and glowing cybernetic HUD walls displaying personalized digital weather.",
        capacity: 1,
        spacesCount_360: ["Cyber Sleep Pod Chamber", "Matrix HUD Bathroom", "Holographic Terminal Desk"]
      },
      {
        id: "cyber-penthouse",
        name: "Hologram Sky Loft",
        pricePerNight: 5500,
        description: "Magnificent high-altitude suite with floor-to-ceiling panoramic glass walls looking out over neon skylines, equipped with an private DJ and AI bar.",
        capacity: 3,
        spacesCount_360: ["Luminous Bed Chamber", "AI Cocktail Lounge", "Cyber-concierge Deck"]
      }
    ]
  },
  {
    id: "chronos-ice",
    name: "Chronos Glacial Cryo-Pods",
    vibe: "Glacial Aurora",
    description: "Geothermal-heated transparent crystal pods balanced on majestic glacial ridges in Tromsø. Floating anti-gravity thermal beds provide premium comfort under dancing neon auroral skies.",
    location: "Lyngen Alps, Tromsø, Norway",
    coordinates: { lat: 69.6492, lng: 18.9553 },
    pricePerNight: 3500,
    images: ["/src/assets/images/aurora_pods_1779539199927.png"],
    rating: 4.97,
    reviewsCount: 224,
    amenities: [
      "Geothermal Crystal Hearth",
      "Cryogenic Biomarker Spa Baths",
      "Super-magnetic Glacier Sleds",
      "Aurora Tracker Artificial Intelligence",
      "Thermal Floating Bed Springs",
      "Subglacial Nordic Dining Cabin"
    ],
    priceComparison: {
      direct: 3500,
      orbitTravel: 3950,
      galacticExpedia: 3800
    },
    rooms: [
      {
        id: "ice-geodome",
        name: "Geothermal Crystalline Pod",
        pricePerNight: 3500,
        description: "Entirely insulated heated crystal pod. Features an overhead glass sky-dome with dynamic polar filters to maximize night aurora beauty.",
        capacity: 2,
        spacesCount_360: ["Heated Sky-view Crystal Pod", "Lumi Fireplace Alcove", "Thermal Bathing Zone"]
      },
      {
        id: "ice-monolith",
        name: "Aurora Crystalline obelisk",
        pricePerNight: 7200,
        description: "Towering double-layered quartz structure designed specifically for stargazing, complete with internal sensory-deprivation zero-g basins.",
        capacity: 4,
        spacesCount_360: ["Obelisk Stargazing Deck", "Sensory-Deprivation Mineral Tub", "Glacial Master Suite"]
      }
    ]
  },
  {
    id: "solaria-mars",
    name: "Solaria Martian Oasis",
    vibe: "Martian Bio-Dome",
    description: "Housed in a grand pressurized geodesic bio-dome on red sand dunes, Solaria provides simulated gravity, fully populated forests, and red sandstone architecture under a simulated copper sky.",
    location: "Gusev Basin, Martian Desert",
    coordinates: { lat: -14.5684, lng: 175.4784 },
    pricePerNight: 6500,
    images: ["https://picsum.photos/seed/marsresort/1920/1080"],
    rating: 4.82,
    reviewsCount: 94,
    amenities: [
      "Atmospheric Forest Biosphere",
      "Molecular Synthesis Vineyards",
      "Gravity Re-Calibration Lounge",
      "Pressurized Dune Rover Safaris",
      "Martian Micro-fine Clay Baths",
      "Double-airlock Entry Vestibules"
    ],
    priceComparison: {
      direct: 6500,
      orbitTravel: 7200,
      galacticExpedia: 6900
    },
    rooms: [
      {
        id: "mars-oasis",
        name: "Red Oasis Suite",
        pricePerNight: 6500,
        description: "Sleek sand-luxe pod overlooking the crimson rust valleys, with high-shield magnetic fields blocks solar rays for optimal peace.",
        capacity: 2,
        spacesCount_360: ["Martian Bed Chamber", "Red-Canyon Viewing Deck", "Sand-filtered Spa Shower"]
      }
    ]
  },
  {
    id: "valhalla-sky",
    name: "Valhalla Aerial Sanctuary",
    vibe: "Sky Pod Aerial",
    description: "Suspended 3,000 meters above Switzerland by a custom heavy magnetic levitation matrix, Valhalla floats comfortably amid fluffy cloud ceilings, providing pure clean alpine oxygen.",
    location: "Alps Ridge, Zermatt, Switzerland",
    coordinates: { lat: 46.0207, lng: 7.7491 },
    pricePerNight: 8900,
    images: ["https://picsum.photos/seed/skypodresort/1920/1080"],
    rating: 4.96,
    reviewsCount: 154,
    amenities: [
      "Levitating Zero-shear Swimming Pools",
      "Cloud-edge Glass Terraces",
      "Magnetic Transit Hover-shuttles",
      "Micro-gravity Elevators",
      "Super-oxygenated Sleep Chambers",
      "High-Altitude Hang-glide Launchers"
    ],
    priceComparison: {
      direct: 8900,
      orbitTravel: 9400,
      galacticExpedia: 9800
    },
    rooms: [
      {
        id: "sky-nimbus",
        name: "Nimbus Suspension Villa",
        pricePerNight: 8900,
        description: "Stately floating chalet floating on autonomous thrusters, allowing customized rotation to face any glacier peak at sunrise.",
        capacity: 2,
        spacesCount_360: ["Cloud-view Master Suite", "Magnetic Floating Balcony", "Prestige Alpine Bath"]
      }
    ]
  }
];
