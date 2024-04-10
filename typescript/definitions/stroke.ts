
class dStroke {
    width: number = 0.1;
    type: string;
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
        const w = tok.key('width')!.params[0].asNum();
        this.width = w == 0 ? 0.1 : w;
        this.type = tok.key('type')!.params[0].asStr();
        this.color = Color.tStroke;
        this.dash = this.strokeType();
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