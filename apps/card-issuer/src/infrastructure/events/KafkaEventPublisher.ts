import { Kafka, Producer } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import { IEventPublisher } from '../../domain/gateways/services/IEventPublisher.js';
import { Customer } from '../../domain/entities/Customer.js';
import { CardRequest } from '../../domain/entities/CardRequest.js';
import { CloudEvent, TOPICS, CardRequestedPayload } from '@io/shared';

export class KafkaEventPublisher implements IEventPublisher {
  private producer: Producer;

  constructor(kafka: Kafka) {
    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  async publishCardRequested(customer: Customer, cardRequest: CardRequest, correlationId: string): Promise<void> {
    const payload: CardRequestedPayload = {
      requestId: cardRequest.id,
      customerId: customer.id,
      documentType: customer.documentType,
      documentNumber: customer.documentNumber,
      email: customer.email.value,
      age: customer.age,
      cardType: cardRequest.cardType,
      currency: cardRequest.currency,
      forceError: cardRequest.forceError,
      retryCount: 0,
    };

    const event: CloudEvent<CardRequestedPayload> = {
      specversion: '1.0',
      id: uuidv4(),
      source: correlationId,
      type: TOPICS.CARD_REQUESTED,
      datacontenttype: 'application/json',
      time: new Date().toISOString(),
      iocorrelationid: correlationId,
      data: payload,
    };

    await this.producer.send({
      topic: TOPICS.CARD_REQUESTED,
      messages: [{ key: cardRequest.id, value: JSON.stringify(event) }],
    });
  }
}
