import { Kafka, Producer } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import { IEventPublisher } from '../../domain/gateways/services/IEventPublisher.js';
import { Card } from '../../domain/entities/Card.js';
import {
  CloudEvent,
  TOPICS,
  CardsIssuedPayload,
  CardRequestedDlqPayload,
  CardRequestedPayload,
} from '@io/shared';

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

  async publishCardIssued(card: Card, correlationId: string): Promise<void> {
    const payload: CardsIssuedPayload = {
      cardId: card.id,
      requestId: card.requestId,
      customerId: card.customerId,
      cardNumber: card.cardNumber,
      cardType: card.cardType,
      currency: card.currency,
      expiryDate: card.expiryDate.toISOString(),
    };

    const event: CloudEvent<CardsIssuedPayload> = {
      specversion: '1.0',
      id: uuidv4(),
      source: correlationId,
      type: TOPICS.CARDS_ISSUED,
      datacontenttype: 'application/json',
      time: new Date().toISOString(),
      iocorrelationid: correlationId,
      data: payload,
    };

    await this.producer.send({
      topic: TOPICS.CARDS_ISSUED,
      messages: [{ key: card.requestId, value: JSON.stringify(event) }],
    });
  }

  async publishCardToDlq(
    reason: string,
    retryCount: number,
    originalPayload: CardRequestedPayload,
  ): Promise<void> {
    const payload: CardRequestedDlqPayload = {
      reason,
      retryCount,
      originalPayload,
    };

    const event: CloudEvent<CardRequestedDlqPayload> = {
      specversion: '1.0',
      id: uuidv4(),
      source: originalPayload.requestId,
      type: TOPICS.CARD_REQUESTED_DLQ,
      datacontenttype: 'application/json',
      time: new Date().toISOString(),
      iocorrelationid: originalPayload.requestId,
      data: payload,
    };

    await this.producer.send({
      topic: TOPICS.CARD_REQUESTED_DLQ,
      messages: [{ key: originalPayload.requestId, value: JSON.stringify(event) }],
    });
  }
}
