
import AppError from '@shared/errors/AppError'

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import FakeMailProvider from '@shared/container/providers/mailProvider/fakes/FakeMailProvider'

import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

let fakeUserRepository :  FakeUserRepository
let fakeUserTokensRepository :  FakeUserTokensRepository
let fakeMailProvider :  FakeMailProvider
let sendForgotPasswordEmail :  SendForgotPasswordEmailService

describe('SendForgotPasswordEmail',()=>{

  beforeEach(()=>{
     fakeUserRepository = new FakeUserRepository()
     fakeMailProvider = new FakeMailProvider()
     fakeUserTokensRepository = new FakeUserTokensRepository()

     sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository
      )
  })

  it('shold be able to recover the password  using the email',async ()=>{


    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    fakeUserRepository.create({
      name:'Jhon Doe',
      email:'jhondoe@email.com',
      password:'123456'
    })

     await sendForgotPasswordEmail.execute({

      email:'jhondoe@email.com',

    })

    expect(sendMail).toHaveBeenCalled()

  })


  it('shold not be able to recover the password  for a non existing user',async ()=>{

    await expect( sendForgotPasswordEmail.execute({
      email:'jhondoe@email.com',

    })).rejects.toBeInstanceOf(AppError)

  })

  it('shold generate a forgot password token',async ()=>{


    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')


    const user = await fakeUserRepository.create({
      name:'Jhon Doe',
      email:'jhondoe@email.com',
      password:'123456'
    })

     await sendForgotPasswordEmail.execute({

      email:'jhondoe@email.com',

    })

    expect(sendMail).toHaveBeenCalled()
    expect(generateToken).toHaveBeenCalledWith(user.id)

  })

})
