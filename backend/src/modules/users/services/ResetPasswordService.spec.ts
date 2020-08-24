
import AppError from '@shared/errors/AppError'

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'

import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider'
import ResetPasswordService from './ResetPasswordService'

let fakeUserRepository :  FakeUserRepository
let fakeUserTokensRepository :  FakeUserTokensRepository
let fakeHashProvider : FakeHashProvider
let resetPasswordService :  ResetPasswordService

describe('ResetPasswordService',()=>{

  beforeEach(()=>{
      fakeUserRepository = new FakeUserRepository()
      fakeUserTokensRepository = new FakeUserTokensRepository()
      fakeHashProvider = new FakeHashProvider()

      resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
      fakeHashProvider
      )
  })

  it('shold be able to reset the password',async ()=>{

    const generateHash = jest.spyOn(fakeHashProvider,'generateHash')

    const user = await fakeUserRepository.create({
      name:'Jhon Doe',
      email:'jhondoe@email.com',
      password:'123456'
    })
    const {token} = await fakeUserTokensRepository.generate(user.id)

     await resetPasswordService.execute({

      password:'123123',
      token

    })

    const checkUserExist = await fakeUserRepository.findById(user.id)

    expect(generateHash).toHaveBeenCalledWith('123123')
    expect(checkUserExist?.password).toBe('123123')

  })

  it('shold not be able to reset the password with non-existing token',async()=>{

    await expect(
      resetPasswordService.execute({
        password:'12312312',
        token:'non-existing-token'
    })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('shold not be able to reset the password with non-existing user',async()=>{
    const {token} = await fakeUserTokensRepository.generate('non-existing-user-id')

    await expect(
      resetPasswordService.execute({
        password:'12312312',
        token
    })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('shold not be able to reset the password if passed 2 hours',async()=>{
    const user = await fakeUserRepository.create({
      name:'Jhon Doe',
      email:'jhondoe@email.com',
      password:'123456'
    })
    const {token} = await fakeUserTokensRepository.generate(user.id)

    jest.spyOn(Date,'now').mockImplementationOnce(()=>{
      const customDate = new Date()

      return customDate.setHours(customDate.getHours()+3)
    })

     await expect(
      resetPasswordService.execute({
        password:'12312312',
        token
    })
    ).rejects.toBeInstanceOf(AppError)
  })

})
