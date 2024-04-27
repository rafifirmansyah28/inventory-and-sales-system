import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Utility from 'App/Helpers/Utility'
import ClientStackholder from 'App/Models/Admin/ClientStackholder'

export default class Client extends BaseModel {
  public static table = 'clients'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public npsn: string

  @column()
  public npwp: string

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

  @hasMany(() => ClientStackholder, { foreignKey: 'user_id' })
  public client_stackholders: HasMany<typeof ClientStackholder>
}
