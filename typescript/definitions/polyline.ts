class dPolyline extends Definition {
    points: Coordinate[];
    stroke: dStroke;
    fill: dFill;

    constructor(tok: Tok) {
        super(tok);
        this.points = Coordinate.list(tok.key("pts")!);
        this.stroke = new dStroke(tok.key('stroke')!);
        this.fill = new dFill(tok.key('fill')!);
    }

    graphic(): string {
        const points = Coordinate.listToString(this.points);

        return `<polyline ${this.fill.fill()} ${this.stroke.stroke()}
        stroke-linejoin="round" stroke-linecap="round"
        points="${points}"></polyline>`;
    }
}