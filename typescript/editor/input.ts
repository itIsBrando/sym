
enum InputType {
    Mouse,
    Pencil,
};


class Control {
    cur_touches = [];
    prev_client_x = 0;
    prev_client_y = 0;
    input: InputType;


    constructor() {
        this.setInputType(Control.hasTouch() ? InputType.Pencil : InputType.Mouse);
    }

    static hasTouch(): boolean {
        return 'ontouchstart' in window;
    }


    setInputType(input: InputType) {
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


    mMouseDown(e: MouseEvent) {
        Editor.target = e.target;
        Editor.setState(eState.Down);
        this.prev_client_x = e.clientX;
        this.prev_client_y = e.clientY;
    }

    mMouseUp(e: MouseEvent) {


        switch(Editor.state) {
            case eState.Down:
                Editor.aClick();
                break;
        }

        Editor.setState(eState.Idle);
    }

    mMouseMove(e: MouseEvent) {
        if(Editor.state == eState.Idle)
            return;

        const ox = (e.clientX - this.prev_client_x);
        const oy = (e.clientY - this.prev_client_y);


        switch(Editor.state) {
            case eState.Moving:
                // if we are moving an element
                Editor.moveUnit(Editor.target, ox, oy);
                break;
            case eState.Pan:
                // if we are moving the entire canvas
                Editor.pan(-ox, -oy);
                break;
            case eState.Down:
                // if we are selecting the canvas, pan. if we are selecting an elem, move
                Editor.setState(e.target == canvas ? eState.Pan : eState.Moving);
        }

        this.prev_client_x = e.clientX;
        this.prev_client_y = e.clientY;
    }


    pTouchStart(e: TouchEvent) {
        e.preventDefault();
        const touches = e.changedTouches;

        for(let i = 0; i < touches.length; i++) {
            this.cur_touches.push(touches[i]);

            if((touches[i] as any).touchType == 'stylus') {
                Editor.setState(eState.Down);
                Editor.target = e.target;
            }
        }
    }


    pTouchMove(e: TouchEvent) {
        e.preventDefault();
        const touches = e.changedTouches;

        for(let i = 0; i < touches.length; i++) {
            const t: any = touches[i];
            const idx = this.pGetTouchById(t.identifier);
            const prevT = this.cur_touches[idx];

            if(t.touchType == 'stylus') {
                switch(Editor.state) {
                    case eState.Down:
                        Editor.state = eState.Moving;
                    case eState.Moving:
                        Editor.moveUnit(Editor.target, 4, 4);
                        // Editor.moveUnit(Editor.target, prevT.clientX - t.clientX, prevT.clientY - t.clientY);
                        console.log('Hello?', Editor.target.parentElement);
                        break;
                }
            } else {
                switch(Editor.state) {
                    case eState.Idle:
                        Editor.state = eState.Pan;
                        break;
                    case eState.Pan:
                        Editor.pan(prevT.clientX - t.clientX, prevT.clientY - t.clientY);
                        break;
                }
            }

            this.cur_touches[idx] = this.pCopyTouch(t);
            console.log(Editor.state, Editor.target);
        }
    }

    pTouchEnd(e: TouchEvent) {
        e.preventDefault();
        const touches = e.changedTouches;
        const sym = Editor.searchSym(Editor.target?.parentElement.id ?? null);

        switch(Editor.state) {
            case eState.Down:
                if(sym)
                    symbolDetails.show(sym);
                else {
                    symbolDetails.hide();
                    console.log(`[Editor]: Symbol Not Found: ${Editor.target.parentElement.id}!!`);
                }
                break;
        }

        for(let i = 0; i < touches.length; i++) {
            const idx = this.pGetTouchById(touches[i].identifier);
            this.cur_touches.splice(idx, 1);
        }

        Editor.setState(eState.Idle);
    }

    pCopyTouch({identifier, touchType, clientX, clientY}) {
        return {identifier, touchType, clientX, clientY};
    }

    pGetTouchById(id: any): number {
        for(let i = 0; i < this.cur_touches.length; i++)
            if(this.cur_touches[i].identifier == id)
                return i;

        return -1;
    }
}