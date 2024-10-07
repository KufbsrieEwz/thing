class imNumber {
    constructor(re, im) {
        this.re = re; // re part
        this.im = im; // im part
    }

    // Add two im numbers
    add(other) {
        return new imNumber(this.re + other.re, this.im + other.im);
    }

    // Subtract two im numbers
    subtract(other) {
        return new imNumber(this.re - other.re, this.im - other.im);
    }

    // Multiply two im numbers
    multiply(other) {
        const rePart = this.re * other.re - this.im * other.im;
        const imPart = this.re * other.im + this.im * other.re;
        return new imNumber(rePart, imPart);
    }

    // Divide two im numbers
    divide(other) {
        const denominator = other.re * other.re + other.im * other.im;
        if (denominator === 0) {
            throw new Error("Cannot divide by zero.");
        }
        const rePart = (this.re * other.re + this.im * other.im) / denominator;
        const imPart = (this.im * other.re - this.re * other.im) / denominator;
        return new imNumber(rePart, imPart);
    }

    // String representation of the im number
    toString() {
        return `${this.re} + ${this.im}i`;
    }
}

let canvas = document.getElementById('canvas')
let c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
function Vector2(x, y) {
    return {x: x, y: y}
}
function drawRect(pos, dim, r, g, b, a) {
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillRect(pos.x, pos.y, dim.x, dim.y)
}
function clear() {
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)
}
function itterate(c, n) {
    let s = c
    let d = c
    let l = 100
    let array = []
    if (
        s.im < 0.5 && s.im > -0.5 && s.re < 0.2 && s.re > -0.5 ||
        s.im < 0.2 && s.im > -0.2 && s.re < -0.9 && s.re > -1.1 ||
        s.im < 0.1 && s.im > -0.1 && s.re < -0.8 && s.re > -1.2
    ) {
        l = 100
    } else {
        for (let i = 0; i < n; i++) {
            if (s.re > 1 || s.re < -1.7) {
                l = i
                break
            }
            if (s.im > 1 || s.im < -1) {
                l = i
                break
            }
            if (array.includes(s)) {
                l = 100
                break
            }
            for (let k = 0; k < 5; k++) {
                array.push(s)
                s = s.multiply(s).add(d)
            }
        }
    }
    return l
}
let workers = []
for (let i = 0; i < 100; i++) {
    workers.push(new Worker('worker.js'))
}
let currentWorker = 0
let toBeSent = []
let points = []
let zoom = 0
let res = 375 * Math.pow(2, zoom)
let quality = 100
let xMin = -1.7 / Math.pow(2, zoom)
let x = xMin
let xMax = 0.5 / Math.pow(2, zoom)
let yMin = -1 / Math.pow(2, zoom)
let y = yMin
let yMax = 1 / Math.pow(2, zoom)
let layers = 0
let saves = {}
let mouse = {
    x: 0,
    y: 0,
    c: {
        x: 0,
        y: 0
    }
}
if (localStorage.getItem('saves') != null) {
    saves = JSON.parse(localStorage.getItem('saves'))
}
function calculate() {
    if (layers < 1) {
        for (let i = 0; i < 10000; i++) {
            if (saves[`${x},${y}`] == undefined) {
                if (roughCalculate(new imNumber(x, y), quality)) {
                    toBeSent.push({c: new imNumber(x, y), n: quality})
                    if (toBeSent.length >= 100) {
                        workers[currentWorker].postMessage(toBeSent)
                        toBeSent = []
                        if (currentWorker != workers.length-1) {
                            currentWorker++
                        } else {
                            currentWorker = 0
                        }
                    }
                }
            } else {
                points.push({c: new imNumber(x, y), result: saves[`${x},${y}`]})
            }
            if (x < xMax) {
                x += 1/res
            }
            if (x >= xMax) {
                x = xMin
                y += 1/res
            }
            if (y >= yMax) {
                layers++
                y = yMin
            }
        }
        // localStorage.setItem('saves', JSON.stringify(saves))
    }
    visualize()
    requestAnimationFrame(calculate)
}
function visualize() {
    for (let q = 0; q < 50000; q++) {
        if (points[0] != undefined) {
            let colour = 255 - points[0].result/quality * 255
            drawRect(Vector2(canvas.width/2 + (points[0].c.re - (xMin + xMax)/2) * res, canvas.height/2 + (points[0].c.im - (yMin + yMax)/2) * res), Vector2(1, 1), colour, colour, colour, 255)
            points.splice(0, 1)
        }
    }
}
function roughCalculate(c, n) {
    let s = c
    let d = c
    let l = 100
    let array = []
    if (
        s.im < 0.5 && s.im > -0.5 && s.re < 0.2 && s.re > -0.5 ||
        s.im < 0.2 && s.im > -0.2 && s.re < -0.9 && s.re > -1.1 ||
        s.im < 0.1 && s.im > -0.1 && s.re < -0.8 && s.re > -1.2
    ) {
        l = 100
    } else {
        for (let i = 0; i < n/20; i++) {
            if (s.re > 1 || s.re < -1.7) {
                l = i
                break
            }
            if (s.im > 1 || s.im < -1) {
                l = i
                break
            }
            if (array.includes(s)) {
                l = 100
                break
            }
            for (let k = 0; k < 5; k++) {
                array.push(s)
                s = s.multiply(s).add(d)
            }
        }
    }
    return l == 100
}
calculate()
//-1.7, 0.5, -1, 1
function draw() {
    if (layers < 1) {
        for (let i = 0; i < 10000; i++) {
            if (saves[`${x},${y}`] == undefined) {
                let result = itterate(new imNumber(x, y), quality)
                saves[`${x},${y}`] = Math.round(result*res)/res
                let colour = 255 - result/quality * 255
                drawRect(Vector2(canvas.width/2 + (x - (xMin + xMax)/2) * res, canvas.height/2 + (y - (yMin + yMax)/2) * res), Vector2(1, 1), colour, colour, colour, 255)
            } else {
                let result = saves[`${x},${y}`]
                let colour = 255 - result/quality * 255
                drawRect(Vector2(canvas.width/2 + (x - (xMin + xMax)/2) * res, canvas.height/2 + (y - (yMin + yMax)/2) * res), Vector2(1, 1), colour, colour, colour, 255)
            }
            if (x < xMax) {
                x += 1/res
            }
            if (x >= xMax) {
                x = xMin
                y += 1/res
            }
            if (y >= yMax) {
                layers++
                y = yMin
            }
        }
        localStorage.setItem('saves', JSON.stringify(saves))
    }
    requestAnimationFrame(draw)
}
// draw()

