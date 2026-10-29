// Route layer: maps HTTP methods and URLs to controller functions.
const express = require("express");
const controller = require("../controllers/notesController");
const router = express.Router();

router.get("/", controller.listNotes);
router.post("/", controller.createNote);
router.get("/:id", controller.getNote);
router.put("/:id", controller.updateNote);
router.delete("/:id", controller.deleteNote);

module.exports = router;
