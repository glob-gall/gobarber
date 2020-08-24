import AppError from '@shared/errors/AppError'

import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider'
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import UpdateUserAvatarService from './UpdateUserAvatarService'

let fakeUserRepository : FakeUserRepository
let fakeStorageProvider : FakeStorageProvider

let updateUserAvatar : UpdateUserAvatarService


describe('Update user avatar',()=>{
  beforeEach(()=>{
    fakeUserRepository = new FakeUserRepository()
    fakeStorageProvider = new FakeStorageProvider()
    updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository,fakeStorageProvider)

  })

  it('shold be able to create a new user',async ()=>{

    const user = await fakeUserRepository.create({
      name:'jhon doe',
      email:'jhondoe@email.com',
      password:'123456'
    })

    await updateUserAvatar.execute({
      user_id:user.id,
      avatarFilename:'avatar.jpg'
    })

     expect(user.avatar).toBe('avatar.jpg')

  })

  it('shold NOT be able to update an avatar from non existing user',async ()=>{

    await expect(updateUserAvatar.execute({
      user_id:'non-existing-id',
      avatarFilename:'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError)

  })

  it('shold be able to delete an old avatar when updating a new one',async ()=>{

    const deleteFile = jest.spyOn(fakeStorageProvider,'deleteFiles')

    const user = await fakeUserRepository.create({
      name:'jhon doe',
      email:'jhondoe@email.com',
      password:'123456'
    })

    await updateUserAvatar.execute({
      user_id:user.id,
      avatarFilename:'avatar.jpg'
    })
    await updateUserAvatar.execute({
      user_id:user.id,
      avatarFilename:'avatar2.jpg'
    })

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')

    expect(user.avatar).toBe('avatar2.jpg')

  })

})
