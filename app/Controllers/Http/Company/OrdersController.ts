import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateCompanyOrderValidator from 'App/Validators/CreateCompanyOrderValidator'
import OrdersServices from 'App/Services/Company/OrdersServices'
import Utility from 'App/Helpers/Utility'
import Database from '@ioc:Adonis/Lucid/Database'

export default class OrdersController {
  public async list(ctx: HttpContextContract) {
    try {
      const queryParams = ctx.request.params()
      const companyId = ctx.params.company_id

      const list = await OrdersServices.list(companyId, queryParams)

      return ctx.response.status(200).json({
        message: 'Daftar pesanan berhasil didapatkan.',
        data: list,
      })
    } catch (error) {
      Utility.catchError(ctx.request, ctx.response, error)

      return ctx.response.status(500).json({
        message: 'Daftar pesanan gagal didapatkan.',
      })
    }
  }
  public async process(ctx: HttpContextContract) {
    const trx = await Database.transaction()

    try {
      await ctx.request.validate(CreateCompanyOrderValidator)
      const data = ctx.request.all()

      await OrdersServices.checkStock(ctx.params.company_id, data.order_cart, trx)

      const result = await OrdersServices.process(ctx.params.company_id, data, trx)

      await trx.commit()

      return ctx.response.status(200).json(result)
    } catch (error) {
      await trx.rollback()
      // save error message for log record
      Utility.catchError(ctx.request, ctx.response, error)
      return ctx.response.status(500).json({
        error: error.message,
      })
    }
  }
}
