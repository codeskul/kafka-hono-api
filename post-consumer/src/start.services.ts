import { connectDb } from "./config/db.config";
import kafkaConfig from "./config/kafka.config";
import { postConsumer } from "./services/post.consumer";

export const init = async () => {
  try {
    await connectDb();
    await kafkaConfig.connect();
    await postConsumer();
  } catch (error) {
    console.error("Error initializing Kafka:", error);
    process.exit(1);
  }
};
