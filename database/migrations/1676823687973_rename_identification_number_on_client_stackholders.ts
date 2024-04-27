import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'client_stackholders'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('identification_number', 'nip')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('nip', 'identification_number')
    })
  }
}
