// Controller layer: validate requests and send HTTP responses.
const notesData = require("../data/notesData");

function validTitle(title) { return typeof title === "string" && title.trim().length > 0; }
function validId(raw) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

exports.listNotes = (_req, res) => res.json({ success: true, data: notesData.getAll() });

exports.getNote = (req, res) => {
  const id = validId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: "Note ID must be a positive integer" });
  const note = notesData.getById(id);
  if (!note) return res.status(404).json({ success: false, message: "Note not found" });
  res.json({ success: true, data: note });
};

exports.createNote = (req, res) => {
  const { title, content = "" } = req.body || {};
  if (!validTitle(title) || typeof content !== "string") {
    return res.status(400).json({ success: false, message: "title is required and content must be a string" });
  }
  res.status(201).json({ success: true, data: notesData.create({ title, content }) });
};

exports.updateNote = (req, res) => {
  const id = validId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: "Note ID must be a positive integer" });
  const { title, content } = req.body || {};
  if (title === undefined && content === undefined) return res.status(400).json({ success: false, message: "Provide title or content to update" });
  if (title !== undefined && !validTitle(title)) return res.status(400).json({ success: false, message: "title must be a non-empty string" });
  if (content !== undefined && typeof content !== "string") return res.status(400).json({ success: false, message: "content must be a string" });
  const note = notesData.update(id, { title, content });
  if (!note) return res.status(404).json({ success: false, message: "Note not found" });
  res.json({ success: true, data: note });
};

exports.deleteNote = (req, res) => {
  const id = validId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: "Note ID must be a positive integer" });
  const deleted = notesData.remove(id);
  if (!deleted) return res.status(404).json({ success: false, message: "Note not found" });
  res.json({ success: true, message: "Note deleted", data: deleted });
};
