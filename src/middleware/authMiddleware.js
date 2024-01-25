export default function authMiddleware(req, res, next) {
  if (req.headers.authorization !== `Bearer ${process.env.API_BEARER_TOKEN}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}
