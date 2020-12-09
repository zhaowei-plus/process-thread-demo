/**
 * 实际工作中对于守护进程并不陌生，例如PM2、Egg-Cluster等
 * 实际工作中对于守护进程的健壮性要求是很高的，需要考虑诸多因素，如进程的异常监听、工作进程的管理调度、进程挂掉之后的重启等
 * */
const fs = require('fs')
const { Console } = require('console')
process.title = 'node - daemon'

// 自定义日志文件
const logger = new Console(
  fs.createWriteStream('./stdout.log'),
  fs.createWriteStream('./stderr.log')
)

// 模拟日志输出
setInterval(() => {
  logger.log('daemon pid: %s，ppid：%s', process.pid, process.ppid)
}, 1000 * 10)
