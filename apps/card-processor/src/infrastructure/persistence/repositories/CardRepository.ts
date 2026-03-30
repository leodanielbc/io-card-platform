import { PrismaClient } from '../../generated/prisma/client.js';
import { ICardRepository } from '../../../domain/gateways/repositories/ICardRepository.js';
import { Card } from '../../../domain/entities/Card.js';
import { CardMapper } from '../mappers/CardMapper.js';

export class CardRepository implements ICardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(card: Card): Promise<void> {
    const data = CardMapper.toPersistence(card);
    await this.prisma.card.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }
}
