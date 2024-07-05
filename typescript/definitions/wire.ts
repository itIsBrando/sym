class dWire extends Definition {
    points: Coordinate[];
    stroke: dStroke;

    constructor(a: Tok);
    constructor(a: Coordinate[]);

    constructor(a?: Tok | Coordinate[]) {
        if( a instanceof Tok) {
            const tok = a as Tok;
            super(tok);
            this.points = Coordinate.list(a.key("pts")!);
            this.stroke = new dStroke(a.key('stroke')!);
        } else {
            const pts = a as Coordinate[];
            super(new Tok("wire"));
            this.points = pts;
            this.stroke = new dStroke();
        }
    }

    graphic(): string {
        return `<polyline ${this.stroke.stroke()}
        stroke-linejoin="round" stroke-linecap="round"
        points="${Coordinate.listToString(this.points)}`;
    }
}