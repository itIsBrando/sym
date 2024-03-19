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

    graphic(): string {
        return `
            <path d="M ${this.start.x} ${this.start.y} A ${this.mid.x} ${this.mid.y} 0 0 1 ${this.end.x} ${this.end.y}"
                stroke-width="${this.stroke.width}" stroke="${this.stroke.color}" fill="${this.fill.color}"
            />
        `;
    }
}