import AppError from '@shared/errors/AppError'

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider'
import AuthenticateUserService from './AuthenticateUserService'

let fakeUserRepoitory : FakeUserRepository
let fakeHashProvider : FakeHashProvider

let authenticateUser : AuthenticateUserService


describe('authenticate user',()=>{
  beforeEach(()=>{
     fakeUserRepoitory = new FakeUserRepository()
     fakeHashProvider = new FakeHashProvider()

      authenticateUser = new AuthenticateUserService(fakeUserRepoitory,fakeHashProvider)

  })
  it('shold be able to authenticate',async()=>{

    const user = await fakeUserRepoitory.create({
      email:'jhondoe@email.com',
      name:'jhon doe',
      password:'123456'
    })

    const response = await authenticateUser.execute({
      email:'jhondoe@email.com',
      password:'123456'
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })

  it('shold not be able to authenticate with non existing user',async()=>{

    await expect(authenticateUser.execute({
      email:'jhondoe@email.com',
      password:'123456'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('shold not be able to authenticate with wrong password',async()=>{

     await fakeUserRepoitory.create({
      email:'jhondoe@email.com',
      name:'jhon doe',
      password:'123456'
    })


    await expect(authenticateUser.execute({
      email:'jhondoe@email.com',
      password:'wrong-password'
    })).rejects.toBeInstanceOf(AppError)
  })
})
