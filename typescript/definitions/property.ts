class dProperty extends Definition {
    key: string;
    value: string;
    position: Coordinate;
    effects: dEffects;

    constructor(tok: Tok) {
        super(tok);

        this.key = tok.params[0].asStr();
        this.value = tok.params[1].asStr();
        this.position = Coordinate.pos(tok.key('at'));
        this.effects = new dEffects(tok.key('effects'));

    }

    graphic(): string {
        return this.effects.text(this.value, this.position.x, this.position.y);
    }
}