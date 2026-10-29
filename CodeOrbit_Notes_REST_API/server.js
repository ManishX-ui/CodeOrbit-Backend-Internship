// Task 1: Simple Notes REST API using Node.js and Express.
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, "data", "notes.json");
app.use(express.json());

function readNotes() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}
function saveNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}
function validText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

app.get("/", (_req, res) => res.json({
  message: "CodeOrbit Notes REST API is running",
  endpoints: ["GET /api/notes", "POST /api/notes", "GET /api/notes/:id", "PUT /api/notes/:id", "DELETE /api/notes/:id"]
}));
app.get("/api/notes", (_req, res) => res.json({ success: true, data: readNotes() }));

app.get("/api/notes/:id", (req, res) => {
  const note = readNotes().find((item) => item.id === Number(req.params.id));
  if (!note) return res.status(404).json({ success: false, message: "Note not found" });
  res.json({ success: true, data: note });
});

app.post("/api/notes", (req, res) => {
  const { title, content = "" } = req.body || {};
  if (!validText(title) || typeof content !== "string") {
    return res.status(400).json({ success: false, message: "title must be a non-empty string and content must be a string" });
  }
  const notes = readNotes();
  const nextId = notes.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const note = { id: nextId, title: title.trim(), content: content.trim(), createdAt: new Date().toISOString() };
  notes.push(note);
  saveNotes(notes);
  res.status(201).json({ success: true, data: note });
});

app.put("/api/notes/:id", (req, res) => {
  const notes = readNotes();
  const note = notes.find((item) => item.id === Number(req.params.id));
  if (!note) return res.status(404).json({ success: false, message: "Note not found" });
  const { title, content } = req.body || {};
  if (title !== undefined && !validText(title)) return res.status(400).json({ success: false, message: "title must be a non-empty string" });
  if (content !== undefined && typeof content !== "string") return res.status(400).json({ success: false, message: "content must be a string" });
  if (title === undefined && content === undefined) return res.status(400).json({ success: false, message: "Provide title or content to update" });
  if (title !== undefined) note.title = title.trim();
  if (content !== undefined) note.content = content.trim();
  note.updatedAt = new Date().toISOString();
  saveNotes(notes);
  res.json({ success: true, data: note });
});

app.delete("/api/notes/:id", (req, res) => {
  const notes = readNotes();
  const index = notes.findIndex((item) => item.id === Number(req.params.id));
  if (index < 0) return res.status(404).json({ success: false, message: "Note not found" });
  const [deleted] = notes.splice(index, 1);
  saveNotes(notes);
  res.json({ success: true, message: "Note deleted", data: deleted });
});

app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && "body" in err) return res.status(400).json({ success: false, message: "Invalid JSON body" });
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

if (require.main === module) app.listen(PORT, () => console.log(`Notes API running at http://localhost:${PORT}`));
module.exports = app;
