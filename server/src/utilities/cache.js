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

// Clear user recommendations from Redis cache
export const clearRecommendations = async (userId) => {
     const key = `recommendations:user:${userId}`;
     await redis.del(key);
}


// store uer profile data in cache
export const setUserProfile = async (userId, profileData) => {
    const key = `user:${userId}`;
    await redis.set(key, JSON.stringify(profileData)); // Cache indefinitely until user updates profile
}

// get user profile data from cache
export const getUserProfile = async (userId) => {
    const key = `user:${userId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
}

// clear user profile data from cache
export const clearUserProfile = async (userId) => {
    const key = `user:${userId}`;
    await redis.del(key);
}