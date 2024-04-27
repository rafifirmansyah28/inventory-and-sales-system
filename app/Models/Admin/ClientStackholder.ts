import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Utility from 'App/Helpers/Utility'
import Client from 'App/Models/Admin/Client'

export default class ClientStackholder extends BaseModel {
  public static table = 'client_stackholders'

  @column({ isPrimary: true })
  public id: number

  @column()
  public client_id: number

  @column()
  public name: string

  @column()
  public nip: string

  @column()
  public job_position: string

  @column()
  public phone_number: string

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

  @belongsTo(() => Client, { foreignKey: 'client_id' })
  public client: BelongsTo<typeof Client>
}
