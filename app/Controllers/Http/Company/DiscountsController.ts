import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DiscountsServices from 'App/Services/Company/DiscountsServices'
import Utility from 'App/Helpers/Utility'
import CreateDiscountValidator from 'App/Validators/Company/CreateDiscountValidator'
import EditDiscountValidator from 'App/Validators/Company/EditDiscountValidator'

export default class DiscountsController {
  public async list(ctx: HttpContextContract) {
    const companyId = ctx['company'].id
    const discounts = await DiscountsServices.get(companyId)

    return ctx.view.render('company/discounts/list', { discounts })
  }

  public async create(ctx: HttpContextContract) {
    return ctx.view.render('company/discounts/create')
  }

  public async store(ctx: HttpContextContract) {
    //request validation
    await ctx.request.validate(CreateDiscountValidator)

    try {
      const data = ctx.request.all()
      data.company_id = ctx['company'].id

      const result = await DiscountsServices.create(data)

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.success }
      // save success data for log record
      ctx['new_data'] = result.data

      ctx.session.flash('success', result.success)

      return ctx.response.redirect().toRoute('discounts.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Diskon barang gagal dibuat')
      return ctx.response.redirect().back()
    }
  }

  public async edit({ params, view, response }: HttpContextContract) {
    const discount = await DiscountsServices.detail(params.id)

    if (!discount) response.abort('Not Found', 404)

    return view.render('company/discounts/edit', { discount })
  }

  public async update(ctx: HttpContextContract) {
    //request validation
    await ctx.request.validate(EditDiscountValidator)

    try {
      const discount = await DiscountsServices.detail(ctx.params.id)

      if (!discount) throw new Error('Diskon barang tidak ditemukan')

      const data = ctx.request.all()

      // save old data for log record
      ctx['old_data'] = discount.toJSON()

      const result = await DiscountsServices.update(discount, data)

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.success }
      // save success data for log record
      ctx['new_data'] = result.data

      ctx.session.flash('success', result.success)

      return ctx.response.redirect().toRoute('discounts.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Diskon barang gagal diubah')
      return ctx.response.redirect().back()
    }
  }

  public async delete(ctx: HttpContextContract) {
    try {
      const discount = await DiscountsServices.detail(ctx.params.id)

      if (!discount) throw new Error('Diskon barang tidak ditemukan')

      // save old data for log record
      ctx['old_data'] = discount.toJSON()

      // delete discount
      await discount.delete()

      // save success message for log record
      ctx['message'] = { success: 'Diskon barang berhasil dihapus' }

      ctx.session.flash('success', 'Diskon barang berhasil dihapus')

      return ctx.response.redirect().toRoute('discounts.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Diskon barang gagal dihapus')

      return ctx.response.redirect().back()
    }
  }
}
