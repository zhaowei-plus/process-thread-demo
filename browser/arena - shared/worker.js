const connects = {}
class HorseWorker {
    constructor(props) {
        const { id, port, speed, distance } = props
        this.id = id
        this.ports = [port]
        this.speed = speed
        this.distance = distance

        this.count = 0
        this.runningTimer = undefined
    }

    addPort (port) {
        if (!this.ports.includes(port)) {
            this.ports.push(port)
        }
    }

    run () {
        if (this.runningTimer) {
            return false
        }
        this.runningTimer = setInterval(() => {
            this.count += this.speed
            this.ports.map(port => {
                port.postMessage({
                    type: 'running',
                    payload: {
                        current: this.count,
                        distance: this.distance
                    }
                })
            })

            // 到达终点，销毁自己
            if (this.count >= this.distance) {
                clearInterval(this.runningTimer)
                this.ports.map(port => {
                    port.postMessage({
                        type: 'running',
                        payload: {
                            current: this.count,
                            distance: this.distance
                        }
                    })
                    port.close()
                })
            }
        }, 17)
    }
}

// SharedWorkerGlobalScope.onconnect 处理连接的相同端口
onconnect = (event) => {
    const port = event.ports[0]
    port.start()
    port.onmessage = (event) => {
        const { type, payload } = event.data
        const { id, speed, distance } = payload
        let worker = connects[id]
        if (!worker) {
            worker = new HorseWorker({
                id, speed, distance, port
            })
            connects[id] = worker
        } else {
            worker.addPort(port)
        }
        if (type === 'start') {
            worker.run()
        }
    }

}
