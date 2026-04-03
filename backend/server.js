require("dotenv").config();
const express    = require("express");
const path       = require("path");
const cors       = require("cors");
const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");
const connectDB  = require("./config/db");

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false, // Allow inline scripts for React
}));

// CORS — allow dev + production origins
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:4173", // vite preview
];
// Allow any *.vercel.app or *.netlify.app subdomain
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow server-to-server / curl
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /\.netlify\.app$/.test(origin) ||
      /\.railway\.app$/.test(origin) ||
      /\.render\.com$/.test(origin)
    ) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.set("trust proxy", 1); // for req.ip behind Render/Railway/Vercel

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again in 15 minutes." },
}));

app.use("/api/data", rateLimit({
  windowMs: 60 * 1000,  // 1 min
  max: 150,
  message: { message: "Too many data requests." },
}));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/data", require("./routes/data"));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_, res) =>
  res.json({ status: "ok", env: process.env.NODE_ENV, ts: Date.now() })
);

// ── Serve React build in production ──────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    // Don't intercept API routes
    if (req.path.startsWith("/api")) return res.status(404).json({ message: "Not found." });
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: "Route not found." }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 CampusBloom API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`)
  );
});
