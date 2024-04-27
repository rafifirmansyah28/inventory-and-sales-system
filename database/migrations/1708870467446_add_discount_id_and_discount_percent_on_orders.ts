import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('discount_id').notNullable().unsigned()
      table.decimal('discount_percent', 3, 2).notNullable()

      // Foreign Key
      table.foreign('discount_id').references('discounts.id').onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('company_id')

      table.dropColumn('discount_id')
      table.dropColumn('discount_percent')
    })
  }
}
