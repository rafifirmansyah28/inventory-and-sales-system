import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClientStackholdersServices from 'App/Services/Admin/ClientStackholdersServices'
import ClientsServices from 'App/Services/Admin/ClientsServices'
import Utility from 'App/Helpers/Utility'
import CreateClientStackholderValidator from 'App/Validators/CreateClientStackholderValidator'
import EditClientStackholderValidator from 'App/Validators/EditClientStackholderValidator'

export default class ClientStackholdersController {
  public async list({ view }: HttpContextContract) {
    const clientStackholders = await ClientStackholdersServices.get()

    return view.render('admin/client_stackholders/list', { clientStackholders })
  }

  public async create({ view }: HttpContextContract) {
    const clients = await ClientsServices.get()

    return view.render('admin/client_stackholders/create', { clients })
  }

  public async store(ctx: HttpContextContract) {
    // request validation
    await ctx.request.validate(CreateClientStackholderValidator)
    try {
      const data = ctx.request.all()

      const result = await ClientStackholdersServices.create(data)

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.success }
      // save success data for log record
      ctx['new_data'] = result.data

      ctx.session.flash('success', result.success)

      return ctx.response.redirect().toRoute('client_stackholders.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Pemangku jabatan klien gagal dibuat')

      return ctx.response.redirect().back()
    }
  }

  public async edit({ params, view, response }: HttpContextContract) {
    const clientStackholder = await ClientStackholdersServices.detail(params.id)

    if (!clientStackholder) response.abort('Not Found', 404)

    const clients = await ClientsServices.get()

    return view.render('admin/client_stackholders/edit', { clientStackholder, clients })
  }

  public async update(ctx: HttpContextContract) {
    // reqeust validation
    await ctx.request.validate(EditClientStackholderValidator)

    try {
      const data = ctx.request.all()

      const clientStackholder = await ClientStackholdersServices.detail(ctx.params.id)

      if (!clientStackholder) throw new Error('Pemangku jabatan klien tidak ditemukan')

      // save old data for log record
      ctx['old_data'] = clientStackholder.toJSON()

      const result = await ClientStackholdersServices.update(clientStackholder, data)

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.success }
      // save success data for log record
      ctx['new_data'] = result.data

      ctx.session.flash('success', result.success)

      return ctx.response.redirect().toRoute('client_stackholders.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Pemangku jabatan klien gagal diubah')

      return ctx.response.redirect().back()
    }
  }

  public async delete(ctx: HttpContextContract) {
    try {
      const clientStackholder = await ClientStackholdersServices.detail(ctx.params.id)

      if (!clientStackholder) throw new Error('Pemangku jabatan klien tidak ditemukan')

      // save old data for log record
      ctx['old_data'] = clientStackholder.toJSON()

      await clientStackholder.delete()

      // save success message for log record
      ctx['message'] = { success: 'Pemangku jabatan klien berhasil dihapus' }

      ctx.session.flash('success', 'Pemangku jabatan klien berhasil dihapus')

      return ctx.response.redirect().toRoute('client_stackholders.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Pemangku jabatan klien gagal dihapus')

      return ctx.response.redirect().back()
    }
  }

  public async getStackholdersOfClient(ctx: HttpContextContract) {
    const clientId = ctx.params.client_id

    try {
      const stackholdersOfClient = await ClientStackholdersServices.stackholdersOfClient(clientId)

      return ctx.response.status(200).json({
        message: 'Pemangku jabatan dari klien berhasil didapatkan.',
        data: stackholdersOfClient,
      })
    } catch (error) {
      Utility.catchError(ctx.request, ctx.response, error)

      return ctx.response.status(500).json({
        message: 'Pemangku jabatan dari klien gagal didapatkan.',
      })
    }
  }
}
