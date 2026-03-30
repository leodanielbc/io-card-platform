import { ICardIssuanceGateway } from '../../domain/gateways/services/ICardIssuanceGateway.js';
import { CardIssuanceFailedException } from '../../domain/exceptions/CardIssuanceFailedException.js';

export class CardIssuanceService implements ICardIssuanceGateway {
  async process(forceError: boolean): Promise<void> {
    await this.simulateExternalLoad();

    if (forceError || !this.isSuccessful()) {
      throw new CardIssuanceFailedException('External issuance service rejected the request');
    }
  }

  private simulateExternalLoad(): Promise<void> {
    const delayMs = 200 + Math.floor(Math.random() * 300);
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  private isSuccessful(): boolean {
    return Math.random() > 0.4;
  }
}
