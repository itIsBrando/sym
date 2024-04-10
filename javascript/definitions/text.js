class dText extends Definition {
    constructor(tok) {
        super(tok);
        this.text = tok.params[0].asStr();
        this.position = Coordinate.pos(tok.params[1].asTok());
        this.effects = new dEffects(tok.key('effects'));
    }
    graphic() {
        return this.effects.text(this.text, this.position.x, this.position.y);
    }
}
