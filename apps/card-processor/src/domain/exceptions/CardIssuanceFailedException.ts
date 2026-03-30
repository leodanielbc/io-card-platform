import { DomainException } from './DomainException.js';

export class CardIssuanceFailedException extends DomainException {
  readonly code = 'CARD_ISSUANCE_FAILED';

  constructor(reason: string) {
    super(reason);
  }
}
