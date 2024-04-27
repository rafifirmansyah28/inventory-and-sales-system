import { DateTime } from 'luxon'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Setting from 'App/Models/Setting'
import Utility from 'App/Helpers/Utility'
import StatusesService from 'App/Services/Company/StatusesService'
import Env from '@ioc:Adonis/Core/Env'
import DiscountsServices from 'App/Services/Company/DiscountsServices'
import Order from 'App/Models/Company/Order'
import EditTransactionValidator from 'App/Validators/Company/EditTransactionValidator'

export default class TransactionsController {
  public async list(ctx: HttpContextContract) {
    const queryParams = {
      search: ctx.request.all().search ?? null,
      date_range_from: ctx.request.all().date_range_from ?? null,
      date_range_to: ctx.request.all().date_range_to ?? null,
      status_id: ctx.request.all().status ?? null,
    }
    const statuses = await StatusesService.get()

    let orders: any

    if (
      queryParams.search &&
      queryParams.date_range_from &&
      queryParams.date_range_to &&
      queryParams.status_id
    ) {
      orders = await Order.query()
        .select(
          'orders.id',
          'orders.name',
          'orders.client_name',
          'orders.client_stackholder_name',
          'orders.user_name',
          'statuses.name AS status_name',
          'orders.created_at'
        )
        .leftJoin('statuses', 'statuses.id', 'orders.status_id')
        .where('orders.company_id', ctx['company'].id)
        .andWhere((query) => {
          query
            .whereILike('orders.name', `%${queryParams.search}%`)
            .orWhereILike('orders.client_name', `%${queryParams.search}%`)
            .orWhereILike('orders.client_stackholder_name', `%${queryParams.search}%`)
            .orWhereILike('orders.user_name', `${queryParams.search}`)
        })
        .andWhereBetween('created_at', [queryParams.date_range_from, queryParams.date_range_to])
        .andWhere('statuses.id', queryParams.status_id)
    } else if (queryParams.search && queryParams.date_range_from && queryParams.date_range_to) {
      orders = await Order.query()
        .select(
          'orders.id',
          'orders.name',
          'orders.client_name',
          'orders.client_stackholder_name',
          'orders.user_name',
          'statuses.name AS status_name',
          'orders.created_at'
        )
        .leftJoin('statuses', 'statuses.id', 'orders.status_id')
        .where('orders.company_id', ctx['company'].id)
        .andWhere((query) => {
          query
            .whereILike('orders.name', `%${queryParams.search}%`)
            .orWhereILike('orders.client_name', `%${queryParams.search}%`)
            .orWhereILike('orders.client_stackholder_name', `%${queryParams.search}%`)
            .orWhereILike('orders.user_name', `${queryParams.search}`)
        })
        .andWhereBetween('created_at', [queryParams.date_range_from, queryParams.date_range_to])
    } else if (queryParams.search && queryParams.status_id) {
      orders = await Order.query()
        .select(
          'orders.id',
          'orders.name',
          'orders.client_name',
          'orders.client_stackholder_name',
          'orders.user_name',
          'statuses.name AS status_name',
          'orders.created_at'
        )
        .leftJoin('statuses', 'statuses.id', 'orders.status_id')
        .where('orders.company_id', ctx['company'].id)
        .andWhere((query) => {
          query
            .whereILike('orders.name', `%${queryParams.search}%`)
            .orWhereILike('orders.client_name', `%${queryParams.search}%`)
            .orWhereILike('orders.client_stackholder_name', `%${queryParams.search}%`)
            .orWhereILike('orders.user_name', `${queryParams.search}`)
        })
        .andWhere('statuses.id', queryParams.status_id)
    } else if (queryParams.date_range_from && queryParams.date_range_to && queryParams.status_id) {
      orders = await Order.query()
        .select(
          'orders.id',
          'orders.name',
          'orders.client_name',
          'orders.client_stackholder_name',
          'orders.user_name',
          'statuses.name AS status_name',
          'orders.created_at'
        )
        .leftJoin('statuses', 'statuses.id', 'orders.status_id')
        .where('orders.company_id', ctx['company'].id)
        .andWhereBetween('created_at', [queryParams.date_range_from, queryParams.date_range_to])
        .andWhere('statuses.id', queryParams.status_id)
    } else if (queryParams.search) {
      orders = await Order.query()
        .select(
          'orders.id',
          'orders.name',
          'orders.client_name',
          'orders.client_stackholder_name',
          'orders.user_name',
          'statuses.name AS status_name',
          'orders.created_at'
        )
        .leftJoin('statuses', 'statuses.id', 'orders.status_id')
        .where('orders.company_id', ctx['company'].id)
        .andWhere((query) => {
          query
            .whereILike('orders.name', `%${queryParams.search}%`)
            .orWhereILike('orders.client_name', `%${queryParams.search}%`)
            .orWhereILike('orders.client_stackholder_name', `%${queryParams.search}%`)
            .orWhereILike('orders.user_name', `${queryParams.search}`)
        })
    } else if (queryParams.date_range_from && queryParams.date_range_to) {
      orders = await Order.query()
        .select(
          'orders.id',
          'orders.name',
          'orders.client_name',
          'orders.client_stackholder_name',
          'orders.user_name',
          'statuses.name AS status_name',
          'orders.created_at'
        )
        .leftJoin('statuses', 'statuses.id', 'orders.status_id')
        .where('orders.company_id', ctx['company'].id)
        .andWhereBetween('created_at', [queryParams.date_range_from, queryParams.date_range_to])
    } else if (queryParams.status_id) {
      orders = await Order.query()
        .select(
          'orders.id',
          'orders.name',
          'orders.client_name',
          'orders.client_stackholder_name',
          'orders.user_name',
          'statuses.name AS status_name',
          'orders.created_at'
        )
        .leftJoin('statuses', 'statuses.id', 'orders.status_id')
        .where('orders.company_id', ctx['company'].id)
        .andWhere('statuses.id', queryParams.status_id)
    } else {
      orders = await Order.query()
        .select(
          'orders.id',
          'orders.name',
          'orders.client_name',
          'orders.client_stackholder_name',
          'orders.user_name',
          'statuses.name AS status_name',
          'orders.created_at'
        )
        .leftJoin('statuses', 'statuses.id', 'orders.status_id')
        .where('orders.company_id', ctx['company'].id)
    }

    const completeUrl = ctx.request.completeUrl()
    const appUrl = Env.get('APP_URL')
    const companyId = ctx['company'].id

    return ctx.view.render('company/transactions/list', {
      statuses,
      orders,
      appUrl,
      companyId,
      completeUrl,
      queryParams,
    })
  }

