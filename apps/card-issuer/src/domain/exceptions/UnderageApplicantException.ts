import { DomainException } from './DomainException.js';

export class UnderageApplicantException extends DomainException {
  readonly code = 'UNDERAGE_APPLICANT';

  constructor(age: number) {
    super(`Applicant must be at least 18 years old. Got: ${age}`);
  }
}
