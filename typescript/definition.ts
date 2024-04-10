class Coordinate {
    x: number;
    y: number;
    radians: number;

    constructor(x: number, y: number, degrees: number = 0) {
        this.x = x;
        this.y = y;
        this.radians = degrees * Math.PI / 180;
    }

    toString():string {
        return `(${this.x}, ${this.y})`;
    }

    rx() {
        return Math.cos(this.radians);
    }

    ry() {
        return Math.sin(this.radians);
    }

    dist(b: Coordinate) {
        return Math.sqrt(
            Math.pow(this.x - b.x, 2) +
            Math.pow(this.y - b.y, 2)
          );
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
    static tFill = new Color(100, 200, 255, 100);
    static tStroke = new Color(0, 0, 0);
    static tPin = Color.tStroke;

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
            case 'rectangle': return new dRect(tok);
            case 'text': return new dText(tok);
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
        return `${this.name}_${this.unit}_${this.style}`;
    }

    constructor(id: string) {
        const a = id.split('_');
        this.name = id.slice(0, id.length-4);
        this.unit = parseInt(a[a.length - 2]);
        this.style = parseInt(a[a.length - 1]);
    }

    get type(): string {
        return String.fromCharCode(65 + this.unit - 1);
    }
}
