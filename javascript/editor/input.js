var InputType;
(function (InputType) {
    InputType[InputType["Mouse"] = 0] = "Mouse";
    InputType[InputType["Pencil"] = 1] = "Pencil";
})(InputType || (InputType = {}));
;
class Control {
    constructor() {
        this.cur_touches = [];
        this.prev_client_x = 0;
        this.prev_client_y = 0;
        this.setInputType(Control.hasTouch() ? InputType.Pencil : InputType.Mouse);
    }
    static hasTouch() {
        return 'ontouchstart' in window;
    }
    setInputType(input) {
        switch (input) {
            case InputType.Mouse:
                canvas.addEventListener('mousedown', this.mMouseDown.bind(this));
                canvas.addEventListener('mouseup', this.mMouseUp.bind(this));
                canvas.addEventListener('mousecancel', this.mMouseUp.bind(this));
                canvas.addEventListener('mousemove', this.mMouseMove.bind(this));
                canvas.addEventListener('wheel', (event) => {
                    if (event.deltaY > 0) {
                        Editor.zoomIn();
                    }
                    else {
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
    mMouseDown(e) {
        Editor.target = e.target;
        Editor.setState(eState.Down);
        this.prev_client_x = e.clientX;
        this.prev_client_y = e.clientY;
    }
    mMouseUp(e) {
        switch (Editor.state) {
            case eState.Down:
                Editor.aClick();
                break;
        }
        Editor.setState(eState.Idle);
    }
    mMouseMove(e) {
        if (Editor.state == eState.Idle)
            return;
        const ox = (e.clientX - this.prev_client_x);
        const oy = (e.clientY - this.prev_client_y);
        switch (Editor.state) {
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
    pTouchStart(e) {
        e.preventDefault();
        const touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            this.cur_touches.push(touches[i]);
            if (touches[i].touchType == 'stylus') {
                Editor.setState(eState.Down);
                Editor.target = e.target;
            }
        }
    }
    pTouchMove(e) {
        e.preventDefault();
        const touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const t = touches[i];
            const idx = this.pGetTouchById(t.identifier);
            const prevT = this.cur_touches[idx];
            if (t.touchType == 'stylus') {
                switch (Editor.state) {
                    case eState.Down:
                        Editor.state = eState.Moving;
                    case eState.Moving:
                        Editor.moveUnit(Editor.target, 4, 4);
                        // Editor.moveUnit(Editor.target, prevT.clientX - t.clientX, prevT.clientY - t.clientY);
                        console.log('Hello?', Editor.target.parentElement);
                        break;
                }
            }
            else {
                switch (Editor.state) {
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
    pTouchEnd(e) {
        var _a, _b;
        e.preventDefault();
        const touches = e.changedTouches;
        const sym = Editor.searchSym((_b = (_a = Editor.target) === null || _a === void 0 ? void 0 : _a.parentElement.id) !== null && _b !== void 0 ? _b : null);
        switch (Editor.state) {
            case eState.Down:
                if (sym)
                    symbolDetails.show(sym);
                else {
                    symbolDetails.hide();
                    console.log(`[Editor]: Symbol Not Found: ${Editor.target.parentElement.id}!!`);
                }
                break;
        }
        for (let i = 0; i < touches.length; i++) {
            const idx = this.pGetTouchById(touches[i].identifier);
            this.cur_touches.splice(idx, 1);
        }
        Editor.setState(eState.Idle);
    }
    pCopyTouch({ identifier, touchType, clientX, clientY }) {
        return { identifier, touchType, clientX, clientY };
    }
    pGetTouchById(id) {
        for (let i = 0; i < this.cur_touches.length; i++)
            if (this.cur_touches[i].identifier == id)
                return i;
        return -1;
    }
}
