import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'
import ListProviderMonthAvailability from './ListProviderMonthAvailabilityService'

let fakeAppointmentsRepository : FakeAppointmentsRepository
let listProviderMonthAvailability : ListProviderMonthAvailability



describe('List Provider Month Availability',()=>{
  beforeEach(()=>{
    fakeAppointmentsRepository = new FakeAppointmentsRepository()

    listProviderMonthAvailability = new ListProviderMonthAvailability(fakeAppointmentsRepository)

  })

  it('shold be able to list the month availability from provider',async ()=>{
    fakeAppointmentsRepository.create({
      provider_id:'id',
      user_id:'id',
      date:new Date(2020,4,20,8,0,0)//20/05/2020 8'0"0
  })
    fakeAppointmentsRepository.create({
      provider_id:'id',
      user_id:'id',
      date:new Date(2020,4,20,10,0,0)
  })
    fakeAppointmentsRepository.create({
      provider_id:'id',
      user_id:'id',
      date:new Date(2020,4,21,8,0,0)
  })

  const availability = await listProviderMonthAvailability.execute({
    provider_id:'id',
    month:5,
    year:2020
  })

  expect(availability).toEqual(
    expect.arrayContaining([
      {day:19,available:true},
      {day:20,available:false},
      {day:21,available:false},
      {day:22,available:true}
    ])
  )

  })



})
