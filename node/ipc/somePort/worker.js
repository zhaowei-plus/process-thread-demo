const http = require('http')
process.title = 'node - worker'

// 子进程，只创建不监听
const httpServer = http.createServer((req, res) => {
  res.end('Hello world')
})

process.on('message', (msg, tcpServer) => {
  console.log(`worker get message: ${msg}`)
  // 如果是 master 传递来的 tcp server
  if (msg === 'server') {
    // 新连接建立的时候触发
    tcpServer.on('connection', socket => {
      // 把 tcp server 的连接转给 http server 处理
      httpServer.emit('connection', socket)
      process.send(`node-worker connection success: ${process.pid} - ${process.ppid}`)
    })
  }
});

