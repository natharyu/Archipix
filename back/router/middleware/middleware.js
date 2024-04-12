import jwt from "jsonwebtoken";
/**
 * Checks if the user is logged in
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} next The next middleware function
 */
export const loggedOnly = (req, res, next) => {
  // Retrieve the JWT from the cookies
  const token = req.cookies.Session;
  // Check if the JWT is missing
  if (!token) {
    // Redirect the user to the login page
    return res.status(301).redirect("/connexion");
  }
  // Verify the JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // Check if the JWT is invalid
    if (err) {
      // Redirect the user to the login page
      return res.status(301).redirect("/connexion");
    }
    // Set the user ID
    req.userId = decoded.id;
    // Call the next middleware function
    next();
  });
};

/**
 * Checks if the user is an admin
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} next The next middleware function
 */
export const adminOnly = (req, res, next) => {
  // Retrieve the JWT from the cookies
  const token = req.cookies.Session;
  // Check if the JWT is missing
  if (!token) {
    // Return a 403 Forbidden status code and redirect to the login page
    return res.status(403).redirect("/connexion");
  }

  // Verify the JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // Check if the JWT is invalid
    if (err) {
      // Redirect the user to the login page
      return res.status(301).redirect("/connexion");
    }
    // Check if the user is an admin
    if (decoded.role === "admin") {
      // Set the user ID
      req.userId = decoded.id;
      // Call the next middleware function
      next();
    } else {
      // Redirect the user to the login page
      return res.status(301).redirect("/connexion");
    }
  });
};
