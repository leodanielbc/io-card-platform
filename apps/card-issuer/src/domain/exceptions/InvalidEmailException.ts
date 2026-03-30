import { DomainException } from './DomainException.js';

export class InvalidEmailException extends DomainException {
  readonly code = 'INVALID_EMAIL';

  constructor(value: string) {
    super(`Invalid email address: "${value}"`);
  }
}
