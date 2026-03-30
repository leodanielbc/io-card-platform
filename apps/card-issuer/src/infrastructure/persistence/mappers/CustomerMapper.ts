import { Customer as PrismaCustomer } from '../../generated/prisma/client';
import { Customer } from '../../../domain/entities/Customer.js';
import { DocumentType } from '../../../domain/types/DocumentType.js';
import { Email } from '../../../domain/value-objects/Email.js';

export class CustomerMapper {
  static toDomain(row: PrismaCustomer): Customer {
    return Customer.reconstitute({
      id: row.id,
      documentType: row.document_type as DocumentType,
      documentNumber: row.document_number,
      email: Email.reconstitute(row.email),
      age: row.age,
      createdAt: row.created_at,
    });
  }

  static toPersistence(entity: Customer): PrismaCustomer {
    return {
      id: entity.id,
      document_type: entity.documentType,
      document_number: entity.documentNumber,
      email: entity.email.value,
      age: entity.age,
      created_at: entity.createdAt,
    };
  }
}
