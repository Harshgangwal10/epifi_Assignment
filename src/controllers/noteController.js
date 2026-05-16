import mongoose from "mongoose";

import Note from "../models/Note.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  normalizeEmail,
  isValidEmail,
  validateNoteInput,
} from "../utils/validators.js";

function userCanReadFilter(noteId, userId) {
  return {
    _id: noteId,
    $or: [{ owner: userId }, { sharedWith: userId }],
  };
}

function ensureObjectId(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "Note not found" });
    return false;
  }
  return true;
}

const getNotes = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 50, 1), 100);
  const skip = (page - 1) * limit;

  const filter = { owner: req.user.id }; // only owner notes are listable in /notes

  const [notes, total] = await Promise.all([
    Note.find(filter)
      .sort({ pinned: -1, updated_at: -1 })
      .skip(skip)
      .limit(limit),
    Note.countDocuments(filter),
  ]);

  res.set({
    "X-Page": page,
    "X-Limit": limit,
    "X-Total-Count": total,
    "X-Total-Pages": Math.ceil(total / limit),
  });
  return res.status(200).json(notes);
});

const searchNotes = asyncHandler(async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (!q) {
    return res.status(400).json({ message: "Search query q is required" });
  }

  const notes = await Note.find({
    owner: req.user.id,
    $text: { $search: q },
  }).sort({ score: { $meta: "textScore" }, updated_at: -1 });

  return res.status(200).json(notes);
});

const createNote = asyncHandler(async (req, res) => {
  const input = validateNoteInput(req.body || {});
  if (input.message) {
    return res.status(400).json({ message: input.message });
  }

  const note = await Note.create({
    title: input.title,
    content: input.content,
    owner: req.user.id,
  });

  return res.status(201).json(note);
});

const getNoteById = asyncHandler(async (req, res) => {
  if (!ensureObjectId(req.params.id, res)) return;

  const note = await Note.findOne(userCanReadFilter(req.params.id, req.user.id));
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  return res.status(200).json(note);
});

const updateNote = asyncHandler(async (req, res) => {
  if (!ensureObjectId(req.params.id, res)) return;

  const input = validateNoteInput(req.body || {});
  if (input.message) {
    return res.status(400).json({ message: input.message });
  }

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    { title: input.title, content: input.content },
    { new: true, runValidators: true }
  );

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  return res.status(200).json(note);
});

const deleteNote = asyncHandler(async (req, res) => {
  if (!ensureObjectId(req.params.id, res)) return;

  const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  return res.status(204).send();
});

const shareNote = asyncHandler(async (req, res) => {
  if (!ensureObjectId(req.params.id, res)) return;

  const email = normalizeEmail(req.body && req.body.share_with_email);
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "A valid share_with_email is required" });
  }

  const [note, recipient] = await Promise.all([
    Note.findOne({ _id: req.params.id, owner: req.user.id }),
    User.findOne({ email }),
  ]);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  if (!recipient) {
    return res.status(404).json({ message: "User to share with not found" });
  }

  if (recipient.id === req.user.id) {
    return res.status(400).json({ message: "Cannot share a note with yourself" });
  }

  await Note.updateOne({ _id: note.id }, { $addToSet: { sharedWith: recipient._id } });

  return res.status(200).json({ message: "Note shared successfully" });
});

const pinNote = asyncHandler(async (req, res) => {
  if (!ensureObjectId(req.params.id, res)) return;

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    { pinned: true },
    { new: true, runValidators: true }
  );

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  return res.status(200).json({ message: "Note pinned successfully" });
});

const unpinNote = asyncHandler(async (req, res) => {
  if (!ensureObjectId(req.params.id, res)) return;

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    { pinned: false },
    { new: true, runValidators: true }
  );

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  return res.status(200).json({ message: "Note unpinned successfully" });
});

export default {
  getNotes,
  searchNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  shareNote,
  pinNote,
  unpinNote,
};


