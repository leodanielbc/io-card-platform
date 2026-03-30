export interface GeneratedCardData {
  maskedNumber: string;
  cardNumberHash: string;
  expiryDate: Date;
  cvvHash: string;
}

export interface ICardGenerator {
  generate(): GeneratedCardData;
}
