class Coordinate {
    x: number;
    y: number;
    radians: number;

    constructor(x: number, y: number, degrees: number = 0) {
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
    static pos(tok: Tok) {
        return new Coordinate(tok.params[0].asNum(), tok.params[1].asNum(), tok.params[2]?.asNum() ?? 0);
    }

    /**
     * Accepts a 'xy' tok
     */
    static point(tok: Tok) {
        return new Coordinate(tok.params[0].asNum(), tok.params[1].asNum());
    }

    /**
     * Accepts a 'pts' tok
     */
    static list(tok: Tok) {
        let out: Coordinate[] = [];
        console.assert(tok.id == "pts", `Unable to create points list from ${tok}`);
        for(let i = 0; i < tok.params.length; i++) {
            out.push(Coordinate.point(tok.params[i].asTok()));
        }

        return out;
    }
}

class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    static black = new Color(0, 0, 0);
    static green = new Color(0, 255, 100);
    static clear = new Color(0, 0, 0, 0);
    static tFill = new Color(0, 200, 255);
    static tStroke = new Color(0, 0, 0);
    static tPin = new Color(200, 40, 20);

    get html(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    toString(): string{
        return this.html;
    }

    constructor(r: number, g: number, b: number, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

class Definition {
    tok: Tok;
    static generate(tok: Tok, parentSymbol?: dSymbol): Definition {
        switch(tok.id) {
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

    constructor(tok: Tok) {
        this.tok = tok;
    }

    graphic() {
        return ``;
    }
}


class UnitId {
    name: string;
    unit: number;
    style: number;

    toString(): string {
        return `[UnitID]: ${this.name}_${this.unit}_${this.style}`;
    }

    constructor(id: string) {
        const a = id.split('_');
        this.name = id.slice(0, id.length-4);
        this.unit = parseInt(a[a.length - 1]);
        this.style = parseInt(a[a.length - 2]);
    }

    get type(): string {
        return String.fromCharCode(65 + this.unit - 1);
    }
}

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
            <text transform="translate(${x} ${y})" font-size="${this.height}">`+text+`</text>
        `;
    }
}



class dSymbol extends Definition {
    defs: Definition[] = [];
    library_id: string = "";
    unit_id?: UnitId;   // only valid for childrens
    selected_unit = 1;  // only valid for parents
    parent?: dSymbol;
    is_child: boolean;
    in_bom: boolean = false;    // @todo
    on_board: boolean = false;  // @todo
    pin_num_hidden: boolean;
    pin_name_hidden: boolean;
    unit_name: string = "";

    constructor(tok: Tok, parent?: dSymbol) {
        super(tok);
        const id = tok.params[0].asStr();

        // determine whether we are a parent symbol or a child
        this.is_child = parent != undefined;
        this.parent = parent;

        if(this.is_child) {
            this.unit_id = new UnitId(id);
        } else {
            this.library_id = id;
        }

        // pin stuff
        const numObj = tok.key('pin_numbers');
        const nameObj = tok.key('pin_names');
        this.pin_num_hidden = numObj?.hasStr('hide') ?? parent?.pin_num_hidden ?? false;
        this.pin_name_hidden = nameObj?.hasStr('hide') ?? parent?.pin_name_hidden ?? false;

        // create a definition for all children
        for(let i = 0; i < tok.params.length; i++) {
            if(tok.params[i].type == ParameterType.Token) {
                this.defs.push(Definition.generate(tok.params[i].asTok(), this));
            }
        }
    }

    /**
     * Sets the unit number for symbols that have multiple symbols.
     * This function only works on parent symbols, otherwise it has no effect.
     *
     */
    unit(unit: number) {
        this.selected_unit = unit;
    }

    property(key: string): string {
        for(let i = 0; i < this.defs.length; i++) {
            if(this.defs[i] instanceof dProperty) {
                const p = this.defs[i] as dProperty;
                if(p.key == key)
                    return p.value;
            }
        }

        return null;
    }


    export(): SVGSVGElement {
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.innerHTML = this.graphic();

        return svg;
    }


    graphic(): string {
        let out = '';

        for(let i = 0; i < this.defs.length; i++) {
            // skip over shit if we are not the selected unit
            if(this.defs[i] instanceof dSymbol) {
                const childSym = this.defs[i] as dSymbol;

                if(childSym.unit_id.unit != 0 && this.selected_unit != childSym.unit_id!.unit) {
                    console.log("SKIPPED", childSym.unit_id, this.selected_unit);
                    continue;
                }
            }

            out += this.defs[i].graphic();
        }

        return out;
    }
}