import { CardRequest } from '../../entities/CardRequest.js';

export interface IEventPublisher {
  publishCardRequested(cardRequest: CardRequest): Promise<void>;
}
