import { sign } from 'jsonwebtoken'
import {inject,injectable} from 'tsyringe'

import AppError from '@shared/errors/AppError'
import authConfig from '@config/auth'
import IHashProvider from '../providers/hashProvider/models/IHashProvider'
import User from '@modules/users/infra/typeorm/entities/User'

import  IUserRepository from "@modules/users/repositories/IUserRepository";
interface Request {
  email: string
  password: string
}

interface Response {
  user: User
  token: string
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository : IUserRepository,
    @inject('HashProvider')
    private hashProvider : IHashProvider
    ){}

  public async execute({ email, password }: Request): Promise<Response> {

    const user = await this.userRepository.findByEmail( email)
    if (!user) {
      throw new AppError('incorrect emaill/password combination', 401)
    }
    const passwordMatched = await this.hashProvider.compareHash(password, user.password)

    if (!passwordMatched) {
      throw new AppError('incorrect email/passwordd combination', 401)
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    })

    return {
      user,
      token,
    }
  }
}

export default AuthenticateUserService
