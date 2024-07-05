var canvas = document.getElementById('canvas');
let bottomBar = document.getElementById('bottomBar');


enum eState {
    Idle,       // no user interaction
    Pan,        // this occurs when user is panning the canvas
    Select,     // this is when the user is selecting multiple items
    Context,    // this is equivalent to a right click
    Zoom,       // optional state occurring when a user is scrolling
    Down,       // this state occurs when the mouse is clicked or a finger touches the screen but no movement has occurred yet
    Moving,     // this state is to represent any sort of dragging of an element whereas panning only refers to moving the canvas
};

enum eTool { // these tools correspond to the items on the toolbar
    None,       // no tool selected. clicking on a symbol will bring up details on it.
    Wiring,     // placing wire
    Label,      // placing local label
    GlobalLabel,// placing global label
    Delete,     // removing components
}

/**
 * These states will look different based on the input methods
 * ex: maybe mouse will not ever enter zoom
 */


var Editor = new function() {
    let symbols: dSymbol[] = [];
    this.inputType = InputType.Mouse;
    this.state = eState.Idle;
    this.control = new Control();
    this.tool = eTool.None;
    this.target = null;
    this.x = 0;
    this.y = 0;
    this.w = 70;
    this.h = 70;
    this.scale = 1;
    this.cur_touches = [];
    this.toolElems = {
        [eTool.None]: null,
        [eTool.Wiring]: document.getElementById('toolbarWire'),
        [eTool.Label]: document.getElementById('toolbarLabel'),
        [eTool.GlobalLabel]: document.getElementById('toolbarGLabel'),
        [eTool.Delete]: document.getElementById('toolbarDelete'),
    };

    this.init = function() {

    }

    this.place = function(sym: dSymbol, unitNum: number = 1) {
        // Set unit number
        sym.unit(unitNum);

        let svg = sym.export();
        svg.setAttribute('transform', `translate(35, 35)`);
        canvas.appendChild(svg);

        let boundingBox = svg.getBBox({stroke: true, markers: true, clipped: true});
        // let x = Math.floor(boundingBox.x), y = Math.floor(boundingBox.y);
        // let w = Math.ceil(boundingBox.width), h = Math.ceil(boundingBox.height);
        let x = parseFloat(boundingBox.x.toFixed(2)), y = parseFloat(boundingBox.y.toFixed(2));
        let w = parseFloat(boundingBox.width.toFixed(2)), h = parseFloat(boundingBox.height.toFixed(2));
        x -= 0.3; y -= 0.3;
        w += 0.3; h += 0.3;
        console.log(boundingBox);
        svg.setAttribute('width', `${w - x}`);
        svg.setAttribute('height', `${h - y}`);
        svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);

        symbols.push(sym);
    }



    /**
     * @returns finds a symbol given a unique id
    */
    this.searchSym = function(unique_id) {
        for(let i = 0; i < symbols.length; i++) {
            if(symbols[i].unique_id == unique_id)
                return symbols[i];
        }
        // this.symbols.forEach(s => {
        //     if(s.unique_id == unique_id)
        //         return s;
        // });

        return null;
    }

    this.setViewBox = function(x: number, y: number, w: number, h: number) {
        this.x = x, this.y = y;
        this.w = w, this.h = h;
        canvas.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
    }

    this.zoomIn = function() {
        const d = 1.1;
        this.scale *= d;
        this.setViewBox(this.x, this.y, this.w * d, this.h * d);
        this.setBottomBar();
    }

    this.zoomOut = function() {
        const d = 0.9;
        this.scale *= d;
        this.setViewBox(this.x, this.y, this.w * d, this.h * d);
        this.setBottomBar();
    }

    this.pan = function(dx: number, dy: number) {
        this.setViewBox(this.x + dx * this.scale, this.y + dy * this.scale, this.w, this.h);
        this.setBottomBar();
    }

    /**
     * Action click. Occurs when the canvas is clicked or tapped
     */
    this.aClick = function() {
        const sym = Editor.searchSym(Editor.target.parentElement.id);
        symbolDetails.hide();

        switch(this.tool) {
            case eTool.None:
                if(sym)
                    symbolDetails.show(sym);
                else {
                    console.log(`[Editor]: Symbol Not Found: ${Editor.target.parentElement.id}!!`);
                }
                break;
            case eTool.Wiring:
                console.log('Wiring');
                break;
        }
    }


    /* why the hell does this not work on safari >:(
     * @todo
     * nothing works on safari and it makes no sense. goshdang issue with transform ig
     */
    this.moveUnit = function(target: any, dx: number, dy: number) {
        const ratiox = this.w / canvas.clientWidth, ratioy = (this.h) / canvas.clientHeight;
        const curx = parseFloat((target.parentElement.getAttribute('transform') || "translate(0,0)").split(',')[0].slice(10));
        const cury = parseFloat((target.parentElement.getAttribute('transform') || "translate(0,0)").split(',')[1].slice(0, -1));

        target.parentElement.setAttribute('transform', `translate(${curx + dx * ratiox}, ${cury + ratioy * dy})`);
    }


    /**
     * Updates the text at the bottom of the screen
     */
    this.setBottomBar = function() {
        bottomBar.innerHTML = `x: ${this.x.toFixed(2)} y: ${this.y.toFixed(2)}`;
    }


    this.setState = function(s: eState) {
        this.state = s;
    }

    this.setTool = function(t: eTool) {
        // update the toolbar's GUI
        for(const key of Object.keys(this.toolElems)) {
            if(this.toolElems[key] == null)
                continue;
            else if(t == (Number(key) as eTool)) {
                this.toolElems[key].classList.add('btn-default-active');
            } else {
                this.toolElems[key].classList.remove('btn-default-active');
            }
        }

        this.tool = t;
    }

    this.toggleTool = function(t: eTool) {
        if(this.tool == t) {
            this.setTool(eTool.None);
        } else {
            this.setTool(t);
        }
    }


    this.setInputType = function(input: InputType) {
        this.inputType = input;

        this.control.setInputType(input);
    }
}