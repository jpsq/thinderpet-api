import { connect } from "mongoose";
import { DB_URI } from "../config";

const dbInit = async () => {
  try {
    const db = await connect(DB_URI);
    console.log("Database is connected to", db.connection.db.databaseName);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export default dbInit;
