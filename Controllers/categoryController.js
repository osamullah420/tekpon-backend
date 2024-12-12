import Category from "../Models/categoryModel.js";

export const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories, sorted alphabetically
    const categories = await Category.find().select("name").sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories!",
      error: error.message,
    });
  }
};
