
class dEffects extends Definition {
    face: string;
    height: number;
    thickness: number;
    is_bold: boolean;
    is_italic: boolean;
    line_spacing: number = 1; // not implemented
    justifiy: string;
    hidden: boolean;

    constructor(tok: Tok) {
        const font = tok.key('font');
        super(tok);

        this.face = font.key('face')?.params[0].asStr() ?? 'default';
        this.height= font.key('size').params[0].asNum() ;
        this.thickness = font.key('thickness')?.params[0].asNum() ?? 20; // @todo initial value
        this.justifiy = 'left'; // @todo
        this.is_bold = tok.hasStr('bold');
        this.is_italic = tok.hasStr('italic');
        this.hidden = tok.hasStr('hide');

    }

    text(text: string, x: number = 0, y: number = 0): string {
        // @todo thickness, bold, italic
        if(this.hidden) return '';
        return `
            <text transform="translate(${x} ${y})" font-size="${this.height}">${text}</text>
        `;
    }
}


