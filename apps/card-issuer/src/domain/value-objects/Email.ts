import { InvalidEmailException } from '../exceptions/InvalidEmailException.js';

export class Email {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email {
    const normalized = value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new InvalidEmailException(value);
    }
    return new Email(normalized);
  }

  static reconstitute(value: string): Email {
    return new Email(value);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
