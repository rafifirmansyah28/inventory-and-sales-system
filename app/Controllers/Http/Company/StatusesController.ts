import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StatusesService from 'App/Services/Company/StatusesService'

export default class StatusesController {
  public async list(ctx: HttpContextContract) {
    const statuses = await StatusesService.get()

    return ctx.view.render('company/statuses/list', { statuses })
  }
}
