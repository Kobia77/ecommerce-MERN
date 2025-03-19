import mongoose from "mongoose";

declare global {
  /* eslint-disable-next-line no-var */
  var mongooseCache: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

const MONGO_URI : string = process.env.MONGO_URI!;
const cached = globalThis.mongooseCache ??= { conn: null, promise: null };

export async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI)
      .then(m => {
        if (process.env.NODE_ENV !== "production") {
          console.log("✅ MongoDB connected");
        }
        return m.connection;
      })
      .catch(err => {
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await cached.conn.close();
    cached.conn = null;
    cached.promise = null;
    if (process.env.NODE_ENV !== "production") {
      console.log("❎ MongoDB disconnected");
    }
  }
}
