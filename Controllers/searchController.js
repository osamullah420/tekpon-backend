import SubCategory from "../Models/subCategoryModel.js";
import Software from "../Models/softwareModel.js";

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

export const searchSoftwareByName = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Query parameter is required",
    });
  }

  try {
    const softwares = await Software.find({
      name: { $regex: query, $options: "i" },
    })
      .select("_id name imageUrl")
      .limit(10); // Add a limit to optimize performance

    res.status(200).json({
      success: true,
      message: "Softwares fetched successfully",
      data: softwares,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch software!",
      error: error.message,
    });
  }
};
