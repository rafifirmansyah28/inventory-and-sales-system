import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'statuses'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.tinyint('sequence').notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('sequence')
    })
  }
}
