class dFill extends Definition {
    constructor(tok) {
        super(tok);
        this.type = tok.key('type').params[0].asStr();
    }
    get color() {
        switch (this.type) {
            case "outline":
                return Color.tStroke;
            case "background":
                return Color.tFill;
            default:
                return Color.clear;
        }
    }
}
