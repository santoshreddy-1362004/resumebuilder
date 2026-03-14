import Redis from "ioredis";
import "dotenv/config";

const redis = new Redis(process.env.REDIS_URL, {
  tls: { rejectUnauthorized: false },
});

redis.on("connect", async () => {
  console.log("✅ Upstash Redis connected!");
  try {
    await redis.set("test:ping", "pong", "EX", 10);
    const val = await redis.get("test:ping");
    console.log("✅ Test read/write:", val);
  } catch (e) {
    console.error("❌ Test failed:", e.message);
  }
  redis.disconnect();
});

redis.on("error", (err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
