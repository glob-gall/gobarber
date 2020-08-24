import "reflect-metadata"

import AppError from '@shared/errors/AppError'
import CreateUserService from './CreateUserService'
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider'
import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/FakeCacheProvider'


let fakeUserRepository : FakeUserRepository
let fakeHashProvider : FakeHashProvider
let createUser : CreateUserService
let fakeCacheProvider : FakeCacheProvider


describe('Create User',()=>{
  beforeEach(()=>{
     fakeUserRepository = new FakeUserRepository()
     fakeHashProvider = new FakeHashProvider()
     fakeCacheProvider = new FakeCacheProvider()

     createUser = new CreateUserService(fakeUserRepository,fakeHashProvider,fakeCacheProvider)

  })

  it('shold be able to create a new user',async ()=>{

    const user = await createUser.execute({
      name:'jhon doe',
      email:'jhondoe@email.com',
      password:'123456'
    })

    expect(user).toHaveProperty('id')

  })

  it('shold not be able to create a new user with an user email',async ()=>{

     await createUser.execute({
      name:'jhon doe',
      email:'jhondoe@email.com',
      password:'123456'
    })

    await expect(createUser.execute({
      name:'jhon doe2',
      email:'jhondoe@email.com',
      password:'123456'
    })).rejects.toBeInstanceOf(AppError)


  })


})
