import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('ppn', 5, 2).defaultTo(null).alter()
      table.decimal('pph', 5, 2).defaultTo(null).alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('ppn', 5, 2).defaultTo(0).alter()
      table.decimal('pph', 5, 2).defaultTo(0).alter()
    })
  }
}
