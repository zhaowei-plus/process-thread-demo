const http = require('http')
process.title = 'node - worker'

// 每一个都监听一个不同的端口
const randomPort = parseInt(Math.random() * 10000)

http.createServer((req, res) => {
  res.end('Hello world')
}).listen(randomPort)

process.on('message', msg => {
  console.log(`worker get message: ${msg}`)
});

process.send(`node-worker ${randomPort} ready: ${process.pid} - ${process.ppid}`)
