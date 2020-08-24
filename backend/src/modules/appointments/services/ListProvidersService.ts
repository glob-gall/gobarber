import {inject,injectable} from 'tsyringe'

import IUserRepository from '@modules/users/repositories/IUserRepository'
import ICacheProvider from '@shared/container/providers/cacheProvider/models/ICacheProvider'

import User from '@modules/users/infra/typeorm/entities/User'

interface IRequest {
  user_id:string
}

@injectable()
class ListProviderService{
  constructor(
    @inject('UsersRepository')
    private userRepository : IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider


    ){}

  public async execute({ user_id}: IRequest): Promise<User[]> {
    let providers = await this.cacheProvider.recover<User[]>(`providers-list:${user_id}`)

    if(!providers){
      providers = await this.userRepository
     .findAllProviders({
       except_user_id:user_id
     })
     this.cacheProvider.save(`providers-list:${user_id}`,providers)
    }


  return providers

  }
}

export default ListProviderService

