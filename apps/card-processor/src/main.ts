import 'dotenv/config';
import { Kafka } from 'kafkajs';
import { prisma } from './infrastructure/persistence/prisma.js';
import { CardRepository } from './infrastructure/persistence/repositories/CardRepository.js';
import { CardGeneratorService } from './infrastructure/services/CardGeneratorService.js';
import { CardIssuanceService } from './infrastructure/services/CardIssuanceService.js';
import { KafkaEventPublisher } from './infrastructure/events/KafkaEventPublisher.js';
import { ProcessCardRequestUseCase } from './application/use-cases/ProcessCardRequestUseCase.js';
import { CardRequestConsumer } from './presentation/consumers/CardRequestConsumer.js';

const SERVICE_NAME = process.env.SERVICE_NAME ?? 'card-processor';
const KAFKA_BROKERS = process.env.KAFKA_BROKERS ?? 'localhost:9092';

async function main(): Promise<void> {
  const kafka = new Kafka({
    clientId: SERVICE_NAME,
    brokers: KAFKA_BROKERS.split(','),
  });

  const eventPublisher = new KafkaEventPublisher(kafka);
  await eventPublisher.connect();

  const cardRepository = new CardRepository(prisma);
  const cardGenerator = new CardGeneratorService();
  const cardIssuanceGateway = new CardIssuanceService();

  const processCardRequest = new ProcessCardRequestUseCase(
    cardRepository,
    cardGenerator,
    cardIssuanceGateway,
    eventPublisher,
  );

  const consumer = new CardRequestConsumer(kafka, processCardRequest);
  await consumer.start();

  console.log(`[${SERVICE_NAME}] consumer started — brokers: ${KAFKA_BROKERS}`);

  const shutdown = async (): Promise<void> => {
    await consumer.stop();
    await eventPublisher.disconnect();
    await prisma.$disconnect();
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((error) => {
  console.error(`[${SERVICE_NAME}] fatal error`, error);
  process.exit(1);
});
