import "reflect-metadata"

import AppError from '@shared/errors/AppError'

import CreateAppointmentService from './CreateAppointmentService'
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository'
import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/FakeCacheProvider'


let fakeAppointmentRepository:FakeAppointmentRepository
let cacheProvider: FakeCacheProvider
let fakeNotificationsRepository:FakeNotificationsRepository

let createAppointment:CreateAppointmentService

describe('Create Appointment',()=>{
  beforeEach(()=>{
     fakeAppointmentRepository = new FakeAppointmentRepository()
     fakeNotificationsRepository = new FakeNotificationsRepository()
     cacheProvider = new FakeCacheProvider()
     createAppointment = new CreateAppointmentService(fakeAppointmentRepository,fakeNotificationsRepository,cacheProvider)
  })

  it('shold be able to create a new appointment',async ()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020,4,10,12).getTime()
    })

    const appointment = await createAppointment.execute({
      date: new Date(2020,4,10,13) ,
      provider_id:'provider-id',
      user_id:'user-id'
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('provider-id')

  })

  it('shold not be able to create two appointments in the same time',async()=>{
    const appointmentDate = new Date(2020,5,10,11)

    await createAppointment.execute({
      date: appointmentDate,
      provider_id:'provider-id',
      user_id:'user-id'
    })

    await expect( createAppointment.execute({
      date: appointmentDate,
      provider_id:'provider-id',
      user_id:'user-id'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('shold not be able to create an appointment in the past',async()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020,4,10,12).getTime()
    })

    await expect( createAppointment.execute({
      date: new Date(2020,4,10,11),
      provider_id:'provider-id',
      user_id:'user-id'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('shold not be able to create an appointment with thenself',async()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020,4,10,12).getTime()
    })

    await expect( createAppointment.execute({
      date: new Date(2020,4,10,11),
      provider_id:'same_id',
      user_id:'same_id'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('shold not be able to create an appointment after 17:00 or before 8:00',async()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020,4,10,12).getTime()
    })

    await expect( createAppointment.execute({
      date: new Date(2020,4,11,7),
      provider_id:'provider_id',
      user_id:'user_id'
    })).rejects.toBeInstanceOf(AppError)

    await expect( createAppointment.execute({
      date: new Date(2020,4,11,18),
      provider_id:'provider_id',
      user_id:'user_id'
    })).rejects.toBeInstanceOf(AppError)
  })

})
