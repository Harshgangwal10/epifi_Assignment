export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
}

export function errorHandler(error, _req, res, _next) {
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
    return res.status(400).json({ message });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  console.error(error);
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
}

