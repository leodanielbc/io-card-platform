import { v4 as uuidv4 } from 'uuid';
import { ICustomerRepository } from '../../domain/gateways/repositories/ICustomerRepository.js';
import { ICardRequestRepository } from '../../domain/gateways/repositories/ICardRequestRepository.js';
import { IEventPublisher } from '../../domain/gateways/services/IEventPublisher.js';
import { Customer } from '../../domain/entities/Customer.js';
import { CardRequest } from '../../domain/entities/CardRequest.js';
import { Email } from '../../domain/value-objects/Email.js';
import { DuplicateCardRequestException } from '../../domain/exceptions/DuplicateCardRequestException.js';
import { RegisterCardRequestInput } from '../dtos/RegisterCardRequestInput.js';
import { RegisterCardRequestOutput } from '../dtos/RegisterCardRequestOutput.js';

export class RegisterCardRequestUseCase {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly cardRequestRepository: ICardRequestRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(input: RegisterCardRequestInput): Promise<RegisterCardRequestOutput> {
    let customer = await this.customerRepository.findByDocumentNumber(input.documentNumber);

    if (customer) {
      const existing = await this.cardRequestRepository.findByCustomerId(customer.id);
      if (existing) {
        throw new DuplicateCardRequestException(input.documentNumber);
      }
    } else {
      customer = Customer.create({
        id: uuidv4(),
        documentType: input.documentType,
        documentNumber: input.documentNumber,
        email: Email.create(input.email),
        age: input.age,
      });
      await this.customerRepository.save(customer);
    }

    const cardRequest = CardRequest.create({
      id: uuidv4(),
      customerId: customer.id,
      cardType: input.cardType,
      currency: input.currency,
      forceError: input.forceError,
    });

    await this.cardRequestRepository.save(cardRequest);

    const correlationId = uuidv4();
    await this.eventPublisher.publishCardRequested(customer, cardRequest, correlationId);

    return { requestId: cardRequest.id, status: cardRequest.status };
  }
}
