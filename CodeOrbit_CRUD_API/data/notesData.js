// Data layer: all functions that read or save notes live here.
const fs = require("fs");
const path = require("path");
const DATA_FILE = path.join(__dirname, "notes.json");

function readAll() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return []; throw error; }
}
function saveAll(notes) { fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2)); }
function getAll() { return readAll(); }
function getById(id) { return readAll().find((note) => note.id === id); }
function create(fields) {
  const notes = readAll();
  const id = notes.reduce((max, note) => Math.max(max, note.id), 0) + 1;
  const note = { id, title: fields.title.trim(), content: (fields.content || "").trim(), createdAt: new Date().toISOString() };
  notes.push(note); saveAll(notes); return note;
}
function update(id, fields) {
  const notes = readAll();
  const note = notes.find((item) => item.id === id);
  if (!note) return null;
  if (fields.title !== undefined) note.title = fields.title.trim();
  if (fields.content !== undefined) note.content = fields.content.trim();
  note.updatedAt = new Date().toISOString();
  saveAll(notes); return note;
}
function remove(id) {
  const notes = readAll();
  const index = notes.findIndex((note) => note.id === id);
  if (index === -1) return null;
  const [deleted] = notes.splice(index, 1);
  saveAll(notes); return deleted;
}
module.exports = { getAll, getById, create, update, remove };
