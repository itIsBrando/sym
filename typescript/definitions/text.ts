class dText extends Definition {
    text: string;
    position: Coordinate;
    effects: dEffects;

    constructor(tok: Tok) {
        super(tok);
        this.text = tok.params[0].asStr();
        this.position = Coordinate.pos(tok.params[1].asTok());
        this.effects = new dEffects(tok.key('effects'));
    }

    graphic(): string {
        return this.effects.text(this.text, this.position.x, this.position.y);
    }
}