class dWire extends Definition {
    constructor(a) {
        if (a instanceof Tok) {
            const tok = a;
            super(tok);
            this.points = Coordinate.list(a.key("pts"));
            this.stroke = new dStroke(a.key('stroke'));
        }
        else {
            const pts = a;
            super(new Tok("wire"));
            this.points = pts;
            this.stroke = new dStroke();
        }
    }
    graphic() {
        return `<polyline ${this.stroke.stroke()}
        stroke-linejoin="round" stroke-linecap="round"
        points="${Coordinate.listToString(this.points)}`;
    }
}
