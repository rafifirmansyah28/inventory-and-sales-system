import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Utility from 'App/Helpers/Utility'
import Company from 'App/Models/Admin/Company'
import UserCompany from 'App/Models/Admin/UserCompany'

export default class FindCompanyOfUser {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    try {
      const userId: any = ctx.auth?.user?.id
      const userCompany = await UserCompany.query()
        .select('id', 'company_id')
        .where('user_id', userId)
        .first()
      if (!userCompany) {
        throw new Error('Pengguna tidak memilki perusahaan.')
      }

      const company = await Company.query().where('id', userCompany?.company_id).first()
      if (!company) {
        throw new Error('Perusahaan tidak ditemukan.')
      }

      ctx['company'] = company.toJSON()

      // continue to next process
      await next()
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', error.message)
      return ctx.response.redirect().back()
    }
  }
}
