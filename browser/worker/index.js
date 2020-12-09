const max = 1000
const maximumThreadsNumber = window.navigator.hardwareConcurrency || 4
const worker = new Worker('worker.js')

class Horse {
    constructor (distance) {
        this.speed = Math.ceil(Math.random() * 4)
        this.distance = distance
        this.worker = new Worker('worker.js')
    }

    start () {
        this.worker.postMessage({
            type: 'start',
            payload: {
                speed: this.speed,
                distance: this.distance
            }
        })

        this.worker.onmessage = (event) => {
            const { current } = event.data
            this.render({
                current,
                distance: this.distance
            })
        }
    }

    registerRender (callback) {
        this.render = (params) => {
            callback && callback(params)
        }
    }
}

// 主线程 调用 postMessage() 方法，向 Worker 发送消息
worker.postMessage({
    type: 'start',
    payload: {
        step: 4
    }
})

// 主线程通过 onmessage 指定监听函数，接受子线程返回的消息
worker.onmessage = (event) => {
    /**
     * 数据通信：
     *  主线程和Worker之间的通行内容，可是是文本也可是是对象，当然，这种通信
     *  是拷贝关系，即是传值而不是传址，所以 Worker 对通信内容的修改，不会影响到主线程。
     *  事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给
     *  Worker，后者再将它还原。
     *
     *  主线程与 Worker 之间也可以交换二进制数据，比如 File、Blob、ArrayBuffer 等类型，也可以在线程之间发送。
     *
     *  关于其他，可以参考： http://www.ruanyifeng.com/blog/2018/07/web-worker.html
     * */
    const { type, payload } = event.data
    if (type === 'running') {
        const { current, max } = payload
        document.getElementById('result').innerHTML = current / max * 100 + '%'

        // 到达终点，发送消息
        if (current >= max) {
            worker.postMessage({
                type: 'stop'
            })
        }
    }
}

// 监听子线程报错
worker.onerror = (event) => {
    console.log([
        'ERROR: Line ', event.lineno, ' in ', event.filename, ': ', event.message
    ].join(''));
}

function doSomething() {
    // document.getElementById('result').innerHTML = current / max * 100 + '%'

    // 完成任务后，关掉子线程
    worker.terminate()
}

function running (index, current) {
    const track = document.getElementsByClassName('track')[index]
    document.getElementsByClassName('track')[index].innerHTML = current / max * 100 + '%'
}

function start () {

}


// 专用线程 dedicated web worker
// Dedicated web worker随当前页面的关闭而结束；这意味着Dedicated web worker只能被创建它的页面访问。

// 共享线程 shared web worker
// Shared web worker可以被多个页面访问。在Javascript代码中，“Work”类型代表Dedicated web worker，而“SharedWorker”类型代表Shared web worker
