export interface GeneratedCardData {
  maskedNumber: string;
  cardNumberHash: string;
  expiryDate: Date;
  cvvHash: string;
  cvvSalt: string;
}

export interface ICardGenerator {
  generate(): GeneratedCardData;
}
