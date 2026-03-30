import { CardRequestStatus } from '../types/CardRequestStatus.js';
import { CardType } from '../types/CardType.js';
import { Currency } from '../types/Currency.js';
import { Email } from '../value-objects/Email.js';
import { UnderageApplicantException } from '../exceptions/UnderageApplicantException.js';

export interface CardRequestProps {
  id: string;
  documentType: string;
  email: Email;
  age: number;
  cardType: CardType;
  currency: Currency;
  status: CardRequestStatus;
  forceError: boolean;
  correlationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CardRequest {
  readonly id: string;
  readonly documentType: string;
  readonly email: Email;
  readonly age: number;
  readonly cardType: CardType;
  readonly currency: Currency;
  readonly status: CardRequestStatus;
  readonly forceError: boolean;
  readonly correlationId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: CardRequestProps) {
    this.id = props.id;
    this.documentType = props.documentType;
    this.email = props.email;
    this.age = props.age;
    this.cardType = props.cardType;
    this.currency = props.currency;
    this.status = props.status;
    this.forceError = props.forceError;
    this.correlationId = props.correlationId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<CardRequestProps, 'status' | 'createdAt' | 'updatedAt'>): CardRequest {
    if (props.age < 18) {
      throw new UnderageApplicantException(props.age);
    }

    const now = new Date();
    return new CardRequest({
      ...props,
      status: CardRequestStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: CardRequestProps): CardRequest {
    return new CardRequest(props);
  }
}
