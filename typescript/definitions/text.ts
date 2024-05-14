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

    offsetX(): number {
        const j = this.effects.justify;
        const w = this.text.length;

        if(j & Justify.left)
            return -w;
        else if(j & Justify.right)
            return 0;
        else
            return w / 2;
    }

    offsetY(): number {
        return 0;
    }

    graphic(): string {
        return this.effects.text(this.text, this.position.x, this.position.y, this.position.radians);
    }
}