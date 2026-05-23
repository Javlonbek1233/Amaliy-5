import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY not configured. Running in simulated offline Mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "SIMULATED_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API: Smart Recommendation Generator
app.post("/api/gemini/recommend", async (req, res) => {
  const { query, budget, duration, preferredVibe } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    // Return stunning simulation response if key is missing
    return res.json({
      intro: "Welcome to StayFinder X Intelligence. Since our quantum relay is running in local simulation, here is our high-priority matching prediction for you:",
      recommendations: [
        {
          hotelId: preferredVibe === "Galactic Orbital" ? "aetheria-orbit" : "neo-shibuya",
          reason: "Matches your premium requirements perfectly, providing state-of-the-art life safety domes and luxurious automated amenities.",
          customActivity: "Exclusive access to private high-gravity observation chambers or neon cloud gardens."
        }
      ]
    });
  }

  try {
    const ai = getAi();
    const prompt = `Recommend luxury futuristic hotel options from our selection for a user looking for:
Query: "${query || 'Any luxury stay'}"
Budget Level: ${budget || 'Unlimited'}
Preferred Length: ${duration || 2} nights
Vibe Intent: ${preferredVibe || 'Cosmic luxury'}

Available hotel selection IDs and vibes:
- "aetheria-orbit" (vibe: "Galactic Orbital")
- "oceanus-deep" (vibe: "Deep Ocean")
- "neo-shibuya" (vibe: "Cyberpunk Neon")
- "chronos-ice" (vibe: "Glacial Aurora")
- "solaria-mars" (vibe: "Martian Bio-Dome")
- "valhalla-sky" (vibe: "Sky Pod Aerial")

Match up to 2 properties and provide beautiful futuristic rationale. Make it sound ultra-premium, cinematic, and professional.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intro: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hotelId: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  customActivity: { type: Type.STRING }
                },
                required: ["hotelId", "reason", "customActivity"]
              }
            }
          },
          required: ["intro", "recommendations"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (err: any) {
    console.error("Gemini recommendation error:", err);
    res.status(500).json({ error: "Quantum AI relays encountered a processing delay. Please try again." });
  }
});

// 2. API: Structured AI Trip Itinerary Planner
app.post("/api/gemini/trip-planner", async (req, res) => {
  const { destination, days, budget, designTheme, travelerNeeds } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    // Mock robust luxury itinerary if key is missed
    return res.json({
      destination: destination || "Lower Earth Orbit & Shibuya Cloud Heights",
      duration: Number(days) || 3,
      budget: budget || "Premium Cosmic",
      hotelsMatched: ["aetheria-orbit", "neo-shibuya"],
      itinerary: Array.from({ length: Number(days) || 3 }).map((_, i) => ({
        day: i + 1,
        title: i === 0 ? "Quantum Arrival & Gravity Acclimatization" : i === 1 ? "Aviation Sky Tour & Synth-Gastronomy" : "Cosmic Re-entry",
        activities: [
          "Check in at premium lounge with automatic biometric scan",
          "Submersible viewings or gravity acclimatization therapy",
          "Sunset stellar-view molecular dining served by cybernetic culinary masterminds"
        ]
      }))
    });
  }

  try {
    const ai = getAi();
    const prompt = `Formulate a detailed Day-by-day luxury futuristic itinerary.
Destination description or focus: "${destination || 'Quantum Orbit & Cyberpunk Metropolises'}"
Duration: ${days || 3} Days
Budget Category: ${budget || 'Imperial Gold'}
Custom traveler interests: "${travelerNeeds || 'Cybernetic wellness, molecular gastronomy, zero-g spas'}"
Theme focus: ${designTheme || 'Galactic & Cyberpunk High-Rise'}

Our official matching hotel IDs:
- "aetheria-orbit" (vibe: "Galactic Orbital")
- "oceanus-deep" (vibe: "Deep Ocean")
- "neo-shibuya" (vibe: "Cyberpunk Neon")
- "chronos-ice" (vibe: "Glacial Aurora")
- "solaria-mars" (vibe: "Martian Bio-Dome")
- "valhalla-sky" (vibe: "Sky Pod Aerial")

Please select exactly matching IDs to include in 'hotelsMatched' based on destination / vibes.
Provide realistic luxury activities containing sci-fi concepts, ensuring strict structure.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            duration: { type: Type.INTEGER },
            budget: { type: Type.STRING },
            hotelsMatched: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "IDs of matching hotels from our database (e.g. aetheria-orbit, oceanus-deep, neo-shibuya, chronos-ice, solaria-mars, valhalla-sky)"
            },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["day", "title", "activities"]
              }
            }
          },
          required: ["destination", "duration", "budget", "hotelsMatched", "itinerary"]
        }
      }
    });

    const plan = JSON.parse(response.text || "{}");
    res.json(plan);
  } catch (err) {
    console.error("Gemini Trip Planner Error:", err);
    res.status(500).json({ error: "Failed to assemble high-fidelity spatial telemetry itinerary. Please try again." });
  }
});

// 3. API: Mock Stripe payments with beautiful telemetry
app.post("/api/stripe/checkout", async (req, res) => {
  const { bookingId, hotelName, roomType, totalPrice, email } = req.body;

  try {
    // Generate a secure transaction hash and mock Stripe checkout redirect session
    const stripeRef = "ch_" + Math.random().toString(36).substr(2, 16).toUpperCase();
    const virtualAuthCode = "STX_PAY_" + Math.random().toString(36).substr(2, 8).toUpperCase();

    // Simulating authentic Stripe payment intent
    res.json({
      success: true,
      transactionId: stripeRef,
      receiptUrl: `https://stripe.com/receipt/simulation/${stripeRef}`,
      authCode: virtualAuthCode,
      message: "Quantum-Shield Payment Authorization Approved.",
      details: {
        merchant: "StayFinderX Premium Escapes LLC",
        charges: totalPrice,
        currency: "USD",
        quantumGasFeeLine: 0.00
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Credit networks offline. Please try again." });
  }
});

// Start listening and mount Vite middleware or static delivery
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StayFinder X quantum server fully linked on port ${PORT}`);
  });
}

startServer();
