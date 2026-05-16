import "dotenv/config";

import app from "./app.js";
import connectDatabase from "./database/connect.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Notes API listening on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});

