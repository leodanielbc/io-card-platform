import { Request, Response, NextFunction } from 'express';
import { DomainException } from '../../domain/exceptions/DomainException.js';

const domainExceptionStatusMap = new Map<string, number>([
  ['DUPLICATE_CARD_REQUEST', 409],
  ['UNDERAGE_APPLICANT', 422],
  ['INVALID_EMAIL', 422],
]);

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof DomainException) {
    const status = domainExceptionStatusMap.get(error.code) ?? 422;
    res.status(status).json({ code: error.code, message: error.message });
    return;
  }

  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
}
