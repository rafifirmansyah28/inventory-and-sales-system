import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Utility from 'App/Helpers/Utility'

export default class OrderStatus extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public order_id: number

  @column()
  public status_id: number

  @column.dateTime({
    autoCreate: true,
    consume: (value) => Utility.dateTimeFormat(value),
  })
  public created_at: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    consume: (value) => Utility.dateTimeFormat(value),
  })
  public updated_at: DateTime
}
