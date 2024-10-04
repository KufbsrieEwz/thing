const worker = new Worker('worker.js')
worker.onmessage = function(event) {
    console.log(event)
}
worker.postMessage(1)
