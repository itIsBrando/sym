class dArc extends Definition {
    start: Coordinate;
    mid: Coordinate;
    end: Coordinate;
    stroke: dStroke;
    fill: dFill;

    constructor(tok: Tok) {
        super(tok);

        this.start = Coordinate.point(tok.key('start'));
        this.mid = Coordinate.point(tok.key('mid'));
        this.end = Coordinate.point(tok.key('end'));

        this.stroke = new dStroke(tok.key('stroke'));
        this.fill = new dFill(tok.key('fill'));
    }

    /**
     * KiCAD draws an arc through 3 points
     * Straight from:
     * https://stackoverflow.com/questions/43825414/draw-an-svg-arc-using-d3-knowing-3-points-on-the-arc
     */
    graphic(): string {
        const A = this.end.dist(this.mid);
        const B = this.mid.dist(this.start);
        const C = this.start.dist(this.end);
        const angle = Math.acos((A * A + B * B - C * C) / (2 * A * B));

        //calc radius of circle
        const K = .5 * A * B * Math.sin(angle);
        let r = A * B * C / 4 / K;
        r = Math.round(r * 1000) / 1000;

        //large arc flag
        const laf = +(Math.PI / 2 > angle);
        // sweep arc flag
        const saf = +((this.end.x - this.start.x) * (this.mid.y - this.start.y) - (this.end.y - this.start.y) * (this.mid.x - this.start.x) < 0);

        return `
            <path d="M ${this.start.x} ${this.start.y} A ${r} ${r} 0 ${laf} ${saf} ${this.end.x} ${this.end.y}"
                ${this.stroke.stroke()} ${this.fill.fill()}"
            />
        `;
    }
}