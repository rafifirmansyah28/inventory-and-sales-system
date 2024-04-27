import Database from '@ioc:Adonis/Lucid/Database'

export default {
  async revenue(companyId) {
    let revenue = await Database.query()
      .with('months', (query) => {
        query.select(Database.raw("UNNEST('{1,2,3,4,5,6,7,8,9,10,11,12}'::int[]) AS month"))
      })
      .with('month_of_this_year', (query) => {
        query
          .select(
            Database.raw("DATE_PART('year', (DATE_TRUNC('year', NOW()))) AS this_year"),
            'months.month AS this_month',
            Database.raw(
              "(DATE_TRUNC('year', NOW()) + FORMAT('%s month', months.month - 1)::INTERVAL)::DATE AS first_date_of_this_month"
            ),
            Database.raw(
              "(DATE_TRUNC('year', NOW()) + FORMAT('%s month - 1 day', months.month)::INTERVAL)::DATE AS end_date_of_this_month"
            )
          )
          .from('months')
      })
      .with('all_order', (query) => {
        query
          .select(
            'month_of_this_year.this_year',
            'month_of_this_year.this_month',
            'month_of_this_year.first_date_of_this_month',
            'month_of_this_year.end_date_of_this_month',
            Database.raw(
              `(CASE
                WHEN
                  SUM(orders.grand_total) FILTER(WHERE company_id = :company_id AND created_at::DATE BETWEEN month_of_this_year.first_date_of_this_month AND month_of_this_year.end_date_of_this_month) IS NOT NULL
                THEN
                  SUM(orders.grand_total) FILTER(WHERE company_id = :company_id AND created_at::DATE BETWEEN month_of_this_year.first_date_of_this_month AND month_of_this_year.end_date_of_this_month)
                ELSE
                  0
              END)::INTEGER
                AS revenue_of_this_month`,
              { company_id: companyId }
            ),
            Database.raw(
              `COUNT(*) FILTER(WHERE company_id = :company_id AND created_at::DATE BETWEEN month_of_this_year.first_date_of_this_month AND month_of_this_year.end_date_of_this_month)::INTEGER AS total_order_of_this_month`,
              { company_id: companyId }
            )
          )
          .from('month_of_this_year')
          .joinRaw('CROSS JOIN orders')
          .groupBy([
            'this_year',
            'this_month',
            'first_date_of_this_month',
            'end_date_of_this_month',
          ])
          .orderBy('this_month', 'asc')
      })
      .select(
        'this_year',
        'this_month',
        'first_date_of_this_month',
        'end_date_of_this_month',
        'revenue_of_this_month',
        'total_order_of_this_month'
      )
      .from('all_order')

    return revenue
  },
  async bestSellerProducts(companyId) {
    const bestSellerProducts = await Database.query()
      .with('best_seller_products_from_3_month_ago_raw', (query) => {
        query
          .select(
            'order_details.product_id',
            'products.name AS product_name',
            'products.price AS product_price',
            'products.qty AS remaining_product_stock',
            Database.raw('SUM(order_details.qty) AS total_product_sold'),
            Database.raw('SUM(order_details.subtotal) AS price_sold_amount')
          )
          .from('orders')
          .leftJoin('order_details', 'orders.id', 'order_details.order_id')
          .leftJoin('products', 'order_details.product_id', 'products.id')
          .where('orders.company_id', companyId)
          .andWhereRaw(
            `orders.created_at::DATE BETWEEN (DATE_TRUNC('day', NOW()) - INTERVAL '3 month')::DATE AND (DATE_TRUNC('day', NOW()))::DATE`
          )
          .groupBy(['order_details.product_id', 'products.name', 'products.qty', 'products.price'])
          .orderBy('total_product_sold', 'desc')
          .limit(5)
      })
      .with('best_seller_products_from_3_month_ago', (query) => {
        query
          .select(
            Database.raw(`
              JSON_AGG(
                JSON_BUILD_OBJECT(
                'product_id', product_id,
                'product_name', product_name,
                'product_price', product_price,
                'remaining_product_stock', remaining_product_stock,
                'total_product_sold', total_product_sold,
                'price_sold_amount', price_sold_amount
                )
              ) AS best_seller_products_from_3_month_ago`)
          )
          .from('best_seller_products_from_3_month_ago_raw')
      })
      .with('best_seller_products_from_6_month_ago_raw', (query) => {
        query
          .select(
            'order_details.product_id',
            'products.name AS product_name',
            'products.price AS product_price',
            'products.qty AS remaining_product_stock',
            Database.raw(`SUM(order_details.qty) AS total_product_sold`),
            Database.raw(`SUM(order_details.subtotal) AS price_sold_amount`)
          )
          .from('orders')
          .leftJoin('order_details', 'orders.id', 'order_details.order_id')
          .leftJoin('products', 'order_details.product_id', 'products.id')
          .where('orders.company_id ', companyId)
          .andWhereRaw(
            `orders.created_at::DATE BETWEEN (DATE_TRUNC('day', NOW()) - INTERVAL '6 month')::DATE AND (DATE_TRUNC('day', NOW()))::DATE`
          )
          .groupBy(['order_details.product_id', 'products.name', 'products.qty', 'products.price'])
          .orderBy('total_product_sold', 'desc')
          .limit(5)
      })
      .with('best_seller_products_from_6_month_ago', (query) => {
        query
          .select(
            Database.raw(`
              JSON_AGG(
                JSON_BUILD_OBJECT(
                'product_id', product_id,
                'product_name', product_name,
                'product_price', product_price,
                'remaining_product_stock', remaining_product_stock,
                'total_product_sold', total_product_sold,
                'price_sold_amount', price_sold_amount
                )
              ) AS best_seller_products_from_6_month_ago
          `)
          )
          .from('best_seller_products_from_6_month_ago_raw')
      })
      .with('best_seller_products_from_9_month_ago_raw', (query) => {
        query
          .select(
            'order_details.product_id',
            'products.name AS product_name',
            'products.price AS product_price',
            'products.qty AS remaining_product_stock',
            Database.raw(`SUM(order_details.qty) AS total_product_sold`),
            Database.raw(`SUM(order_details.subtotal) AS price_sold_amount`)
          )
          .from('orders')
          .leftJoin('order_details', 'orders.id', 'order_details.order_id')
          .leftJoin('products', 'order_details.product_id', 'products.id')
          .where('orders.company_id', companyId)
          .andWhereRaw(
            `orders.created_at::DATE BETWEEN (DATE_TRUNC('day', NOW()) - INTERVAL '9 month')::DATE AND (DATE_TRUNC('day', NOW()))::DATE`
          )
          .groupBy(['order_details.product_id', 'products.name', 'products.qty', 'products.price'])
          .orderBy('total_product_sold', 'desc')
          .limit(5)
      })
      .with('best_seller_products_from_9_month_ago', (query) => {
        query
          .select(
            Database.raw(`
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'product_id', product_id,
                  'product_name', product_name,
                  'product_price', product_price,
                  'remaining_product_stock', remaining_product_stock,
                  'total_product_sold', total_product_sold,
                  'price_sold_amount', price_sold_amount
                )
              ) AS best_seller_products_from_9_month_ago
            `)
          )
          .from('best_seller_products_from_9_month_ago_raw')
      })
      .with('best_seller_products_from_12_month_ago_raw', (query) => {
        query
          .select(
            'order_details.product_id',
            'products.name AS product_name',
            'products.price AS product_price',
            'products.qty AS remaining_product_stock',
            Database.raw(`SUM(order_details.qty) AS total_product_sold`),
            Database.raw(`SUM(order_details.subtotal) AS price_sold_amount`)
          )
          .from('orders')
          .leftJoin('order_details', 'orders.id', 'order_details.order_id')
          .leftJoin('products', 'order_details.product_id', 'products.id')
          .where('orders.company_id', companyId)
          .andWhereRaw(
            `orders.created_at::DATE BETWEEN (DATE_TRUNC('day', NOW()) - INTERVAL '12 month')::DATE AND (DATE_TRUNC('day', NOW()))::DATE`
          )
          .groupBy(['order_details.product_id', 'products.name', 'products.qty', 'products.price'])
          .orderBy('total_product_sold', 'desc')
          .limit(5)
      })
      .with('best_seller_products_from_12_month_ago', (query) => {
        query
          .select(
            Database.raw(`
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'product_id', product_id,
                  'product_name', product_name,
                  'product_price', product_price,
                  'remaining_product_stock', remaining_product_stock,
                  'total_product_sold', total_product_sold,
                  'price_sold_amount', price_sold_amount
                )
              ) AS best_seller_products_from_12_month_ago
          `)
          )
          .from('best_seller_products_from_12_month_ago_raw')
      })
      .select(
        'best_seller_products_from_3_month_ago',
        'best_seller_products_from_6_month_ago',
        'best_seller_products_from_9_month_ago',
        'best_seller_products_from_12_month_ago'
      )
      .from('best_seller_products_from_3_month_ago')
      .joinRaw('NATURAL JOIN best_seller_products_from_6_month_ago')
      .joinRaw('NATURAL JOIN best_seller_products_from_9_month_ago')
      .joinRaw('best_seller_products_from_12_month_ago')
      .first()

    return bestSellerProducts
  },
}
