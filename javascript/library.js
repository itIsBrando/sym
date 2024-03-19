var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Library extends Definition {
    constructor(tok) {
        super(tok);
        this.version = tok.key('version').params[0].asNum();
        this.generator = tok.key('generator').params[0].asStr();
        this.name = 'lib';
        this.symbols = [];
        for (let i = 2; i < tok.params.length; i++) {
            this.symbols.push(new dSymbol(tok.params[i].asTok()));
        }
        Library.libs.push(this);
    }
    toString() {
        return `[Library]: ${this.name} v${this.version} with ${this.symbols.length} symbols`;
    }
}
Library.libs = [];
fetch('../Device.kicad_sym').then((resp) => __awaiter(this, void 0, void 0, function* () {
    let txt = yield resp.text();
    console.log(txt);
    let lib = Token.parseFile(txt);
    console.log('' + new Library(lib));
}));
