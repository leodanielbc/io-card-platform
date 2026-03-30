import { Customer } from '../../entities/Customer.js';

export interface ICustomerRepository {
  save(customer: Customer): Promise<void>;
  findByDocumentNumber(documentNumber: string): Promise<Customer | null>;
}
