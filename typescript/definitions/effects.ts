enum Justify {
    left = 1, right = 2, top = 4, bottom = 8
};


class dEffects extends Definition {
    face: string;
    height: number;
    thickness: number;
    is_bold: boolean;
    is_italic: boolean;
    line_spacing: number = 1; // not implemented
    justify: Justify;
    hidden: boolean;

    constructor(tok: Tok) {
        const font = tok.key('font');
        super(tok);

        this.face = font.key('face')?.params[0].asStr() ?? 'default';
        this.height= font.key('size').params[0].asNum() ;
        this.thickness = font.key('thickness')?.params[0].asNum() ?? 0.2540;
        this.justify = Justify.left; // @todo
        this.is_bold = tok.hasStr('bold');
        this.is_italic = tok.hasStr('italic');
        this.hidden = tok.hasStr('hide');

    }

    text(text: string, x: number = 0, y: number = 0, rotate: number = 0): string {
        // @todo thickness, bold, italic
        if(this.hidden) return '';
        return `
            <text transform="translate(${x} ${y}) ${rotate != 0 ? 'rotate(90)' : ''}" font-size="${this.height}">${text}</text>
        `;
    }
}


