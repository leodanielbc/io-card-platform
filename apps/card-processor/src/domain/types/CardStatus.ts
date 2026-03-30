export const CardStatus = {
  ACTIVE: 'ACTIVE',
} as const;

export type CardStatus = (typeof CardStatus)[keyof typeof CardStatus];
