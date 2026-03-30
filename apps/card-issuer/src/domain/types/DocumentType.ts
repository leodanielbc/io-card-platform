export const DocumentType = {
  DNI: 'DNI',
} as const;

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];
