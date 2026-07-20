module.exports = {
  apps: [
    {
      name: 'wa-control',
      script: 'src/index.js',
      cwd: '/var/www/wa-control',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/wa-control-error.log',
      out_file: '/var/log/pm2/wa-control-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};