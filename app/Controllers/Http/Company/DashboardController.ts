import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DashboardServices from 'App/Services/Company/DashboardServices'
import Env from '@ioc:Adonis/Core/Env'
import Utility from 'App/Helpers/Utility'

export default class DashboardController {
  public async index(ctx: HttpContextContract) {
    const appUrl = Env.get('APP_URL')
    const companyId = ctx['company'].id
    // const revenue = await DashboardServices.revenue(companyId)

    // console.log("revenue:", revenue);

    return ctx.view.render('company/index', { companyId, appUrl })
  }

  public async revenue(ctx: HttpContextContract) {
    try {
      const revenue = await DashboardServices.revenue(ctx.params.company_id)

      return ctx.response.status(200).json({
        message: 'Pendapatan tahun ini berhasil didapatkan',
        data: revenue,
      })
    } catch (error) {
      Utility.catchError(ctx.request, ctx.response, error)

      return ctx.response.status(500).json({
        message: 'Pendapatan tahun ini gagal didapatkan.',
      })
    }
  }

  public async bestSellerProducts(ctx: HttpContextContract) {
    try {
      const bestSellerProducts = await DashboardServices.bestSellerProducts(ctx.params.company_id)

      return ctx.response.status(200).json({
        message: '5 teratas barang paling banyak terjual berhasil didapatkan',
        data: bestSellerProducts,
      })
    } catch (error) {
      Utility.catchError(ctx.request, ctx.response, error)

      return ctx.response.status(500).json({
        message: '5 teratas barang paling banyak terjual gagal didapatkan.',
      })
    }
  }
}
