import { Router } from 'express';
import { IProfileController } from '../controllers/profile/IProfileController';
import { requireAuth } from '../middlewares/auth/requireAuth';
import { validate } from '../middlewares/validate';
import { UpdateUserProfileSchema } from '../controllers/profile/profile.schema';
import { wrap } from './wrapper';

export const createProfileRouter = (controller: IProfileController): Router => {
  const router = Router();

  // GET /profile/me
  router.get(
    '/me', 
    requireAuth, 
    wrap((req, res) => controller.getProfile(req, res))
  );

  // PUT /profile/me
  router.put(
    '/me',
    requireAuth,
    validate(UpdateUserProfileSchema),
    wrap((req, res) => controller.updateProfile(req, res)),
  );

  return router;
};