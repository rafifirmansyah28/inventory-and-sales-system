import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/Admin/User'
import Hash from '@ioc:Adonis/Core/Hash'
import LoginValidator from 'App/Validators/LoginValidator'

export default class AuthController {
  public async login(ctx: HttpContextContract) {
    await ctx.request.validate(LoginValidator)

    const email = ctx.request.input('email')
    const password = ctx.request.input('password')
    const rememberMe = ctx.request.input('remember_me', false)

    // Lookup user manually
    const user: any = await User.query()
      .where('email', email)
      .preload('userCompany', (userCompany) => userCompany.select('id', 'company_id'))
      .first()

    if (!user) {
      ctx.session.flash('errors', {
        email: ['Akun anda tidak ditemukan. Harap menghubungi admin lebih lanjut.'],
      })
      return ctx.response.redirect().back()
    }

    if (user.userCompany) {
      ctx['userCompany'] = user.userCompany
    } else {
      ctx['userCompany'] = undefined
    }

    // Verify password
    if (!(await Hash.verify(user?.password, password))) {
      ctx.session.flash('errors', {
        email: ['Email atau password anda salah. Silahkan dicoba lagi.'],
      })
      return ctx.response.redirect().back()
    }
    const userCompleteCredential = user.serialize()

    // Redirect to admin dashboard
    if (user!.isAdmin) {
      await ctx.auth.use('admin').login(userCompleteCredential, rememberMe)

      return ctx.response.redirect('/admin')
    }
    // Redirect to company dashboard
    else {
      await ctx.auth.use('web').login(userCompleteCredential, rememberMe)

      return ctx.response.redirect('/company')
    }
  }

  public async logoutAdmin({ auth, response }) {
    await auth.use('admin').logout()

    return response.redirect('/auth/login')
  }

  public async logoutCompany({ auth, response }) {
    await auth.use('web').logout()

    return response.redirect('/auth/login')
  }
}
