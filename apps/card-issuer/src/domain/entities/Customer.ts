import { DocumentType } from '../types/DocumentType.js';
import { Email } from '../value-objects/Email.js';
import { UnderageApplicantException } from '../exceptions/UnderageApplicantException.js';

export interface CustomerProps {
  id: string;
  documentType: DocumentType;
  documentNumber: string;
  email: Email;
  age: number;
  createdAt: Date;
}

export class Customer {
  readonly id: string;
  readonly documentType: DocumentType;
  readonly documentNumber: string;
  readonly email: Email;
  readonly age: number;
  readonly createdAt: Date;

  private constructor(props: CustomerProps) {
    this.id = props.id;
    this.documentType = props.documentType;
    this.documentNumber = props.documentNumber;
    this.email = props.email;
    this.age = props.age;
    this.createdAt = props.createdAt;
  }

  static create(props: Omit<CustomerProps, 'createdAt'>): Customer {
    if (props.age < 18) {
      throw new UnderageApplicantException(props.age);
    }
    return new Customer({ ...props, createdAt: new Date() });
  }

  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }
}
