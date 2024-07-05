class dStroke {
    constructor(a) {
        this.width = 0.1;
        if (a === undefined) {
            this.width = 0.0001; // @todo
            this.type = 'default';
            this.color = Color.tStroke;
            this.dash = this.strokeType();
        }
        else {
            const tok = a;
            const w = tok.key('width').params[0].asNum();
            this.width = w;
            if (this.width < 0)
                this.width = 0; // TODO
            this.type = tok.key('type').params[0].asStr();
            this.color = Color.tStroke; // @todo
            this.dash = this.strokeType();
        }
    }
    strokeType() {
        switch (this.type) {
            case 'dash': return '5 5';
            case 'dash_dot': return '5 5 1 5';
            case 'dash_dot_dot': return '5 5 1 5 1 5';
            case 'dot': return '1 5';
            case 'default':
            case 'solid':
            default:
                return '1 0';
        }
    }
    /**
     * Generates needed information that should be embedded inside an svg elem
     */
    stroke() {
        return `stroke="${this.color.html}" stroke-opacity="${this.color.a / 255}"
        stroke-width="${this.width}" dasharray="${this.dash}"
        `;
    }
}
