class dProperty extends Definition {
    constructor(tok) {
        super(tok);
        this.key = tok.params[0].asStr();
        this.value = tok.params[1].asStr();
        this.position = Coordinate.pos(tok.key('at'));
        this.effects = new dEffects(tok.key('effects'));
    }
}
