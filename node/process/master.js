// nodejs 多进程模型
const fork = require('child_process').fork
const cpus = require('os').cpus()

// 主进程开启服务，监听端口
const server = require('net').createServer()
server.listen(3000)
// process.title = 'node-master'

const workers = {}
const createWorker = () => {
  // 创建子进程
  const worker = fork('worker.js')
  worker.on('message', function(message) {
    if (message.act === 'suicide') {
      createWorker()
    }
  })

  // 退出
  worker.on('exit', (code, signal) => {
    console.log('worker process exited, code: %s signal: %s', code, signal)
    delete workers[worker.pid]
  })

  // 发送消息
  worker.send('server', server)
  workers[worker.pid] = worker
  console.log('worker process created, pid: %s ppid: %s', worker.pid, process.pid)
}

for (let i = 0; i < cpus.length; i ++) {
  createWorker()
}

process.once('SIGINT', close.bind(this, 'SIGINT')) // kill(2) Ctrl-C
process.once('SIGQUIT', close.bind(this, 'SIGQUIT')) // kill(3) Ctrl-\
process.once('SIGTERM', close.bind(this, 'SIGTERM')) // kill(15) default
process.once('exit', close.bind(this))

function close (code) {
  console.log('进程退出！', code)
  if (code !== 0) {
    for (let pid in workers) {
      console.log('master process exited, kill worker pid: ', pid)
      workers[pid].kill('SIGINT')
    }
  }
  process.exit(0)
}
