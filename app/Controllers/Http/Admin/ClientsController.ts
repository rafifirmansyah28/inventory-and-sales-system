import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Utility from 'App/Helpers/Utility'
import ClientsServices from 'App/Services/Admin/ClientsServices'
import CreateClientValidator from 'App/Validators/Admin/CreateClientValidator'
import EditClientValidator from 'App/Validators/Admin/EditClientValidator'

export default class ClientsController {
  public async list({ view }: HttpContextContract) {
    const clients = await ClientsServices.get()

    return view.render('admin/clients/list', { clients })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('admin/clients/create')
  }

  public async store(ctx: HttpContextContract) {
    // request validation
    await ctx.request.validate(CreateClientValidator)

    try {
      const data = ctx.request.all()

      const result = await ClientsServices.create(data)

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.success }
      // save success data for log record
      ctx['new_data'] = result.data

      ctx.session.flash('success', result.success)

      return ctx.response.redirect().toRoute('clients.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Klien gagal dibuat')

      return ctx.response.redirect().back()
    }
  }

  public async edit({ params, view, response }: HttpContextContract) {
    const client = await ClientsServices.detail(params.id)

    if (!client) response.abort('Not Found', 404)

    return view.render('admin/clients/edit', { client })
  }

  public async update(ctx: HttpContextContract) {
    // reqeust validation
    await ctx.request.validate(EditClientValidator)
    try {
      const data = ctx.request.all()

      const client = await ClientsServices.detail(ctx.params.id)

      if (!client) throw new Error('Klien tidak ditemukan')

      // save old data for log record
      ctx['old_data'] = client.toJSON()

      const result = await ClientsServices.update(client, data)

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.success }
      // save success data for log record
      ctx['new_data'] = result.data

      ctx.session.flash('success', result.success)

      return ctx.response.redirect().toRoute('clients.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Klien gagal diubah')

      return ctx.response.redirect().back()
    }
  }

  public async delete(ctx: HttpContextContract) {
    try {
      const client = await ClientsServices.detail(ctx.params.id)

      if (!client) throw new Error('Klien tidak ditemukan')

      // save old data for log record
      ctx['old_data'] = client.toJSON()

      // delete client
      await client.delete()

      // save success message for log record
      ctx['message'] = { success: 'Klien berhasil dihapus' }

      ctx.session.flash('success', 'Klien berhasil dihapus')

      return ctx.response.redirect().toRoute('clients.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Klien gagal dihapus')

      return ctx.response.redirect().back()
    }
  }

  public async apiList(ctx: HttpContextContract) {
    try {
      const clients = await ClientsServices.get()

      return ctx.response.status(200).json({
        message: 'Klien berhasil didapatkan.',
        data: clients,
      })
    } catch (error) {
      Utility.catchError(ctx.request, ctx.response, error)

      return ctx.response.status(500).json({
        message: 'Klien gagal didapatkan.',
      })
    }
  }
}
