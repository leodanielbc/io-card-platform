import { Router } from 'express';
import { CardRequestController } from '../controllers/CardRequestController.js';

export function cardRequestRoutes(controller: CardRequestController): Router {
  const router = Router();

  router.post('/cards/issue', (req, res, next) => controller.register(req, res, next));

  return router;
}
