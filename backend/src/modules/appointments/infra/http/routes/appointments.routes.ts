import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/EnsureAuthenticated'
import AppointmentController from '@modules/appointments/infra/http/Controllers/AppointmentsController'
import ProviderAppointmentsController from '@modules/appointments/infra/http/Controllers/ProviderAppointmentsController'


const appointmentsRouter = Router()
const appointmentController =new AppointmentController()
const providerAppointmentsController =new ProviderAppointmentsController()

appointmentsRouter.use(ensureAuthenticated)

appointmentsRouter.post('/',
  celebrate({
    [Segments.BODY]:{
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required()
    }
  })
, appointmentController.create)
appointmentsRouter.get('/me', providerAppointmentsController.index)

export default appointmentsRouter
