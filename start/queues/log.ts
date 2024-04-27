import Utility from 'App/Helpers/Utility'
import LogService from 'App/Services/LogService'
import { Job, Queue, UnrecoverableError, Worker } from 'bullmq'
import { queueOption, workerOption } from './config'

const name = 'LogService'

const queue = new Queue(name, queueOption)
const worker = new Worker(
  name,
  async (job: Job) => {
    const { success, error } = await LogService[job.name](job.data)
    if (success) {
      job.updateProgress(100)
      return success
    }
    throw new UnrecoverableError(error)
  },
  workerOption
)

// worker.on("completed", (job: Job, result: any) => {});

worker.on('failed', (job: Job, error: Error) => {
  Utility.logging(
    `Failed to run queue of ${name}`,
    { job_id: job.id, job_name: job.name, job_data: job.data },
    error.message,
    'error'
  )
})

export { queue }
