import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'discounts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.smallint('percent').unsigned().notNullable().alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('percent', 3, 2).notNullable().alter()
    })
  }
}
