import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('discount_id').unsigned().alter()
      table.integer('discount_percent').unsigned().alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('discount_id').notNullable().unsigned().alter()
      table.decimal('discount_percent', 3, 2).notNullable().alter()
    })
  }
}
