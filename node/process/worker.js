const http  = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plan'
  })
  res.send('I am worker, pid:' + process.pid + ', ppid:' + process.ppid)
  throw new Error('worker process exception!') // worker 进程异常退出
})

let worker

process.title = 'node-worker'
process.on('message', (message, sendHandle) => {
  if (message === 'server') {
    worker = sendHandle
    worker.on('connection', (socket) => {
      server.emit('connection', socket)
    })
  }
})

process.on('uncaughtException', (error) => {
  console.log(err)
  process.send({ act: 'suicide' })
  worker.close(() => {
    process.exit(1)
  })
})
