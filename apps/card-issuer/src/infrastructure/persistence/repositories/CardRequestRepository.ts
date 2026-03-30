import { PrismaClient } from '../../generated/prisma/client';
import { ICardRequestRepository } from '../../../domain/gateways/repositories/ICardRequestRepository.js';
import { CardRequest } from '../../../domain/entities/CardRequest.js';
import { CardRequestMapper } from '../mappers/CardRequestMapper.js';

export class CardRequestRepository implements ICardRequestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(cardRequest: CardRequest): Promise<void> {
    const data = CardRequestMapper.toPersistence(cardRequest);
    await this.prisma.cardRequest.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async findByCustomerId(customerId: string): Promise<CardRequest | null> {
    const row = await this.prisma.cardRequest.findFirst({
      where: { customer_id: customerId },
    });
    if (!row) return null;
    return CardRequestMapper.toDomain(row);
  }
}
