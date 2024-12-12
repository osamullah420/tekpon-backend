import mongoose from "mongoose";
import Category from "../Models/categoryModel.js";

const categories = [
  { name: "Development Tools", description: "Tools for software development" },
  { name: "Design Tools", description: "Tools for UI/UX and graphic design" },
  { name: "Cloud Services", description: "Platforms for cloud computing" },
  { name: "Project Management", description: "Tools for managing projects" },
  {
    name: "Testing Tools",
    description: "Software testing frameworks and tools",
  },
  {
    name: "AI/ML Tools",
    description: "Tools for artificial intelligence and machine learning",
  },
];

const seedCategories = async () => {
  try {
    console.log("Seeding static categories...");
    for (const category of categories) {
      const existingCategory = await Category.findOne({ name: category.name });
      if (!existingCategory) {
        await Category.create(category);
      }
    }
    console.log("Static categories seeded successfully.");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

const startSeeding = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to the database...");
    await mongoose.connect(
      "mongodb+srv://shahzadarif545:14augest2002@cluster0.rdhenru.mongodb.net/software_coverage?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to the database.");

    // Call the seeding function
    await seedCategories();

    // Close the connection
    console.log("Closing the database connection...");
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding process:", error);
    process.exit(1);
  }
};

startSeeding();
