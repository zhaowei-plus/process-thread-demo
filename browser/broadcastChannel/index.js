const bc = new BroadcastChannel('test_channel')
bc.onmessage = (event) => {}
bc.postMessage()
bc.close()
