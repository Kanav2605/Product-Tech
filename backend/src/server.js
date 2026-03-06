import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    const connection = await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
      console.log(`MongoDB connected: ${connection.name}`);
    });
  } catch (error) {
    console.error("Failed to start API", error.message);
    process.exit(1);
  }
}

bootstrap();
