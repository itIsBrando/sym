class dPin extends Definition {
    constructor(tok, parent) {
        const nameObj = tok.key('name');
        const numObj = tok.key('number');
        super(tok);
        this.parent = parent;
        this.electric_type = tok.params[0].asStr();
        this.graphic_type = tok.params[0].asStr();
        this.length = tok.key('length').params[0].asNum();
        this.position = Coordinate.pos(tok.key('at'));
        this.hidden = tok.hasStr('hide');
        this.name = nameObj.params[0].asStr();
        this.num = numObj.params[0].asStr();
        this.numEffects = new dEffects(numObj.key('effects'));
        this.nameEffects = new dEffects(nameObj.key('effects'));
    }
    graphic() {
        if (this.hidden)
            return '';
        const xStart = this.position.x, yStart = this.position.y;
        const xEnd = this.position.x + this.length * this.position.rx();
        const yEnd = this.position.y + this.length * this.position.ry();
        const xText = (dPin.offset * this.position.rx() + xEnd);
        const yText = (dPin.offset * this.position.ry() + yEnd);
        const xPin = this.position.x - dPin.offset;
        const yPin = this.position.y - dPin.offset;
        const name = this.parent.pin_name_hidden ? '' : this.nameEffects.text(this.name == '~' ? '' : this.name, xText, yText, this.position.radians);
        const num = this.parent.pin_num_hidden ? '' : this.numEffects.text(this.num, xPin, yPin);
        return `
            <polyline stroke="${Color.tPin}" points="${xStart} ${yStart} ${xEnd} ${yEnd}"
            stroke-width="0.15" stroke-linejoin="round" stroke-linecap="round">
            </polyline>
            ${name}
            ${num}
        `;
    }
}
dPin.offset = 0.504;
// svg.getBBox()
