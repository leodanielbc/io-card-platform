import { v4 as uuidv4 } from 'uuid';
import { ICardRepository } from '../../domain/gateways/repositories/ICardRepository.js';
import { ICardGenerator } from '../../domain/gateways/services/ICardGenerator.js';
import { ICardIssuanceGateway } from '../../domain/gateways/services/ICardIssuanceGateway.js';
import { IEventPublisher } from '../../domain/gateways/services/IEventPublisher.js';
import { Card } from '../../domain/entities/Card.js';
import { CardRequestedPayload } from '@io/shared';

const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [1000, 2000, 4000];

export class ProcessCardRequestUseCase {
  constructor(
    private readonly cardRepository: ICardRepository,
    private readonly cardGenerator: ICardGenerator,
    private readonly cardIssuanceGateway: ICardIssuanceGateway,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(payload: CardRequestedPayload, correlationId: string): Promise<void> {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) await this.delay(RETRY_DELAYS_MS[attempt - 1]);

      try {
        await this.cardIssuanceGateway.process(payload.forceError);
        const card = this.buildCard(payload);
        await this.cardRepository.save(card);
        await this.eventPublisher.publishCardIssued(card, correlationId);
        return;
      } catch (error) {
        const isLastAttempt = attempt === MAX_RETRIES;
        console.error(`[ProcessCardRequest] attempt ${attempt + 1}/${MAX_RETRIES + 1} failed:`, (error as Error).message);
        if (isLastAttempt) {
          await this.eventPublisher.publishCardToDlq(
            (error as Error).message,
            MAX_RETRIES,
            payload,
          );
        }
      }
    }
  }

  private buildCard(payload: CardRequestedPayload): Card {
    const generated = this.cardGenerator.generate();
    return Card.create({
      id: uuidv4(),
      requestId: payload.requestId,
      customerId: payload.customerId,
      cardType: payload.cardType,
      currency: payload.currency,
      cardNumber: generated.maskedNumber,
      cardNumberHash: generated.cardNumberHash,
      expiryDate: generated.expiryDate,
      cvvHash: generated.cvvHash,
      cvvSalt: generated.cvvSalt,
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
