import Log from 'App/Models/Log'
import Utility from 'App/Helpers/Utility'

interface LogActionInterface {
  url: string
  method: string
  ip: string
  user_params?: object
  user_input?: object
  old_data?: object
  new_data?: object
  success_message: string
  error_message: string
  created_by_user_id?: number
}

export default {
  async logAction(data: LogActionInterface) {
    try {
      const row = new Log()

      row.url = data.url
      row.method = data.method
      row.ip = data.ip
      row.user_params = data.user_params
      row.user_input = data.user_input
      row.old_data = data.old_data
      row.new_data = data.new_data
      row.success_message = data.success_message
      row.error_message = data.error_message
      row.created_by_user_id = data.created_by_user_id

      await row.save()

      return {
        success: 'Log aktifitas berhasil dibuat',
        data: row,
      }
    } catch (error) {
      Utility.logging(
        `Failed to run ${Utility.getCurrentFunction()} in ${Utility.getCurrentFile(__filename)}`,
        arguments,
        error.message,
        'error'
      )
      return { error: error.message }
    }
  },
}
