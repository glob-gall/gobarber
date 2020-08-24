import AppError from '@shared/errors/AppError'

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/FakeCacheProvider'
import ListProvidersService from './ListProvidersService'

let fakeUserRepository : FakeUserRepository
let listProviders : ListProvidersService
let fakeCacheProvider : FakeCacheProvider



describe('List Provider',()=>{
  beforeEach(()=>{
    fakeUserRepository = new FakeUserRepository()
    fakeCacheProvider = new FakeCacheProvider()

    listProviders = new ListProvidersService(fakeUserRepository,fakeCacheProvider)

  })

  it('shold be able to list the providers',async ()=>{

   const user1 = await fakeUserRepository.create({
      name:'jhon doe',
      email:'jhondoe@email.com',
      password:'123456'
    })

    const user2 = await fakeUserRepository.create({
      name:'jhon doe2',
      email:'jhondoe2@email.com',
      password:'123456'
    })
    const loggedUser = await fakeUserRepository.create({
      name:'user',
      email:'user@teste.com',
      password:'123456'
    })

    const providers = await listProviders.execute({
      user_id: loggedUser.id
    })
     expect(providers).toEqual([user1,user2])

  })



})
