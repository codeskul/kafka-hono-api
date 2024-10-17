import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import kafkaConfig from "../config/kafka.config";
import { PostModel } from "../model/post";

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
      await PostModel.create({ title, content });
      return c.json({ message: "Post created successfully" });
    } catch (error) {
      console.error("Error creating post:", error);
      return c.json({ error: "Failed to create post" }, 500);
    }
  }
);

export default app;
