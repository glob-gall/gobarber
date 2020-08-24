import {inject,injectable} from 'tsyringe'
import path from 'path'

import AppError from '@shared/errors/AppError'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'
import IMailProvider from '@shared/container/providers/mailProvider/models/IMailProvider'

interface IRequest {
  email: string
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private userRepository : IUserRepository,

    @inject('MailProvider')
    private mailProvider : IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository : IUserTokensRepository

    ){}

  public async execute({email}: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email)
    if(!user){
      throw new AppError('this email is not used')
    }
    const {token} = await this.userTokensRepository.generate(user.id)
    const forgotPasswordTemplate = path.resolve(__dirname,'..','views','forgot_password.hbs')

    await this.mailProvider.sendMail({
      to:{
        name:user.name,
        email:user.email
      },
      subject:'[Go Barber] Recuperação de senha',
      templateData:{
        file:forgotPasswordTemplate,
        variables:{
          name:user.name,
          link:`${process.env.APP_WEB_URL}/reset_password?token=${token}`
        }
      }
    })

  }
}

export default SendForgotPasswordEmailService
