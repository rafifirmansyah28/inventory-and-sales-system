import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Status extends BaseModel {
  public static table = 'statuses'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public sequence: number
}
