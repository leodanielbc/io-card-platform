import { DomainException } from './DomainException.js';

export class DuplicateCardRequestException extends DomainException {
  constructor(documentType: string) {
    super(`A card request already exists for document ${documentType}`);
  }
}
