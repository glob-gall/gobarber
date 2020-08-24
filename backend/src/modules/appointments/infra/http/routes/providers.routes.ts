import { Router } from 'express'
import { celebrate, Segments ,Joi } from 'celebrate'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/EnsureAuthenticated'
import ProvidersController from '@modules/appointments/infra/http/Controllers/ProvidersController'

import ProviderDayAvailability from '../Controllers/ProviderDayAvailabilityController'
import ProviderMonthAvailability from '../Controllers/ProviderMonthAvailabilityController'


const providersRouter = Router()
const providersController =new ProvidersController()
const providerDayAvailability =new ProviderDayAvailability()
const providerMonthAvailability =new ProviderMonthAvailability()

providersRouter.use(ensureAuthenticated)

providersRouter.get('/', providersController.index)
providersRouter.get('/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]:{
      provider_id: Joi.string().uuid().required()
    }
  })
, providerDayAvailability.index)
providersRouter.get('/:provider_id/month-availability',
celebrate({
  [Segments.PARAMS]:{
    provider_id: Joi.string().uuid().required()
  }
})
, providerMonthAvailability.index)

export default providersRouter
