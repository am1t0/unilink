import redis from "../config/cache.js";

// Set user recommendations in Redis cache
export const setRecommendations = async (userId, recommendations) => {
     const key = `recommendations:user:${userId}`;
     await redis.set(key, JSON.stringify(recommendations), { EX: 3600 }); // Cache for 1 hour
}

// Get user recommendations from Redis cache
export const getRecommendations = async (userId) => {
     const key = `recommendations:user:${userId}`;
     const data = await redis.get(key);
     return data ? JSON.parse(data) : null;
}