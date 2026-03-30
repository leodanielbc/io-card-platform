export const CardRequestStatus = {
  PENDING: 'PENDING',
  PROCESSED: 'PROCESSED',
  FAILED: 'FAILED',
} as const;

export type CardRequestStatus = (typeof CardRequestStatus)[keyof typeof CardRequestStatus];
