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
let imOpperations = {
    add: (a, b) => {
        return new imNumber(a.re + b.re, a.im + b.im)
    },
    multiply: (a, b) => {
        return new imNumber(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
    }
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
                s = imOpperations.add(imOpperations.multiply(s, s), d)
            }
        }
    }
    return l
}
let toBeSent = []
self.onmessage = function(event) {
    for (let i of event.data) {
        toBeSent.push({c: i.c, result: itterate(i.c, i.n)})
    }
    if (toBeSent.length >= 10) {
        self.postMessage(toBeSent)
        toBeSent = []
    }
}
