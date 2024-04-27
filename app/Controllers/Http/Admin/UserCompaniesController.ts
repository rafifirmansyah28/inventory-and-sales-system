import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserCompaniesServices from 'App/Services/Admin/UserCompaniesServices'
import CompaniesServices from 'App/Services/Admin/CompaniesServices'
import CreateUserCompanyValidator from 'App/Validators/Admin/CreateUserCompanyValidator'
import Utility from 'App/Helpers/Utility'
import Database from '@ioc:Adonis/Lucid/Database'
import EditUserCompanyValidator from 'App/Validators/Admin/EditUserCompanyValidator'

export default class UserCompaniesController {
  public async list({ view }: HttpContextContract) {
    const userCompanies = await UserCompaniesServices.get()

    return view.render('admin/user_companies/list', { userCompanies })
  }

  public async create({ view }: HttpContextContract) {
    const companies = await CompaniesServices.get()

    return view.render('admin/user_companies/create', { companies })
  }

  public async store(ctx: HttpContextContract) {
    // request validation
    await ctx.request.validate(CreateUserCompanyValidator)

    const trx = await Database.transaction()

    try {
      const data = ctx.request.all()

      // create temporary variable for upload file
      const signatureImageFile = ctx.request.file('upload_signature_image')
      if (signatureImageFile) data.signature_image_binary = signatureImageFile

      const result = await UserCompaniesServices.create(data, trx)

      // delete temporary variable upload file
      delete data.signature_image_binary

      await trx.commit()

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.success }
      // save success data for log record
      ctx['new_data'] = result.data

      ctx.session.flash('success', result.success)

      return ctx.response.redirect().toRoute('user_companies.list')
    } catch (error) {
      await trx.rollback()

      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Perusahaan gagal dibuat')

      return ctx.response.redirect().back()
    }
  }

  public async edit({ params, view, response }: HttpContextContract) {
    const user = await UserCompaniesServices.detail(params.user_id)
    const companies = await CompaniesServices.get()

    if (!user) response.abort('Not Found', 404)

    return view.render('admin/user_companies/edit', { user, companies })
  }

  public async update(ctx: HttpContextContract) {
    // request validation
    await ctx.request.validate(EditUserCompanyValidator)

    const trx = await Database.transaction()

    try {
      const data = ctx.request.all()

      const user = await UserCompaniesServices.detail(ctx.params.user_id)

      if (!user) throw new Error('Pengguna perusahaan tidak ditemukan')

      const userCompany = await UserCompaniesServices.detailPivot(ctx.params.user_id)

      // save old data for log record
      ctx['old_data'] = user.toJSON()

      // create temporary variable for upload file (if edit)
      const signatureImageFile = ctx.request.file('upload_signature_image')
      if (signatureImageFile) data.signature_image_binary = signatureImageFile

      const result = await UserCompaniesServices.update(user, userCompany, data, trx)

      // delete temporary variable upload file
      delete data.signature_image_binary

      await trx.commit()

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.success }
      // save success data for log record
      ctx['new_data'] = result.data

      ctx.session.flash('success', result.success)

      return ctx.response.redirect().toRoute('user_companies.list')
    } catch (error) {
      await trx.rollback()

      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Pengguna perusahaan gagal diubah')

      return ctx.response.redirect().back()
    }
  }

  public async delete(ctx: HttpContextContract) {
    try {
      const user = await UserCompaniesServices.detail(ctx.params.user_id)

      if (!user) throw new Error('Pengguna perusahaan tidak ditemukan')

      // save old data for log record
      ctx['old_data'] = user.toJSON()

      // delete user & user companies
      await user.delete()

      // save success message for log record
      ctx['message'] = { success: 'Pengguna perusahaan berhasil dihapus' }

      ctx.session.flash('success', 'Pengguna perusahaan berhasil dihapus')

      return ctx.response.redirect().toRoute('user_companies.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Perusahaan gagal dihapus')

      return ctx.response.redirect().back()
    }
  }

  public async getUsersFromCompany(ctx: HttpContextContract) {
    const companyId = ctx.params.company_id

    try {
      const usersFromCompany = await UserCompaniesServices.usersFromCompany(companyId)

      return ctx.response.status(200).json({
        message: 'Pengguna dari perusahaan berhasil didapatkan.',
        data: usersFromCompany,
      })
    } catch (error) {
      Utility.catchError(ctx.request, ctx.response, error)

      return ctx.response.status(500).json({
        message: 'Pengguna dari perusahaan gagal didapatkan.',
      })
    }
  }
}
