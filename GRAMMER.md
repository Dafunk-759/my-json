json        : array | object

// SB : Square brackets
array       : LSB arrayBody RSB

arrayBody   : empty | value (COMMA value)*

// CB ： curly braces
object      : LCB objectBody RCB

objectBody  : empty | pair (COMMA pair)*

pair        : STRING COLON value

value       :  BOOL | NUMBER | NULL | STRING | json

empty       : 