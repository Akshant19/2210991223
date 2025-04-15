const { APIService } = require("./api.service");
const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false,
});

class DataService {
  constructor() {
    this.updateInterval = 30000;
    this.isUpdating = false;
    this.isInitialized = false;
  }

  async startPeriodicUpdate() {
    console.log("[DataService] Starting periodic data updates...");
    await this.updateData();
    this.isInitialized = true;
    setInterval(() => this.updateData(), this.updateInterval);
  }

  async updateData() {
    if (this.isUpdating) return;
    this.isUpdating = true;

    try {
      const users = await APIService.getUsers();
      const allPosts = [];
      const userStats = [];
      const commentsCache = {};

      for (const [userId, name] of Object.entries(users)) {
        const posts = await APIService.getUserPosts(userId);
        let totalComments = 0;

        if (Array.isArray(posts)) {
          for (const post of posts) {
            const comments = await APIService.getPostComments(post.id);
            const commentCount = Array.isArray(comments) ? comments.length : 0;

            commentsCache[post.id] = comments;
            totalComments += commentCount;

            allPosts.push({
              ...post,
              userName: name,
              commentCount,
              comments: comments,
              timestamp: Date.now(),
            });
          }
        }

        userStats.push({
          id: userId,
          name,
          commentCount: totalComments,
        });
      }

      if (allPosts.length > 0) {
        cache.set("processedPosts", allPosts);
        cache.set("commentsCache", commentsCache);
      }
      if (userStats.length > 0) {
        cache.set("processedUsers", userStats);
      }

      console.log(
        `[DataService] Cached ${
          Object.keys(commentsCache).length
        } post comments`
      );
    } catch (error) {
      console.error("[DataService] Error during update:", error);
    } finally {
      this.isUpdating = false;
    }
  }

  getProcessedUsers() {
    const users = cache.get("processedUsers");
    console.log(
      `[DataService] Retrieved ${users?.length || 0} users from cache`
    );
    return users || [];
  }

  getProcessedPosts() {
    const posts = cache.get("processedPosts");
    console.log(
      `[DataService] Retrieved ${posts?.length || 0} posts from cache`
    );
    return posts || [];
  }

  getPostComments(postId) {
    const commentsCache = cache.get("commentsCache");
    return commentsCache?.[postId] || [];
  }

  isDataReady() {
    return (
      this.isInitialized &&
      cache.get("processedPosts") &&
      cache.get("processedUsers")
    );
  }
}

module.exports = new DataService();
