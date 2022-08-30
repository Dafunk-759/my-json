json       :  BOOL | NUMBER | NULL | STRING | array | object

// SB : Square brackets
array       : LSB arrayBody RSB

arrayBody   : empty | json (COMMA json)*

// CB ： curly braces
object      : LCB objectBody RCB

objectBody  : empty | pair (COMMA pair)*

pair        : STRING COLON json

empty       : 