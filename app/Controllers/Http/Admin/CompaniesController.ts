import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateCompanyValidator from 'App/Validators/Admin/CreateCompanyValidator'
import EditCompanyValidator from 'App/Validators/Admin/EditCompanyValidator'
import CompaniesServices from 'App/Services/Admin/CompaniesServices'
import Utility from 'App/Helpers/Utility'

export default class CompaniesController {
  public async list({ view }: HttpContextContract) {
    const companies = await CompaniesServices.get()

    return view.render('admin/companies/list', { companies })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('admin/companies/create')
  }

  public async store(ctx: HttpContextContract) {
    // request validation
    await ctx.request.validate(CreateCompanyValidator)

    try {
      const data = ctx.request.all()

      // create temporary variable for upload file
      const stampImageFile = ctx.request.file('upload_stamp_image')
      if (stampImageFile) data.stamp_image_binary = stampImageFile

      const result = await CompaniesServices.create(data)

      // delete temporary variable upload file
      delete data.stamp_image_binary

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.success }
      // save success data for log record
      ctx['new_data'] = result.data

      ctx.session.flash('success', result.success)

      return ctx.response.redirect().toRoute('companies.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Perusahaan gagal dibuat')

      return ctx.response.redirect().back()
    }
  }

  public async edit({ params, view, response }: HttpContextContract) {
    const company = await CompaniesServices.detail(params.id)

    if (!company) response.abort('Not Found', 404)

    return view.render('admin/companies/edit', { company })
  }

  public async update(ctx: HttpContextContract) {
    // request validation
    await ctx.request.validate(EditCompanyValidator)

    try {
      const data = ctx.request.all()

      const company = await CompaniesServices.detail(ctx.params.id)

      if (!company) throw new Error('Perusahaan tidak ditemukan')

      // save old data for log record
      ctx['old_data'] = company.toJSON()

      // create temprorary variable for upload file (if edit)
      const stampImageFile = ctx.request.file('upload_stamp_image')
      if (stampImageFile) data.stamp_image_binary = stampImageFile

      const result = await CompaniesServices.update(company, data)

      // delete temporary variable upload file
      delete data.stamp_image_binary

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.success }
      // save success data for log record
      ctx['new_data'] = result.data

      ctx.session.flash('success', result.success)

      return ctx.response.redirect().toRoute('companies.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Perusahaan gagal diubah')

      return ctx.response.redirect().back()
    }
  }

  public async delete(ctx: HttpContextContract) {
    try {
      const company = await CompaniesServices.detail(ctx.params.id)

      if (!company) throw new Error('Perusahaan tidak ditemukan')

      // save old data for log record
      ctx['old_data'] = company.toJSON()

      // delete company
      await company.delete()

      // save success message for log record
      ctx['message'] = { success: 'Perusahaan berhasil dihapus' }

      ctx.session.flash('success', 'Perusahaan berhasil dihapus')

      return ctx.response.redirect().toRoute('companies.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Perusahaan gagal dihapus')

      return ctx.response.redirect().back()
    }
  }

  public async apiList(ctx: HttpContextContract) {
    try {
      const companies = await CompaniesServices.get()

      return ctx.response.status(200).json({
        message: 'Perusahaan berhasil didapatkan.',
        data: companies,
      })
    } catch (error) {
      Utility.catchError(ctx.request, ctx.response, error)

      return ctx.response.status(500).json({
        message: 'Perusahaan gagal didapatkan.',
      })
    }
  }
}
