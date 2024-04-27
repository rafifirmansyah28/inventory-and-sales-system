import Event from '@ioc:Adonis/Core/Event'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Utility from 'App/Helpers/Utility'
import { DateTime } from 'luxon'

export default class LogAction {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // continue to controller
    await next()

    try {
      // after from controller, then log all data
      if (ctx.request.method() !== 'GET') {
        Event.emit('LogService:logAction', {
          user_id: ctx.auth?.user?.id,
          url: ctx.request.completeUrl(true),
          method: ctx.request.method(),
          ip: ctx.request.ip(),
          user_params: ctx.request.params(),
          user_input: ctx['payload'],
          old_data: ctx['old_data'],
          new_data: ctx['new_data'],
          success_message: ctx['message']?.success,
          error_message: ctx['message']?.error,
          created_at: DateTime.now(),
        })
      }
    } catch (error) {
      Utility.catchError(ctx.request, ctx.response, error)
    }
  }
}
