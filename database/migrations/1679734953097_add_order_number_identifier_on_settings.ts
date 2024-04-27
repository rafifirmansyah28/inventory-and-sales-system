import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'settings'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('order_number_identifier')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('order_number_identifier')
    })
  }
}
