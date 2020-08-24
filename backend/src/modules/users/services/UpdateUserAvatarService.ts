
import {inject,injectable} from 'tsyringe'

import User from '@modules/users/infra/typeorm/entities/User'

import AppError from '@shared/errors/AppError'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import IStorageProvider from '@shared/container/providers/storageProvider/models/IStorageProvider'

interface Request {
  user_id: string
  avatarFilename: string
}

@injectable()
class UpdateUsersAvatarService {
  constructor(
    @inject('UsersRepository')
    private userRepository : IUserRepository,

    @inject('StorageProvider')
    private storageProvider : IStorageProvider
    ){}

  public async execute({ user_id, avatarFilename }: Request): Promise<User> {


    const user = await this.userRepository.findById(user_id)

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401)
    }
    if (user.avatar) {
        await this.storageProvider.deleteFiles(user.avatar)

      }

    const fileName = await this.storageProvider.saveFiles(avatarFilename)


    user.avatar = fileName

    await this.userRepository.save(user)

    return user
  }
}

export default UpdateUsersAvatarService
