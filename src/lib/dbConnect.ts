import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: Number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database!!");
    return;
  }

  try {
    const db = await mongoose.connect(
      process.env.MONGODB_URI || "Connection failed"
    );

    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully!!");
  } catch (err) {
    console.log("Database Connection failed!!", err);
    process.exit(1);
  }
}

export default dbConnect;
