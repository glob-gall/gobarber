import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'
import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/FakeCacheProvider'
import ListProviderAppointmentsService from './ListProviderAppointmentsService'

let fakeAppointmentsRepository : FakeAppointmentsRepository
let listProviderAppointmentsService : ListProviderAppointmentsService
let fakeCacheProvider : FakeCacheProvider



describe('List Provider Appointments Availability',()=>{
  beforeEach(()=>{
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeCacheProvider = new FakeCacheProvider()

    listProviderAppointmentsService = new ListProviderAppointmentsService(fakeAppointmentsRepository,fakeCacheProvider)

  })

  it('shold be able to list the Appointments availability on a day',async ()=>{
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id:'provider-id',
      user_id:'id',
      date:new Date(2020,4,20,8,0,0)//20/05/2020 8'0"0
  })
  const appointment2 = await fakeAppointmentsRepository.create({
      provider_id:'provider-id',
      user_id:'id',
      date:new Date(2020,4,20,10,0,0)
  })

  const appointments = await listProviderAppointmentsService.execute({
    provider_id:'provider-id',
    day:20,
    month:5,
    year:2020
  })

  expect(appointments).toEqual([
    appointment1,
    appointment2
  ])

  })



})
