class dCircle extends Definition {
    center: Coordinate
    radius: number
    stroke: dStroke
    fill: dFill

    constructor(tok: Tok) {
        super(tok);

        this.center = Coordinate.point(tok.params[0].asTok());
        this.radius = tok.params[1].asTok().params[0].asNum();
        this.stroke = new dStroke(tok.key('stroke'));
        this.fill = new dFill(tok.key('fill'));
    }

    graphic(): string {
        return `
        <circle cx="${this.center.x}" cy="${this.center.y}" r="${this.radius}"
            fill="${this.fill.color}" stroke="${this.stroke.color}" stroke-width="${this.stroke.width}"
        />
        `;
    }
}