import express from "express";

import authenticate from "../middleware/auth.js";
import noteController from "../controllers/noteController.js";

const router = express.Router();

router.use(authenticate);

router.get("/notes", noteController.getNotes);
router.get("/search", noteController.searchNotes);
router.post("/notes", noteController.createNote);
router.get("/notes/:id", noteController.getNoteById);
router.put("/notes/:id", noteController.updateNote);
router.delete("/notes/:id", noteController.deleteNote);
router.post("/notes/:id/share", noteController.shareNote);
router.post("/notes/:id/pin", noteController.pinNote);
router.post("/notes/:id/unpin", noteController.unpinNote);


export default router;

