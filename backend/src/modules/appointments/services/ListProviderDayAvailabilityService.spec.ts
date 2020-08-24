import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'
import ListProviderDayAvailability from './ListProviderDayAvailabilityService'

let fakeAppointmentsRepository : FakeAppointmentsRepository
let listProviderDayAvailability : ListProviderDayAvailability



describe('List Provider Day Availability',()=>{
  beforeEach(()=>{
    fakeAppointmentsRepository = new FakeAppointmentsRepository()

    listProviderDayAvailability = new ListProviderDayAvailability(fakeAppointmentsRepository)

  })

  it('shold be able to list the day availability from provider',async () => {
    const appointment = await fakeAppointmentsRepository.create({
      provider_id:'id',
      user_id:'id',
      date:new Date(2020,4,20,14,0,0)//20/05/2020 8'0"0
    })
    await fakeAppointmentsRepository.create({
      provider_id:'id',
      user_id:'id',
      date:new Date(2020,4,20,15,0,0)//20/05/2020 10'0"0
    })

    jest.spyOn(Date,'now').mockImplementationOnce(()=>{
      return new Date(2020,4,20,11).getTime()
    })

  const availability = await listProviderDayAvailability.execute({
    provider_id:'id',
    day:20,
    month:5,
    year:2020
  })

  expect(availability).toEqual(
    expect.arrayContaining([
      {hour:8,available:false},
      {hour:9,available:false},
      {hour:10,available:false},
      {hour:13,available:true},
      {hour:14,available:false},
      {hour:15,available:false},
      {hour:17,available:true},
    ])
  )

  })



})
