export default interface IStorageProvider{
  saveFiles(file:string):Promise<string>,
  deleteFiles(file:string):Promise<void>
}
