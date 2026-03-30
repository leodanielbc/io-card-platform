import { DomainException } from './DomainException.js';

export class InvalidEmailException extends DomainException {
  constructor(value: string) {
    super(`Invalid email address: "${value}"`);
  }
}
