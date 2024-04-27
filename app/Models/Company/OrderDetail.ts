import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Utility from 'App/Helpers/Utility'

export default class OrderDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public order_id: number

  @column()
  public product_id: number

  @column()
  public product_name: string

  @column()
  public product_price: string

  @column()
  public qty: number

  @column()
  public qty_good_condition?: number

  @column()
  public qty_bad_condition?: number

  @column()
  public subtotal: number

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
