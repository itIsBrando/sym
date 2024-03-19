class Library extends Definition {
    static libs: Library[] = [];
    name: string;
    version: number;
    generator: string;
    symbols: dSymbol[];


    toString(): string {
        return `[Library]: ${this.name} v${this.version} with ${this.symbols.length} symbols`;
    }

    constructor(tok: Tok) {
        super(tok);

        this.version = tok.key('version').params[0].asNum();
        this.generator = tok.key('generator').params[0].asStr();
        this.name = 'lib';
        this.symbols = [];

        for(let i = 2; i < tok.params.length; i++) {
            this.symbols.push(new dSymbol(tok.params[i].asTok()));
        }

        Library.libs.push(this);
    }
}


fetch('../Device.kicad_sym').then(async resp => {
    let txt = await resp.text();
    console.log(txt);
    let lib = Token.parseFile(txt);
    console.log('' + new Library(lib));
});

