import { CardRequest as PrismaCardRequest } from '../../generated/prisma/client.js';
import { CardRequest } from '../../../domain/entities/CardRequest.js';
import { CardRequestStatus } from '../../../domain/types/CardRequestStatus.js';
import { CardType } from '../../../domain/types/CardType.js';
import { Currency } from '../../../domain/types/Currency.js';

export class CardRequestMapper {
  static toDomain(row: PrismaCardRequest): CardRequest {
    return CardRequest.reconstitute({
      id: row.id,
      customerId: row.customer_id,
      status: row.status as CardRequestStatus,
      cardType: row.card_type as CardType,
      currency: row.currency as Currency,
      forceError: row.force_error,
      failureReason: row.failure_reason,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  static toPersistence(entity: CardRequest): PrismaCardRequest {
    return {
      id: entity.id,
      customer_id: entity.customerId,
      status: entity.status,
      card_type: entity.cardType,
      currency: entity.currency,
      force_error: entity.forceError,
      failure_reason: entity.failureReason,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
}
