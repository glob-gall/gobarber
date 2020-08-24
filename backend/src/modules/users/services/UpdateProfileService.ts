import {inject,injectable} from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IHashProvider from '@modules/users/providers/hashProvider/models/IHashProvider'
import IUserRepository from '../repositories/IUserRepository'
import User from '../infra/typeorm/entities/User'

interface IRequest {
  user_id:string
  name:string
  email:string
  old_password?:string
  password?:string
}

@injectable()
class UpdateProfileService{
  constructor(
    @inject('UsersRepository')
    private userRepository : IUserRepository,

    @inject('HashProvider')
    private hashProvider : IHashProvider
    ){}

  public async execute({ user_id, name,email,password,old_password }: IRequest): Promise<User> {

    const user = await this.userRepository.findById(user_id)
    if(!user){
      throw new AppError('User not found')
    }

    const userEmailExist = await this.userRepository.findByEmail(email)
    if(userEmailExist && userEmailExist.id !== user_id){
      throw new AppError('This email is already used')
    }

    user.name = name
    user.email = email

    if(password && !old_password){
      throw new AppError('You need inform the old password to update the password')
    }
    if(password && old_password){
      const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password)
      if(!checkOldPassword){
        throw new AppError('old password does not match')
      }
    }


    if(password){
      user.password = await this.hashProvider.generateHash(password)
    }

  return this.userRepository.save(user)

  }
}

export default UpdateProfileService

