import fs from 'fs'
import path from 'path'
import uploadConfig from '@config/upload'
import aws,{S3} from 'aws-sdk'
import mime from 'mime'
import IStorageProvider from '../models/IStorageProvider'
import AppError from '@shared/errors/AppError'

class S3StorageProvider implements IStorageProvider{
  private client = new S3()
  constructor(){
    this.client = new aws.S3({
      region:'us-east-1',

    })
  }
  public async saveFiles(file:string):Promise<string>{

    const originalPath = path.resolve(uploadConfig.tmpFolder, file)
    const ContentType = mime.getType(originalPath)

    if(!ContentType){
      throw new AppError('Image Not found')
    }

    const fileContent = await fs.promises.readFile(originalPath)

    await this.client.putObject({
      Bucket:uploadConfig.config.aws.bucket,
      Key:file,
      ACL:'public-read',
      Body: fileContent,
      ContentType,
      ContentDisposition:`inline; filename=${file}`
    }).promise()

    await fs.promises.unlink(originalPath)
    return file
  }
  public async deleteFiles(file:string):Promise<void>{
    await this.client.deleteObject({
      Bucket:uploadConfig.config.aws.bucket,
      Key:file
    }).promise()
  }


}

export default S3StorageProvider
