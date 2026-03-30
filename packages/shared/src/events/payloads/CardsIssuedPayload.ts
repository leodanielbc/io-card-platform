import { CardType } from '../../types/CardType.js';
import { Currency } from '../../types/Currency.js';

export interface CardsIssuedPayload {
  cardId: string;
  cardRequestId: string;
  cardNumber: string;
  cardType: CardType;
  currency: Currency;
  expirationDate: string;
  cvv: string;
}
