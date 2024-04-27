import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('npwp', 16).nullable()
      table.decimal('ppn', 3, 2).defaultTo(0)
      table.decimal('pph', 3, 2).defaultTo(0)
      table.string('bank_branch', 255).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('npwp')
      table.dropColumn('ppn')
      table.dropColumn('pph')
      table.dropColumn('bank_branch')
    })
  }
}
