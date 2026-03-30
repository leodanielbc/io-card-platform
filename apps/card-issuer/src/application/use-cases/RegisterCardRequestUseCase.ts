import { v4 as uuidv4 } from 'uuid';
import { ICardRequestRepository } from '../../domain/gateways/repositories/ICardRequestRepository.js';
import { IEventPublisher } from '../../domain/gateways/services/IEventPublisher.js';
import { CardRequest } from '../../domain/entities/CardRequest.js';
import { Email } from '../../domain/value-objects/Email.js';
import { DuplicateCardRequestException } from '../../domain/exceptions/DuplicateCardRequestException.js';
import { RegisterCardRequestInput } from '../dtos/RegisterCardRequestInput.js';
import { RegisterCardRequestOutput } from '../dtos/RegisterCardRequestOutput.js';

export class RegisterCardRequestUseCase {
  constructor(
    private readonly cardRequestRepository: ICardRequestRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(input: RegisterCardRequestInput): Promise<RegisterCardRequestOutput> {
    const existing = await this.cardRequestRepository.findByDocumentType(input.documentType);
    if (existing) {
      throw new DuplicateCardRequestException(input.documentType);
    }

    const cardRequest = CardRequest.create({
      id: input.cardRequestId ?? uuidv4(),
      documentType: input.documentType,
      email: Email.create(input.email),
      age: input.age,
      cardType: input.cardType,
      currency: input.currency,
      forceError: input.forceError,
      correlationId: input.correlationId,
    });

    await this.cardRequestRepository.save(cardRequest);
    await this.eventPublisher.publishCardRequested(cardRequest);

    return {
      cardRequestId: cardRequest.id,
      status: cardRequest.status,
    };
  }
}
