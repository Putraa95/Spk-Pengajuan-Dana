// backend/middleware/authMiddleware.js
// Middleware sederhana supaya server jalan
module.exports = (req, res, next) => {
  // sementara set user dummy
  req.user = {
    id: "dummyUserId",
    role: "admin",
  };

  next();
};
