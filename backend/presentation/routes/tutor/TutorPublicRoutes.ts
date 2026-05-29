import { Router } from 'express';
import { ITutorPublicController } from '../../controllers/tutor/public/ITutorPublicController';
import { validate } from '../../middlewares/validate';
import { wrap } from '../wrapper';
import {
  TutorListQuerySchema,
  TutorIdParamsSchema,
} from '../../controllers/tutor/public/tutor-public.schema';

export const createTutorPublicRouter = (
  controller: ITutorPublicController
): Router => {
  const router = Router();

  router.get(
    '/',
    validate(TutorListQuerySchema, 'query'),
    wrap(async (req, res) => {
      await controller.getPublicList(req as any, res);
    }),
  );

  router.get(
    '/:tutorId',
    validate(TutorIdParamsSchema, 'params'),
    wrap(async (req, res) => {
      await controller.getPublicProfile(req as any, res);
    }),
  );

  return router;
};