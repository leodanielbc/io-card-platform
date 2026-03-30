import { CardType } from '../../types/CardType.js';
import { Currency } from '../../types/Currency.js';

export interface CardsIssuedPayload {
  cardId: string;
  requestId: string;
  customerId: string;
  cardNumber: string;
  cardType: CardType;
  currency: Currency;
  expiryDate: string;
}
