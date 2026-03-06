import app from "../backend/src/app.js";
import { connectDB } from "../backend/src/config/db.js";

let dbReadyPromise;

async function ensureDb() {
  if (!dbReadyPromise) {
    dbReadyPromise = connectDB(process.env.MONGODB_URI);
  }
  await dbReadyPromise;
}

export default async function handler(req, res) {
  try {
    await ensureDb();
    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Database connection failed",
      details: error.message
    });
  }
}
