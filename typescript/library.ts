class Library extends Definition {
    static libs: { [id: string] : Library; } = {};
    name: string;
    version: number;
    generator: string;
    symbols: dSymbol[];


    toString(): string {
        return `[Library]: ${this.name} v${this.version} with ${this.symbols.length} symbols`;
    }

    constructor(tok: Tok, name: string) {
        super(tok);

        this.version = tok.key('version').params[0].asNum();
        this.generator = tok.key('generator').params[0].asStr();
        this.name = name;
        this.symbols = [];

        for(let i = 2; i < tok.params.length; i++) {
            this.symbols.push(new dSymbol(tok.params[i].asTok()));
        }

        Library.libs[name] = this;
    }


    /**
     * Adds a file from the project's top directory to the library manager
     * @note this function may take awhile
     */
    static add(name: string) {
        fetch(`/${name}.kicad_sym`).then(async resp => {
            let txt = await resp.text();
            let lib = Token.parseFile(txt);
            console.log('' + new Library(lib, name));
        });
    }
}


Library.add('4xxx');
Library.add('Device');
