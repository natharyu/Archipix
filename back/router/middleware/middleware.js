import jwt from "jsonwebtoken";
export const loggedOnly = (req, res, next) => {
  const token = req.cookies.Session;
  if (!token) {
    return res.status(301).redirect("http://localhost:5173/connexion");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(301).redirect("http://localhost:5173/connexion");
    }
    req.userId = decoded.id;
    next();
  });
};

export const adminOnly = (req, res, next) => {
  const token = req.cookies.Session;
  if (!token) {
    return res.status(403).redirect("http://localhost:5173/connexion");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(301).redirect("http://localhost:5173/connexion");
    }
    if (decoded.role === "admin") {
      req.userId = decoded.id;
      next();
    } else {
      return res.status(301).redirect("http://localhost:5173/connexion");
    }
  });
};
