import { CardRequestStatus } from '../../domain/types/CardRequestStatus.js';

export interface RegisterCardRequestOutput {
  cardRequestId: string;
  status: CardRequestStatus;
}
