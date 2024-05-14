var Justify;
(function (Justify) {
    Justify[Justify["left"] = 1] = "left";
    Justify[Justify["right"] = 2] = "right";
    Justify[Justify["top"] = 4] = "top";
    Justify[Justify["bottom"] = 8] = "bottom";
})(Justify || (Justify = {}));
;
class dEffects extends Definition {
    constructor(tok) {
        var _a, _b, _c, _d;
        const font = tok.key('font');
        super(tok);
        this.line_spacing = 1; // not implemented
        this.face = (_b = (_a = font.key('face')) === null || _a === void 0 ? void 0 : _a.params[0].asStr()) !== null && _b !== void 0 ? _b : 'default';
        this.height = font.key('size').params[0].asNum();
        this.thickness = (_d = (_c = font.key('thickness')) === null || _c === void 0 ? void 0 : _c.params[0].asNum()) !== null && _d !== void 0 ? _d : 0.2540;
        this.justify = Justify.left; // @todo
        this.is_bold = tok.hasStr('bold');
        this.is_italic = tok.hasStr('italic');
        this.hidden = tok.hasStr('hide');
    }
    text(text, x = 0, y = 0, rotate = 0) {
        // @todo thickness, bold, italic
        if (this.hidden)
            return '';
        return `
            <text transform="translate(${x} ${y}) ${rotate != 0 ? 'rotate(90)' : ''}" font-size="${this.height}">${text}</text>
        `;
    }
}
