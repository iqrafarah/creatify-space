import prisma from "@/lib/db";

const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;  // 2 requests per minute on average

const LIMITS = {
  DEFAULT: 30,    // Normal endpoints
  AUTH: 5,        // Login/signup attempts
  API: 50         // API endpoints
};

export class RateLimiter {
  async checkLimit(identifier) {
    const now = new Date();
    const windowStart = new Date(now.getTime() - WINDOW_SIZE);

    try {
      // Clean old requests
      await prisma.rateLimit.deleteMany({
        where: {
          timestamp: {
            lt: windowStart
          }
        }
      });

      // Add new request
      await prisma.rateLimit.create({
        data: {
          ip: identifier,
          timestamp: now
        }
      });

      // Count requests in window
      const requestCount = await prisma.rateLimit.count({
        where: {
          ip: identifier,
          timestamp: {
            gte: windowStart
          }
        }
      });

      return {
        isAllowed: requestCount <= MAX_REQUESTS,
        remaining: Math.max(0, MAX_REQUESTS - requestCount),
        reset: now.getTime() + WINDOW_SIZE
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      // On error, allow the request
      return {
        isAllowed: true,
        remaining: MAX_REQUESTS,
        reset: now.getTime() + WINDOW_SIZE
      };
    }
  }
}