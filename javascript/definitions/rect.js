class dRect extends Definition {
    constructor(tok) {
        super(tok);
        this.stroke = new dStroke(tok.key('stroke'));
        this.fill = new dFill(tok.key('fill'));
        this.start = Coordinate.point(tok.params[0].asTok());
        this.end = Coordinate.point(tok.params[1].asTok());
    }
    graphic() {
        const x = this.start.x > this.end.x ? this.end.x : this.start.x;
        const y = this.start.y > this.end.y ? this.end.y : this.start.y;
        return `
        <rect x="${x}" y="${y}" width="${Math.abs(this.end.x - this.start.x)}"
            height="${Math.abs(this.end.y - this.start.y)}"
            ${this.fill.fill()} ${this.stroke.stroke()}"
        />
        `;
    }
}
