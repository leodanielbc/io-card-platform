export const Currency = {
  PEN: 'PEN',
  USD: 'USD',
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];
