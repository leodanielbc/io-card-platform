export const CardType = {
  VISA: 'VISA',
  MASTERCARD: 'MASTERCARD',
} as const;

export type CardType = (typeof CardType)[keyof typeof CardType];
