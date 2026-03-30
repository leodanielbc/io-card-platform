import { CardType } from '../../types/CardType.js';
import { Currency } from '../../types/Currency.js';

export interface CardRequestedPayload {
  cardRequestId: string;
  documentType: string;
  email: string;
  age: number;
  cardType: CardType;
  currency: Currency;
  forceError: boolean;
  retryCount: number;
}
