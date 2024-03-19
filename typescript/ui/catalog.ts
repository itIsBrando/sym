const div = document.getElementById('SymbolCatalog')
const catalog = document.getElementById('CatalogList');

var CatalogList = new function() {
    this.show = function() {
        let out = '';

        for(let i = 0; i < Library.libs[0].symbols.length; i++) {
            out += `<button type="button" class="button"
            onclick="place(Library.libs[0].symbols[${i}]);CatalogList.hide();"
            >${Library.libs[0].symbols[i].library_id}</button>`;
        }

        div.style.display = 'block';

        catalog.innerHTML = out;

    }

    this.hide = function() {
        div.style.display = 'none';
    }
}