const times = [];
let fps;

function refreshLoop() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;
        //console.clear()
        //console.log(fps)
        refreshLoop();
    });
}
  
//refreshLoop()

window.addEventListener('keydown', ({keyCode}) => {
    switch (keyCode) {
        case 187:
            clear()
            zoom++
            res = 375 * Math.pow(2, zoom)
            x = xMin
            xMin = (x + xMax)/2 + (x - xMax)/4
            xMax = (x + xMax)/2 - (x - xMax)/4
            x = xMin
            y = yMin
            yMin = (y + yMax)/2 + (y - yMax)/4
            yMax = (y + yMax)/2 - (y - yMax)/4
            y = yMin
            layers = 0
            break
        case 189:
            clear()
            zoom--
            res = 375 * Math.pow(2, zoom)
            x = xMin
            xMin = (x + xMax)/2 + (x - xMax)
            xMax = (x + xMax)/2 - (x - xMax)
            x = xMin
            y = yMin
            yMin = (y + yMax)/2 + (y - yMax)
            yMax = (y + yMax)/2 - (y - yMax)
            y = yMin
            layers = 0
            break
        case 87:
            clear()
            yMin -= 10/res
            yMax -= 10/res
            x = xMin
            y = yMin
            layers = 0
            break
        case 65:
            clear()
            xMin -= 10/res
            xMax -= 10/res
            x = xMin
            y = yMin
            layers = 0
            break
        case 83:
            clear()
            yMin += 10/res
            yMax += 10/res
            x = xMin
            y = yMin
            layers = 0
            break
        case 68:
            clear()
            xMin += 10/res
            xMax += 10/res
            x = xMin
            y = yMin
            layers = 0
            break
    }
})
// document.addEventListener("mousemove", function(event) {
//     mouse.x = event.clientX
//     mouse.y = event.clientY
//     mouse.c.x = 0
//     mouse.c.y = 0
// })
// document.addEventListener("click", function(event) {
//     mouse.x = event.clientX
//     mouse.y = event.clientY
//     clear()
//     x = xMin
//     xMin = (mouse.c.x)/2 + (x - xMax)/2
//     xMax = (mouse.c.x)/2 - (x - xMax)/2
//     x = xMin
//     y = yMin
//     yMin = (mouse.c.y)/2 + (y - yMax)/2
//     yMax = (mouse.c.y)/2 - (y - yMax)/2
//     y = yMin
//     layers = 0
// })
for (let i of workers) {
    i.onmessage = function(event) {
        points = points.concat(event.data)
    }
}
