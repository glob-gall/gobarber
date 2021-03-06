import IParseMailTemplateDTO from '@shared/container/providers/mailTemplateProvider/dtos/IParseMailTemplateDTO'

interface IMailContact{
  name:string,
  email:string
}

export default interface ISendEmailDTO{
  to:IMailContact
  from?:IMailContact
  subject:string
 templateData:IParseMailTemplateDTO
}
