import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Company from 'App/Models/Admin/Company'
import User from 'App/Models/Admin/User'
import Utility from 'App/Helpers/Utility'

export default class UserCompany extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public company_id: number

  @column()
  public phone_number: string

  @column()
  public job_position: string

  @column()
  public signature_image: string

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

  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Company, { foreignKey: 'company_id' })
  public company: BelongsTo<typeof Company>
}
