import { Router } from 'express';
import { requireAuth } from '../middlewares/auth/requireAuth';
import { requireRole } from '../middlewares/auth/requireRole';
import { validate } from '../middlewares/validate';
import { CreateAppealSchema, ResolveAppealSchema } from '../controllers/appeal/appeal.schema';
import { appealCreateLimiter, appealAdminLimiter } from '../middlewares/rateLimiter';
import { wrap } from './wrapper';

export const createAppealRouter = (controller: any): Router => {
  const router = Router();

  // POST /appeals — создать апелляцию
  router.post(
    '/',
    requireAuth,
    appealCreateLimiter,
    validate(CreateAppealSchema),
    wrap((req, res) => controller.createAppeal(req, res)),
  );

  // GET /appeals/:appealId — получить апелляцию
  router.get(
    '/:appealId',
    requireAuth,
    wrap((req, res) => controller.getAppeal(req, res)),
  );

  // POST /appeals/:appealId/resolve — admin разрешает
  router.post(
    '/:appealId/resolve',
    requireAuth,
    requireRole('admin'),
    appealAdminLimiter,
    validate(ResolveAppealSchema),
    wrap((req, res) => controller.resolveAppeal(req, res)),
  );

  // POST /appeals/:appealId/reject — admin отклоняет
  router.post(
    '/:appealId/reject',
    requireAuth,
    requireRole('admin'),
    appealAdminLimiter,
    wrap((req, res) => controller.rejectAppeal(req, res)),
  );

  return router;
};