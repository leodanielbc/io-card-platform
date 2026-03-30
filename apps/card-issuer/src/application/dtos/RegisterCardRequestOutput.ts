import { CardRequestStatus } from '../../domain/types/CardRequestStatus.js';

export interface RegisterCardRequestOutput {
  requestId: string;
  status: CardRequestStatus;
}
