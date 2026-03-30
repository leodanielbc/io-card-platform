import { CardType } from '../../domain/types/CardType.js';
import { Currency } from '../../domain/types/Currency.js';

export interface RegisterCardRequestInput {
  cardRequestId: string;
  documentType: string;
  email: string;
  age: number;
  cardType: CardType;
  currency: Currency;
  forceError: boolean;
  correlationId: string;
}
