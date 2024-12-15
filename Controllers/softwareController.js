import Software from "../Models/softwareModel.js";
import SubCategory from "../Models/subCategoryModel.js";

export const addSoftware = async (req, res) => {
	const { name, description, subCategory, category, score } = req.body;

	try {
		// Validate required fields
		if (
			!name ||
			!description ||
			!subCategory ||
			!category ||
			score === undefined
		) {
			return res.status(400).json({
				success: false,
				message:
					"All fields (name, description, subCategory, category, and score) are required.",
			});
		}

		if (!req.file || !req.file.path) {
			return res
				.status(400)
				.json({ success: false, message: "Image is required" });
		}

		const parsedScore = parseFloat(score);
		if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) {
			return res.status(400).json({
				success: false,
				message: "Score must be a number between 0 and 10.",
			});
		}

		// Check if software with the same name and subCategory already exists
		const existingSoftware = await Software.findOne({
			name: name,
			subCategory: subCategory,
		});

		if (existingSoftware) {
			return res.status(400).json({
				success: false,
				message: "Software with this name already exists in the subcategory.",
			});
		}

		// Create a new software entry
		const newSoftware = new Software({
			name,
			description,
			subCategory,
			category,
			score,
			imageUrl: req.file.path,
		});

		// Save the software in the database
		await newSoftware.save();

		res.status(201).json({
			success: true,
			message: "Software added successfully",
			data: newSoftware,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to add software",
			error: error.message,
		});
	}
};

export const getTopSoftwareByCategory = async (req, res) => {
	const { subcategoryId } = req.params;

	try {
		const category = await SubCategory.findById(subcategoryId);
		if (!category) {
			return res.status(404).json({ error: "Category not found" });
		}

		const topSoftware = await Software.find({ subCategory: subcategoryId })
			.select("name score imageUrl") // Select only name, score, and imageUrl
			.sort({ score: -1 }) // Sort by score in descending order
			.limit(6); // Limit to 6

		res.status(200).json({
			success: true,
			message: "Software fetched successfully",
			data: {
				topSoftware,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch the softwares!",
			error: error.message,
		});
	}
};

export const getAllSoftware = async (req, res) => {
	try {
		// Fetch all categories, sorted alphabetically
		const softwares = await Software.find()
			.select("_id name description score category subCategory imageUrl")
			.sort({ name: 1 });

		res.status(200).json({
			success: true,
			message: "Software fetched successfully",
			data: {
				softwares,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch Software!",
			error: error.message,
		});
	}
};

export const getAllSoftwareByCategoryWithPagination = async (req, res) => {
	const { subcategoryId } = req.params;
	const { page = 1 } = req.query; // Default to page 1 if not provided

	try {
		const category = await SubCategory.findById(subcategoryId);
		if (!category) {
			return res
				.status(404)
				.json({ success: false, message: "Category not found" });
		}

		// Convert page to a number and calculate the number of items to skip
		const pageNumber = parseInt(page, 10);
		const limit = 20;
		const skip = (pageNumber - 1) * limit;

		const totalCount = await Software.countDocuments({
			subCategory: subcategoryId,
		});
		const softwareList = await Software.find({ subCategory: subcategoryId })
			.populate({
				path: "subCategory",
				select: "name",
			})
			.skip(skip)
			.limit(limit);

		res.status(200).json({
			success: true,
			message: "Software fetched successfully",
			data: {
				software: softwareList,
				pagination: {
					totalItems: totalCount,
					currentPage: pageNumber,
					totalPages: Math.ceil(totalCount / limit),
					itemsPerPage: limit,
				},
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch the software!",
			error: error.message,
		});
	}
};
