
class dStroke {
    width: number = 12;
    type: string; // @todo
    dash: string;
    color: Color;

    strokeType() {
        switch(this.type) {
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

    constructor(tok: Tok) {
        this.width = Math.max(tok.key('width')!.params[0].asNum(), 0.1);
        this.type = tok.key('type')!.params[0].asStr();
        this.color = Color.tStroke;
        this.dash = this.strokeType();
    }
}