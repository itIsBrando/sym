class Coordinate {
    constructor(x, y, degrees = 0) {
        this.x = x;
        this.y = y;
        this.radians = degrees * Math.PI / 180;
    }
    rx() {
        return Math.cos(this.radians);
    }
    ry() {
        return Math.sin(this.radians);
    }
    /**
     * Accepts an 'at x y [angle]' tok
     */
    static pos(tok) {
        var _a, _b;
        return new Coordinate(tok.params[0].asNum(), tok.params[1].asNum(), (_b = (_a = tok.params[2]) === null || _a === void 0 ? void 0 : _a.asNum()) !== null && _b !== void 0 ? _b : 0);
    }
    /**
     * Accepts a 'xy' tok
     */
    static point(tok) {
        return new Coordinate(tok.params[0].asNum(), tok.params[1].asNum());
    }
    /**
     * Accepts a 'pts' tok
     */
    static list(tok) {
        let out = [];
        console.assert(tok.id == "pts", `Unable to create points list from ${tok}`);
        for (let i = 0; i < tok.params.length; i++) {
            out.push(Coordinate.point(tok.params[i].asTok()));
        }
        return out;
    }
}
class Color {
    constructor(r, g, b, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    get html() {
        return `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
    toString() {
        return this.html;
    }
}
Color.black = new Color(0, 0, 0);
Color.green = new Color(0, 255, 100);
Color.clear = new Color(0, 0, 0, 0);
Color.tFill = new Color(0, 200, 255);
Color.tStroke = new Color(0, 0, 0);
Color.tPin = new Color(200, 40, 20);
class Definition {
    constructor(tok) {
        this.tok = tok;
    }
    static generate(tok, parentSymbol) {
        switch (tok.id) {
            case 'symbol': return new dSymbol(tok, parentSymbol);
            case 'polyline': return new dPolyline(tok);
            case 'pin': return new dPin(tok, parentSymbol);
            case 'property': return new dProperty(tok);
            case 'circle': return new dCircle(tok);
            case 'arc': return new dArc(tok);
            default:
                // console.log(`[Definition]: Tok ${tok.id} is not implemented`);
                return new Definition(tok);
        }
    }
    graphic() {
        return ``;
    }
}
class UnitId {
    constructor(id) {
        const a = id.split('_');
        this.name = id.slice(0, id.length - 4);
        this.unit = parseInt(a[a.length - 1]);
        this.style = parseInt(a[a.length - 2]);
    }
    toString() {
        return `[UnitID]: ${this.name}_${this.unit}_${this.style}`;
    }
    get type() {
        return String.fromCharCode(65 + this.unit - 1);
    }
}
class dEffects extends Definition {
    constructor(tok) {
        var _a, _b, _c, _d;
        const font = tok.key('font');
        super(tok);
        this.line_spacing = 1; // not implemented
        this.face = (_b = (_a = font.key('face')) === null || _a === void 0 ? void 0 : _a.params[0].asStr()) !== null && _b !== void 0 ? _b : 'default';
        this.height = font.key('size').params[0].asNum();
        this.thickness = (_d = (_c = font.key('thickness')) === null || _c === void 0 ? void 0 : _c.params[0].asNum()) !== null && _d !== void 0 ? _d : 20; // @todo initial value
        this.justifiy = 'left'; // @todo
        this.is_bold = tok.hasStr('bold');
        this.is_italic = tok.hasStr('italic');
        this.hidden = tok.hasStr('hide');
    }
    text(text, x = 0, y = 0) {
        // @todo thickness, bold, italic
        if (this.hidden)
            return '';
        return `
            <text transform="translate(${x} ${y})" font-size="${this.height}">` + text + `</text>
        `;
    }
}
class dSymbol extends Definition {
    constructor(tok, parent) {
        var _a, _b, _c, _d;
        super(tok);
        this.defs = [];
        this.library_id = "";
        this.selected_unit = 1; // only valid for parents
        this.in_bom = false; // @todo
        this.on_board = false; // @todo
        this.unit_name = "";
        const id = tok.params[0].asStr();
        // determine whether we are a parent symbol or a child
        this.is_child = parent != undefined;
        this.parent = parent;
        if (this.is_child) {
            this.unit_id = new UnitId(id);
        }
        else {
            this.library_id = id;
        }
        // pin stuff
        const numObj = tok.key('pin_numbers');
        const nameObj = tok.key('pin_names');
        this.pin_num_hidden = (_b = (_a = numObj === null || numObj === void 0 ? void 0 : numObj.hasStr('hide')) !== null && _a !== void 0 ? _a : parent === null || parent === void 0 ? void 0 : parent.pin_num_hidden) !== null && _b !== void 0 ? _b : false;
        this.pin_name_hidden = (_d = (_c = nameObj === null || nameObj === void 0 ? void 0 : nameObj.hasStr('hide')) !== null && _c !== void 0 ? _c : parent === null || parent === void 0 ? void 0 : parent.pin_name_hidden) !== null && _d !== void 0 ? _d : false;
        // create a definition for all children
        for (let i = 0; i < tok.params.length; i++) {
            if (tok.params[i].type == ParameterType.Token) {
                this.defs.push(Definition.generate(tok.params[i].asTok(), this));
            }
        }
    }
    /**
     * Sets the unit number for symbols that have multiple symbols.
     * This function only works on parent symbols, otherwise it has no effect.
     *
     */
    unit(unit) {
        this.selected_unit = unit;
    }
    property(key) {
        for (let i = 0; i < this.defs.length; i++) {
            if (this.defs[i] instanceof dProperty) {
                const p = this.defs[i];
                if (p.key == key)
                    return p.value;
            }
        }
        return null;
    }
    export() {
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.innerHTML = this.graphic();
        return svg;
    }
    graphic() {
        let out = '';
        for (let i = 0; i < this.defs.length; i++) {
            // skip over shit if we are not the selected unit
            if (this.defs[i] instanceof dSymbol) {
                const childSym = this.defs[i];
                if (childSym.unit_id.unit != 0 && this.selected_unit != childSym.unit_id.unit) {
                    console.log("SKIPPED", childSym.unit_id, this.selected_unit);
                    continue;
                }
            }
            out += this.defs[i].graphic();
        }
        return out;
    }
}
