import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DashboardServices from 'App/Services/Admin/DashboardServices'

export default class DashboardController {
  public async index(ctx: HttpContextContract) {
    const orderAndRevenueAggregate = await DashboardServices.orderAndRevenueAggregate()

    return ctx.view.render('admin/index', { orderAndRevenueAggregate })
  }
}
