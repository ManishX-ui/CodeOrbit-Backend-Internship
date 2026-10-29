// Task 3: modular Notes CRUD API.
const express = require("express");
const notesRoutes = require("./routes/notesRoutes");
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.get("/", (_req, res) => res.json({
  message: "CodeOrbit modular CRUD API is running",
  notesEndpoint: "/api/notes"
}));
app.use("/api/notes", notesRoutes);
app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && "body" in err) return res.status(400).json({ success: false, message: "Invalid JSON body" });
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

if (require.main === module) app.listen(PORT, () => console.log(`CRUD API running at http://localhost:${PORT}`));
module.exports = app;
