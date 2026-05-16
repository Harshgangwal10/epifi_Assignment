import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { validateCredentials } from "../utils/validators.js";
import asyncHandler from "../utils/asyncHandler.js";

const register = asyncHandler(async (req, res) => {
  const input = validateCredentials(req.body || {});
  if (input.message) {
    return res.status(400).json({ message: input.message });
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  await User.create({ email: input.email, passwordHash });

  return res.status(201).json({ message: "User registered successfully" });
});

const login = asyncHandler(async (req, res) => {
  const input = validateCredentials(req.body || {});
  if (input.message) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const user = await User.findOne({ email: input.email });
  const validPassword = user
    ? await bcrypt.compare(input.password, user.passwordHash)
    : false;

  if (!user || !validPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return res.status(200).json({ access_token: accessToken });
});

export default {
  register,
  login,
};

