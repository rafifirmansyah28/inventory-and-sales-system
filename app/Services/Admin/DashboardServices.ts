import Database from '@ioc:Adonis/Lucid/Database'

export default {
  async orderAndRevenueAggregate() {
    let orderAndRevenueAggregate = await Database.query()
      .with('total_company', (query) => {
        query.select(Database.raw(`COUNT(*) AS total`)).from('companies')
      })
      .with('total_client', (query) => {
        query.select(Database.raw(`COUNT(*) AS total`)).from('clients')
      })
      .with('total_order_and_revenue', (query) => {
        query
          .select(
            Database.raw(`COUNT(*) AS total`),
            Database.raw(`
              CASE
                WHEN
                  SUM(grand_total) IS NULL
                THEN
                  0
                ELSE
                  SUM(grand_total)
              END AS all_revenue
            `)
          )
          .from('orders')
      })
      .select(
        'total_company.total AS total_company',
        'total_client.total AS total_client',
        'total_order_and_revenue.total AS total_order',
        'total_order_and_revenue.all_revenue AS all_revenue'
      )
      .from('total_company')
      .joinRaw('CROSS JOIN total_client')
      .joinRaw('CROSS JOIN total_order_and_revenue')
      .first()

    return orderAndRevenueAggregate
  },
}
