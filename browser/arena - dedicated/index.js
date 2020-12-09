class Horse {
    constructor (distance) {
        this.speed = Math.ceil(Math.random() * 2)
        this.distance = distance
        this.worker = new Worker('worker.js')
        this.worker.onmessage = this.messageHandler
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
        this.worker.postMessage({
            type: 'start',
            payload: {
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
    }
    init () {
        for (let i = 0; i < this.tracks; i ++) {
            const track = this.buildTrack(i + 1)
            const horse = new Horse(this.distance)
            horse.registerRender(params => {
                const { current, distance } = params
                const runRate = current / distance * 100
                track.style.width = runRate + '%'
                track.innerText = `${i + 1}赛马 ${current}m`
            })
            this.horses.push(horse)
        }
        return this
    }
    buildTrack (index) {
        const track = document.createElement('div')
        track.className = 'track'
        track.style.width = '20%'
        track.innerText = `赛马 ${index}`
        document.getElementById('tracks').appendChild(track)
        return track
    }
    start () {
        this.horses.forEach(horse => {
            horse.start()
        })
    }
}

const arena = new Arena()
function start () {
    arena.init().start()
}
