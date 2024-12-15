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

export const searchSubCategories = async (req, res) => {
  const { keyword, page = 1 } = req.query;
  const limit = 24;

  try {
    // Build regex for partial, case-insensitive matches
    const regex = new RegExp(keyword, "i");

    const subCategories = await SubCategory.find({ name: regex })
      .select("_id name")
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const subCategoryWithSoftwares = await Promise.all(
      subCategories.map(async (subCategory) => {
        const topSoftwares = await Software.find({
          subCategory: subCategory._id,
        })
          .select("_id imageUrl") // Fetch only id and imageUrl
          .sort({ score: -1 })
          .limit(4)
          .lean();

        return {
          name: subCategory.name,
          topSoftwares,
        };
      })
    );

    const totalCount = await SubCategory.countDocuments({ name: regex });

    res.status(200).json({
      success: true,
      message: "Search results fetched successfully",
      data: {
        subCategories: subCategoryWithSoftwares,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
        },
      },
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

export const getSortedSubCategories = async (req, res) => {
  const { page = 1, sort = "asc" } = req.query;
  const limit = 24; // Subcategories per page
  const sortOrder = sort === "desc" ? -1 : 1; // Determine sorting order

  try {
    // Fetch subcategories with pagination and sorting
    const subCategories = await SubCategory.find()
      .select("_id name")
      .sort({ name: sortOrder }) // Dynamic sorting based on query
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Fetch top 4 software for each subcategory
    const subCategoryWithSoftwares = await Promise.all(
      subCategories.map(async (subCategory) => {
        const topSoftwares = await Software.find({
          subCategory: subCategory._id,
        })
          .select("_id imageUrl")
          .sort({ score: -1 }) // Sort by score descending
          .limit(4)
          .lean();

        return { name: subCategory.name, topSoftwares };
      })
    );

    // Count total subcategories for pagination
    const totalCount = await SubCategory.countDocuments();

    res.status(200).json({
      success: true,
      message: `Subcategories fetched successfully (${
        sort === "desc" ? "Z to A" : "A to Z"
      })`,
      data: {
        subCategories: subCategoryWithSoftwares,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subcategories!",
      error: error.message,
    });
  }
};
