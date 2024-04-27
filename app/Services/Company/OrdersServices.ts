import Order from 'App/Models/Company/Order'
import Status from 'App/Models/Company/Status'
import OrderStatus from 'App/Models/Company/OrderStatus'
import OrderDetail from 'App/Models/Company/OrderDetail'
import Database from '@ioc:Adonis/Lucid/Database'
import Product from 'App/Models/Company/Product'
import Setting from 'App/Models/Setting'
import Utility from 'App/Helpers/Utility'

export default {
  async list(companyId, queryParams) {
    const orders = Database.query()
      .select(
        'orders.id',
        'orders.name',
        'orders.client_name',
        'orders.client_stackholder_name',
        'orders.user_name',
        'statuses.name AS status_name',
        'orders.created_at'
      )
      .from('orders')
      .leftJoin('statuses', 'statuses.id', 'orders.status_id')
      .where('orders.company_id', companyId)

    if (queryParams.search)
      orders.andWhere((query) => {
        query
          .whereILike('orders.name', `%${queryParams.search}%`)
          .orWhereILike('orders.client_name', `%${queryParams.search}%`)
          .orWhereILike('orders.client_stackholder_name', `%${queryParams.search}%`)
          .orWhereILike('orders.user_name', `${queryParams.search}`)
      })

    if (queryParams.dateRange) {
      orders.andWhereBetween('created_at', [queryParams.dateRange.from, queryParams.dateRange.to])
    }

    if (queryParams.status_id) {
      orders.andWhere('statuses.id', queryParams.status_id)
    }

    return orders
  },
  async process(companyId, data: any, trx) {
    const generalInformation = {
      sk_number: data.general_information.sk_number,
      order_name: data.general_information.order_name,
      company_id: data.general_information.company_id,
      company_name: data.general_information.company_name,
      client_id: data.general_information.client_id,
      client_name: data.general_information.client_name,
      user_id: data.general_information.user_id,
      user_name: data.general_information.user_name,
      stackholder_id: data.general_information.stackholder_id,
      stackholder_name: data.general_information.stackholder_name,
    }

    const orderCart = data.order_cart

    const orderSummary = {
      discount_id: data.order_summary.discount_id,
      discount_percent: data.order_summary.discount_percent,
      sub_total: data.order_summary.sub_total,
      grand_total: data.order_summary.grand_total,
    }

    // order
    const order = new Order()

    const orderInDeliveryStatus = await Status.findBy('sequence', 1)

    order.name = generalInformation.order_name
    order.company_id = companyId
    order.company_name = generalInformation.company_name
    order.client_id = generalInformation.client_id
    order.client_name = generalInformation.client_name
    order.user_id = generalInformation.user_id
    order.user_name = generalInformation.user_name
    order.client_stackholder_id = generalInformation.stackholder_id
    order.client_stackholder_name = generalInformation.stackholder_name
    if (orderInDeliveryStatus) {
      order.status_id = orderInDeliveryStatus.id
      order.status_name = orderInDeliveryStatus.name
    }

    order.subtotal = orderSummary.sub_total
    order.grand_total = orderSummary.grand_total
    order.has_tax = false
    order.tax_percent = 0
    order.shipping_cost = 0
    if (orderSummary.discount_id) order.discount_id = orderSummary.discount_id
    if (orderSummary.discount_percent) order.discount_percent = orderSummary.discount_percent

    if (generalInformation.sk_number) {
      order.order_number_list = {
        SP: generalInformation.sk_number,
      }

      // update increment of Surat Pesanan
      const currentSetting = await Database.query()
        .select('id', 'value')
        .from('settings')
        .where('company_id', companyId)
        .andWhere('order_number_identifier', Utility.orderNumberList['Surat Pesanan'])
        .first()

      if (currentSetting) {
        const setting = await Setting.findBy('id', currentSetting.id)

        if (setting) {
          setting.value = (+setting.value + 1).toString()
          setting.useTransaction(trx).save()
        }
      }
    }

    await order.useTransaction(trx).save()

    // order status
    const orderStatus = new OrderStatus()

    orderStatus.order_id = order.id
    orderStatus.status_id = order.status_id

    await orderStatus.useTransaction(trx).save()

    // order details & decrease stock of product
    for (const cart of orderCart) {
      // const product = new Product
      const currentStock = await Database.query()
        .select('id', 'qty')
        .from('products')
        .where('company_id', companyId)
        .andWhere('id', cart.product_id)
        .useTransaction(trx)
        .first()

      if (currentStock) {
        const product = await Product.findBy('id', currentStock.id)
        if (product) {
          product.qty = currentStock.qty - cart.product_qty
          product.useTransaction(trx).save()
        }
      }

      const orderDetail = new OrderDetail()
      orderDetail.order_id = order.id
      orderDetail.product_id = cart.product_id
      orderDetail.product_name = cart.product_name
      orderDetail.product_price = cart.product_price
      orderDetail.qty = cart.product_qty
      orderDetail.subtotal = cart.total_product_price

      await orderDetail.useTransaction(trx).save()
    }

    return {
      success: 'Pesanan berhasil diproses',
    }
  },

  async checkStock(companyId, orderCart, trx) {
    for (const cart of orderCart) {
      console.log('cart:', cart)

      const currentStock = await Database.query()
        .select('id', 'name', 'qty')
        .from('products')
        .where('company_id', companyId)
        .andWhere('id', cart.product_id)
        .useTransaction(trx)
        .first()

      if (currentStock.qty < cart.product_qty)
        throw new Error(`Stok "${currentStock.name}" tidak cukup`)
    }
  },
}
