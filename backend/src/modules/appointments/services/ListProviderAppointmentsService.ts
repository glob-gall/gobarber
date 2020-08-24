import {inject,injectable} from 'tsyringe'
import {getHours,isAfter} from 'date-fns'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICacheProvider from '@shared/container/providers/cacheProvider/models/ICacheProvider'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

interface IRequest {
  provider_id:string
  month:number
  year:number
  day:number
}
@injectable()
class ListProviderAppointmentsService{
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider

    ){}

  public async execute({ provider_id,month,year,day }: IRequest): Promise<Appointment[]> {
    const cacheKey = `providers-appointments:${provider_id}-${year}-${month}-${day}`

    let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey)

    if(!appointments){
      appointments = await this.appointmentRepository.findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
      })
      console.log(' buscou DO BACNO');

      await this.cacheProvider.save(cacheKey,appointments)
    }

    return appointments
  }
}

export default ListProviderAppointmentsService

