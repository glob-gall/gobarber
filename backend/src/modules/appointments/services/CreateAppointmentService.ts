import { startOfHour, isBefore, getHours, format } from 'date-fns'
import {inject,injectable} from 'tsyringe'
import AppError from '@shared/errors/AppError'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

import ICacheProvider from '@shared/container/providers/cacheProvider/models/ICacheProvider'
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'

interface IRequest {
  provider_id: string
  user_id:string
  date: Date
}

@injectable()
class CreateAppointmentService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository:IAppointmentRepository,
    @inject('NotificationsRepository')
    private notificationsRepository:INotificationsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
    ){}

  public async execute({ provider_id,user_id, date }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    if(user_id === provider_id){
      throw new AppError("you can't create a appointment with yourself")
    }

    if(isBefore(appointmentDate,Date.now())){
      throw new AppError("you can't create a appointment in a past date")
    }

    if(getHours(appointmentDate)<8 || getHours(appointmentDate) > 17){
      throw new AppError("you can only create a appointment beetwen 8am to 5pm")
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    )

    if (findAppointmentInSameDate) {
      throw new AppError('this appointment is already booked')
    }

    const appointment =await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    })

    const formatedDate = format(appointmentDate,"dd/MM/yyyy 'às' HH:mm'h' ")

    this.notificationsRepository.create({
      recipient_id:provider_id,
      content: `Novo agendamento para dia ${formatedDate}`
    })

    await this.cacheProvider.invalidate(
        `providers-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`
      )

    return appointment
  }
}

export default CreateAppointmentService
