let count = 0
const speed = Math.ceil(Math.random() * 4) // 速度
const max = 100
let runningTimer

// worker 内部设置监听函数，监听 message 事件
onmessage = function(event) {
    const { type } = event.data
    switch (type) {
        case 'start':
            {
                runningTimer = setInterval(() => {
                    count += speed
                    postMessage({
                        type: 'running',
                        payload: {
                            current: count,
                            max
                        }
                    })
                    if (count >= max) {
                        clearInterval(runningTimer)
                        postMessage({
                            type: 'running',
                            payload: {
                                current: max,
                                max
                            }
                        })
                        this.close()
                    }
                }, 300)
                break
            }
        case 'stop':
            {
                // 可以在内部关闭自己
                break
            }
        default:
            {
                postMessage('Unknown Action:', type)
            }
    }
}

// importScripts
// importScripts

// Dedicated Web Workers 是由主进程实例化并且只能与之进行通信
// Shared workers 可以被运行在同源的所有进程访问（不同的浏览的选项卡，内联框架及其它shared workers）

// BroadcastChannel - 允许我们向共享同一个源的所有上下文发送消息，同一个源下的所有的浏览器选项卡，内联框架或者 workers 都可以发送和接收消息

// BroadcastChannel 只能用于同同源的页面之前的通信
// window.postMessage 可以用于任何页面之间的通信
