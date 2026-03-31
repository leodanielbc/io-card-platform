import { CardType, Currency } from '@io/shared';
import { CardStatus } from '../types/CardStatus.js';

export interface CardProps {
  id: string;
  requestId: string;
  customerId: string;
  cardNumber: string;
  cardNumberHash: string;
  expiryDate: Date;
  cvvHash: string;
  cvvSalt: string;
  cardType: CardType;
  currency: Currency;
  status: CardStatus;
  issuedAt: Date;
}

export interface CardCreateProps {
  id: string;
  requestId: string;
  customerId: string;
  cardNumber: string;
  cardNumberHash: string;
  expiryDate: Date;
  cvvHash: string;
  cvvSalt: string;
  cardType: CardType;
  currency: Currency;
}

export class Card {
  readonly id: string;
  readonly requestId: string;
  readonly customerId: string;
  readonly cardNumber: string;
  readonly cardNumberHash: string;
  readonly expiryDate: Date;
  readonly cvvHash: string;
  readonly cvvSalt: string;
  readonly cardType: CardType;
  readonly currency: Currency;
  readonly status: CardStatus;
  readonly issuedAt: Date;

  private constructor(props: CardProps) {
    this.id = props.id;
    this.requestId = props.requestId;
    this.customerId = props.customerId;
    this.cardNumber = props.cardNumber;
    this.cardNumberHash = props.cardNumberHash;
    this.expiryDate = props.expiryDate;
    this.cvvHash = props.cvvHash;
    this.cvvSalt = props.cvvSalt;
    this.cardType = props.cardType;
    this.currency = props.currency;
    this.status = props.status;
    this.issuedAt = props.issuedAt;
  }

  static create(props: CardCreateProps): Card {
    return new Card({
      ...props,
      status: CardStatus.ACTIVE,
      issuedAt: new Date(),
    });
  }

  static reconstitute(props: CardProps): Card {
    return new Card(props);
  }
}
