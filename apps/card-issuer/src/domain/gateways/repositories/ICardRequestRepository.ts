import { CardRequest } from '../../entities/CardRequest.js';

export interface ICardRequestRepository {
  save(cardRequest: CardRequest): Promise<void>;
  findByCustomerId(customerId: string): Promise<CardRequest | null>;
}
