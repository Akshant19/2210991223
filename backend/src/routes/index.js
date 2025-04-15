const { AnalyticsController } = require("../controllers/analytics.controller");

function setupRoutes(app) {
  console.log("[Routes] Setting up API routes...");

  app.get("/api/users", (req, res, next) => {
    console.log("[Routes] GET /api/users requested");
    AnalyticsController.getTopUsers(req, res, next);
  });

  app.get("/api/posts", (req, res, next) => {
    console.log(
      `[Routes] GET /api/posts requested with type=${req.query.type}`
    );
    AnalyticsController.getPosts(req, res, next);
  });

  console.log("[Routes] All routes set up successfully");
}

module.exports = { setupRoutes };
