import mongoose from "mongoose";

export const connectDb = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/eda-test")
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};
