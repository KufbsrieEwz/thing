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
const worker = new Worker('worker.js')
worker.onmessage = function(event) {
    console.log(event)
}
worker.postMessage({c: new imNumber(0, 0), n: 100})