import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Utility from 'App/Helpers/Utility'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public company_id: number

  @column()
  public company_name: string

  @column()
  public client_id: number

  @column()
  public client_name: string

  @column()
  public user_id: number

  @column()
  public user_name: string

  @column()
  public client_stackholder_id: number

  @column()
  public client_stackholder_name: string

  @column()
  public status_id: number

  @column()
  public status_name: string

  @column()
  public subtotal: number

  @column()
  public grand_total: number

  @column()
  public has_tax: boolean

  @column()
  public tax_percent?: number

  @column()
  public shipping_cost?: number

  @column()
  public discount_id?: number

  @column()
  public discount_percent?: number

  @column({ prepare: (value) => value && JSON.stringify(value) })
  public order_number_list: object

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

  @column.dateTime()
  public processed_at: DateTime

  @column.dateTime()
  public ended_at: DateTime
}
