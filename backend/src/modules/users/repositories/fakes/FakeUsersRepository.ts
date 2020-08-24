import {uuid} from 'uuidv4'

import IUserRepository from '@modules/users/repositories/IUserRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import IFindAllProviders from '@modules/users/dtos/IFindAllProvidersDTO'

import User from '@modules/users/infra/typeorm/entities/User'

class FakeUserRepository implements IUserRepository{
  private users:User[] = []


  public async findById(id:string):Promise<User|undefined>{
    const user = this.users.find(user=> user.id === id)

    return user
  }

  public async findAllProviders({except_user_id}:IFindAllProviders):Promise<User[]>{
    let providers = this.users

    if(except_user_id){
       providers = providers.filter(user=> user.id !== except_user_id)
    }

    return providers
  }

  public async findByEmail(email:string):Promise<User|undefined>{
    const user = this.users.find(user=> user.email === email)

    return user
  }

  public async create({email,name,password}:ICreateUserDTO):Promise<User>{
    const user = new User()
    Object.assign(user,{id:uuid(), email,name,password})

    this.users.push(user)

    return user
  }

  public async save(user:User):Promise<User>{
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id)
    this.users[findIndex] = user

    return user
  }


}

export default FakeUserRepository
