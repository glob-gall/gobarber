import {Request,Response} from 'express'

import {container} from 'tsyringe'

import ResetPasswordEmailService from '@modules/users/services/ResetPasswordService'

export default class ResetPasswordController{
  async create(request:Request,response:Response): Promise<Response>{
    const { token, password } = request.body

  const resetPassword = container.resolve(ResetPasswordEmailService)

    await resetPassword.execute({
    password,token
  })

  return response.status(204).json()
  }
}
