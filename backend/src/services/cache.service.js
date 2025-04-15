const NodeCache = require("node-cache");

class CacheService {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 60,
      checkperiod: 120,
    });

    this.keys = {
      USERS: "users",
      POSTS: "posts",
      COMMENTS: "comments",
      AUTH_TOKEN: "auth_token",
    };
  }

  set(key, value, ttl = 60) {
    return this.cache.set(key, value, ttl);
  }

  get(key) {
    return this.cache.get(key);
  }

  del(key) {
    return this.cache.del(key);
  }

  flush() {
    return this.cache.flushAll();
  }
}

module.exports = new CacheService();
