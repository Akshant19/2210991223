const API_BASE = "http://localhost:3001/api";

async function fetchWithRetry(url, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export async function getTopUsers() {
  try {
    const data = await fetchWithRetry(`${API_BASE}/users`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getTrendingPosts() {
  const response = await fetch(`${API_BASE}/posts?type=popular`);
  return response.json();
}

export async function getFeed() {
  try {
    const response = await fetch(`${API_BASE}/posts?type=latest`);
    const data = await response.json();

    return Array.isArray(data) ? data : data.posts || [];
  } catch (error) {
    console.error("Error fetching feed:", error);
    return [];
  }
}
