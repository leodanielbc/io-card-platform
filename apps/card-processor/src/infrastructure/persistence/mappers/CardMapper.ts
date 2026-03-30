import { Card as PrismaCard } from '../../generated/prisma/client.js';
import { Card } from '../../../domain/entities/Card.js';
import { CardStatus } from '../../../domain/types/CardStatus.js';
import { CardType, Currency } from '@io/shared';

export class CardMapper {
  static toDomain(row: PrismaCard): Card {
    return Card.reconstitute({
      id: row.id,
      requestId: row.request_id,
      customerId: row.customer_id,
      cardNumber: row.card_number,
      cardNumberHash: row.card_number_hash,
      expiryDate: row.expiry_date,
      cvvHash: row.cvv_hash,
      cardType: row.card_type as CardType,
      currency: row.currency as Currency,
      status: row.status as CardStatus,
      issuedAt: row.issued_at,
    });
  }

  static toPersistence(entity: Card): PrismaCard {
    return {
      id: entity.id,
      request_id: entity.requestId,
      customer_id: entity.customerId,
      card_number: entity.cardNumber,
      card_number_hash: entity.cardNumberHash,
      expiry_date: entity.expiryDate,
      cvv_hash: entity.cvvHash,
      card_type: entity.cardType,
      currency: entity.currency,
      status: entity.status,
      issued_at: entity.issuedAt,
    };
  }
}
