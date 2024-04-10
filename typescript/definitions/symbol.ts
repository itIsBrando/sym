class dSymbol extends Definition {
    private static cnt = 0;
    unique_id: string = ""; // unique identifier for interfacing with DOM
    defs: Definition[] = [];
    library_id: string = "";
    unit_id?: UnitId;   // only valid for childrens
    num_units = 0; // only valid for parents with children with multiple units
    selected_unit = 1;  // only valid for parents

    parent?: dSymbol;
    is_child: boolean;
    in_bom: boolean = false;    // @todo
    on_board: boolean = false;  // @todo
    pin_num_hidden: boolean;
    pin_name_hidden: boolean;

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
                const def = Definition.generate(tok.params[i].asTok(), this);
                // @todo check if this definition is a symbol, if so
                //  we should check to see if the child has a different UNIT
                //  then we will update a counter in the parent (this object)
                //  that will says how many units are here
                if(def instanceof dSymbol) {
                    const s = def as dSymbol;
                    this.num_units = Math.max(s.unit_id!.unit, this.num_units);
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
        this.unique_id = `${this.library_id}_${dSymbol.cnt++}`;
        svg.id = this.unique_id;

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