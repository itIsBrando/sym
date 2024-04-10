const div = document.getElementById('SymbolCatalog');
const catalog = document.getElementById('CatalogList');
var CatalogList = new function () {
    const CatalogLibrarySelect = document.getElementById('CatalogLibrarySelect');
    const CatalogDetail = document.getElementById('CatalogDetail');
    this.selectedLib = 'none';
    /**
     * Draws all of the symbols in a given library onto the catalog.
     * If no library is selected, set name='none'
     */
    this.setLib = function (name) {
        this.selectedLib = name;
        if (name == 'none') {
            catalog.innerHTML = 'select a library';
            return;
        }
        let out = '';
        const lib = Library.libs[name];
        for (let i = 0; i < lib.symbols.length; i++) {
            out += `<button type="button" class="btn-catalog"
            onclick="CatalogList.setDetail('${name}', ${i});"
            >${lib.symbols[i].library_id}</button>`;
        }
        catalog.innerHTML = out;
    };
    this.setDetail = function (lib_name, sym_index) {
        const sym = Library.libs[lib_name].symbols[sym_index];
        const datasheet = sym.property('Datasheet');
        const description = sym.property('Description');
        let details = `
            <b>${sym.library_id}</b>
            <br>
            ${description != null ? description : sym.property('ki_description')}
            <br>
            Keywords: ${sym.property('ki_keywords')}
            <br>
        `;
        if (datasheet != '' && datasheet != '~') {
            details += `<a href="${datasheet}">Datasheet</a>`;
        }
        // @todo needs to be able to place the symbol too
        const okBtn = `<button type="button" class="btn-catalog" style="width:fit-content; right: 0px; bottom: 0px;
        position: absolute;"
        onclick="Editor.place(Library.libs['${lib_name}'].symbols[${sym_index}]); CatalogList.hide();"
        >Ok</button>`;
        details += okBtn; //.outerHTML;
        CatalogDetail.innerHTML = details;
    };
    this.show = function () {
        const keys = Object.keys(Library.libs);
        let html = '<option value="none">none</option>';
        for (let i = 0; i < keys.length; i++) {
            html += `<option value="${keys[i]}">${keys[i]}</option>`;
        }
        CatalogLibrarySelect.innerHTML = html;
        div.style.display = 'block';
    };
    this.hide = function () {
        div.style.display = 'none';
    };
    this.init = function () {
        CatalogLibrarySelect.onchange = (e) => {
            CatalogList.setLib(CatalogLibrarySelect.value);
        };
        this.setLib('none');
    };
};
CatalogList.init();
