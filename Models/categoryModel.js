import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
  },
  { timestamps: true }
);

// Middleware to delete related subcategories and software when a category is deleted
categorySchema.pre("findOneAndDelete", async function (next) {
  const Category = this.model; // The Category model itself
  const SubCategory = mongoose.model("SubCategory");
  const Software = mongoose.model("Software");

  // Get the category ID
  const categoryId = this._conditions._id;

  try {
    // Delete related subcategories
    await SubCategory.deleteMany({ category: categoryId });

    // Delete software related to this category
    await Software.deleteMany({ category: categoryId });

    next();
  } catch (error) {
    next(error);
  }
});

// Use the existing model if it exists; otherwise, create a new one
const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
