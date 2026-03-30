import { CardType } from '../../types/CardType.js';
import { Currency } from '../../types/Currency.js';

export interface CardRequestedPayload {
  requestId: string;
  customerId: string;
  documentType: string;
  documentNumber: string;
  email: string;
  age: number;
  cardType: CardType;
  currency: Currency;
  forceError: boolean;
  retryCount: number;
}
