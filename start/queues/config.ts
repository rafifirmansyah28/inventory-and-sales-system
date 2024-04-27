import Config from '@ioc:Adonis/Core/Config'
import { QueueOptions, WorkerOptions } from 'bullmq'

const queueOption: QueueOptions = {
  connection: Config.get('redis.connections.db_queue'),
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
    // timeout: 1000 * 60,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000 * 3,
    },
  },
}

const workerOption: WorkerOptions = {
  connection: Config.get('redis.connections.db_queue'),
  settings: {
    backoffStrategy: (current_attempt: number) => {
      return 5000 + current_attempt * 1000
    },
  },
}

export { queueOption, workerOption }
