import {container} from 'tsyringe'
import EtherealMailProvider from './implementations/EtherealMailProvider'

import IMailProviders from '@shared/container/providers/mailProvider/models/IMailProvider'


const providers = {
  ethereal:container.resolve(EtherealMailProvider)
}

container.registerInstance<IMailProviders>(
  'MailProvider',
  providers.ethereal
)
