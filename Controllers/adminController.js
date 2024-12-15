import bcrypt from "bcryptjs";
import Admin from "../Models/adminMode.js";
import generateToken from "../utils/generateToken.js";

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with admin's ID
    const token = generateToken(admin._id);

    res.json({
      succss: true,
      message: "Admin Logged in Successfully",
      admin,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Register Admin
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = new Admin({
      username,
      password: hashedPassword,
    });

    await admin.save();
    res
      .status(201)
      .json({ succss: true, message: "Admin created Successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { login, register };
