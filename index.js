class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }

  static t = {
    LSB: "[",
    RSB: "]",
    LCB: "{",
    RCB: "}",
    COMMA: ",",
    COLON: ":",
    BOOL: "BOOL",
    NUMBER: "NUMBER",
    NULL: "NULL",
    STRING: "STRING",
    EOF: "EOF",
  };
}

function* genToken(rawJson) {
  // captures
  // 1: newLine
  // 2: whiteSpace
  // 3: punctuation
  // 4: bool
  // 5: null
  // 6: number
  // 7: string
  const tokenRe =
    /(\n|\r\n)|(\s+)|([\[\]\{\}\,\:])|(true|false)|(null)|(\-?[0-9]+(?:\.[0-9]+)?)|("(?:\\.|[^"\\\r\n])*")/y;

  let line = 1,
    column = 1,
    pos = 0;

  const advance = () => {
    column += tokenRe.lastIndex - pos;
    pos = tokenRe.lastIndex;
  };

  const error = () => {
    throw new Error(
      `Invalid char:${rawJson[pos]} at line: ${line} column: ${column}`
    );
  };

  while (true) {
    let captures = tokenRe.exec(rawJson);

    if (captures == null) {
      if (pos < rawJson.length) {
        error();
      }
      yield new Token(Token.t.EOF, Token.t.EOF, line, column);
      break;
    }

    // newLine
    let val;
    if ((val = captures[1])) {
      // advance newLine
      pos = tokenRe.lastIndex;
      line++;
      column = 1;
      continue;
    }

    // whiteSpace
    if ((val = captures[2])) {
      advance();
      continue;
    }

    // punctuation
    if ((val = captures[3])) {
      yield new Token(val, val, line, column);
      advance();
      continue;
    }

    // bool
    if ((val = captures[4])) {
      yield new Token(Token.t.BOOL, val, line, column);
      advance();
      continue;
    }

    // null
    if ((val = captures[5])) {
      yield new Token(Token.t.NULL, val, line, column);
      advance();
      continue;
    }

    // number
    if ((val = captures[6])) {
      yield new Token(Token.t.NUMBER, val, line, column);
      advance();
      continue;
    }

    // string
    if ((val = captures[7])) {
      yield new Token(Token.t.STRING, val, line, column);
      advance();
      continue;
    }
  }
}

// mode: 'p'(parse) or 's'(stringigy)

const modes = {
  parse: 0,
  stringify: 1,
};
const escape = (s, mode = modes.parse) => {
  let chars = [
    ['\\"', '"'],
    ["\\n", "\n"],
    ["\\r", "\r"],
    ["\\b", "\b"],
    ["\\f", "\f"],
  ];

  switch (mode) {
    case modes.parse:
      // ???????????????????????????
      s = s.slice(1, -1);
      for (let [c1, c2] of chars) {
        s = s.replace(c1, c2);
      }
      break;
    case modes.stringify:
      for (let [c1, c2] of chars) {
        s = s.replace(c2, c1);
      }
      // ????????????????????????
      s = '"' + s + '"';
      break;
  }

  return s;
};

const bools = {
  true: true,
  false: false,
};

class Parser {
  constructor(rawJson) {
    this.lexer = genToken(rawJson);
    this.currentToken = this.#nextToken();
  }

  #nextToken() {
    let item = this.lexer.next();
    if (item.done) {
      throw new Error("No more token");
    } else {
      return item.value;
    }
  }

  get #tt() {
    return this.currentToken.type;
  }

  #eat(t) {
    if (t !== this.#tt)
      throw new Error(`Uexpected token:${this.#tt} \
at line: ${this.currentToken.line} column: ${this.currentToken.column}`);
    this.currentToken = this.#nextToken();
  }

  #string() {
    let v = this.currentToken.value;
    this.#eat(Token.t.STRING);
    return escape(v);
  }

  #object() {
    let obj = {};
    this.#eat(Token.t.LCB);
    if (this.#tt === Token.t.RCB) {
      this.#eat(Token.t.RCB);
      return obj;
    }

    let key, value;

    const pair = () => {
      key = this.#string();
      this.#eat(Token.t.COLON);
      value = this.#json();
      obj[key] = value;
    };

    pair();
    while (this.#tt === Token.t.COMMA) {
      this.#eat(Token.t.COMMA);
      pair();
    }

    this.#eat(Token.t.RCB);
    return obj;
  }

  #array() {
    let arr = [];
    this.#eat(Token.t.LSB);
    if (this.#tt === Token.t.RSB) {
      this.#eat(Token.t.RSB);
      return arr;
    }

    arr.push(this.#json());
    while (this.#tt === Token.t.COMMA) {
      this.#eat(Token.t.COMMA);
      arr.push(this.#json());
    }

    this.#eat(Token.t.RSB);
    return arr;
  }

  #json() {
    let v;
    switch (this.#tt) {
      case Token.t.BOOL:
        v = this.currentToken.value;
        this.#eat(Token.t.BOOL);
        return bools[v];
      case Token.t.NUMBER:
        v = this.currentToken.value;
        this.#eat(Token.t.NUMBER);
        return parseFloat(v);
      case Token.t.NULL:
        v = this.currentToken.value;
        this.#eat(Token.t.NULL);
        return null;
      case Token.t.STRING:
        return this.#string();
      case Token.t.LCB:
        return this.#object();
      case Token.t.LSB:
        return this.#array();
    }
  }

  parse() {
    return this.#json();
  }
}

function stringify(json) {
  if (Array.isArray(json)) {
    return "[" + json.map((j) => stringify(j)).join(",") + "]";
  }

  if (json && typeof json === "object") {
    return (
      "{" +
      Object.entries(json)
        .map(([k, v]) => stringify(k) + ":" + stringify(v))
        .join(",") +
      "}"
    );
  }

  if (typeof json === "boolean") {
    if (json) return "true";
    else return "false";
  }

  if (typeof json === "number") {
    return json.toString();
  }

  if (json === null) {
    return "null";
  }

  if (typeof json === "string") {
    return escape(json, modes.stringify);
  }
}

module.exports = {
  parse(jsonRaw) {
    return new Parser(jsonRaw).parse();
  },
  stringify,
  genToken,
};
