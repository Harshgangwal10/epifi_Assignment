function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function validateCredentials(body) {
  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";

  if (!isValidEmail(email)) {
    return { message: "A valid email is required" };
  }

  if (password.length < 8) {
    return { message: "Password must be at least 8 characters long" };
  }

  return { email, password };
}

function validateNoteInput(body, partial = false) {
  const title = typeof body.title === "string" ? body.title.trim() : undefined;
  const content = typeof body.content === "string" ? body.content.trim() : undefined;

  if (!partial || title !== undefined) {
    if (!title) return { message: "Title is required" };
    if (title.length > 160) return { message: "Title must be 160 characters or less" };
  }

  if (!partial || content !== undefined) {
    if (!content) return { message: "Content is required" };
    if (content.length > 10000) return { message: "Content must be 10000 characters or less" };
  }

  return { title, content };
}

export {
  normalizeEmail,
  isValidEmail,
  validateCredentials,
  validateNoteInput,
};

