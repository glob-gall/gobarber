import User from '@modules/users/infra/typeorm/entities/User'

import {inject,injectable} from 'tsyringe'

import AppError from '@shared/errors/AppError'
import ICacheProvider from '@shared/container/providers/cacheProvider/models/ICacheProvider'

import IUserRepository from '@modules/users/repositories/IUserRepository'
import IHashProvider from '../providers/hashProvider/models/IHashProvider'

interface Request {
  name: string
  email: string
  password: string
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository : IUserRepository,
    @inject('HashProvider')
    private hashProvider : IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    ){}

  public async execute({ name, email, password }: Request): Promise<User> {


    const checkUserExist = await this.userRepository.findByEmail(email)

    if (checkUserExist) {
      throw new AppError('this Email address is already used')
    }

    const hashPassword = await this.hashProvider.generateHash(password)

    const user =await  this.userRepository.create({
      name,
      email,
      password: hashPassword,
    })

    await this.cacheProvider.invalidatePrefix('providers-list')

    return user
  }
}

export default CreateUserService
