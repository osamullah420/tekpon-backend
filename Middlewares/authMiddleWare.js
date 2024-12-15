import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const isAdmin = (req, res, next) => {
  // Check if the user is authenticated and has a role
  if (!req.admin || req.admin.role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Admins only.",
    });
  }

  next();
};

export { protect, isAdmin };