  public async create(ctx: HttpContextContract) {
    try {
      const [setting, discounts] = await Promise.all([
        Setting.query()
          .select('key', 'value')
          .where('company_id', ctx['company']?.id)
          .andWhere('order_number_identifier', Utility.orderNumberList['Surat Pesanan'])
          .first(),
        DiscountsServices.get(ctx['company']?.id),
      ])

      const latestSkCompany = `${setting?.key}-${Number(setting?.value) + 1}`

      const currentDate = DateTime.now().setLocale('id').toFormat('dd LLLL yyyy')
      const appUrl = Env.get('APP_URL')
      const companyId = ctx['company'].id
      const companyName = ctx['company'].name
      const userId = ctx.auth.user?.id
      const userName = ctx.auth.user?.name
      const tax = {
        ppn: ctx['company'].ppn,
        pph: ctx['company'].pph,
      }

      return ctx.view.render('company/transactions/create', {
        latestSkCompany,
        currentDate,
        appUrl,
        companyId,
        companyName,
        userId,
        userName,
        tax,
        discounts,
      })
    } catch (error) {
      console.log('error:', error)
    }
  }

  public async detail(id) {
    const order = await Order.query()
      .select(
        'orders.id',
        'orders.name',
        'orders.client_name',
        'orders.client_stackholder_name',
        'orders.user_name',
        'statuses.name AS status_name',
        'orders.created_at'
      )
      .leftJoin('statuses', 'statuses.id', 'orders.status_id')
      .where('orders.id', id)
      .first()

    return order
  }

  public async update(ctx: HttpContextContract) {
    //request validation
    await ctx.request.validate(EditTransactionValidator)

    try {
      const order = await this.detail(ctx.params.id)

      if (!order) throw new Error('Diskon barang tidak ditemukan')

      const data = ctx.request.all()

      // save old data for log record
      ctx['old_data'] = order.toJSON()

      order.name = data.name
      order.save()

      const result = {
        message: 'Order berhasil diubah',
        data: order,
      }

      // save payload for log record
      ctx['payload'] = data
      // save success message for log record
      ctx['message'] = { success: result.message }
      // save success data for log record
      ctx['new_data'] = result.data

      return ctx.response.status(200).json(result)
    } catch (error) {
      // save error message for log record
      Utility.catchError(ctx.request, ctx.response, error)
      ctx['message'] = { error: 'Order gagal diubah' }

      return ctx.response.status(500).json({
        error: 'Order gagal diubah',
      })
    }
  }

  public async delete(ctx: HttpContextContract) {
    try {
      const order = await this.detail(ctx.params.id)

      if (!order) throw new Error('Order tidak ditemukan')

      // save old data for log record
      ctx['old_data'] = order.toJSON()

      // delete order
      await order.delete()

      // save success message for log record
      ctx['message'] = { success: 'Order berhasil dihapus' }

      ctx.session.flash('success', 'Order berhasil dihapus')

      return ctx.response.redirect().toRoute('transactions.list')
    } catch (error) {
      // save error message for log record
      ctx['message'] = { error: error.message }

      Utility.catchError(ctx.request, ctx.response, error)
      ctx.session.flash('error', 'Order gagal dihapus')

      return ctx.response.redirect().back()
    }
  }
}
