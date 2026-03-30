export const CardRequestStatus = {
  PENDING: 'PENDING',
  ISSUED: 'ISSUED',
  FAILED: 'FAILED',
} as const;

export type CardRequestStatus = (typeof CardRequestStatus)[keyof typeof CardRequestStatus];
