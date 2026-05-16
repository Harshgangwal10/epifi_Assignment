import jwt from "jsonwebtoken";

function authenticate(req, res, next) {
  const header = req.get("Authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default authenticate;

