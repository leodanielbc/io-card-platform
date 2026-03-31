import crypto from 'node:crypto';
import { ICardGenerator, GeneratedCardData } from '../../domain/gateways/services/ICardGenerator.js';

const CARD_EXPIRY_YEARS = 3;
const CVV_SALT_BYTES = 16;

export class CardGeneratorService implements ICardGenerator {
  constructor(private readonly hashSecret: string) {}

  generate(): GeneratedCardData {
    const rawNumber = this.generateCardNumber();
    const cvv = this.generateCvv();
    const cvvSalt = crypto.randomBytes(CVV_SALT_BYTES).toString('hex');

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + CARD_EXPIRY_YEARS);

    return {
      maskedNumber: this.maskCardNumber(rawNumber),
      cardNumberHash: this.hmac(rawNumber),
      expiryDate,
      cvvHash: this.hmac(cvv + cvvSalt),
      cvvSalt,
    };
  }

  private generateCardNumber(): string {
    const prefix = '4';
    const partial = prefix + Array.from(
      { length: 15 - prefix.length },
      () => crypto.randomInt(0, 10),
    ).join('');

    const checkDigit = this.luhnCheckDigit(partial);
    return partial + checkDigit;
  }

  private luhnCheckDigit(partial: string): number {
    let sum = 0;
    for (let i = 0; i < partial.length; i++) {
      let digit = Number(partial[partial.length - 1 - i]);
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return (10 - (sum % 10)) % 10;
  }

  private generateCvv(): string {
    return String(crypto.randomInt(0, 1000)).padStart(3, '0');
  }

  private maskCardNumber(cardNumber: string): string {
    return `****${cardNumber.slice(-4)}`;
  }

  private hmac(value: string): string {
    return crypto.createHmac('sha256', this.hashSecret).update(value).digest('hex');
  }
}
