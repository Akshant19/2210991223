const { APIService } = require("../services/api.service");
const dataService = require("../services/data.service");

class AnalyticsController {
  static async getTopUsers(req, res) {
    try {
      if (!dataService.isDataReady()) {
        console.log("[Analytics] Waiting for initial data load...");
        return res.status(503).json({ error: "Data is being loaded" });
      }
      console.log("[Analytics] Fetching top users...");
      const users = dataService.getProcessedUsers();
      console.log(`[Analytics] Found ${users.length} users`);

      const topUsers = users
        .sort((a, b) => b.commentCount - a.commentCount)
        .slice(0, 5);

      console.log("[Analytics] Sending top users response");
      res.json(topUsers);
    } catch (error) {
      console.error("[Analytics] Error in getTopUsers:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getPosts(req, res) {
    try {
      if (!dataService.isDataReady()) {
        console.log("[Analytics] Waiting for initial data load...");
        return res.status(503).json({ error: "Data is being loaded" });
      }

      const { type } = req.query;
      console.log(`[Analytics] Fetching posts of type: ${type}`);

      const posts = dataService.getProcessedPosts();
      console.log(`[Analytics] Found ${posts.length} total posts`);

      if (!posts.length) {
        console.log("[Analytics] No posts found in cache");
        return res.json([]);
      }

      let result;
      if (type === "popular") {
        const maxComments = Math.max(...posts.map((p) => p.commentCount));
        result = posts.filter((p) => p.commentCount === maxComments);
        console.log(`[Analytics] Found ${result.length} popular posts`);
      } else if (type === "latest") {
        result = [...posts]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 5);
        console.log("[Analytics] Returning 5 latest posts");
      }

      res.json(result || []);
    } catch (error) {
      console.error("[Analytics] Error in getPosts:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = { AnalyticsController };
