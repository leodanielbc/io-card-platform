import { Card } from '../../entities/Card.js';
import { CardRequestedPayload } from '@io/shared';

export interface IEventPublisher {
  publishCardIssued(card: Card, correlationId: string): Promise<void>;
  publishCardToDlq(reason: string, retryCount: number, originalPayload: CardRequestedPayload): Promise<void>;
}
