import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Add it in backend/.env");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });

  return mongoose.connection;
}
