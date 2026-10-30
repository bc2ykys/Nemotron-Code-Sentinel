// server.js - Nemotron Code Sentinel Backend
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { analyzeCode, fullScan, AVAILABLE_MODES } from "./agent/analyzer.js";
import { BASE_URL, MODEL } from "./agent/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const VALID_MODES = new Set(AVAILABLE_MODES.map(m => m.id));

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

// ─── API Routes ────────────────────────────────────────────────────────

// Health check & config (no API call)
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    model: MODEL,
    baseUrl: BASE_URL,
    modes: AVAILABLE_MODES,
    timestamp: new Date().toISOString(),
  });
});

// Available modes (no API call)
app.get("/api/modes", (_req, res) => {
  res.json(AVAILABLE_MODES);
});

// Analyze code (makes ONE API call per request)
app.post("/api/analyze", async (req, res) => {
  const { code, mode, language } = req.body;

  if (!code || !mode) {
    return res.status(400).json({ error: "Both 'code' and 'mode' are required." });
  }

  if (!VALID_MODES.has(mode)) {
    return res.status(400).json({
      error: `Invalid mode "${mode}". Valid modes: ${[...VALID_MODES].join(", ")}`,
    });
  }

  try {
    console.log(`[${new Date().toISOString()}] Analyzing ${language || "auto"} code in "${mode}" mode...`);
    const result = await analyzeCode(code, mode, language);
    console.log(`[${new Date().toISOString()}] Done in ${result.elapsed_ms}ms | Tokens: ${result.usage?.total_tokens || "?"}`);
    res.json(result);
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Full scan — runs all 4 modes sequentially (makes 4 API calls)
app.post("/api/fullscan", async (req, res) => {
  const { code, language } = req.body;

  if (!code) {
    return res.status(400).json({ error: "'code' is required." });
  }

  try {
    console.log(`[${new Date().toISOString()}] Starting full scan...`);
    const results = await fullScan(code, language);
    const totalTokens = results.reduce((sum, r) => sum + (r.usage?.total_tokens || 0), 0);
    const totalTime = results.reduce((sum, r) => sum + (r.elapsed_ms || 0), 0);
    console.log(`[${new Date().toISOString()}] Full scan done in ${totalTime}ms | Total tokens: ${totalTokens}`);
    res.json({ results, totalTokens, totalTime });
  } catch (err) {
    console.error(`[ERROR] Full scan: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// ─── Catch-all for unknown /api/* routes → 404 JSON ──────────────────
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found." });
});

// ─── Fallback to SPA (Express 5 compatible) ──────────────────────────
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ─── Start ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════════════════════╗`);
  console.log(`║   🛡️  Nemotron Code Sentinel                            ║`);
  console.log(`║   Powered by NVIDIA Nemotron Reasoning Engine            ║`);
  console.log(`╠══════════════════════════════════════════════════════════╣`);
  console.log(`║   Server:  http://localhost:${PORT}                       ║`);
  console.log(`║   Model:   ${MODEL.padEnd(43)}║`);
  console.log(`║   Engine:  ${BASE_URL.slice(0, 43).padEnd(43)}║`);
  console.log(`╚══════════════════════════════════════════════════════════╝\n`);
});
