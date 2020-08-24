import {Request,Response} from 'express'
import {classToClass} from 'class-transformer'
import {container} from 'tsyringe'

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService'

export default class SessionsController{
  async create(request:Request,response:Response): Promise<Response>{
    const { email, password } = request.body

  const authenticadeUser = container.resolve(AuthenticateUserService)

  const { user, token } = await authenticadeUser.execute({
    email,
    password,
  })

  return response.json({ user:classToClass(user), token })
  }
}
