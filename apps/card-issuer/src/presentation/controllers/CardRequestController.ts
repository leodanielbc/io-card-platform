import { Request, Response, NextFunction } from 'express';
import { RegisterCardRequestUseCase } from '../../application/use-cases/RegisterCardRequestUseCase.js';
import { RegisterCardRequestDto } from '../dtos/RegisterCardRequestDto.js';
import { DocumentType } from '../../domain/types/DocumentType.js';
import { CardType } from '../../domain/types/CardType.js';

export class CardRequestController {
  constructor(private readonly registerCardRequest: RegisterCardRequestUseCase) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = RegisterCardRequestDto.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.issues });
      return;
    }

    try {
      const { customer, product, forceError } = parsed.data;
      const output = await this.registerCardRequest.execute({
        documentType: customer.documentType as DocumentType,
        documentNumber: customer.documentNumber,
        email: customer.email,
        age: customer.age,
        cardType: product.type as CardType,
        currency: product.currency,
        forceError,
      });
      res.status(202).json(output);
    } catch (error) {
      next(error);
    }
  }
}
