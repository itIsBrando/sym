class dFill extends Definition {
    type: String;

    get color() {
        switch(this.type) {
            case "outline":
                return Color.tStroke;
            case "background":
                return Color.tFill;
            default:
                return Color.clear;
        }
    }

    constructor(tok: Tok) {
        super(tok);
        this.type = tok.key('type')!.params[0].asStr();
    }
}