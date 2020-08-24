import User from '@modules/users/infra/typeorm/entities/User'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import IFindAllProviders from '@modules/users/dtos/IFindAllProvidersDTO'

export default interface IUserRepository{
  findAllProviders(data:IFindAllProviders):Promise<User[]>
  findById(id:string):Promise<User | undefined>
  findByEmail(email:string):Promise<User | undefined>
  create(data:ICreateUserDTO):Promise<User>
  save(user:User):Promise<User>
}
