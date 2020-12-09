onconnect = (event) => {
    const port = event.ports[0]
    port.start()
    port.postMessage({
        type: 'state',
        isRunning: this.isRunning
    })
    port.onmessage = event => {
        if (event.data === 'start') {
            this.isRunning = true
        }

    }
}
