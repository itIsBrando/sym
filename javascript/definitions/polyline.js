class dPolyline extends Definition {
    constructor(tok) {
        super(tok);
        this.points = Coordinate.list(tok.key("pts"));
        this.stroke = new dStroke(tok.key('stroke'));
        this.fill = new dFill(tok.key('fill'));
    }
    graphic() {
        let points = ``;
        for (let i = 0; i < this.points.length; i++) {
            points += `${this.points[i].x} ${this.points[i].y} `;
        }
        return `<polyline ${this.fill.fill()} ${this.stroke.stroke()}
        stroke-linejoin="round" stroke-linecap="round"
        points="${points}"></polyline>`;
    }
}
