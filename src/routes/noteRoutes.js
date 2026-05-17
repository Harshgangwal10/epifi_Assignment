import express from "express";

import authenticate from "../middleware/auth.js";
import noteController from "../controllers/noteController.js";

const router = express.Router();

router.use(authenticate);

router.get("/", noteController.getNotes);
router.post("/", noteController.createNote);

router.get("/:id", noteController.getNoteById);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

router.post("/:id/share", noteController.shareNote);
router.post("/:id/pin", noteController.pinNote);
router.post("/:id/unpin", noteController.unpinNote);

router.get("/search", noteController.searchNotes);

export default router;

