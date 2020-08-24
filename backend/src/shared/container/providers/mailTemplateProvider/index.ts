import {container} from 'tsyringe'

import IMailTemplateProviders from '@shared/container/providers/mailTemplateProvider/models/IMailTemplateProvider'
import HandlebarsMailTemplateProvider from './implementations/HandlebarsMailTemplateProvider'


const providers = {
  handlebars:container.resolve(HandlebarsMailTemplateProvider)
}

container.registerInstance<IMailTemplateProviders>(
  'MailTemplateProvider',
  providers.handlebars
)
