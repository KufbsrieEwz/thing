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
self.onmessage = function(event) {
    self.postMessage({result:itterate(event.c, event.n), c: event.c})
}