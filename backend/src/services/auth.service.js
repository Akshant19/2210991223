const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache();
const TEST_SERVER = "http://20.244.56.144/evaluation-service";

const AUTH_CREDENTIALS = {
  email: "akshant1223.be22@chitkara.edu.in",
  name: "Akshant Kumar",
  rollNo: "2210991223",
  accessCode: "PwzufG",
  clientID: "43de9067-7a8d-44f5-87f8-24cb3b1bafdd",
  clientSecret: "dyatSTXhYgMkJXnB",
};

async function initializeAuth() {
  try {
    const response = await axios.post(`${TEST_SERVER}/auth`, AUTH_CREDENTIALS);
    const { access_token, expires_in } = response.data;

    cache.set(
      "authToken",
      access_token,
      Math.floor(expires_in - Date.now() / 1000)
    );
    return access_token;
  } catch (error) {
    console.error("Auth failed:", error);
    throw error;
  }
}

function getAuthToken() {
  return cache.get("authToken");
}

module.exports = { initializeAuth, getAuthToken };
