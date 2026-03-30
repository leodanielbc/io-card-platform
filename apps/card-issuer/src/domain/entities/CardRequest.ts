import { CardRequestStatus } from '../types/CardRequestStatus.js';
import { CardType } from '../types/CardType.js';
import { Currency } from '../types/Currency.js';

export interface CardRequestProps {
  id: string;
  customerId: string;
  status: CardRequestStatus;
  cardType: CardType;
  currency: Currency;
  forceError: boolean;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CardRequest {
  readonly id: string;
  readonly customerId: string;
  readonly status: CardRequestStatus;
  readonly cardType: CardType;
  readonly currency: Currency;
  readonly forceError: boolean;
  readonly failureReason: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: CardRequestProps) {
    this.id = props.id;
    this.customerId = props.customerId;
    this.status = props.status;
    this.cardType = props.cardType;
    this.currency = props.currency;
    this.forceError = props.forceError;
    this.failureReason = props.failureReason;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<CardRequestProps, 'status' | 'failureReason' | 'createdAt' | 'updatedAt'>): CardRequest {
    const now = new Date();
    return new CardRequest({
      ...props,
      status: CardRequestStatus.PENDING,
      failureReason: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: CardRequestProps): CardRequest {
    return new CardRequest(props);
  }
}
