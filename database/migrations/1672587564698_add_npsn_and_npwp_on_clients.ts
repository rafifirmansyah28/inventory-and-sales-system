import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('npsn', 255).nullable()
      table.string('npwp', 255).nullable().alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('npsn')
      table.dropColumn('npwp')
    })
  }
}
