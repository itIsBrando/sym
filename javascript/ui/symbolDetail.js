var symbolDetails = new function () {
    const elem = document.getElementById('SymbolDetails');
    this.show = function (sym) {
        elem.style.display = 'block';
        const datasheet = sym.property('Datasheet');
        elem.innerHTML = `
            <h3>${sym.library_id}</h3>
            <span>Datasheet ${datasheet != null ? datasheet : ""}<br>
            In BOM: ${sym.in_bom ? "yes" : "no"}
            <br>
            In board: ${sym.on_board ? "yes" : "no"}
            </span>
        `;
    };
    this.hide = function () {
        elem.style.display = 'none';
    };
};
