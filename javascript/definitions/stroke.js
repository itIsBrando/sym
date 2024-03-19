class dStroke {
    constructor(tok) {
        this.width = 12;
        this.width = Math.max(tok.key('width').params[0].asNum(), 0.1);
        this.type = tok.key('type').params[0].asStr();
        this.color = Color.tStroke;
        this.dash = this.strokeType();
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
}
