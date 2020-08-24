import AppError from '@shared/errors/AppError'

import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider'
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import UpdateProfileService from './UpdateProfileService'

let fakeUserRepository : FakeUserRepository
let fakeHashProvider : FakeHashProvider
let updateProfile : UpdateProfileService



describe('Update profile',()=>{
  beforeEach(()=>{
    fakeUserRepository = new FakeUserRepository()
    fakeHashProvider = new FakeHashProvider()
    updateProfile = new UpdateProfileService(fakeUserRepository,fakeHashProvider)

  })

  it('shold be able to update a profile',async ()=>{

    const user = await fakeUserRepository.create({
      name:'jhon doe',
      email:'jhondoe@email.com',
      password:'123456'
    })

    const updatedUser = await updateProfile.execute({
       user_id: user.id,
       name:'jhonny Doe',
       email:'jhonnyDoe@email.com',
    })

     expect(updatedUser.name).toBe('jhonny Doe')
     expect(updatedUser.email).toBe('jhonnyDoe@email.com')

  })

  it('shold not be able update the profile from non-existing user',async ()=>{

    await expect(
      updateProfile.execute({
        user_id:'non-existing-user-id',
        name:'teste',
        email:'teste@teste.com'
      })

    ).rejects.toBeInstanceOf(AppError)



 })

  it('shold not be able to update a profile to used email',async ()=>{

    await fakeUserRepository.create({
      name:'another user',
      email:'anotherEmail@email.com',
      password:'123456'
    })

    const user = await fakeUserRepository.create({
      name:'jhon doe',
      email:'jhondoe@email.com',
      password:'123456'
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name:'jhonny Doe',
        email:'anotherEmail@email.com',
      })
   ).rejects.toBeInstanceOf(AppError)

  })

  it('shold be able to update the password',async ()=>{

    const user = await fakeUserRepository.create({
      name:'jhon doe',
      email:'jhondoe@email.com',
      password:'123456'
    })

    const updatedUser = await updateProfile.execute({
       user_id: user.id,
       name:'jhonny Doe',
       email:'jhonnyDoe@email.com',
       old_password:'123456',
       password:'123123'
    })

     expect(updatedUser.password).toBe('123123')

  })

  it('shold not br able to update the password witout a old password',async ()=>{

    const user = await fakeUserRepository.create({
      name:'jhon doe',
      email:'jhondoe@email.com',
      password:'123456'
    })



     await expect(
      updateProfile.execute({
        user_id: user.id,
        name:'jhonny Doe',
        email:'jhonnyDoe@email.com',
        password:'123123'
     })
     ).rejects.toBeInstanceOf(AppError)

  })

  it('shold not br able to update the password with a wrong old password',async ()=>{

    const user = await fakeUserRepository.create({
      name:'jhon doe',
      email:'jhondoe@email.com',
      password:'123456'
    })

     await expect(
      updateProfile.execute({
        user_id: user.id,
        name:'jhonny Doe',
        email:'jhonnyDoe@email.com',
        old_password:'wrong-old-password',
        password:'123123'
     })
     ).rejects.toBeInstanceOf(AppError)

  })

})
