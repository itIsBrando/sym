enum AttrType {
    String,
    Token,
}

class Attribute {
    type: AttrType;
    value: string;

    constructor(t: AttrType, v: string) {
        this.type = t;
        this.value = v;
    }
}



class Token {
    attributes: Attribute[];
    id: string;

    constructor() {
        this.id = "";
        this.attributes = [];
    }

    addTok(tok: string) {
        this.attributes.push(new Attribute(AttrType.Token, tok));
    }

    addStr(str: string) {
        this.attributes.push(new Attribute(AttrType.String, str));
    }

    setID(s: string) {
        let ei = s.indexOf(" ");

        if(!s.startsWith('(') || !s.endsWith(")") || ei == -1) {
            console.error('Malformed input');
        }

        this.id = s.slice(1, ei);
    }

    toString() {
        return `Token: ${this.id}, # attr: ${this.attributes.length}`;
    }

    static parse(str: string) {
        let tok = new Token();
        let opStack: string[] = [];
        let inStr = false, inTok = false;
        let buf = "";

        str = str.trim().replace(/\n/g, "");
        tok.setID(str);
        let toksStr = str.slice(1 + tok.id.length, str.length - 1).trim();

        // console.log("ToksStr:", toksStr);

        for(let i = 0; i < toksStr.length; i++) {
            const char = toksStr[i];

            if(char != " " || inStr || inTok) {
                buf += char;
            } else if(char == " " && !inStr && buf.length > 0) {
                // string
                tok.addStr(buf);
                buf = "";
            }

            if(!inStr && char == "(") {
                if(!inTok) {
                    inTok = true;
                    buf = "";
                }
                opStack.push("(");
            } else if(!inStr && char == ")") {
                opStack.pop();

                if(opStack.length == 0) {
                    tok.addTok(`(${buf.slice(0, -1)})`);
                    inTok = false;
                    buf = "";
                }
            }

            if(!inTok && char == '"') {
                if(!inStr) {
                    opStack.push('"');
                    buf = "";
                } else {
                    opStack.pop();
                    tok.addStr(`"${buf.slice(0, -1)}"`);
                    buf = "";
                }
                inStr = !inStr;
            }

        }

        if(buf.length > 0) {
            tok.addStr(buf);
        }

        return tok;
    }


    static parseFile(str: string) {
        let toks = Token.parse(str);
        let out = new Tok(toks.id);

        for (let i = 0; i < toks.attributes.length; i++) {
            const p = toks.attributes[i];
            let value: Parameter;

            switch (p.type) {
                case AttrType.String:
                    let num = parseFloat(p.value);
                    if (!Number.isNaN(num)) {
                        value = new Parameter(num);
                    } else {
                        value = new Parameter(p.value);
                    }
                    break;
                case AttrType.Token:
                    value = new Parameter(Token.parseFile(p.value));
                    break;
            }

            out.addParam(value);
        }

        return out;
    }
}

/**
 * This is the output of the tokenizer. This is not to be confused with the intermediate
 * value, Token
 */
class Tok {
    id: string;
    params: Parameter[] = [];

    constructor(id: string) {
        this.id = id;
    }

    toString(): string {
      return `[Tok]: id=${this.id}, #params=${this.params.length}`;
    }


    key(search: string) {
      for(let i = 0; i < this.params.length; i++) {
        if(this.params[i].type == ParameterType.Token && this.params[i].asTok().id == search)
          return this.params[i].asTok();

      }

      return null;
    }

    hasStr(search: string) {
      for(let i = 0; i < this.params.length; i++) {
        if(this.params[i].type == ParameterType.String && this.params[i].asStr() == search)
          return true;
      }

      return false;
    }

    addParam(p: Parameter) {
        this.params.push(p);
    }
}



let file = `
(symbol "D" (pin_numbers hide) (pin_names (offset 1.016) hide) (in_bom yes) (on_board yes)
    (property "Reference" "D" (at 0 2.54 0)
      (effects (font (size 1.27 1.27)))
    )
    (property "Value" "D" (at 0 -2.54 0)
      (effects (font (size 1.27 1.27)))
    )
    (property "Footprint" "" (at 0 0 0)
      (effects (font (size 1.27 1.27)) hide)
    )
    (property "Datasheet" "~" (at 0 0 0)
      (effects (font (size 1.27 1.27)) hide)
    )
    (property "Sim.Device" "D" (at 0 0 0)
      (effects (font (size 1.27 1.27)) hide)
    )
    (property "Sim.Pins" "1=K 2=A" (at 0 0 0)
      (effects (font (size 1.27 1.27)) hide)
    )
    (property "ki_keywords" "diode" (at 0 0 0)
      (effects (font (size 1.27 1.27)) hide)
    )
    (property "ki_description" "Diode" (at 0 0 0)
      (effects (font (size 1.27 1.27)) hide)
    )
    (property "ki_fp_filters" "TO-???* *_Diode_* *SingleDiode* D_*" (at 0 0 0)
      (effects (font (size 1.27 1.27)) hide)
    )
    (symbol "D_0_1"
      (polyline
        (pts
          (xy -1.27 1.27)
          (xy -1.27 -1.27)
        )
        (stroke (width 0.254) (type default))
        (fill (type none))
      )
      (polyline
        (pts
          (xy 1.27 0)
          (xy -1.27 0)
        )
        (stroke (width 0) (type default))
        (fill (type none))
      )
      (polyline
        (pts
          (xy 1.27 1.27)
          (xy 1.27 -1.27)
          (xy -1.27 0)
          (xy 1.27 1.27)
        )
        (stroke (width 0.254) (type default))
        (fill (type none))
      )
    )
    (symbol "D_1_1"
      (pin passive line (at -3.81 0 0) (length 2.54)
        (name "K" (effects (font (size 1.27 1.27))))
        (number "1" (effects (font (size 1.27 1.27))))
      )
      (pin passive line (at 3.81 0 180) (length 2.54)
        (name "A" (effects (font (size 1.27 1.27))))
        (number "2" (effects (font (size 1.27 1.27))))
      )
    )
  )
`;


var t = Token.parseFile(file);
var tDef = Definition.generate(t);
console.log(tDef);