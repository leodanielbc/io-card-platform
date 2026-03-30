import { CardType } from '../../domain/types/CardType.js';
import { Currency } from '../../domain/types/Currency.js';
import { DocumentType } from '../../domain/types/DocumentType.js';

export interface RegisterCardRequestInput {
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  age: number;
  cardType: CardType;
  currency: Currency;
  forceError: boolean;
}
