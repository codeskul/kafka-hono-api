import { Consumer, Kafka, logLevel } from "kafkajs";

class KafkaConfig {
  private kafka: Kafka;
  private consumer: Consumer;
  private broker: string;

  constructor() {
    this.broker = process.env.KAFKA_BROKER || "localhost:9092";
    this.kafka = new Kafka({
      clientId: "post-producer",
      brokers: [this.broker],
      logLevel: logLevel.ERROR,
    });
    this.consumer = this.kafka.consumer({
      groupId: "post-consumer",
    });
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log("Connected to Kafka!");
    } catch (error) {
      console.error("Error connecting to Kafka:", error);
    }
  }

  async subscribeTopic(topic: string): Promise<void> {
    try {
      await this.consumer.subscribe({ topic, fromBeginning: true });
      console.log(`Subscribed to topic ${topic}`);
    } catch (error) {
      console.error("Error subscribing to topic:", error);
    }
  }

  async consume(callback: (message: any) => void): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
        //   console.log("message received:", {
        //     topic,
        //     partition,
        //     message,
        //     value: message?.value?.toString(),
        //   });
          callback(JSON.parse(message?.value?.toString()!));
        },
      });
    } catch (error) {}
  }

  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      console.log("Disconnected from Kafka!");
    } catch (error) {
      console.error("Error disconnecting from Kafka:", error);
    }
  }
}

export default new KafkaConfig();
