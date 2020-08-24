import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@config/upload'
import {celebrate,Segments,Joi} from 'celebrate'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/EnsureAuthenticated'

import UserController from '@modules/users/infra/http/controllers/UsersController'
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController'

const usersRouter = Router()
const upload = multer(uploadConfig.multer)


const userController = new UserController()
const userAvatarController = new UserAvatarController()

usersRouter.post('/',celebrate({
  [Segments.BODY]:{
    name:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().required(),
    password_confirmation:Joi.string().required().valid(Joi.ref('password')),
  }
}), userController.create)

usersRouter.patch('/avatar',
ensureAuthenticated, upload.single('avatar'), userAvatarController.update)

export default usersRouter
