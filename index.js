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
    /(\n|\r\n)|(\s+)|([\[\]\{\}\,\:])|(true|false)|(null)|(\-?[0-9]+(?:\.[0-9]+)?)|("(?:\\"|[^"\\\r\n])*")/y;

  let line = 1,
    column = 1,
    pos = 0;

  const advance = () => {
    column += tokenRe.lastIndex - pos;
    pos = tokenRe.lastIndex;
  };

  while (true) {
    let captures = tokenRe.exec(rawJson);

    if (captures == null) {
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
      yield new Token(Token.t.NUMBER, parseFloat(val), line, column);
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

class MYJSON {
  static stringify(json) {}

  static parse(jsonRaw) {}

  static genToken = genToken;
}

module.exports = MYJSON;
