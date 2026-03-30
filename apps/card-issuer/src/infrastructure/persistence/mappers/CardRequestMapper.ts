import { CardRequest as PrismaCardRequest } from '../generated/prisma/client.js';
import { CardRequest } from '../../../domain/entities/CardRequest.js';
import { CardRequestStatus } from '../../../domain/types/CardRequestStatus.js';
import { CardType } from '../../../domain/types/CardType.js';
import { Currency } from '../../../domain/types/Currency.js';
import { Email } from '../../../domain/value-objects/Email.js';

export class CardRequestMapper {
  static toDomain(row: PrismaCardRequest): CardRequest {
    return CardRequest.reconstitute({
      id: row.id,
      documentType: row.document_type,
      email: Email.reconstitute(row.email),
      age: row.age,
      cardType: row.card_type as CardType,
      currency: row.currency as Currency,
      status: row.status as CardRequestStatus,
      forceError: row.force_error,
      correlationId: row.correlation_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  static toPersistence(entity: CardRequest): PrismaCardRequest {
    return {
      id: entity.id,
      document_type: entity.documentType,
      email: entity.email.value,
      age: entity.age,
      card_type: entity.cardType,
      currency: entity.currency,
      status: entity.status,
      force_error: entity.forceError,
      correlation_id: entity.correlationId,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
}
