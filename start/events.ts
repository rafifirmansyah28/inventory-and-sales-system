import Event from '@ioc:Adonis/Core/Event'

import { queue as queueLogService } from './queues/log'

Event.on('LogService:logAction', (data: any) => {
  queueLogService.add('logAction', data)
})
