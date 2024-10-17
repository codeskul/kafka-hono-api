import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import kafkaConfig from "../config/kafka.config";

const app = new Hono();

app.post(
  "/create-post",
  zValidator(
    "json",
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
  async (c) => {
    const { title, content } = c.req.valid("json");
    try {
      await kafkaConfig.sendToTopic("post", JSON.stringify({ title, content }));
      return c.json({ message: "Post created successfully" });
    } catch (error) {
      console.error("Error sending message to Kafka:", error);
      return c.json({ error: "Failed to send message to Kafka" }, 500);
    }
  }
);

export default app;
