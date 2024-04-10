var canvas = document.getElementById('canvas');
var Editor = new function () {
    let symbols = [];
    this.x = 0;
    this.y = 0;
    this.w = 70;
    this.h = 70;
    this.place = function (sym) {
        if (sym.num_units > 1) {
            sym.unit(2);
            console.log(`Sym has ${sym.num_units} units`);
        }
        let svg = sym.export();
        svg.setAttribute('transform', `translate(35, 35)`);
        canvas.appendChild(svg);
        let boundingBox = svg.getBBox({ stroke: true, markers: true, clipped: true });
        let x = Math.floor(boundingBox.x), y = Math.floor(boundingBox.y);
        let w = Math.ceil(boundingBox.width), h = Math.ceil(boundingBox.height);
        svg.setAttribute('width', `${w - x}`);
        svg.setAttribute('height', `${h - y}`);
        svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
        symbols.push(sym);
    };
    /**
     * @returns finds a symbol given a unique id
    */
    this.searchSym = function (unique_id) {
        for (let i = 0; i < symbols.length; i++) {
            if (symbols[i].unique_id == unique_id)
                return symbols[i];
        }
        // this.symbols.forEach(s => {
        //     if(s.unique_id == unique_id)
        //         return s;
        // });
        return null;
    };
    this.setViewBox = function (x, y, w, h) {
        this.x = x, this.y = y;
        this.w = w, this.h = h;
        canvas.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
    };
    this.zoomIn = function () {
        const d = 1.1;
        this.setViewBox(this.x * d, this.y * d, this.w * d, this.h * d);
    };
    this.zoomOut = function () {
        const d = 0.9;
        this.setViewBox(this.x * d, this.y * d, this.w * d, this.h * d);
    };
    this.pan = function (dx, dy) {
        this.setViewBox(this.x + dx, this.y + dy, this.w, this.h);
    };
};
