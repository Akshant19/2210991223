const axios = require("axios");
const NodeCache = require("node-cache");
const { getAuthToken, refreshToken } = require("./auth.service");

const cache = new NodeCache({ stdTTL: 60 });
const TEST_SERVER = "http://20.244.56.144/evaluation-service";

class APIService {
  static async makeAuthenticatedRequest(url) {
    try {
      let token = await getAuthToken();
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          token = await refreshToken();
          const retryResponse = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return retryResponse.data;
        }
        throw error;
      }
    } catch (error) {
      console.error(`Request failed for ${url}:`, error.message);
      throw error;
    }
  }

  static async getUsers() {
    try {
      const cachedData = cache.get("users");
      if (cachedData) return cachedData;

      const data = await this.makeAuthenticatedRequest(`${TEST_SERVER}/users`);
      cache.set("users", data.users);
      return data.users;
    } catch (error) {
      console.error("Error fetching users:", error.message);
      return {};
    }
  }

  static async getUserPosts(userId) {
    try {
      const cacheKey = `posts-${userId}`;
      const cachedData = cache.get(cacheKey);
      if (cachedData) return cachedData;

      const data = await this.makeAuthenticatedRequest(
        `${TEST_SERVER}/users/${userId}/posts`
      );
      cache.set(cacheKey, data.posts);
      return data.posts;
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error.message);
      return [];
    }
  }

  static async getPostComments(postId) {
    try {
      const cacheKey = `comments-${postId}`;
      const cachedData = cache.get(cacheKey);
      if (cachedData) return cachedData;

      const data = await this.makeAuthenticatedRequest(
        `${TEST_SERVER}/posts/${postId}/comments`
      );
      cache.set(cacheKey, data.comments);
      return data.comments;
    } catch (error) {
      console.error(
        `Error fetching comments for post ${postId}:`,
        error.message
      );
      return [];
    }
  }
}

module.exports = { APIService };
