import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'settings'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('company_id').references('companies.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('company_id')
    })
  }
}
