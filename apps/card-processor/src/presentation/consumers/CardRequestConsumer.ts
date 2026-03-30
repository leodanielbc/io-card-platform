import { Consumer, Kafka, EachMessagePayload } from 'kafkajs';
import { ProcessCardRequestUseCase } from '../../application/use-cases/ProcessCardRequestUseCase.js';
import { CloudEvent, TOPICS, CardRequestedPayload } from '@io/shared';

export class CardRequestConsumer {
  private consumer: Consumer;

  constructor(
    kafka: Kafka,
    private readonly processCardRequest: ProcessCardRequestUseCase,
  ) {
    this.consumer = kafka.consumer({ groupId: 'card-processor-group' });
  }

  async start(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: TOPICS.CARD_REQUESTED, fromBeginning: false });
    await this.consumer.run({ eachMessage: (msg) => this.handleMessage(msg) });
  }

  async stop(): Promise<void> {
    await this.consumer.disconnect();
  }

  private async handleMessage({ message }: EachMessagePayload): Promise<void> {
    if (!message.value) return;

    const event = JSON.parse(message.value.toString()) as CloudEvent<CardRequestedPayload>;
    await this.processCardRequest.execute(event.data, event.source);
  }
}
