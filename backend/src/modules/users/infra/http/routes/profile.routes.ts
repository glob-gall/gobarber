import { Router } from 'express'
import {celebrate,Segments,Joi} from 'celebrate'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/EnsureAuthenticated'

import ProfileController from '@modules/users/infra/http/controllers/ProfileController'

const profileRouter = Router()

profileRouter.use(ensureAuthenticated)

const profileController = new ProfileController()

profileRouter.put('/', profileController.update)
profileRouter.get('/',celebrate({
  [Segments.BODY]:{
    name:Joi.string().required(),
    email:Joi.string().email().required(),
    old_password:Joi.string(),
    password:Joi.string().required(),
    password_confirmation:Joi.string().valid(Joi.ref('password')),

  }
}), profileController.show)


export default profileRouter
