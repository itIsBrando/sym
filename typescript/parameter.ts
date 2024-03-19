
enum ParameterType {
    Number = 'number', String = 'string', Token = 'tok'
}


class Parameter {
    private num: number;
    private str: string;
    private tok: Tok;
    type: ParameterType;

    toString() {
        switch(this.type) {
            case ParameterType.Number:
                return `Number: ${this.num}`;
            case ParameterType.String:
                return `String: ${this.str}`;
            case ParameterType.Token:
                return `Token: ${this.tok}`;
        }
    }

    constructor(input: number | string | Tok) {
        switch(typeof input) {
            case 'number':
                this.type = ParameterType.Number;
                this.num = input;
                break;
            case 'object':
                this.type = ParameterType.Token;
                this.tok = input;
                break;
            case 'string':
                this.type = ParameterType.String;
                this.str = input.replace(/\"/g, '');
                break;
        }

    }

    asRaw(): any {
        switch(this.type) {
            case ParameterType.Number:
                return this.num;
            case ParameterType.Token:
                return this.tok;
            case ParameterType.String:
                return this.str;
        }

    }

    asNum() {
        if(this.type != ParameterType.Number)
            console.error(`'${this.asRaw()}' of type ${this.type} cannot be expressed as number.`);
        return this.num;
    }

    asStr() {
        if(this.type != ParameterType.String)
            console.error(`'${this.asRaw()}' of type ${this.type} cannot be expressed as string.`);
        return this.str;
    }

    asTok() {
        console.assert(this.type == ParameterType.Token, `Param of type ${this.type} cannot be expressed as token.`);
        return this.tok;
    }

}
