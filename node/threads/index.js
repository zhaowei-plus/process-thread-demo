// 利用多线程：worker_threads 模块实现多线程
// 案例一：主线程与工作线程的通行
// worker表示一个独立的JavaScript 执行线程， parentPort是一个 MessagePort 的实例
const { isMainThread, parentPort, workerData, threadId, Worker } = require('worker_threads')

const createWorkerThread = () => {
  // 启动一个工作线程
  const worker = new Worker(__filename, { workerData: 1 });

  worker.once('exit', code => {
    // 监听错误，如果进程调用 process.exit()，则code 为 参数传递的code码
    console.log('exit code:', code)
  })

  // 父线程监听工作线程发过来的消息
  worker.on('message', msg => {
    // 收到其他线程的消息
    console.log(`主线程收到消息数据 ${msg}`)

    // 父线程向工作线程发送消息
    worker.postMessage(msg + 1)
  })
}

const workerThread = () => {
  console.log(`当前工作线程为: threadId：${threadId}`)
  console.log(`工作线程初始化的数据为: workerDate： ${workerData}`)

  // 工作线程监听父线程发来的消息
  parentPort.on('message', msg => {
    // 监听主进程来的消息
    console.log(`工作线程当前接受到的数据： ${msg} threadId:${threadId}`)
    if (msg === 5) {
      process.exit(33)
    }
    // 工作线程向父线程发送
    parentPort.postMessage(msg)
  })
  parentPort.postMessage(workerData)
}

if (isMainThread) {
  createWorkerThread()
  createWorkerThread()
} else {
  workerThread()
}
