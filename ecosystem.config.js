module.exports = {
  apps: [
    {
      name: 'inventory-and-sales-system',
      script: 'server.js',
      instances: 0, //pakai semua core CPU yang ada
      instance_var: 'MAIN_INSTANCE_APP', //daftar sebagai nama instance di env, nanti bisa digunakan untuk cronjobs agar menghindari duplikat proses yang sama
      exec_mode: 'fork',
      max_memory_restart: '1G', //jika sudah mencapai ini (mungkin memory leak), maka restart
      wait_ready: true,
      listen_timeout: 5_000, //default : 3000 ms, pm2 will consider your app ready
      restart_delay: 5_000, //default : 0 ms, time to wait before restarting a crashed app
      cwd: '.',
      env: {},
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      node_args: '--unhandled-rejections=strict',
      max_restarts: 5, //jumlah restart maksmimal dalam durasi minimum uptime
      min_uptime: 10_000, //minimum uptime (dalam milliseconds)
      listen_timeout: 8_000, //timeout sebelum force reload (dalam milliseconds)
    },
  ],
}

//source : https://medium.com/learnwithrahul/zero-downtime-deployments-with-pm2-93013713df15
//instance_var : This key is used to specify env var name for instance identifier. here we provided it as APP_INSTANCE_SEQ, but you can specify any string here. inside your code you can get value of instance identifier as process.env.APP_INSTANCE_SEQ (or whatever string you provided with instance_var). Instance identifier is helpful in identifying specific application instance to perform specific task on a single instance instead of all application instances, e.g. Cron job schedules - we don't want to do duplicate task execution while running multi instance setup.
//restart_delay : If our application instances go down due to some unusual reason, PM2 will try to restart application instances automatically. In such cases, we don't want to bombard our resources (like DBs) continuously for startup connections. We can use this value to specify a delay for automatic restarts in case of failures.
//cwd: This is the working directory, relative to which PM2 looks for "script" (startup file). If you specify it as "." (or keep unspecified), PM2 will look for startup file relative to directory from where startup command was executed.
//env: This can be used for injecting environment variables for our application instances. PM2 supports multi environment configuration setup as well, but generally we do environment related stuff using system env vars or a .env files.
//RECOMMENDATION : PM2 supports multi-app configuration in a single file but it is better to use separate files for managing different configurations for prod, stage, dev & so on
