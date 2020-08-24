
import {inject,injectable} from 'tsyringe'
import {isAfter,addHours} from 'date-fns'

import AppError from '@shared/errors/AppError'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'
import IHashProvider from '../providers/hashProvider/models/IHashProvider'

interface IRequest {
  password: string
  token: string
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private userRepository : IUserRepository,

    @inject('UserTokensRepository')
    private userTokensRepository : IUserTokensRepository,

    @inject('HashProvider')
    private ihashProvider : IHashProvider

    ){}

  public async execute({password,token}: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token)

    if(!userToken){
      throw new AppError('this user token does not exist')
    }
    const user = await this.userRepository.findById(userToken.user_id)

    if(!user){
      throw new AppError('this user does not exist')
    }

    const tokenCreatedAt = addHours(userToken.created_at,2)

    if(isAfter(Date.now(),tokenCreatedAt)){
      throw new AppError('token expired')
    }

    user.password =await this.ihashProvider.generateHash(password)

    await this.userRepository.save(user)
  }
}

export default SendForgotPasswordEmailService
