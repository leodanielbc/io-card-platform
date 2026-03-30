import "dotenv/config";
import express from "express";
import { Kafka } from "kafkajs";
import { prisma } from "./infrastructure/persistence/prisma.js";
import { CustomerRepository } from "./infrastructure/persistence/repositories/CustomerRepository.js";
import { CardRequestRepository } from "./infrastructure/persistence/repositories/CardRequestRepository.js";
import { KafkaEventPublisher } from "./infrastructure/events/KafkaEventPublisher.js";
import { RegisterCardRequestUseCase } from "./application/use-cases/RegisterCardRequestUseCase.js";
import { CardRequestController } from "./presentation/controllers/CardRequestController.js";
import { cardRequestRoutes } from "./presentation/routes/cardRequestRoutes.js";
import { errorHandler } from "./presentation/middlewares/ErrorHandler.js";

const PORT = process.env.PORT ?? "3001";
const SERVICE_NAME = process.env.SERVICE_NAME ?? "card-issuer";
const KAFKA_BROKERS = process.env.KAFKA_BROKER ?? "localhost:9092";

async function main(): Promise<void> {
  const kafka = new Kafka({
    clientId: SERVICE_NAME,
    brokers: KAFKA_BROKERS.split(","),
  });

  const eventPublisher = new KafkaEventPublisher(kafka);
  await eventPublisher.connect();

  const customerRepository = new CustomerRepository(prisma);
  const cardRequestRepository = new CardRequestRepository(prisma);
  const registerCardRequest = new RegisterCardRequestUseCase(
    customerRepository,
    cardRequestRepository,
    eventPublisher,
  );
  const cardRequestController = new CardRequestController(registerCardRequest);

  const app = express();
  app.use(express.json());
  app.use(cardRequestRoutes(cardRequestController));
  app.use(errorHandler);

  const server = app.listen(PORT, () => {
    console.log(`[${SERVICE_NAME}] listening on port ${PORT}`);
  });

  const shutdown = async (): Promise<void> => {
    server.close();
    await eventPublisher.disconnect();
    await prisma.$disconnect();
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((error) => {
  console.error(`[${SERVICE_NAME}] fatal error`, error);
  process.exit(1);
});
