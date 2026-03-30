import { CardRequest } from '../../entities/CardRequest.js';

export interface ICardRequestRepository {
  save(cardRequest: CardRequest): Promise<void>;
  findByDocumentType(documentType: string): Promise<CardRequest | null>;
}
