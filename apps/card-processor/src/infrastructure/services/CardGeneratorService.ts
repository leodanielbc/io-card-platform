import crypto from 'node:crypto';
import { ICardGenerator, GeneratedCardData } from '../../domain/gateways/services/ICardGenerator.js';

export class CardGeneratorService implements ICardGenerator {
  generate(): GeneratedCardData {
    const rawNumber = this.generateCardNumber();
    const cvv = this.generateCvv();

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 3);

    return {
      maskedNumber: this.maskCardNumber(rawNumber),
      cardNumberHash: this.hash(rawNumber),
      expiryDate,
      cvvHash: this.hash(cvv),
    };
  }

  private generateCardNumber(): string {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
  }

  private generateCvv(): string {
    return String(Math.floor(Math.random() * 900) + 100);
  }

  private maskCardNumber(cardNumber: string): string {
    return `****${cardNumber.slice(-4)}`;
  }

  private hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
}
