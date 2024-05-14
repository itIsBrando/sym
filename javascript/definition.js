class Coordinate {
    constructor(x, y, degrees = 0) {
        this.x = x;
        this.y = -y;
        this.radians = degrees * Math.PI / 180;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
    rx() {
        return Math.cos(this.radians);
    }
    ry() {
        return -Math.sin(this.radians);
    }
    dist(b) {
        return Math.sqrt(Math.pow(this.x - b.x, 2) +
            Math.pow(this.y - b.y, 2));
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
Color.tFill = new Color(100, 200, 255, 100);
Color.tStroke = new Color(0, 0, 0);
Color.tPin = Color.tStroke;
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
            case 'rectangle': return new dRect(tok);
            case 'text': return new dText(tok);
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
        this.unit = parseInt(a[a.length - 2]);
        this.style = parseInt(a[a.length - 1]);
    }
    toString() {
        return `${this.name}_${this.unit}_${this.style}`;
    }
    get type() {
        return String.fromCharCode(65 + this.unit - 1);
    }
}
