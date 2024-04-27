import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Log extends BaseModel {
  public static table = 'logs'

  @column({ isPrimary: true })
  public id: number

  @column()
  public url: string

  @column()
  public method: string

  @column()
  public ip: string

  @column({ prepare: (value) => value && JSON.stringify(value) })
  public user_params?: object

  @column({ prepare: (value) => value && JSON.stringify(value) })
  public user_input?: object

  @column({ prepare: (value) => value && JSON.stringify(value) })
  public old_data?: object

  @column({ prepare: (value) => value && JSON.stringify(value) })
  public new_data?: object

  @column()
  public success_message?: string

  @column()
  public error_message?: string

  @column.dateTime({ autoCreate: true })
  public created_datetime: DateTime

  @column()
  public created_by_user_id?: number
}
