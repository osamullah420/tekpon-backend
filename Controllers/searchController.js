import SubCategory from "../Models/subCategoryModel";
import Software from "../Models/softwareModel";

export const searchItems = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Query parameter is required",
    });
  }

  try {
    // Fetch matching subcategories and softwares
    const [subCategories, softwares] = await Promise.all([
      SubCategory.find({ name: { $regex: query, $options: "i" } }).select(
        "_id name"
      ),
      Software.find({ name: { $regex: query, $options: "i" } }).select(
        "_id name"
      ),
    ]);

    res.status(200).json({
      success: true,
      message: "Search results fetched successfully",
      data: { subCategories, softwares },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch search results!",
      error: error.message,
    });
  }
};
