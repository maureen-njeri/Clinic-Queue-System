import mongoose from "mongoose";

// Extend NodeJS.Global to define a custom mongoose cache type
declare global {
  // This line adds a property to the global object in Node.js
  namespace globalThis {
    // eslint-disable-next-line no-var
    var mongoose: {
      conn: mongoose.Connection | null;
      promise: Promise<mongoose.Connection> | null;
    };
  }
}

// Required for TypeScript module resolution
export {};
