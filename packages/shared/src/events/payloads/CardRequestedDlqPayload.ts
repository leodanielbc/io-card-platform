import { CardRequestedPayload } from './CardRequestedPayload.js';

export interface CardRequestedDlqPayload {
  reason: string;
  retryCount: number;
  originalPayload: CardRequestedPayload;
}
