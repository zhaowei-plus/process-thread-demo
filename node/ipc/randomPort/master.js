// Master-Worker 模式，主进程负责调度和管理工作进程，工作进程负责具体业务逻辑处理
const { fork } = require('child_process');
const cpus = require('os').cpus()
process.title = 'node-master'

console.log('node-master:', process.pid)
for (let i = 0, len = cpus.length; i < len; i++) {
  const worker = fork('./worker.js')
  worker.on('message', msg => {
    console.log(`master get message: ${msg}`)
  });

  worker.send('ok')
}
