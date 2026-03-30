import { PrismaClient } from '../../generated/prisma/client';
import { ICustomerRepository } from '../../../domain/gateways/repositories/ICustomerRepository.js';
import { Customer } from '../../../domain/entities/Customer.js';
import { CustomerMapper } from '../mappers/CustomerMapper.js';

export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(customer: Customer): Promise<void> {
    const data = CustomerMapper.toPersistence(customer);
    await this.prisma.customer.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async findByDocumentNumber(documentNumber: string): Promise<Customer | null> {
    const row = await this.prisma.customer.findUnique({
      where: { document_number: documentNumber },
    });
    if (!row) return null;
    return CustomerMapper.toDomain(row);
  }
}
