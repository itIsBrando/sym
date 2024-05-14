class dSymbol extends Definition {
    constructor(tok, parent) {
        var _a, _b, _c, _d;
        super(tok);
        this.unique_id = ""; // unique identifier for interfacing with DOM
        this.defs = [];
        this.library_id = "";
        this.num_units = 0; // only valid for parents with children with multiple units
        this.selected_unit = 1; // only valid for parents
        this.in_bom = false; // @todo
        this.on_board = false; // @todo
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
                const def = Definition.generate(tok.params[i].asTok(), this);
                // @todo check if this definition is a symbol, if so
                //  we should check to see if the child has a different UNIT
                //  then we will update a counter in the parent (this object)
                //  that will says how many units are here
                if (def instanceof dSymbol) {
                    const s = def;
                    this.num_units = Math.max(s.unit_id.unit, this.num_units);
                }
                this.defs.push(def);
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
        this.unique_id = `${this.library_id}_${dSymbol.cnt++}`;
        svg.id = this.unique_id;
        return svg;
    }
    graphic() {
        var _a, _b;
        let out = '';
        for (let i = 0; i < this.defs.length; i++) {
            let shouldAppend = true;
            // skip over shit if we are not the selected unit
            if (this.defs[i] instanceof dSymbol) {
                const childSym = this.defs[i];
                const style = (_b = (_a = childSym.unit_id) === null || _a === void 0 ? void 0 : _a.style) !== null && _b !== void 0 ? _b : 1;
                if (style != 1 && style != 0)
                    shouldAppend = false;
                if (childSym.unit_id.unit != 0 && this.selected_unit != childSym.unit_id.unit) {
                    console.log("SKIPPED", childSym.unit_id, this.selected_unit);
                    shouldAppend = false;
                }
            }
            if (shouldAppend)
                out += this.defs[i].graphic();
        }
        return out;
    }
}
dSymbol.cnt = 0;
