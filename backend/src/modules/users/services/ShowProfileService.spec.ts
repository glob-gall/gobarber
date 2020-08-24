import AppError from '@shared/errors/AppError'

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import ShowProfileService from './ShowProfileService'

let fakeUserRepository : FakeUserRepository
let showProfile : ShowProfileService



describe('Update profile',()=>{
  beforeEach(()=>{
    fakeUserRepository = new FakeUserRepository()

    showProfile = new ShowProfileService(fakeUserRepository)

  })

  it('shold be able to show the profile',async ()=>{

    const user = await fakeUserRepository.create({
      name:'jhon doe',
      email:'jhondoe@email.com',
      password:'123456'
    })

    const profile = await showProfile.execute({user_id:user.id})

     expect(profile.name).toBe('jhon doe')
     expect(profile.email).toBe('jhondoe@email.com')

  })

  it('shold not be able to show the profile from non-existing user',async ()=>{

     await expect(
       showProfile.execute({user_id:'non-existing-user-id'})
     ).rejects.toBeInstanceOf(AppError)



  })

})
