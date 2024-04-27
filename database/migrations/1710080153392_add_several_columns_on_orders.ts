import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('company_name', 255).notNullable()
      table.string('user_name', 255).notNullable()
      table.string('client_name', 255).notNullable()
      table.string('client_stackholder_name', 255).notNullable()
      table.string('status_name', 255).notNullable()
      table.renameColumn('total', 'grand_total')
      table.json('order_number_list')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('company_name')
      table.dropColumn('user_name')
      table.dropColumn('client_name')
      table.dropColumn('client_stackholder_name')
      table.dropColumn('status_name')
      table.renameColumn('grand_total', 'total')
      table.dropColumn('order_number_list')
    })
  }
}
