import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
});

// Use the existing model if it exists; otherwise, create a new one
const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
