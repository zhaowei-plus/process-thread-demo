let count = 0
let runningTimer

onmessage = function(event) {
    const { type, payload } = event.data
    switch (type) {
        case 'start':
        {
            const { speed, distance } = payload
            runningTimer = setInterval(() => {
                count += speed
                postMessage({
                    type: 'running',
                    payload: {
                        current: count,
                        distance
                    }
                })

                // 到达终点，销毁自己
                if (count >= distance) {
                    clearInterval(runningTimer)
                    postMessage({
                        type: 'running',
                        payload: {
                            current: distance,
                            distance
                        }
                    })
                    close()
                }
            }, 17)
            break
        }
    }
}

// WebWorker 实际使用场景：通过解析远程图片获得图片的Base64
// 实际工作过程会遇到用户需要通过解析远程图片来获得图片 base64 的案例，那么这时候，如果图片非常大，就会造成 canvas 的 toDataURL 操作相当的耗时，从而阻塞页面的渲染。
