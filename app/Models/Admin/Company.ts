import { DateTime } from 'luxon'
import { afterSave, BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Utility from 'App/Helpers/Utility'
import Setting from 'App/Models/Setting'
import UserCompany from 'App/Models/Admin/UserCompany'

export default class Company extends BaseModel {
  public static table = 'companies'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public address: string

  @column()
  public bank_name: string

  @column()
  public bank_account_number: number

  @column()
  public stamp_image: string

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

  @column()
  public bank_branch: string

  @column()
  public npwp: string

  @column()
  public pph: number

  @column()
  public ppn: number

  @afterSave()
  public static async addKeys(company: Company) {
    const companyKey = company.name
      .split(' ')
      .map((value) => value[0].toUpperCase())
      .join('')

    await Setting.createMany([
      {
        company_id: company.id,
        order_number_identifier: Utility.orderNumberList['Kwitansi Pembayaran'],
        key: `${Utility.orderNumberList['Kwitansi Pembayaran']}-${companyKey}`,
        value: '0', // started
        created_at: DateTime.now(),
      },
      {
        company_id: company.id,
        order_number_identifier: Utility.orderNumberList['Berita Acara Serah Terima'],
        key: `${Utility.orderNumberList['Berita Acara Serah Terima']}-${companyKey}`,
        value: '0', // started
        created_at: DateTime.now(),
      },
      {
        company_id: company.id,
        order_number_identifier: Utility.orderNumberList['Surat Pesanan'],
        key: `${Utility.orderNumberList['Surat Pesanan']}-${companyKey}`,
        value: '0', // started
        created_at: DateTime.now(),
      },
      {
        company_id: company.id,
        order_number_identifier: Utility.orderNumberList['Invoice'],
        key: `${Utility.orderNumberList['Invoice']}-${companyKey}`,
        value: '0', // started
        created_at: DateTime.now(),
      },
    ])
  }

  @hasMany(() => UserCompany, { foreignKey: 'company_id' })
  public UserCompany: HasMany<typeof UserCompany>
}
