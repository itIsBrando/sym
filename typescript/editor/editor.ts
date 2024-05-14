var canvas = document.getElementById('canvas');


enum InputType {
    Mouse,
    Pencil,
};


enum eState {
    Idle,       // no user interaction
    Pan,        // this occurs when user is panning the canvas
    Select,     // this is when the user is selecting multiple items
    Context,    // this is equivalent to a right click
    Zoom,       // optional state occurring when a user is scrolling
    Down,       // this state occurs when the mouse is clicked or a finger touches the screen but no movement has occurred yet
    Moving,     // this state is to represent any sort of dragging of an element whereas panning only refers to moving the canvas
};

/**
 * These states will look different based on the input methods
 * ex: maybe mouse will not ever enter zoom
 */


var Editor = new function() {
    let symbols: dSymbol[] = [];
    this.inputType = InputType.Mouse;
    this.state = eState.Idle;
    this.target = null;
    this.x = 0;
    this.y = 0;
    this.w = 70;
    this.h = 70;
    this.cur_touches = [];

    this.prev_client_x = 0;
    this.prev_client_y = 0;

    this.hasTouch = function(): boolean {
        return 'ontouchstart' in window;
    }

    this.init = function() {
        this.setInputType(this.hasTouch() ? InputType.Pencil : InputType.Mouse);
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

    this.setViewBox = function(x, y, w, h) {
        this.x = x, this.y = y;
        this.w = w, this.h = h;
        canvas.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
    }

    this.zoomIn = function() {
        const d = 1.1;

        this.setViewBox(this.x * d, this.y * d, this.w * d, this.h * d);
    }

    this.zoomOut = function() {
        const d = 0.9;
        this.setViewBox(this.x * d, this.y * d, this.w * d, this.h * d);
    }

    this.pan = function(dx: number, dy: number) {
        this.setViewBox(this.x + dx, this.y + dy, this.w, this.h);
    }

    this.mMouseDown = function(e: MouseEvent) {
        this.target = e.target;
        this.setState(eState.Down);
        this.prev_client_x = e.clientX;
        this.prev_client_y = e.clientY;
    }

    this.mMouseMove = function(e: MouseEvent) {
        if(this.state == eState.Idle)
            return;

        const ox = (e.clientX - this.prev_client_x);
        const oy = (e.clientY - this.prev_client_y);


        switch(this.state) {
            case eState.Moving:
                // if we are moving an element
                this.moveUnit(this.target, ox, oy);
                break;
            case eState.Pan:
                // if we are moving the entire canvas
                this.pan(this.prev_client_x - e.clientX, this.prev_client_y - e.clientY);
                break;
            case eState.Down:
                // if we are selecting the canvas, pan. if we are selecting an elem, move
                this.setState(e.target == canvas ? eState.Pan : eState.Moving);
        }

        this.prev_client_x = e.clientX;
        this.prev_client_y = e.clientY;
    }

    // why the hell does this not work on safari >:(
    // nothing works on safari and it makes no sense. goshdang issue with transform ig
    this.moveUnit = function(target: any, dx: number, dy: number) {
        const ratiox = this.w / canvas.clientWidth, ratioy = (this.h) / canvas.clientHeight;
        const curx = parseFloat((target.parentElement.getAttribute('transform') || "translate(0,0)").split(',')[0].slice(10));
        const cury = parseFloat((target.parentElement.getAttribute('transform') || "translate(0,0)").split(',')[1].slice(0, -1));

        target.parentElement.setAttribute('transform', `translate(${curx + dx * ratiox}, ${cury + ratioy * dy})`);
    }


    this.mMouseUp = function(e: MouseEvent) {
        const sym = Editor.searchSym(this.target.parentElement.id);

        switch(this.state) {
            case eState.Down:
                if(sym)
                    symbolDetails.show(sym);
                else {
                    symbolDetails.hide();
                    console.log(`[Editor]: Symbol Not Found: ${this.target.parentElement.id}!!`);
                }
                break;
        }

        this.setState(eState.Idle);
    }

    this.pTouchStart = function(e: TouchEvent) {
        e.preventDefault();
        const touches = e.changedTouches;

        for(let i = 0; i < touches.length; i++) {
            this.cur_touches.push(touches[i]);

            if((touches[i] as any).touchType == 'stylus') {
                this.state = eState.Down;
                this.target = e.target;
            }
        }
    }


    this.pTouchMove = function(e: TouchEvent) {
        e.preventDefault();
        const touches = e.changedTouches;

        for(let i = 0; i < touches.length; i++) {
            const t: any = touches[i];
            const idx = this.pGetTouchById(t.identifier);
            const prevT = this.cur_touches[idx];

            if(t.touchType == 'stylus') {
                switch(this.state) {
                    case eState.Down:
                        this.state = eState.Moving;
                    case eState.Moving:
                        this.moveUnit(this.target, 4, 4);
                        // this.moveUnit(this.target, prevT.clientX - t.clientX, prevT.clientY - t.clientY);
                        console.log('Hello?', this.target.parentElement);
                        break;
                }
            } else {
                switch(this.state) {
                    case eState.Idle:
                        this.state = eState.Pan;
                        break;
                    case eState.Pan:
                        this.pan(prevT.clientX - t.clientX, prevT.clientY - t.clientY);
                        break;
                }
            }

            this.cur_touches[idx] = this.pCopyTouch(t);
            console.log(this.state, this.target);
        }
    }

    this.pTouchEnd = function(e: TouchEvent) {
        e.preventDefault();
        const touches = e.changedTouches;
        const sym = Editor.searchSym(this.target?.parentElement.id ?? null);

        switch(this.state) {
            case eState.Down:
                if(sym)
                    symbolDetails.show(sym);
                else {
                    symbolDetails.hide();
                    console.log(`[Editor]: Symbol Not Found: ${this.target.parentElement.id}!!`);
                }
                break;
        }

        for(let i = 0; i < touches.length; i++) {
            const idx = this.pGetTouchById(touches[i].identifier);
            this.cur_touches.splice(idx, 1);
        }

        this.setState(eState.Idle);
    }

    this.pCopyTouch = function({identifier, touchType, clientX, clientY}) {
        return {identifier, touchType, clientX, clientY};
    }

    this.pGetTouchById = function(id: String): number {
        for(let i = 0; i < this.cur_touches.length; i++)
            if(this.cur_touches[i].identifier == id)
                return i;

        return -1;
    }


    this.setState = function(s: eState) {
        this.state = s;
    }


    this.setInputType = function(input: InputType) {
        this.inputType = input;

        switch(input) {
            case InputType.Mouse:
                canvas.addEventListener('mousedown', this.mMouseDown.bind(this));
                canvas.addEventListener('mouseup', this.mMouseUp.bind(this));
                canvas.addEventListener('mousecancel', this.mMouseUp.bind(this));
                canvas.addEventListener('mousemove', this.mMouseMove.bind(this));
                canvas.addEventListener('wheel', (event) => {
                    if(event.deltaY > 0) {
                        Editor.zoomIn();
                    } else {
                        Editor.zoomOut();
                    }
                });
                break;
            case InputType.Pencil:
                canvas.addEventListener('touchstart', this.pTouchStart.bind(this));
                canvas.addEventListener('touchmove', this.pTouchMove.bind(this));
                canvas.addEventListener('touchend', this.pTouchEnd.bind(this));
                canvas.addEventListener('touchcancel', this.pTouchEnd.bind(this));
                break;
        }
    }
}