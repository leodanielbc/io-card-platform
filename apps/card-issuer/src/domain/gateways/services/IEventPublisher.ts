import { Customer } from '../../entities/Customer.js';
import { CardRequest } from '../../entities/CardRequest.js';

export interface IEventPublisher {
  publishCardRequested(customer: Customer, cardRequest: CardRequest, correlationId: string): Promise<void>;
}
