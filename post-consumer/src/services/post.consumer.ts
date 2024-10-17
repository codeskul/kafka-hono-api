import kafkaConfig from "../config/kafka.config";
import { PostModel } from "../model/post";

export const postConsumer = async () => {
  const messages: any[] = [];
  let processing = false;

  try {
    await kafkaConfig.subscribeTopic("post");

    await kafkaConfig.consume(async (message) => {
      messages.push(message);
      console.log("Message received:", message);

      if (messages.length > 100) {
        // TODO: save into database bulk insertion
        processMessage();
      }
    });

    setInterval(processMessage, 5000); // run every 5 seconds
  } catch (error) {
    console.error("Error consuming Kafka messages:", error);
  }
  async function processMessage() {
    if (messages.length > 0 && !processing) {
      processing = true;
      const batchToProcess = [...messages];
      messages.length = 0;

      try {
        await PostModel.insertMany(batchToProcess, { ordered: false });
        console.log("Batch processed successfully");
      } catch (error) {
        console.error("Error processing batch:", error);
        messages.push(...batchToProcess);
      } finally {
        processing = false;
      }
    }
  }
};
