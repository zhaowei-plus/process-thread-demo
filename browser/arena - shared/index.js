let ID = 0
class Horse {
    constructor (distance) {
        this.id = ++ ID
        this.speed = Math.ceil(Math.random() * 2)
        this.distance = distance
        this.worker = new SharedWorker('worker.js')
        // 两个脚本通过 MessagePort 对象来访问 worker
        this.worker.port.onmessage = this.messageHandler
        this.worker.port.start()
    }
    messageHandler = event => {
        const { type, payload } = event.data
        if (type === 'running') {
            this.render(payload)
        }
    }
    registerRender (callback) {
        this.render = (params) => {
            callback && callback(params)
        }
    }
    start () {
        this.worker.port.postMessage({
            type: 'start',
            payload: {
                id: this.id,
                speed: this.speed,
                distance: this.distance
            }
        })
    }
}

class Arena {
    constructor() {
        this.tracks = window.navigator.hardwareConcurrency || 4
        this.distance = 1000
        this.horses = []
        this.checkState()
    }

    checkState () {
        this.stateWorker = new SharedWorker('state.js')
        this.stateWorker.port.onmessage = (event) => {
            const { isRunning } = event.data
            this.isRunning = isRunning
        }
        this.stateWorker.port.start()
    }

    init () {
        for (let i = 0; i < this.tracks; i ++) {
            const track = this.buildTrack(i + 1)
            const horse = new Horse(this.distance)
            horse.registerRender(params => {
                const { current, distance } = params
                const runRate = current / distance * 100
                const calcWidth = runRate > 10 ? runRate : 10
                track.style.width = calcWidth + '%'
                track.innerText = `${i + 1}赛马 ${current}m`
            })
            this.horses.push(horse)
        }
        return this
    }
    buildTrack (index) {
        const track = document.createElement('div')
        track.className = 'track'
        track.style.width = '10%'
        track.innerText = `赛马 ${index}`
        document.getElementById('tracks').appendChild(track)
        return track
    }
    start () {
        this.horses.forEach(horse => {
            horse.start()
        })
        this.stateWorker.port.postMessage('start')
    }
}

const arena = new Arena()
window.onload = () => {
    setTimeout(() => {
        const isRunning = arena.init().isRunning
        const aStart = document.getElementById('start')
        aStart.innerText = isRunning ? '加载比赛' : '开始比赛'
    })
}

function start () {
    arena.start()
}

