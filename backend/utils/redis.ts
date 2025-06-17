import { createClient } from "redis";

const redis = createClient({
  url: "redis://redis:6379",
});

redis.on("error", (err) => console.error("Redis client error", err));

async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

connectRedis();

export default redis;
