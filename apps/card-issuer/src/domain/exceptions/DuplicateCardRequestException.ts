import { DomainException } from './DomainException.js';

export class DuplicateCardRequestException extends DomainException {
  constructor(documentNumber: string) {
    super(`A card request already exists for document number ${documentNumber}`);
  }
}
