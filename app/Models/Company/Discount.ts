import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Utility from 'App/Helpers/Utility'
import Company from 'App/Models/Admin/Company'

export default class Discount extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public company_id: number

  @column()
  public name: string

  @column()
  public percent: number

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

  @belongsTo(() => Company, { foreignKey: 'company_id' })
  public company: BelongsTo<typeof Company>
}
