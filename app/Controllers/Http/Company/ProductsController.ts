import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CompaniesServices from 'App/Services/Admin/CompaniesServices'
import CreateProductValidator from 'App/Validators/Company/CreateProductValidator'
import Utility from 'App/Helpers/Utility'
import ProductsServices from 'App/Services/Company/ProductsServices'
import EditProductValidator from 'App/Validators/Company/EditProductValidator'

export default class ProductsController {
  public async list(ctx: HttpContextContract) {
    const companyId = ctx['company'].id
    const products = await ProductsServices.get(companyId)

    return ctx.view.render('company/products/list', { products })
  }

  public async create(ctx: HttpContextContract) {
    return ctx.view.render('company/products/create')
  }

  public async store(ctx: HttpContextContract) {
    //request validation
    await ctx.request.validate(CreateProductValidator)

    try {
      const data = ctx.request.all()
      data.company_id = ctx['company'].id

      // create temporary variable for upload file
      const imageFile = ctx.request.file('upload_image')
      if (imageFile) data.image_binary = imageFile

      const result = await ProductsServices.create(data)

      // delete temporary variable upload file
      delete data.image_binary

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.success }
      // save success data for log record
      ctx['new_data'] = result.data

      ctx.session.flash('success', result.success)

      return ctx.response.redirect().toRoute('products.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Stok barang gagal dibuat')
      return ctx.response.redirect().back()
    }
  }

  public async edit({ params, view, response }: HttpContextContract) {
    const product = await ProductsServices.detail(params.id)
    const companies = await CompaniesServices.get()

    if (!product) response.abort('Not Found', 404)

    return view.render('company/products/edit', { product, companies })
  }

  public async update(ctx: HttpContextContract) {
    // request validation
    await ctx.request.validate(EditProductValidator)

    try {
      const product = await ProductsServices.detail(ctx.params.id)

      if (!product) throw new Error('Stok barang tidak ditemukan')

      const data = ctx.request.all()

      // save old data for log record
      ctx['old_data'] = product.toJSON()

      // create temporary variable for upload file
      const imageFile = ctx.request.file('upload_image')
      if (imageFile) data.image_binary = imageFile

      const result = await ProductsServices.update(product, data)

      // delete temporary variable upload file
      delete data.image_binary

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.success }
      // save success data for log record
      ctx['new_data'] = result.data

      ctx.session.flash('success', result.success)

      return ctx.response.redirect().toRoute('products.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Stok barang gagal diubah')

      return ctx.response.redirect().back()
    }
  }

  public async delete(ctx: HttpContextContract) {
    try {
      const product = await ProductsServices.detail(ctx.params.id)

      if (!product) throw new Error('Stok barang tidak ditemukan')

      // save old data for log record
      ctx['old_data'] = product.toJSON()

      // delete product
      await product.delete()

      // save success message for log record
      ctx['message'] = { success: 'Stok barang berhasil dihapus' }

      ctx.session.flash('success', 'Stok barang berhasil dihapus')

      return ctx.response.redirect().toRoute('products.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Stok barang gagal dihapus')

      return ctx.response.redirect().back()
    }
  }

  public async productList(ctx: HttpContextContract) {
    try {
      const companyId = ctx.params.company_id
      const productList = await ProductsServices.list(companyId)

      return ctx.response.status(200).json({
        message: 'Daftar barang berhasil didapatkan.',
        data: productList,
      })
    } catch (error) {
      Utility.catchError(ctx.request, ctx.response, error)

      return ctx.response.status(500).json({
        message: 'Daftar barang gagal didapatkan.',
      })
    }
  }
}
