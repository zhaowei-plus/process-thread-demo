/**
 * 进程是计算机中的程序关于某次数据集合上的一簇运行活动，是系统进行资源分配和调度的基本单元，是操作系统结构的基础
 *
 * 多进程：每个进程拥有自己独立的空间地址、数据栈，一个进程无法访问另外一个进程中定义的变量、数据结构等资源，只有建立了IPC通信，
 * 进程之间才能数据共享
 * */
const http = require('http')

http.createServer().listen(3000, () => {
  process.title = '测试进程 Node.js' // 进程进行命名
  console.log(`process.pid: `, process.pid) // process.pid: 20279
})
